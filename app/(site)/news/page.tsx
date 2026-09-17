import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { getPosts } from "@/lib/api";

export const revalidate = 60;

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <div className="pt-10 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            So&apos;nggi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Yangiliklar</span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Texnoparkdagi voqealar, texnologiya olamidagi so&apos;nggi xabarlar va foydali maqolalar.
          </p>
        </div>

        {posts.length === 0 && (
          <p className="glass-card rounded-3xl p-8 text-center text-foreground/60">
            Hozircha yangiliklar yo&apos;q.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/news/${post.id}`} className="glass-card rounded-3xl overflow-hidden group block">
              <div className="h-48 bg-foreground/5 relative overflow-hidden">
                {post.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin yuklagan muqova
                  <img src={post.cover} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-foreground/50">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center text-sm font-semibold group-hover:text-blue-600 transition-colors">
                  Batafsil o&apos;qish <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
