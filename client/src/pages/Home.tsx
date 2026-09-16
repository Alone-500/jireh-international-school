import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Compass,
  Cross,
  ExternalLink,
  Facebook,
  GraduationCap,
  HeartHandshake,
  Instagram,
  Lightbulb,
  Mail,
  Menu,
  Music2,
  Palette,
  Phone,
  Quote,
  School,
  Send,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const STORAGE = {
  logo: "/manus-storage/logo1_e7f96a69.png",
  hero: "/manus-storage/slider1_4c2bf183.png",
  life: "/manus-storage/M1_53769bbc.png",
  learning: "/manus-storage/M2_f4d10a5a.png",
  portrait1: "/manus-storage/blog1_22196026.png",
  portrait2: "/manus-storage/blog2_471ce717.png",
  portrait3: "/manus-storage/blog3_2394453e.png",
  portrait4: "/manus-storage/blog4_b6d7b49e.png",
  portrait5: "/manus-storage/blog5_287aba62.png",
};

const DEFAULT_CONTENT = {
  heroEyebrow: "A Christian school for curious, confident learners",
  heroTitle: "Impact starts with the right foundation.",
  heroBody:
    "At Jireh International School, every learner is known, challenged and encouraged to grow in character, knowledge and purpose.",
  intro:
    "Jireh International School is a private Christian day and boarding school in Ghana, serving learners from Early Childhood through Junior High School.",
  leadershipMessage:
    "We believe education should open doors: to discovery, to service and to a future shaped by courage, compassion and excellence.",
  admissionsNote:
    "For current places, requirements and fees, please contact the school directly. Our admissions team will guide your family through the next step.",
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const galleryItems = [
  { src: STORAGE.life, title: "Learning in community", category: "School Life" },
  { src: STORAGE.learning, title: "A place to explore", category: "Academics" },
  { src: STORAGE.portrait1, title: "Growing with confidence", category: "Students" },
  { src: STORAGE.portrait2, title: "Curiosity in action", category: "Activities" },
  { src: STORAGE.portrait3, title: "The Jireh experience", category: "School Life" },
  { src: STORAGE.portrait4, title: "Ready for the next step", category: "Students" },
  { src: STORAGE.portrait5, title: "Every learner matters", category: "Campus" },
];

const levelCards = [
  { title: "Early Childhood", age: "Ages and entry details available from admissions", icon: Sparkles, copy: "A warm start where play, language, movement and wonder make learning feel natural." },
  { title: "Primary", age: "A strong foundation for the years ahead", icon: BookOpen, copy: "Learners build confidence across the core curriculum while developing independence and good habits." },
  { title: "Junior High", age: "Preparing learners for their next chapter", icon: Target, copy: "A focused, supportive environment that brings academic growth together with character and leadership." },
  { title: "Day & Boarding", age: "Boarding available at the Senior Campus", icon: School, copy: "Families can choose the arrangement that best supports their child’s learning and wellbeing." },
];

const activityCards = [
  { title: "STEM & Innovation", copy: "Questions become experiments, prototypes and new ways of seeing the world.", icon: Lightbulb },
  { title: "Arts & Music", copy: "Creative practice gives learners a confident voice and room to express what they imagine.", icon: Palette },
  { title: "Co-curricular Life", copy: "Coding, robotics, sports, public speaking and performing arts help every learner find a place to shine.", icon: Music2 },
];

function useSiteContent() {
  const { data } = trpc.content.getPublic.useQuery(undefined, { staleTime: 300000 });
  return useMemo(() => ({ ...DEFAULT_CONTENT, ...(data ?? {}) }), [data]);
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${compact ? "shrink-0" : ""}`}>
      <img src={STORAGE.logo} alt="Jireh International School crest" className={compact ? "h-10 w-10 object-contain" : "h-14 w-14 object-contain"} />
      <span className="leading-tight">
        <span className="block font-display text-lg font-semibold tracking-tight text-navy">Jireh</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-blue">International School</span>
      </span>
    </Link>
  );
}

function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="bg-navy text-white">
        <div className="container flex min-h-9 items-center justify-between gap-4 text-[11px] font-medium tracking-wide">
          <p className="hidden sm:block">Impact <span className="text-gold">•</span> Inspire <span className="text-gold">•</span> Empower</p>
          <div className="ml-auto flex items-center gap-4">
            <a href="tel:+233240496665" className="inline-flex items-center gap-1.5 hover:text-gold"><Phone className="h-3.5 w-3.5" /> +233 (0) 24 049 6665</a>
            <a href="mailto:jirehschools@gmail.com" className="hidden items-center gap-1.5 hover:text-gold sm:inline-flex"><Mail className="h-3.5 w-3.5" /> jirehschools@gmail.com</a>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-blue/10 bg-cream/95 backdrop-blur">
        <div className="container flex h-[76px] items-center justify-between gap-6">
          <Logo compact />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href} className={`nav-link ${location === item.href ? "active" : ""}`}>{item.label}</Link>)}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/admissions" className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-navy shadow-sm transition hover:bg-gold-deep sm:inline-flex">Apply / Enquire <ArrowRight className="ml-2 h-4 w-4" /></Link>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue/15 text-navy lg:hidden" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && <div className="border-t border-blue/10 bg-cream px-5 py-4 lg:hidden"><nav className="container flex flex-col gap-1">{navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-semibold ${location === item.href ? "bg-blue text-white" : "text-navy hover:bg-blue/5"}`}>{item.label}</Link>)}</nav></div>}
      </header>
      {children}
      <Footer />
    </div>
  );
}

function Footer() {
  return <footer className="bg-navy text-white">
    <div className="container grid gap-12 py-14 md:grid-cols-[1.3fr_0.8fr_1fr]">
      <div><div className="flex items-center gap-3"><img src={STORAGE.logo} alt="" className="h-14 w-14 object-contain" /><div><p className="font-display text-xl font-semibold">Jireh International School</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-gold">Quality for Success</p></div></div><p className="mt-6 max-w-sm text-sm leading-7 text-white/65">A Christian day and boarding school in Ghana helping learners grow in knowledge, character and purpose.</p><div className="mt-5 flex gap-2"><a href="https://www.facebook.com/p/Jireh-International-School-100034784154549/" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook"><Facebook className="h-4 w-4" /></a><a href="https://www.instagram.com/jireh_int_school/" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram"><Instagram className="h-4 w-4" /></a></div></div>
      <div><p className="footer-heading">Explore</p><div className="mt-4 grid gap-3 text-sm text-white/70">{navItems.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-gold">{item.label}</Link>)}</div></div>
      <div><p className="footer-heading">Visit or call</p><div className="mt-4 space-y-4 text-sm leading-6 text-white/70"><p><span className="font-semibold text-white">Junior Campus</span><br />3 Ardi-Nortey Street, Lebanon Zone 2, Ashaiman, Ghana</p><p><span className="font-semibold text-white">Senior Campus</span><br />GB-076-3504, Community 22 Annex, Ghana</p><p><a className="hover:text-gold" href="tel:+233240496665">+233 (0) 24 049 6665</a><br /><a className="hover:text-gold" href="mailto:jirehschools@gmail.com">jirehschools@gmail.com</a></p></div></div>
    </div>
    <div className="border-t border-white/10"><div className="container flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Jireh International School. All rights reserved.</p><p>Quality for Success</p></div></div>
  </footer>;
}

function SectionIntro({ eyebrow, title, body, align = "left" }: { eyebrow: string; title: string; body: string; align?: "left" | "center" }) {
  return <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}><p className="eyebrow">{eyebrow}</p><h2 className="section-title mt-3">{title}</h2><p className="mt-5 text-base leading-8 text-muted">{body}</p></div>;
}

function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <section className="border-b border-blue/10 bg-paper"><div className="container py-16 md:py-20"><p className="eyebrow">{eyebrow}</p><h1 className="display-title mt-3 max-w-3xl">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{body}</p></div></section>;
}

export default function Home() {
  const content = useSiteContent();
  const announcements = trpc.announcements.getPublished.useQuery(undefined, { staleTime: 120000 });
  return <SiteShell>
    <main>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 -z-10"><img src={STORAGE.hero} alt="Jireh learners" className="h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-navy/70" /></div>
        <div className="container grid min-h-[590px] items-end gap-12 py-16 md:grid-cols-[1fr_0.55fr] md:items-center md:py-24">
          <div className="max-w-2xl"><div className="mb-7 flex items-center gap-3"><img src={STORAGE.logo} alt="Jireh crest" className="h-16 w-16 object-contain" /><span className="h-px w-12 bg-gold" /><span className="text-xs font-bold uppercase tracking-[0.23em] text-gold">Quality for Success</span></div><p className="eyebrow text-gold">{content.heroEyebrow}</p><h1 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">{content.heroTitle}</h1><p className="mt-6 max-w-lg text-base leading-8 text-white/75 md:text-lg">{content.heroBody}</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/admissions" className="rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-navy transition hover:bg-gold-deep">Explore admissions <ArrowRight className="ml-2 inline h-4 w-4" /></Link><Link href="/contact" className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-gold hover:text-gold">Contact the school</Link></div></div>
          <div className="hidden justify-self-end md:block"><div className="hero-note"><Cross className="h-5 w-5 text-gold" /><p className="mt-8 font-display text-3xl leading-tight">Learn deeply.<br />Live purposefully.</p><p className="mt-5 text-sm leading-6 text-white/60">A place for the next question, the next discovery and the next brave step.</p></div></div>
        </div>
      </section>

      <section className="bg-paper"><div className="container grid gap-12 py-20 md:grid-cols-[0.8fr_1.2fr] md:items-end md:py-28"><div><p className="eyebrow">Welcome to Jireh</p><h2 className="section-title mt-3">A school community built around possibility.</h2></div><div><p className="text-xl leading-9 text-navy">{content.intro}</p><p className="mt-5 max-w-2xl text-base leading-8 text-muted">We bring together a supportive Christian ethos, engaging teaching and a broad co-curricular life so learners are ready to make a positive impact wherever they find themselves.</p><Link href="/about" className="text-link mt-7">Learn about our school <ArrowRight className="h-4 w-4" /></Link></div></div></section>

      {announcements.data?.length ? <section className="border-y border-blue/10 bg-cream"><div className="container py-10"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Latest from Jireh</p><h2 className="mt-2 font-display text-3xl font-semibold text-navy">What’s happening in our community.</h2></div><span className="text-xs font-bold uppercase tracking-widest text-muted">School updates</span></div><div className="mt-7 grid gap-4 md:grid-cols-3">{announcements.data.slice(0, 3).map((item) => <article key={item.id} className="rounded-[1.25rem] bg-paper p-5"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-widest text-gold-deep">{item.category}</span><span className="text-xs text-muted">{new Date(item.createdAt).toLocaleDateString()}</span></div><h3 className="mt-4 font-display text-2xl font-semibold text-navy">{item.title}</h3><p className="mt-3 text-sm leading-7 text-muted">{item.excerpt}</p></article>)}</div></div></section> : null}

      <section className="section-pad border-y border-blue/10 bg-cream"><div className="container"><SectionIntro eyebrow="A place to belong" title="One school, many ways to grow." body="From a child’s first classroom experiences to the confidence of Junior High, Jireh offers a connected journey for learners and families." align="center" /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{levelCards.map((item) => <div key={item.title} className="feature-card"><item.icon className="h-6 w-6 text-blue" /><h3 className="mt-6 font-display text-2xl font-semibold text-navy">{item.title}</h3><p className="mt-2 text-xs font-bold uppercase tracking-wide text-gold-deep">{item.age}</p><p className="mt-4 text-sm leading-7 text-muted">{item.copy}</p><Link href="/academics" className="text-link mt-6">Discover more <ArrowRight className="h-4 w-4" /></Link></div>)}</div></div></section>

      <section className="bg-navy text-white"><div className="container grid gap-14 py-20 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-28"><div><p className="eyebrow text-gold">The learning experience</p><h2 className="section-title mt-3 text-white">Curiosity is a serious advantage.</h2><p className="mt-6 text-base leading-8 text-white/65">Our academic approach combines the Ghana Education Service framework with the Oxford International Curriculum, creating space for strong foundations, global perspective and active learning.</p><Link href="/academics" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-gold hover:text-white">See the academic journey <ArrowRight className="h-4 w-4" /></Link></div><div className="grid gap-4 sm:grid-cols-3">{activityCards.map((item) => <div key={item.title} className="border-l border-gold/40 pl-5"><item.icon className="h-6 w-6 text-gold" /><h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/60">{item.copy}</p></div>)}</div></div></section>

      <section className="section-pad bg-paper"><div className="container grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-center"><div><p className="eyebrow">The Jireh difference</p><h2 className="section-title mt-3">Known well. Taught well. Encouraged well.</h2><p className="mt-5 text-base leading-8 text-muted">Small class sizes and attentive teaching help us create a learning environment where questions are welcomed, progress is noticed and every learner is encouraged to participate.</p><Link href="/about" className="text-link mt-7">Our approach <ArrowRight className="h-4 w-4" /></Link></div><div className="grid grid-cols-2 gap-4"><div className="relative col-span-2 overflow-hidden rounded-[2rem] sm:col-span-1"><img src={STORAGE.life} alt="Learners together at Jireh" className="h-72 w-full object-cover sm:h-[380px]" /></div><div className="grid gap-4 sm:pt-14"><div className="relative overflow-hidden rounded-[2rem]"><img src={STORAGE.learning} alt="Learning at Jireh" className="h-44 w-full object-cover" /></div><div className="rounded-[2rem] bg-blue p-6 text-white"><Users className="h-6 w-6 text-gold" /><p className="mt-5 font-display text-2xl leading-tight">Every learner has a next step.</p></div></div></div></div></section>

      <section className="section-pad border-y border-blue/10 bg-cream"><div className="container"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><SectionIntro eyebrow="A glimpse of Jireh" title="Learning looks different every day." body="Explore a small selection of moments from school life, learning and activities." /><Link href="/gallery" className="text-link shrink-0">Open gallery <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">{galleryItems.slice(0, 4).map((item, index) => <Link href="/gallery" key={item.src} className={`group relative overflow-hidden rounded-[1.5rem] ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}><img src={item.src} alt={item.title} className={`w-full object-cover transition duration-500 group-hover:scale-105 ${index === 0 ? "h-[390px]" : "h-[185px]"}`} /><div className="absolute inset-x-0 bottom-0 bg-navy/75 p-4 text-white"><p className="text-xs font-bold uppercase tracking-widest text-gold">{item.category}</p><p className="mt-1 font-display text-lg">{item.title}</p></div></Link>)}</div></div></section>

      <section className="bg-gold"><div className="container grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-navy/65">Admissions are a conversation</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-navy md:text-4xl">Let’s find the right next step for your family.</h2><p className="mt-3 max-w-xl text-sm leading-7 text-navy/70">{content.admissionsNote}</p></div><Link href="/admissions" className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue">Start an enquiry <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>

      <section className="bg-paper"><div className="container grid gap-10 py-16 md:grid-cols-[1fr_0.8fr] md:items-center"><div><p className="eyebrow">Find us in Ghana</p><h2 className="section-title mt-3">Two campuses, one connected community.</h2><p className="mt-5 max-w-xl text-base leading-8 text-muted">Visit the Junior Campus in Ashaiman or reach out to the Senior Campus at Community 22 Annex. Our team will be glad to help.</p></div><div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1"><div className="border-l-2 border-gold pl-5"><p className="text-xs font-bold uppercase tracking-widest text-blue">Junior Campus</p><p className="mt-2 text-sm leading-6 text-navy">3 Ardi-Nortey Street, Lebanon Zone 2, Ashaiman, Ghana</p></div><div className="border-l-2 border-blue pl-5"><p className="text-xs font-bold uppercase tracking-widest text-blue">Senior Campus</p><p className="mt-2 text-sm leading-6 text-navy">GB-076-3504, Community 22 Annex, Ghana</p></div></div></div></section>
    </main>
  </SiteShell>;
}

export function AboutPage() {
  const content = useSiteContent();
  return <SiteShell><PageIntro eyebrow="About Jireh" title="A Christian school with a clear sense of purpose." body={content.intro} /><main><section className="section-pad bg-paper"><div className="container grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-center"><div className="relative"><img src={STORAGE.portrait3} alt="Jireh student" className="h-[480px] w-full rounded-[2rem] object-cover" /><div className="absolute -bottom-6 -right-4 max-w-[210px] rounded-2xl bg-gold p-5 text-navy shadow-xl"><Quote className="h-6 w-6" /><p className="mt-4 font-display text-lg leading-snug">{content.leadershipMessage}</p></div></div><div><p className="eyebrow">Our foundation</p><h2 className="section-title mt-3">Education that reaches beyond the classroom.</h2><p className="mt-6 text-base leading-8 text-muted">Jireh International School exists to give children and young people a supportive place to learn, ask good questions and develop the confidence to contribute meaningfully to their communities.</p><p className="mt-5 text-base leading-8 text-muted">The school serves Early Childhood, Primary and Junior High learners, with boarding facilities available at the Senior Campus. Families can contact the school for current admissions information and campus guidance.</p></div></div></section><section className="section-pad border-y border-blue/10 bg-cream"><div className="container grid gap-5 md:grid-cols-3"><div className="story-card"><Compass className="h-6 w-6 text-blue" /><h3 className="mt-6 font-display text-2xl font-semibold text-navy">Mission</h3><p className="mt-4 text-sm leading-7 text-muted">To nurture learners through purposeful teaching, Christian values and opportunities to grow in knowledge, character and service.</p></div><div className="story-card"><Target className="h-6 w-6 text-blue" /><h3 className="mt-6 font-display text-2xl font-semibold text-navy">Vision</h3><p className="mt-4 text-sm leading-7 text-muted">To help raise impactful, inspired and empowered young people who are prepared for the journey ahead.</p></div><div className="story-card"><HeartHandshake className="h-6 w-6 text-blue" /><h3 className="mt-6 font-display text-2xl font-semibold text-navy">Core values</h3><p className="mt-4 text-sm leading-7 text-muted">Faith, integrity, curiosity, excellence, compassion, responsibility and the courage to participate.</p></div></div></section><section className="bg-navy text-white"><div className="container grid gap-10 py-16 md:grid-cols-2 md:items-center"><div><p className="eyebrow text-gold">Day & boarding</p><h2 className="section-title mt-3 text-white">The right environment for every season.</h2></div><div className="text-sm leading-8 text-white/65"><p>Jireh welcomes day learners across the school and offers boarding facilities at the Senior Campus. For details about availability, routines and the best fit for your child, please speak with admissions.</p><Link href="/admissions" className="mt-6 inline-flex items-center gap-2 font-bold text-gold hover:text-white">Ask about boarding <ArrowRight className="h-4 w-4" /></Link></div></div></section></main></SiteShell>;
}

export function AcademicsPage() {
  return <SiteShell><PageIntro eyebrow="Academics" title="Strong foundations. Wider horizons." body="Jireh combines the Ghana Education Service framework with the Oxford International Curriculum, with active learning and co-curricular experiences woven through the school day." /><main><section className="section-pad bg-paper"><div className="container"><div className="grid gap-5 md:grid-cols-3">{levelCards.slice(0, 3).map((level) => <div key={level.title} className="feature-card"><level.icon className="h-7 w-7 text-blue" /><h2 className="mt-7 font-display text-3xl font-semibold text-navy">{level.title}</h2><p className="mt-4 text-sm leading-7 text-muted">{level.copy}</p><div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-deep"><CircleCheck className="h-4 w-4" /> Personalized support</div></div>)}</div></div></section><section className="section-pad border-y border-blue/10 bg-cream"><div className="container grid gap-14 md:grid-cols-[1fr_0.85fr] md:items-center"><div><p className="eyebrow">How learners grow</p><h2 className="section-title mt-3">Learning is active, collaborative and connected to the real world.</h2><div className="mt-8 grid gap-5 sm:grid-cols-2">{["STEM and innovation", "Interactive learning", "Arts and music", "Co-curricular activities", "Small class sizes", "Character and leadership"].map((item) => <div key={item} className="flex items-start gap-3 text-sm font-semibold text-navy"><Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" />{item}</div>)}</div></div><div className="overflow-hidden rounded-[2rem]"><img src={STORAGE.learning} alt="Students learning at Jireh" className="h-[390px] w-full object-cover" /></div></div></section><section className="bg-paper"><div className="container grid gap-10 py-16 md:grid-cols-[0.8fr_1.2fr] md:items-center"><div><p className="eyebrow">Beyond the timetable</p><h2 className="section-title mt-3">There is more than one way to discover a strength.</h2></div><div className="grid gap-4 sm:grid-cols-2">{activityCards.map((item) => <div key={item.title} className="flex gap-4 border-t border-blue/15 pt-5"><item.icon className="h-6 w-6 shrink-0 text-blue" /><div><h3 className="font-display text-xl font-semibold text-navy">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{item.copy}</p></div></div>)}</div></div></section></main></SiteShell>;
}

function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const mutation = trpc.enquiries.submit.useMutation({ onSuccess: () => setSubmitted(true), onError: (error) => toast.error(error.message || "Please check the form and try again.") });
  const [form, setForm] = useState({ parentName: "", phone: "", email: "", studentName: "", studentAge: "", classApplying: "", dayBoarding: "Day", message: "" });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  if (submitted) return <div className="rounded-[1.5rem] bg-blue p-8 text-white"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy"><Check /></div><h3 className="mt-6 font-display text-3xl font-semibold">Thank you for reaching out.</h3><p className="mt-3 max-w-lg text-sm leading-7 text-white/70">Your enquiry has been received. The school team can follow up using the details you shared.</p><button className="mt-6 text-sm font-bold text-gold underline underline-offset-4" onClick={() => setSubmitted(false)}>Send another enquiry</button></div>;
  return <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); mutation.mutate(form); }}><div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="parentName">Parent / guardian name</Label><Input id="parentName" required value={form.parentName} onChange={(e) => update("parentName", e.target.value)} /></div><div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div><div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} /></div><div><Label htmlFor="studentName">Student name</Label><Input id="studentName" required value={form.studentName} onChange={(e) => update("studentName", e.target.value)} /></div><div><Label htmlFor="studentAge">Student age</Label><Input id="studentAge" required value={form.studentAge} onChange={(e) => update("studentAge", e.target.value)} /></div><div><Label htmlFor="classApplying">Class applying for</Label><Input id="classApplying" required placeholder="e.g. Primary 4" value={form.classApplying} onChange={(e) => update("classApplying", e.target.value)} /></div></div><div><Label htmlFor="dayBoarding">Day / boarding preference</Label><select id="dayBoarding" className="field-select" value={form.dayBoarding} onChange={(e) => update("dayBoarding", e.target.value)}><option>Day</option><option>Boarding</option><option>Not sure yet</option></select></div><div><Label htmlFor="message">Message</Label><Textarea id="message" required rows={5} placeholder="Tell us how we can help..." value={form.message} onChange={(e) => update("message", e.target.value)} /></div><Button type="submit" disabled={mutation.isPending} className="w-full rounded-full bg-blue py-6 text-white hover:bg-navy sm:w-fit">{mutation.isPending ? "Sending…" : "Send enquiry"}<Send className="ml-2 h-4 w-4" /></Button></form>;
}

export function AdmissionsPage() {
  const content = useSiteContent();
  return <SiteShell><PageIntro eyebrow="Admissions" title="A considered next step for your family." body={content.admissionsNote} /><main><section className="section-pad bg-paper"><div className="container grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-start"><div><p className="eyebrow">Start here</p><h2 className="section-title mt-3">We make the first conversation simple.</h2><p className="mt-5 text-base leading-8 text-muted">Use the enquiry form to share a little about your family. The school will confirm current availability, requirements and fees directly with you.</p><div className="mt-8 space-y-5">{["Share your enquiry", "Speak with the school team", "Visit the most relevant campus", "Choose day or boarding where available"].map((item, index) => <div key={item} className="flex items-center gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy">0{index + 1}</span><span className="text-sm font-semibold text-navy">{item}</span></div>)}</div><div className="mt-10 border-l-2 border-blue pl-5 text-sm leading-7 text-muted"><p className="font-semibold text-navy">Classes available</p><p>Early Childhood, Primary and Junior High School. Boarding facilities are available at the Senior Campus.</p></div></div><div className="rounded-[2rem] bg-cream p-6 sm:p-9"><h3 className="font-display text-3xl font-semibold text-navy">Send an enquiry</h3><p className="mt-3 mb-8 text-sm leading-7 text-muted">Fields marked required help the school respond with the right information.</p><EnquiryForm /></div></div></section><section className="bg-navy text-white"><div className="container flex flex-col justify-between gap-6 py-12 md:flex-row md:items-center"><div><p className="eyebrow text-gold">Prefer a direct conversation?</p><p className="mt-3 text-xl font-semibold">Call +233 (0) 24 049 6665 or email jirehschools@gmail.com</p></div><a href="tel:+233240496665" className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-bold text-navy">Call admissions <Phone className="ml-2 h-4 w-4" /></a></div></section></main></SiteShell>;
}

export function GalleryPage() {
  const [active, setActive] = useState("All");
  const categories = ["All", "School Life", "Students", "Academics", "Activities", "Campus"];
  const filtered = galleryItems.filter((item) => active === "All" || item.category === active);
  return <SiteShell><PageIntro eyebrow="Gallery" title="A glimpse of the Jireh experience." body="Explore moments from learning, school life and the activities that help our learners grow." /><main className="section-pad bg-paper"><div className="container"><div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setActive(category)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${active === category ? "bg-blue text-white" : "bg-cream text-navy hover:bg-gold"}`}>{category}</button>)}</div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <div key={item.src} className="group overflow-hidden rounded-[1.5rem] bg-cream"><img src={item.src} alt={item.title} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" /><div className="p-5"><p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{item.category}</p><h2 className="mt-2 font-display text-2xl font-semibold text-navy">{item.title}</h2></div></div>)}</div></div></main></SiteShell>;
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  return <SiteShell><PageIntro eyebrow="Contact" title="We’re always happy to hear from you." body="Call, email or send a message and the Jireh team will point you in the right direction." /><main><section className="section-pad bg-paper"><div className="container grid gap-14 md:grid-cols-[0.8fr_1.2fr]"><div><p className="eyebrow">Reach the school</p><h2 className="section-title mt-3">Come and say hello.</h2><div className="mt-9 space-y-7"><div><p className="text-xs font-bold uppercase tracking-widest text-blue">Phone</p><p className="mt-2 text-lg font-semibold text-navy"><a className="hover:text-blue" href="tel:+233240496665">+233 (0) 24 049 6665</a><br /><a className="hover:text-blue" href="tel:+233541171496">+233 (0) 54 117 1496</a></p></div><div><p className="text-xs font-bold uppercase tracking-widest text-blue">Email & website</p><p className="mt-2 text-lg font-semibold text-navy"><a className="hover:text-blue" href="mailto:jirehschools@gmail.com">jirehschools@gmail.com</a><br /><a className="hover:text-blue" href="https://jirehschools.com" target="_blank" rel="noreferrer">jirehschools.com <ExternalLink className="inline h-4 w-4" /></a></p></div><div><p className="text-xs font-bold uppercase tracking-widest text-blue">Campuses</p><p className="mt-2 text-sm leading-7 text-muted"><strong className="text-navy">Junior Campus:</strong> 3 Ardi-Nortey Street, Lebanon Zone 2, Ashaiman, Ghana<br /><strong className="text-navy">Senior Campus:</strong> GB-076-3504, Community 22 Annex, Ghana</p></div></div></div><div className="rounded-[2rem] bg-cream p-6 sm:p-9"><h3 className="font-display text-3xl font-semibold text-navy">Send a message</h3>{sent ? <div className="mt-8 rounded-2xl bg-blue p-6 text-white"><Check className="h-6 w-6 text-gold" /><p className="mt-4 font-display text-2xl">Message ready to be followed up.</p><p className="mt-2 text-sm leading-7 text-white/70">Thank you for contacting Jireh International School.</p></div> : <form className="mt-8 grid gap-5" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="contact-name">Name</Label><Input id="contact-name" required /></div><div><Label htmlFor="contact-email">Email</Label><Input id="contact-email" type="email" required /></div></div><div><Label htmlFor="contact-message">Message</Label><Textarea id="contact-message" required rows={6} /></div><Button type="submit" className="w-full rounded-full bg-blue py-6 text-white hover:bg-navy sm:w-fit">Send message <Send className="ml-2 h-4 w-4" /></Button></form>}</div></div></section><section className="border-t border-blue/10 bg-cream"><div className="container grid gap-4 py-12 md:grid-cols-2"><div className="campus-panel"><p className="eyebrow">Junior Campus</p><p className="mt-3 font-display text-2xl text-navy">Lebanon Zone 2, Ashaiman</p><a href="https://www.google.com/maps/search/?api=1&query=3%20Ardi-Nortey%20Street%2C%20Lebanon%20Zone%202%2C%20Ashaiman%2C%20Ghana" target="_blank" rel="noreferrer" className="text-link mt-5">Open map search <ExternalLink className="h-4 w-4" /></a></div><div className="campus-panel"><p className="eyebrow">Senior Campus</p><p className="mt-3 font-display text-2xl text-navy">Community 22 Annex</p><a href="https://www.google.com/maps/search/?api=1&query=GB-076-3504%2C%20Community%2022%20Annex%2C%20Ghana" target="_blank" rel="noreferrer" className="text-link mt-5">Open map search <ExternalLink className="h-4 w-4" /></a></div></div></section></main></SiteShell>;
}

function AdminOverview() {
  const { user } = useAuth();
  const enquiries = trpc.enquiries.list.useQuery();
  return <div className="admin-content"><div className="flex flex-col justify-between gap-4 border-b border-blue/10 pb-6 md:flex-row md:items-end"><div><p className="eyebrow">Jireh content studio</p><h1 className="admin-title">Good to see you, {user?.name?.split(" ")[0] || "admin"}.</h1><p className="mt-2 text-sm text-muted">Manage the public school website without the weight of a school ERP.</p></div><Link href="/" target="_blank" className="text-link">View public site <ExternalLink className="h-4 w-4" /></Link></div><div className="mt-8 grid gap-4 md:grid-cols-3"><div className="admin-stat"><p className="text-xs font-bold uppercase tracking-widest text-blue">Public pages</p><p className="mt-3 font-display text-4xl text-navy">06</p><p className="mt-2 text-sm text-muted">Home through Contact</p></div><div className="admin-stat"><p className="text-xs font-bold uppercase tracking-widest text-blue">Gallery items</p><p className="mt-3 font-display text-4xl text-navy">07</p><p className="mt-2 text-sm text-muted">Official school imagery</p></div><div className="admin-stat"><p className="text-xs font-bold uppercase tracking-widest text-blue">Enquiries</p><p className="mt-3 font-display text-4xl text-navy">{enquiries.data?.length ?? 0}</p><p className="mt-2 text-sm text-muted">Submitted from admissions</p></div></div><div className="mt-8 grid gap-5 md:grid-cols-2"><div className="admin-panel"><p className="eyebrow">Quick actions</p><div className="mt-5 grid gap-3"><Link href="/admin/homepage" className="admin-action">Edit homepage content <ArrowRight className="h-4 w-4" /></Link><Link href="/admin/gallery" className="admin-action">Manage gallery <ArrowRight className="h-4 w-4" /></Link><Link href="/admin/admissions" className="admin-action">Review enquiries <ArrowRight className="h-4 w-4" /></Link></div></div><div className="admin-panel bg-navy text-white"><p className="eyebrow text-gold">Keep the story clear</p><p className="mt-4 font-display text-3xl leading-tight">A few thoughtful updates go a long way.</p><p className="mt-4 text-sm leading-7 text-white/65">Use this panel to keep public-facing information current. Student records, fees and school management do not belong here.</p></div></div></div>;
}

function AdminEditor({ section }: { section: "homepage" | "about" | "academics" }) {
  const content = useSiteContent();
  const update = trpc.content.update.useMutation({ onSuccess: () => toast.success("Content saved to the public site."), onError: (error) => toast.error(error.message) });
  const fields = section === "homepage" ? [
    ["heroEyebrow", "Hero eyebrow", content.heroEyebrow], ["heroTitle", "Hero headline", content.heroTitle], ["heroBody", "Hero welcome statement", content.heroBody], ["intro", "Homepage introduction", content.intro],
  ] : section === "about" ? [["leadershipMessage", "Leadership message", content.leadershipMessage], ["intro", "School introduction", content.intro]] : [["admissionsNote", "Admissions note", content.admissionsNote], ["intro", "Academic overview intro", content.intro]];
  const [values, setValues] = useState<Record<string, string>>({});
  const getValue = (key: string, fallback: string) => values[key] ?? fallback;
  return <div className="admin-content"><p className="eyebrow">Content editor</p><h1 className="admin-title">Edit {section}</h1><p className="mt-2 max-w-2xl text-sm leading-7 text-muted">These fields control public-facing copy only. Save each field when you are ready to publish the change.</p><div className="mt-8 max-w-3xl space-y-5">{fields.map(([key, label, fallback]) => <div key={key} className="admin-panel"><Label htmlFor={key}>{label}</Label><Textarea id={key} rows={key.includes("Title") || key === "heroTitle" ? 2 : 5} value={getValue(key, fallback)} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} /><Button className="mt-4 rounded-full bg-blue text-white hover:bg-navy" onClick={() => update.mutate({ key, value: getValue(key, fallback) })} disabled={update.isPending}>{update.isPending ? "Saving…" : "Save to public site"}</Button></div>)}</div></div>;
}

function AdminGallery() {
  const [items, setItems] = useState(galleryItems);
  return <div className="admin-content"><div className="flex flex-col justify-between gap-4 border-b border-blue/10 pb-6 md:flex-row md:items-end"><div><p className="eyebrow">Media library</p><h1 className="admin-title">Gallery</h1><p className="mt-2 text-sm text-muted">Official school imagery currently used across the public site.</p></div><Button className="rounded-full bg-blue text-white hover:bg-navy" onClick={() => toast.info("Image uploads are ready for storage wiring in the next content pass.")}>Add image <ArrowRight className="ml-2 h-4 w-4" /></Button></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <div key={item.src} className="overflow-hidden rounded-[1.5rem] border border-blue/10 bg-paper"><img src={item.src} alt={item.title} className="h-48 w-full object-cover" /><div className="p-4"><p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{item.category}</p><p className="mt-2 font-display text-xl text-navy">{item.title}</p><button className="mt-4 text-xs font-bold uppercase tracking-wider text-blue" onClick={() => { setItems((current) => current.filter((candidate) => candidate.src !== item.src)); toast.success("Removed from this view."); }}>Remove from view</button></div></div>)}</div></div>;
}

function AdminEnquiries() {
  const enquiries = trpc.enquiries.list.useQuery();
  return <div className="admin-content"><p className="eyebrow">Admissions inbox</p><h1 className="admin-title">Submitted enquiries</h1><p className="mt-2 text-sm leading-7 text-muted">A lightweight list of public admission enquiries. Follow up directly by phone or email.</p><div className="mt-8 grid gap-4">{enquiries.isLoading ? <p className="text-sm text-muted">Loading enquiries…</p> : enquiries.data?.length ? enquiries.data.map((item) => <Card key={item.id} className="border-blue/10 bg-paper shadow-none"><CardHeader className="pb-3"><div className="flex flex-col justify-between gap-2 sm:flex-row"><CardTitle className="font-display text-2xl text-navy">{item.studentName}</CardTitle><Badge className="w-fit bg-gold text-navy hover:bg-gold">{item.dayBoarding}</Badge></div></CardHeader><CardContent className="grid gap-3 text-sm text-muted sm:grid-cols-2"><p><strong className="text-navy">Parent / guardian:</strong> {item.parentName}</p><p><strong className="text-navy">Class:</strong> {item.classApplying}</p><p><strong className="text-navy">Phone:</strong> <a className="text-blue" href={`tel:${item.phone}`}>{item.phone}</a></p><p><strong className="text-navy">Email:</strong> <a className="text-blue" href={`mailto:${item.email}`}>{item.email}</a></p><p className="sm:col-span-2"><strong className="text-navy">Message:</strong> {item.message}</p></CardContent></Card>) : <div className="admin-panel"><p className="font-display text-2xl text-navy">No enquiries yet.</p><p className="mt-2 text-sm text-muted">New admissions forms will appear here.</p></div>}</div></div>;
}

function AdminAnnouncements() {
  const utils = trpc.useUtils();
  const announcements = trpc.announcements.list.useQuery();
  const create = trpc.announcements.create.useMutation({ onSuccess: () => { utils.announcements.list.invalidate(); setDraft({ title: "", category: "News", excerpt: "", published: 1 }); toast.success("Announcement created."); }, onError: (error) => toast.error(error.message) });
  const update = trpc.announcements.update.useMutation({ onSuccess: () => { utils.announcements.list.invalidate(); setEditing(null); toast.success("Announcement updated."); }, onError: (error) => toast.error(error.message) });
  const remove = trpc.announcements.remove.useMutation({ onSuccess: () => { utils.announcements.list.invalidate(); toast.success("Announcement deleted."); }, onError: (error) => toast.error(error.message) });
  const [draft, setDraft] = useState({ title: "", category: "News", excerpt: "", published: 1 });
  const [editing, setEditing] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState({ title: "", category: "News", excerpt: "", published: 1 });
  return <div className="admin-content"><p className="eyebrow">Public updates</p><h1 className="admin-title">Announcements</h1><p className="mt-2 max-w-2xl text-sm leading-7 text-muted">Create short, public-facing updates for families. Keep the content useful, current and easy to scan.</p><div className="mt-8 rounded-[1.5rem] bg-navy p-6 text-white sm:p-8"><p className="eyebrow text-gold">New announcement</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><Label htmlFor="announcement-title" className="text-white">Title</Label><Input id="announcement-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="e.g. Open day for prospective families" /></div><div><Label htmlFor="announcement-category" className="text-white">Category</Label><Input id="announcement-category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></div><div className="sm:col-span-2"><Label htmlFor="announcement-excerpt" className="text-white">Announcement copy</Label><Textarea id="announcement-excerpt" rows={4} value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} placeholder="Write a short update for the public site..." /></div></div><div className="mt-5 flex flex-wrap items-center gap-4"><label className="mb-0 inline-flex items-center gap-2 text-sm font-semibold text-white"><input type="checkbox" checked={draft.published === 1} onChange={(event) => setDraft({ ...draft, published: event.target.checked ? 1 : 0 })} /> Publish immediately</label><Button className="rounded-full bg-gold text-navy hover:bg-gold-deep" onClick={() => create.mutate(draft)} disabled={create.isPending}>{create.isPending ? "Creating…" : "Create announcement"}<Send className="ml-2 h-4 w-4" /></Button></div></div><div className="mt-8 space-y-4">{announcements.isLoading ? <p className="text-sm text-muted">Loading announcements…</p> : announcements.data?.length ? announcements.data.map((item) => editing === item.id ? <div key={item.id} className="admin-panel"><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor={`edit-title-${item.id}`}>Title</Label><Input id={`edit-title-${item.id}`} value={editDraft.title} onChange={(event) => setEditDraft({ ...editDraft, title: event.target.value })} /></div><div><Label htmlFor={`edit-category-${item.id}`}>Category</Label><Input id={`edit-category-${item.id}`} value={editDraft.category} onChange={(event) => setEditDraft({ ...editDraft, category: event.target.value })} /></div><div className="sm:col-span-2"><Label htmlFor={`edit-excerpt-${item.id}`}>Copy</Label><Textarea id={`edit-excerpt-${item.id}`} rows={4} value={editDraft.excerpt} onChange={(event) => setEditDraft({ ...editDraft, excerpt: event.target.value })} /></div></div><div className="mt-4 flex gap-3"><Button className="rounded-full bg-blue text-white hover:bg-navy" onClick={() => update.mutate({ id: item.id, ...editDraft })}>Save changes</Button><Button variant="outline" className="rounded-full" onClick={() => setEditing(null)}>Cancel</Button></div></div> : <div key={item.id} className="admin-panel"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-widest text-gold-deep">{item.category}</span><Badge className={item.published ? "bg-blue text-white hover:bg-blue" : "bg-muted text-navy hover:bg-muted"}>{item.published ? "Published" : "Draft"}</Badge></div><h2 className="mt-3 font-display text-2xl text-navy">{item.title}</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{item.excerpt}</p></div><div className="flex shrink-0 gap-2"><Button variant="outline" className="rounded-full" onClick={() => { setEditing(item.id); setEditDraft({ title: item.title, category: item.category, excerpt: item.excerpt, published: item.published }); }}>Edit</Button><Button variant="outline" className="rounded-full text-destructive" onClick={() => remove.mutate({ id: item.id })}>Delete</Button></div></div></div>) : <div className="admin-panel"><p className="font-display text-2xl text-navy">No announcements yet.</p><p className="mt-2 text-sm text-muted">Create the first public update above.</p></div>}</div></div>;
}

function AdminSettings() {
  return <div className="admin-content"><p className="eyebrow">Site settings</p><h1 className="admin-title">School identity & contacts</h1><p className="mt-2 max-w-2xl text-sm leading-7 text-muted">The supplied contact information is already reflected across the public site. Keep this checklist nearby when future updates are needed.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{[["School name", "Jireh International School"], ["Motto", "Impact • Inspire • Empower"], ["Tagline", "Quality for Success"], ["Email", "jirehschools@gmail.com"], ["Phone", "+233 (0) 24 049 6665 / +233 (0) 54 117 1496"], ["Website", "jirehschools.com"]].map(([label, value]) => <div className="admin-panel" key={label}><p className="text-xs font-bold uppercase tracking-widest text-blue">{label}</p><p className="mt-3 text-lg font-semibold text-navy">{value}</p></div>)}</div></div>;
}

export function AdminPage({ section = "dashboard" }: { section?: string }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-cream text-muted">Loading admin…</div>;
  if (!user) return <div className="flex min-h-screen items-center justify-center bg-cream px-6"><div className="max-w-md text-center"><img src={STORAGE.logo} alt="" className="mx-auto h-20 w-20 object-contain" /><h1 className="mt-6 font-display text-4xl text-navy">Admin access</h1><p className="mt-4 text-sm leading-7 text-muted">Sign in to manage public school website content.</p><Button className="mt-7 rounded-full bg-blue text-white hover:bg-navy" onClick={() => startLogin()}>Sign in</Button></div></div>;
  if (user.role !== "admin") return <div className="flex min-h-screen items-center justify-center bg-cream px-6"><div className="max-w-md text-center"><h1 className="font-display text-4xl text-navy">Admin access is restricted</h1><p className="mt-4 text-sm leading-7 text-muted">This area is reserved for authorised Jireh content editors.</p><Link href="/" className="text-link mt-7">Return to public site <ArrowRight className="h-4 w-4" /></Link></div></div>;
  return <div className="min-h-screen bg-cream"><AdminLayout><>{section === "dashboard" && <AdminOverview />}{section === "homepage" && <AdminEditor section="homepage" />}{section === "about" && <AdminEditor section="about" />}{section === "academics" && <AdminEditor section="academics" />}{section === "admissions" && <AdminEnquiries />}{section === "gallery" && <AdminGallery />}{section === "announcements" && <AdminAnnouncements />}{section === "settings" && <AdminSettings />}</></AdminLayout></div>;
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const links = [{ label: "Dashboard", href: "/admin", icon: Compass }, { label: "Homepage", href: "/admin/homepage", icon: Sparkles }, { label: "About", href: "/admin/about", icon: HeartHandshake }, { label: "Academics", href: "/admin/academics", icon: BookOpen }, { label: "Admissions", href: "/admin/admissions", icon: GraduationCap }, { label: "Gallery", href: "/admin/gallery", icon: Palette }, { label: "Announcements", href: "/admin/announcements", icon: Send }, { label: "Site settings", href: "/admin/settings", icon: Zap }];
  return <div className="flex min-h-screen"><aside className={`hidden border-r border-blue/10 bg-navy text-white transition-all md:flex md:flex-col ${collapsed ? "w-20" : "w-64"}`}><div className="flex h-20 items-center gap-3 border-b border-white/10 px-5"><img src={STORAGE.logo} alt="" className="h-10 w-10 object-contain" />{!collapsed && <div><p className="font-display text-lg">Jireh</p><p className="text-[9px] uppercase tracking-[0.2em] text-gold">Content studio</p></div>}</div><nav className="flex-1 space-y-1 px-3 py-5">{links.map((link) => <Link key={link.href} href={link.href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${location === link.href ? "bg-gold font-bold text-navy" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><link.icon className="h-4 w-4 shrink-0" />{!collapsed && link.label}</Link>)}</nav><button onClick={() => setCollapsed((value) => !value)} className="m-3 rounded-xl border border-white/10 px-3 py-3 text-left text-xs text-white/60 hover:text-white">{collapsed ? "Expand" : "Collapse menu"}</button><Link href="/" className="border-t border-white/10 px-6 py-5 text-sm text-white/60 hover:text-gold">← Public site</Link></aside><div className="flex min-w-0 flex-1 flex-col"><div className="flex h-16 items-center justify-between border-b border-blue/10 bg-paper px-5 md:px-8"><div className="flex items-center gap-3 md:hidden"><img src={STORAGE.logo} alt="" className="h-9 w-9 object-contain" /><span className="font-display text-lg text-navy">Jireh content studio</span></div><span className="hidden text-xs font-bold uppercase tracking-widest text-blue md:block">Public website content only</span><Link href="/" className="text-sm font-semibold text-blue hover:text-navy">View site <ExternalLink className="ml-1 inline h-4 w-4" /></Link></div><div className="flex-1 overflow-auto p-5 md:p-10">{children}</div></div></div>;
}
