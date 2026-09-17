import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { getPost, getPosts } from "@/lib/api";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Andijon Yoshlar Texnoparki`,
    description: post.excerpt,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Paragraflar admin'da bo'sh qator bilan ajratiladi
  const paragraphs = post.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="min-h-screen pt-10 pb-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Barcha yangiliklar
        </Link>

        <div className="flex flex-wrap items-center gap-4 mb-5">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-xs font-bold uppercase tracking-wider text-blue-600">
            {post.category}
          </span>
          <time dateTime={post.publishedAt} className="flex items-center gap-1.5 text-sm text-foreground/50">
            <Calendar className="w-4 h-4" />
            {post.date}
          </time>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-foreground/70 mb-10">{post.excerpt}</p>

        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element -- admin yuklagan muqova
          <img src={post.cover} alt="" className="w-full rounded-3xl mb-10 border border-foreground/10" />
        )}

        <div className="flex flex-col gap-5 text-foreground/80 text-lg leading-relaxed">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
