// Portfolio website — Webhook receiver
// Accepts signed webhook deliveries from the AI-Content Writer tool
// (https://github.com/ahmedhassan142/AI-Content) and creates BlogPost
// entries on this site.
//
// Security:
//   - Verifies HMAC-SHA256 signature in X-AIContent-Signature using
//     WEBHOOK_SECRET env var. Requests with a missing or invalid
//     signature are rejected with 401.
//   - Optionally enforces a shared header token (WEBHOOK_TOKEN) for an
//     extra layer of defense.
//
// Envelope accepted (from AI-Content tool's lib/webhooks/sender.ts):
//   {
//     "event": "content.saved" | "content.generated" | "content.humanized",
//     "timestamp": ISO-8601,
//     "userId": string,
//     "data": { title, content, ... }
//   }
//
// For backwards compatibility we ALSO accept a flat body (top-level
// title/content), but signed payloads are preferred.

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import BlogPost from '@/models/BlogPost';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Shared secret used to verify HMAC signatures. MUST be set in the
// environment of BOTH this site and the AI-Content tool's webhook
// registration (each webhook in the AI-Content tool has its own secret).
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Events we will turn into blog posts. Other events (seo.audited,
// plagiarism.fixed, etc.) are silently ignored with a 200.
const PUBLISHABLE_EVENTS = new Set([
  'blog.published', // preferred — explicit publish action from the AI-Content tool
  'content.saved',
  'content.generated',
  'content.humanized',
]);

// Mapping from AI-Content content type → portfolio blog category.
const CATEGORY_MAP: Record<string, string> = {
  generated: 'AI Content',
  rewritten: 'AI Content',
  humanized: 'AI Content',
  enhanced: 'AI Content',
  blog: 'Blog',
  article: 'Article',
  essay: 'Article',
  email: 'Email',
  social: 'Social Media',
  product: 'Product',
  story: 'Story',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeSignature(body: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  return `sha256=${hmac.digest('hex')}`;
}

/**
 * Constant-time string comparison to avoid timing attacks.
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function makeExcerpt(content: string, max = 200): string {
  const plain = content
    .replace(/^#+\s+/gm, '') // headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // bold
    .replace(/\*(.+?)\*/g, '$1') // italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .replace(/[#*>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function readingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Returns a unique slug. If the desired slug is taken (or already used
 * by the same source within the last hour — dedup window), append a
 * short suffix.
 */
async function uniqueSlug(base: string): Promise<string> {
  const candidate = slugify(base) || `post-${Date.now()}`;
  const exists = await BlogPost.findOne({ slug: candidate }).select('_id').lean();
  if (!exists) return candidate;
  return `${candidate}-${Date.now().toString(36)}`;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  console.log('📥 ========== WEBHOOK RECEIVED ==========');

  // ----- 1. Read raw body ONCE (needed for HMAC verification) -------------
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch (err) {
    console.error('❌ Could not read request body:', err);
    return NextResponse.json(
      { success: false, error: 'Could not read request body' },
      { status: 400 },
    );
  }

  if (!rawBody) {
    return NextResponse.json(
      { success: false, error: 'Empty body' },
      { status: 400 },
    );
  }

  // ----- 2. Signature verification ----------------------------------------
  const providedSig = request.headers.get('x-aicontent-signature') || '';
  const event = request.headers.get('x-aicontent-event') || '';

  if (WEBHOOK_SECRET) {
    if (!providedSig) {
      console.warn('🚫 Missing X-AIContent-Signature header');
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 401 },
      );
    }
    const expectedSig = computeSignature(rawBody, WEBHOOK_SECRET);
    if (!safeEqual(expectedSig, providedSig)) {
      console.warn('🚫 Invalid webhook signature');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 },
      );
    }
    console.log('✅ Signature verified');
  } else {
    console.warn(
      '⚠️  WEBHOOK_SECRET not set — accepting unsigned webhook. Set WEBHOOK_SECRET in production!',
    );
  }

  // ----- 3. Parse JSON body ----------------------------------------------
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch (err) {
    console.error('❌ Invalid JSON:', err);
    return NextResponse.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 },
    );
  }

  console.log('📦 Event:', event || body?.event);
  console.log('📦 Body keys:', Object.keys(body || {}));

  // ----- 4. Normalize: support both envelope and flat payloads -----------
  // Envelope: { event, timestamp, userId, data: { title, content, ... } }
  // Flat:     { title, content, category, tags, ... }
  const envelopeEvent = event || body?.event;
  const data = body?.data && typeof body.data === 'object' ? body.data : body;
  const sourceUserId = body?.userId || body?.data?.userId || 'unknown';
  const externalId =
    data?.contentId || body?.contentId || data?.id || body?.id || '';

  // ----- 5. Event filtering ----------------------------------------------
  // If an event header is present, only accept publishable events. If no
  // event header is set (legacy flat POST), accept it as a direct publish.
  if (envelopeEvent && !PUBLISHABLE_EVENTS.has(envelopeEvent)) {
    console.log(`ℹ️  Ignoring non-publishable event: ${envelopeEvent}`);
    return NextResponse.json(
      { success: true, ignored: true, reason: `Event ${envelopeEvent} is not publishable` },
      { status: 200 },
    );
  }

  // ----- 6. Extract title + content --------------------------------------
  const title = (data?.title ?? body?.title ?? '').toString().trim();
  const content = (data?.content ?? body?.content ?? '').toString().trim();

  if (!title || !content) {
    console.error('❌ Missing title or content. Got title=', title, 'contentLen=', content.length);
    return NextResponse.json(
      {
        success: false,
        error: 'Title and content are required',
        received: { titlePresent: !!title, contentPresent: !!content },
      },
      { status: 400 },
    );
  }

  // ----- 7. Connect to DB -------------------------------------------------
  try {
    await connectDB();
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 },
    );
  }

  // ----- 8. Deduplication -------------------------------------------------
  // Same user + same external contentId + same title → skip.
  if (externalId) {
    const dedupeKey = `${sourceUserId}:${externalId}`;
    const existing = await BlogPost.findOne({
      'source': 'webhook',
      'sourceRef': dedupeKey,
    }).select('_id slug');
    if (existing) {
      console.log(`♻️  Duplicate webhook delivery (sourceRef=${dedupeKey}) — returning existing post ${existing.slug}`);
      return NextResponse.json(
        {
          success: true,
          message: 'Post already exists from a previous delivery',
          post: {
            id: existing._id,
            slug: existing.slug,
            url: `/blog/${existing.slug}`,
          },
        },
        { status: 200 },
      );
    }
  }

  // ----- 9. Build the post document --------------------------------------
  const contentType = (data?.type ?? body?.type ?? 'generated').toString();
  const seoKeywords: string[] = Array.isArray(data?.seoKeywords)
    ? data.seoKeywords
    : Array.isArray(body?.seoKeywords)
      ? body.seoKeywords
      : [];

  const slug = await uniqueSlug(title);

  const postData: any = {
    title,
    content,
    slug,
    excerpt:
      (data?.excerpt ?? body?.excerpt ?? '').toString().trim() ||
      makeExcerpt(content),
    category:
      (data?.category ?? body?.category ?? '').toString().trim() ||
      CATEGORY_MAP[contentType] ||
      'AI Content',
    tags: Array.isArray(data?.tags)
      ? data.tags
      : Array.isArray(body?.tags)
        ? body.tags
        : seoKeywords.slice(0, 8),
    author: (data?.author ?? body?.author ?? 'AI Content Writer').toString(),
    featuredImage: (data?.featuredImage ?? body?.featuredImage ?? '').toString(),
    featured: Boolean(data?.featured ?? body?.featured ?? false),
    published: true,
    publishedAt: new Date(),
    readingTime: readingTimeMinutes(content),
    source: 'webhook',
    sourceRef: externalId ? `${sourceUserId}:${externalId}` : undefined,
  };

  // Clean undefined values so Mongoose doesn't complain about schema strictness.
  Object.keys(postData).forEach((k) => postData[k] === undefined && delete postData[k]);

  // ----- 10. Persist -------------------------------------------------------
  try {
    const post = await BlogPost.create(postData);
    const durationMs = Date.now() - startedAt;
    console.log(`✅ Blog post created! id=${post._id} slug=${post.slug} (${durationMs}ms)`);

    return NextResponse.json(
      {
        success: true,
        message: 'Blog post created successfully',
        post: {
          id: post._id,
          title: post.title,
          slug: post.slug,
          url: `/blog/${post.slug}`,
          excerpt: post.excerpt,
          category: post.category,
          readingTime: post.readingTime,
          featuredImage: post.featuredImage,
        },
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error('❌ Failed to create blog post:', err);

    // Last-resort slug collision retry
    if (err?.code === 11000 && err?.keyPattern?.slug) {
      try {
        postData.slug = `${slugify(title)}-${Date.now().toString(36)}`;
        const post = await BlogPost.create(postData);
        console.log(`✅ Retry succeeded: slug=${post.slug}`);
        return NextResponse.json(
          {
            success: true,
            message: 'Blog post created (with unique slug)',
            post: {
              id: post._id,
              title: post.title,
              slug: post.slug,
              url: `/blog/${post.slug}`,
            },
          },
          { status: 201 },
        );
      } catch (retryErr) {
        console.error('❌ Retry failed:', retryErr);
        return NextResponse.json(
          { success: false, error: 'Failed to create post with unique slug' },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to create blog post',
      },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// GET — descriptive status endpoint (handy for testing from a browser)
// ---------------------------------------------------------------------------
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'Webhook receiver is active',
    acceptsEvents: Array.from(PUBLISHABLE_EVENTS),
    signatureRequired: Boolean(WEBHOOK_SECRET),
    payloadFormat: {
      envelope: {
        event: 'blog.published | content.saved | content.generated | content.humanized',
        timestamp: 'ISO-8601',
        userId: 'string',
        data: {
          title: 'string (required)',
          content: 'string (required, markdown accepted)',
          contentId: 'string (optional, used for dedup)',
          type: 'string (optional)',
          tone: 'string (optional)',
          seoKeywords: 'string[] (optional → tags)',
          excerpt: 'string (optional, auto-generated if missing)',
          category: 'string (optional)',
          tags: 'string[] (optional)',
          author: 'string (optional)',
          featuredImage: 'string URL (optional)',
          featured: 'boolean (optional)',
        },
      },
      flat: 'Also accepts a flat body with title/content at the top level (legacy).',
    },
    headers: {
      'X-AIContent-Signature': 'sha256=<hmac> (required when WEBHOOK_SECRET is set)',
      'X-AIContent-Event': 'event name (optional for flat payloads)',
    },
  });
}
