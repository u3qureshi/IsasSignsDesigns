import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import type { BusinessPolicy } from "../../data/businessPolicies";

export default function BusinessPolicyPage({ policy }: { policy: BusinessPolicy }) {
  return (
    <main className="min-h-[65vh] bg-[hsl(var(--theme-kids-bg))] px-5 py-10 text-[hsl(var(--theme-brown-900))] sm:py-14">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_65px_hsl(var(--theme-brown-900)/0.1)]">
        <header className="bg-[hsl(var(--theme-sage-100)/0.5)] px-6 py-9 sm:px-10 sm:py-12">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">{policy.eyebrow}</p>
          <h1 className="mt-2 font-aoki text-4xl sm:text-5xl">{policy.title}</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[hsl(var(--theme-brown-700))]">{policy.introduction}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-stone-400">Effective August 28, 2026</p>
        </header>

        <div className="space-y-9 px-6 py-9 sm:px-10 sm:py-12">
          {policy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-aoki text-2xl sm:text-3xl">{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm font-medium leading-7 text-[hsl(var(--theme-brown-700))] sm:text-base">{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-medium leading-7 text-[hsl(var(--theme-brown-700))] sm:text-base">
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              )}
            </section>
          ))}

          <aside className="rounded-2xl bg-[hsl(var(--theme-sage-100)/0.38)] p-5 sm:p-6">
            <h2 className="font-aoki text-2xl">Need help?</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="mailto:chrastinovakajaa@outlook.com" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold"><Mail className="h-4 w-4" /> Email us</a>
              <a href="tel:+16477005182" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold"><Phone className="h-4 w-4" /> Call</a>
              <a href="https://wa.me/16477005182" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              <Link to="/about#contact-form" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--theme-green-900))] px-4 py-2 text-sm font-bold text-white">Message form <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
