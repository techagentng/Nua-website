import { useEffect, useRef, useState, type ReactNode } from 'react'

type Service = { title: string; description: string }

const services: Service[] = [
  { title: 'Cloud & Infrastructure', description: 'Designing secure, elastic cloud environments that eliminate downtime and scale with enterprise demands.' },
  { title: 'Data Intelligence & AI', description: 'Structuring clean data pipelines and deploying custom AI models that turn operational noise into strategic foresight.' },
  { title: 'Cybersecurity & Compliance', description: 'Fortifying digital perimeters through zero-trust architecture, continuous monitoring, and rigorous compliance alignment.' },
  { title: 'Enterprise Software Engineering', description: 'Building high-performance applications that modernize core operations and integrate seamlessly with existing stacks.' },
]
const partners = ['Vertex AI', 'Quantum Systems', 'Helix Cloud', 'Aegis Security', 'DataCore']

function ServiceRow({ title, description }: Service) {
  return <a href="#contact" className="service-row group flex items-center justify-between gap-8 border-b border-black/10 py-8 transition-all duration-500 hover:pl-4 md:py-10">
    <h3 className="font-display text-3xl font-light transition-colors duration-500 group-hover:italic group-hover:text-electric md:text-5xl">{title}</h3>
    <p className="hidden max-w-sm text-right text-sm leading-relaxed text-ink-muted md:block">{description}</p>
  </a>
}

function MagneticButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const button = buttonRef.current
    if (!button) return
    const bounds = button.getBoundingClientRect()
    button.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * 0.18}px, ${(event.clientY - bounds.top - bounds.height / 2) * 0.18}px)`
  }
  const resetPosition = () => { if (buttonRef.current) buttonRef.current.style.transform = 'translate(0, 0)' }
  return <a ref={buttonRef} href="#contact" onMouseMove={handleMouseMove} onMouseLeave={resetPosition} className={`inline-block rounded-full bg-electric px-9 py-5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_40px_rgba(5,0,255,0.25)] transition-all duration-300 hover:bg-ink hover:shadow-none ${className}`}>{children}</a>
}

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return <button
    type="button"
    onClick={onToggle}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-lg text-white transition-colors hover:border-acid hover:text-acid"
  >
    <span aria-hidden="true">{isDark ? '☼' : '◐'}</span>
  </button>
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = window.localStorage.getItem('nua-theme')
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    window.localStorage.setItem('nua-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    let mouseX = window.innerWidth / 2; let mouseY = window.innerHeight / 2
    let cursorX = mouseX; let cursorY = mouseY; let animationId = 0
    const handleMouseMove = (event: MouseEvent) => { mouseX = event.clientX; mouseY = event.clientY }
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.2; cursorY += (mouseY - cursorY) * 0.2
      cursor.style.left = `${cursorX}px`; cursor.style.top = `${cursorY}px`; animationId = requestAnimationFrame(animate)
    }
    const interactiveElements = document.querySelectorAll('a, button, .service-row')
    const handleEnter = () => cursor.classList.add('hovering'); const handleLeave = () => cursor.classList.remove('hovering')
    window.addEventListener('mousemove', handleMouseMove); animationId = requestAnimationFrame(animate)
    interactiveElements.forEach((element) => { element.addEventListener('mouseenter', handleEnter); element.addEventListener('mouseleave', handleLeave) })
    const timer = window.setTimeout(() => setIsLoaded(true), 100)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(animationId); window.clearTimeout(timer)
      interactiveElements.forEach((element) => { element.removeEventListener('mouseenter', handleEnter); element.removeEventListener('mouseleave', handleLeave) })
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.15, rootMargin: '0px 0px -50px 0px' })
    const elements = document.querySelectorAll('.reveal'); elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return <main className={`min-h-screen overflow-x-hidden bg-ice text-ink ${isLoaded ? 'loaded' : ''}`}>
    <div className="noise-overlay" aria-hidden="true" /><div ref={cursorRef} className="cursor hidden md:block" aria-hidden="true" />
    <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-6 text-white mix-blend-difference md:px-16">
      <a href="#hero" className="font-display text-2xl font-black italic">Nua Consult.</a>
      <div className="flex items-center gap-6"><ul className="hidden gap-10 text-sm font-medium uppercase tracking-wider lg:flex"><li><a href="#manifesto" className="hover:text-acid">Studio</a></li><li><a href="#services" className="hover:text-acid">Capabilities</a></li><li><a href="#process" className="hover:text-acid">Approach</a></li><li><a href="#contact" className="hover:text-acid">Contact</a></li></ul><ThemeToggle isDark={isDark} onToggle={() => setIsDark((current) => !current)} /></div>
    </nav>

    <section id="hero" className="relative flex min-h-screen flex-col justify-end px-6 pb-16 pt-32 md:px-16">
      <div className="mb-8 flex justify-between border-b border-black/10 pb-4 text-[10px] uppercase tracking-[0.14em] text-ink-muted md:text-xs"><span>IT Solutions & Digital Architecture</span><span>Global Delivery</span></div>
      <h1 className="font-display text-[16vw] font-black leading-[0.78] md:text-[13vw]"><span className="block overflow-hidden"><span className="line-inner delay-1">Architecting</span></span><span className="block overflow-hidden"><span className="line-inner delay-2 italic font-light text-electric">digital clarity.</span></span></h1>
      <div className="mt-12 flex items-end justify-between gap-8"><p className="max-w-xs text-sm leading-relaxed text-ink-muted md:text-base">We engineer foundational IT infrastructure that allows ambitious enterprises to scale without friction.</p><p className="hidden text-right text-sm text-ink-muted md:block">Scroll to explore</p></div>
    </section>

    <div className="overflow-hidden whitespace-nowrap border-y border-black/10 bg-white/30 py-6 backdrop-blur-md"><div className="animate-scroll inline-flex items-center gap-16">{[...partners, ...partners].map((partner, index) => <span key={`${partner}-${index}`} className="font-display flex items-center gap-16 text-2xl font-light">{partner}<span className="text-base text-electric" aria-hidden="true">✳</span></span>)}</div></div>

    <section id="manifesto" className="px-6 py-24 md:px-16 md:py-48"><div className="grid grid-cols-1 gap-10 lg:grid-cols-3"><p className="reveal text-xs uppercase tracking-wider text-ink-muted">[ 01 — The Studio ]</p><h2 className="reveal font-display text-3xl font-light leading-tight md:text-5xl lg:col-span-2">Modern enterprises aren’t slowed by ideas; they’re slowed by <span className="italic text-electric">legacy architecture</span>. We partner with leaders to engineer resilient, scalable IT systems that hold the weight of their growth.</h2></div></section>

    <section id="services" className="px-6 pb-24 md:px-16 md:pb-48"><div className="mb-16 flex justify-between border-b border-black/10 pb-8 text-xs uppercase tracking-wider text-ink-muted"><p className="reveal">[ 02 — Capabilities ]</p><p className="reveal">[ 04 Disciplines ]</p></div><div>{services.map((service) => <ServiceRow key={service.title} {...service} />)}</div></section>

    <section id="process" className="relative overflow-hidden bg-night px-6 py-16 text-white md:px-16 md:py-32"><div className="relative z-10"><div className="mb-24 flex justify-between border-b border-white/10 pb-8 text-xs uppercase tracking-wider text-white/40"><p className="reveal">[ 03 — The Approach ]</p><p className="reveal">[ 03 Phases ]</p></div><div className="grid grid-cols-1 gap-16 md:grid-cols-3">{[['01', 'Discovery & Audit', 'We immerse ourselves in your operational reality, mapping legacy constraints, security gaps, and immediate bottlenecks.'], ['02', 'Architecture Design', 'We engineer the blueprint, designing systems built explicitly for your scale, security, and future integration needs.'], ['03', 'Execution & Scaling', 'We deploy with precision, transitioning from legacy architecture while upskilling your teams to maintain momentum.']].map(([number, title, description]) => <div key={number} className="reveal border-t border-white/20 pt-8"><span className="font-display mb-16 block text-xl italic text-acid">{number}</span><h3 className="font-display mb-4 text-2xl font-light">{title}</h3><p className="text-sm leading-relaxed text-white/60">{description}</p></div>)}</div></div></section>

    <section id="case-study" className="relative overflow-hidden bg-electric px-6 py-32 text-white md:px-16 md:py-48"><div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24"><div><p className="reveal mb-6 text-xs uppercase tracking-wider opacity-70">[ 04 — Case Study ]</p><h2 className="reveal font-display text-4xl font-light leading-tight md:text-6xl">Reduced project latency by <span className="font-black text-acid">34%</span>.</h2></div><div className="reveal border-l border-white/20 pl-8 md:pl-12"><p className="text-lg font-light leading-relaxed opacity-90 md:text-2xl">By implementing an AI-driven scheduling engine and real-time resource allocation matrix, we eliminated critical path bottlenecks before they occurred.</p></div></div></section>

    <section id="metrics" className="px-6 py-24 md:px-16 md:py-48"><div className="mb-12 border-b border-black/10 pb-8"><p className="reveal text-xs uppercase tracking-wider text-ink-muted">[ 05 — Measured Impact ]</p></div><div className="grid grid-cols-1 border-t border-black/10 md:grid-cols-3">{[['99.99%', 'Guaranteed Infrastructure Uptime'], ['40%', 'Average Operational Cost Reduction'], ['150+', 'Enterprise Systems Modernized']].map(([value, label]) => <div key={label} className="reveal border-t border-black/10 py-12 md:border-l md:border-t-0 md:px-8 md:py-16 first:md:pl-0"><h3 className="font-display mb-4 text-5xl font-light md:text-7xl">{value}</h3><p className="text-xs uppercase tracking-wider text-ink-muted">{label}</p></div>)}</div></section>

    <section id="contact" className="border-t border-black/10 px-6 py-24 text-center md:px-16 md:py-48"><h2 className="reveal mb-12 font-display text-5xl font-black leading-[0.9] md:text-[10vw]">Let&apos;s engineer <br /><span className="font-light italic text-electric">what&apos;s next.</span></h2><MagneticButton className="reveal">Start a Consultation</MagneticButton></section>

    <footer className="bg-night px-6 pb-8 pt-24 text-white md:px-16"><div className="mb-24 grid grid-cols-1 gap-16 md:grid-cols-3"><div><h3 className="font-display mb-8 text-7xl font-black leading-[0.8] md:text-[12vw]">Nua<span className="text-acid">.</span></h3><p className="max-w-sm text-sm text-white/40">Architecting digital clarity for enterprises that refuse to break. Working globally, engaging directly.</p></div><div className="flex flex-col"><h4 className="mb-6 text-xs uppercase tracking-wider text-white/40">Studio</h4><a href="#manifesto" className="mb-3 text-lg font-light text-white/80 hover:text-acid">About Nua</a><a href="#services" className="mb-3 text-lg font-light text-white/80 hover:text-acid">Capabilities</a><a href="#process" className="text-lg font-light text-white/80 hover:text-acid">Our Approach</a></div><div className="flex flex-col"><h4 className="mb-6 text-xs uppercase tracking-wider text-white/40">Connect</h4><a href="#contact" className="mb-3 text-lg font-light text-white/80 hover:text-acid">LinkedIn</a><a href="#contact" className="mb-3 text-lg font-light text-white/80 hover:text-acid">GitHub</a><a href="#contact" className="text-lg font-light text-white/80 hover:text-acid">Twitter</a></div></div><div className="flex flex-col justify-between border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row"><span>© 2026 Nua Consult. All rights reserved.</span><span>Designed in-house, engineered for scale.</span></div></footer>
  </main>
}

export default App
