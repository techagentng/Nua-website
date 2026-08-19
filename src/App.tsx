import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'

type Service = { title: string; description: string }

const services: Service[] = [
  { title: 'Cloud & Infrastructure', description: 'Designing secure, elastic cloud environments that eliminate downtime and scale with enterprise demands.' },
  { title: 'Data Intelligence & AI', description: 'Structuring clean data pipelines and deploying custom AI models that turn operational noise into strategic foresight.' },
  { title: 'Cybersecurity & Compliance', description: 'Fortifying digital perimeters through zero-trust architecture, continuous monitoring, and rigorous compliance alignment.' },
  { title: 'Enterprise Software Engineering', description: 'Building high-performance applications that modernize core operations and integrate seamlessly with existing stacks.' },
]
const partners = ['Vertex AI', 'Quantum Systems', 'Helix Cloud', 'Aegis Security', 'DataCore']
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined

type ConsultationData = {
  name: string
  email: string
  company: string
  message: string
}

const initialConsultationData: ConsultationData = { name: '', email: '', company: '', message: '' }

function ServiceRow({ title, description }: Service) {
  return <a href="#contact" className="service-row group flex items-center justify-between gap-8 border-b border-black/10 py-8 transition-all duration-500 hover:pl-4 md:py-10">
    <h3 className="font-display text-3xl font-light transition-colors duration-500 group-hover:italic group-hover:text-electric md:text-5xl">{title}</h3>
    <p className="hidden max-w-sm text-right text-sm leading-relaxed text-ink-muted md:block">{description}</p>
  </a>
}

function MagneticButton({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const button = buttonRef.current
    if (!button) return
    const bounds = button.getBoundingClientRect()
    button.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * 0.18}px, ${(event.clientY - bounds.top - bounds.height / 2) * 0.18}px)`
  }
  const resetPosition = () => { if (buttonRef.current) buttonRef.current.style.transform = 'translate(0, 0)' }
  return <button ref={buttonRef} type="button" onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={resetPosition} className={`group relative inline-block rounded-full bg-electric px-9 py-5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_40px_rgba(5,0,255,0.25)] transition-all duration-300 hover:bg-ink hover:!text-electric hover:shadow-none ${className}`}><span className="relative z-10 transition-colors duration-300 group-hover:!text-electric">{children}</span></button>
}

function ConsultationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [data, setData] = useState(initialConsultationData)
  const questions = [
    { label: 'First, what should we call you?', key: 'name' as const, type: 'text', placeholder: 'Your name' },
    { label: 'Where can we reach you?', key: 'email' as const, type: 'email', placeholder: 'you@company.com' },
    { label: 'Tell us a little about your team.', key: 'company' as const, type: 'text', placeholder: 'Company or organisation' },
  ]
  const currentQuestion = questions[step]
  const updateField = (value: string) => setData((current) => ({ ...current, [currentQuestion.key]: value }))
  const canContinue = step < questions.length && Boolean(data[currentQuestion.key].trim())
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }
  const whatsappMessage = encodeURIComponent(`Hi Nua Consult, I am ${data.name} from ${data.company}. ${data.message}`)
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : `https://wa.me/?text=${whatsappMessage}`

  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-night/70 p-0 backdrop-blur-sm md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
    <div className="relative w-full max-w-2xl overflow-hidden bg-ice text-ink shadow-2xl dark:bg-night dark:text-white md:rounded-2xl">
      <button type="button" onClick={onClose} aria-label="Close consultation form" className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-xl text-ink-muted transition-colors hover:border-electric hover:text-electric dark:border-white/15">×</button>
      {!submitted ? <form onSubmit={handleSubmit} className="p-8 md:p-14">
        <div className="mb-12 flex items-center justify-between pr-12 text-xs uppercase tracking-[0.14em] text-ink-muted"><span>Start a consultation</span><span>{step + 1} / {questions.length + 1}</span></div>
        <h2 id="consultation-title" className="mb-10 max-w-xl font-display text-4xl font-light leading-tight md:text-6xl">{step < questions.length ? currentQuestion.label : 'What would you like to solve together?'}</h2>
        {step < questions.length ? <input autoFocus required type={currentQuestion.type} value={data[currentQuestion.key]} onChange={(event) => updateField(event.target.value)} placeholder={currentQuestion.placeholder} className="w-full border-b-2 border-black/15 bg-transparent px-0 py-4 text-xl outline-none transition-colors placeholder:text-ink-muted/60 focus:border-electric dark:border-white/20 md:text-2xl" /> : <textarea autoFocus required value={data.message} onChange={(event) => setData((current) => ({ ...current, message: event.target.value }))} placeholder="A short description of your challenge or ambition" rows={3} className="w-full resize-none border-b-2 border-black/15 bg-transparent px-0 py-4 text-xl outline-none transition-colors placeholder:text-ink-muted/60 focus:border-electric dark:border-white/20 md:text-2xl" />}
        <div className="mt-12 flex items-center justify-between gap-4"><p className="text-sm text-ink-muted">Press Enter to continue</p>{step < questions.length ? <button type="button" disabled={!canContinue} onClick={() => setStep((current) => current + 1)} className="rounded-full bg-electric px-7 py-4 text-sm font-medium uppercase tracking-wider text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40">Continue</button> : <button type="submit" className="rounded-full bg-electric px-7 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-ink hover:text-electric">Submit request</button>}</div>
      </form> : <div className="p-8 md:p-14"><p className="mb-6 text-xs uppercase tracking-[0.14em] text-electric">Request received</p><h2 id="consultation-title" className="mb-6 font-display text-4xl font-light leading-tight md:text-6xl">Thanks, {data.name.split(' ')[0] || 'there'}.</h2><p className="max-w-lg text-lg leading-relaxed text-ink-muted">We have your details. For the fastest response, start a WhatsApp conversation with our team now.</p><div className="mt-10 flex flex-wrap gap-4"><a href={whatsappLink} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 rounded-full border border-white bg-night px-7 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-night"><svg className="h-5 w-5 shrink-0 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.52 2 2.03 6.49 2.03 12c0 1.77.46 3.5 1.34 5.04L2 22l5.12-1.34A10 10 0 1 0 12.04 2Zm0 18.2c-1.57 0-3.1-.42-4.43-1.22l-.32-.19-3.04.8.81-2.96-.21-.33A8.2 8.2 0 1 1 12.04 20.2Zm4.5-6.16c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.25-.01-.39.11-.52.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.11s.91 2.45 1.04 2.62c.13.17 1.79 2.73 4.33 3.83.61.26 1.08.42 1.45.54.61.19 1.17.16 1.61.1.49-.07 1.48-.61 1.69-1.2.21-.59.21-1.09.15-1.2-.06-.11-.23-.17-.48-.3Z" /></svg><span>Message us on WhatsApp</span></a><button type="button" onClick={onClose} className="rounded-full border border-black/15 px-7 py-4 text-sm font-medium uppercase tracking-wider text-ink transition-colors hover:border-electric hover:text-electric dark:border-white/20 dark:text-white">Close</button></div>{!whatsappNumber && <p className="mt-6 text-xs text-ink-muted">Add VITE_WHATSAPP_NUMBER to connect this button to your business number.</p>}</div>}
    </div>
  </div>
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
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
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

    <section id="contact" className="border-t border-black/10 px-6 py-24 text-center md:px-16 md:py-48"><h2 className="reveal mb-12 font-display text-5xl font-black leading-[0.9] md:text-[10vw]">Let&apos;s engineer <br /><span className="font-light italic text-electric">what&apos;s next.</span></h2><MagneticButton onClick={() => setIsConsultationOpen(true)} className="reveal">Start a Consultation</MagneticButton></section>

    <footer className="bg-night px-6 pb-8 pt-24 text-white md:px-16"><div className="mb-24 grid grid-cols-1 gap-16 md:grid-cols-3"><div><h3 className="font-display mb-8 text-7xl font-black leading-[0.8] md:text-[12vw]">Nua<span className="text-acid">.</span></h3><p className="max-w-sm text-sm text-white/40">Architecting digital clarity for enterprises that refuse to break. Working globally, engaging directly.</p></div><div className="flex flex-col"><h4 className="mb-6 text-xs uppercase tracking-wider text-white/40">Studio</h4><a href="#manifesto" className="mb-3 text-lg font-light text-white/80 hover:text-acid">About Nua</a><a href="#services" className="mb-3 text-lg font-light text-white/80 hover:text-acid">Capabilities</a><a href="#process" className="text-lg font-light text-white/80 hover:text-acid">Our Approach</a></div><div className="flex flex-col"><h4 className="mb-6 text-xs uppercase tracking-wider text-white/40">Connect</h4><a href="#contact" className="mb-3 text-lg font-light text-white/80 hover:text-acid">LinkedIn</a><a href="#contact" className="mb-3 text-lg font-light text-white/80 hover:text-acid">GitHub</a><a href="#contact" className="text-lg font-light text-white/80 hover:text-acid">Twitter</a></div></div><div className="flex flex-col justify-between border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row"><span>© 2026 Nua Consult. All rights reserved.</span><span>Designed in-house, engineered for scale.</span></div></footer>
    {isConsultationOpen && <ConsultationModal onClose={() => setIsConsultationOpen(false)} />}
  </main>
}

export default App
