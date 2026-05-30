import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPages } from "@/lib/data";
import { MarkdownContent } from "@/app/components/MarkdownContent";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} />
    </Suspense>
  );
}

async function PageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pages = await getPages();
  const page = pages.find((p) => p.slug === slug && p.published);

  if (!page) notFound();

  return (
    <main className="min-h-svh bg-[var(--color-bg,#0a0a0f)] px-5 py-16 sm:px-8">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-block text-xs uppercase tracking-wider text-[var(--color-text-muted,#555570)] hover:text-[var(--color-text,#e8e8f0)]"
        >
          &larr; Back to home
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-[var(--color-text,#e8e8f0)] sm:text-3xl">
          {page.title}
        </h1>
        <MarkdownContent content={page.content} />
        <p className="mt-12 text-[10px] text-[var(--color-text-muted,#555570)] uppercase tracking-wider">
          Last updated: {page.updatedAt}
        </p>
      </article>
    </main>
  );
}

function PageSkeleton() {
  return (
    <main className="min-h-svh bg-[var(--color-bg,#0a0a0f)] px-5 py-16 sm:px-8">
      <article className="mx-auto max-w-3xl">
        <div className="mb-6 h-4 w-24 animate-pulse rounded bg-[var(--color-surface-alt,#1a1a2e)]" />
        <div className="mb-6 h-8 w-64 animate-pulse rounded bg-[var(--color-surface-alt,#1a1a2e)]" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-alt,#1a1a2e)]" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-surface-alt,#1a1a2e)]" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-surface-alt,#1a1a2e)]" />
        </div>
      </article>
    </main>
  );
}
