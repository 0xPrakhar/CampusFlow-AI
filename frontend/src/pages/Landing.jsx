import { ArrowRight, Bot, Check, ChevronRight, CircleDot, ExternalLink, ShieldCheck, Sparkles, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'

const signals = [
  { number: '01', title: 'Capture intent', text: 'Students explain what they need in plain language.' },
  { number: '02', title: 'Shape the work', text: 'AI turns ambiguity into a structured, reviewable request.' },
  { number: '03', title: 'Move with confidence', text: 'Staff approve safe actions and keep a complete audit trail.' },
]

export default function Landing() {
  return <main className="landing-page" id="top">
    <nav className="landing-nav">
      <Link to="/" aria-label="CampusFlow home"><Brand /></Link>
      <div className="landing-nav-links"><a href="#system">The system</a><a href="#trust">Built for trust</a><Link className="landing-login" to="/login">Sign in <ArrowRight size={15} /></Link></div>
    </nav>
    <section className="landing-hero">
      <div className="hero-copy">
        <span className="landing-kicker"><Sparkles size={14} /> COLLEGE OPERATIONS, REIMAGINED</span>
        <h1>Make every request feel <em>handled.</em></h1>
        <p className="hero-lede">CampusFlow turns the everyday requests that slow colleges down into clear, accountable workflows your team can trust.</p>
        <div className="hero-actions"><Link className="button button-primary landing-cta" to="/register">Start with a request <ArrowRight size={17} /></Link><Link className="landing-text-link" to="/login">Open your workspace <ChevronRight size={16} /></Link></div>
        <div className="hero-proof"><span><Check size={14} /> Human approval built in</span><span><Check size={14} /> PostgreSQL + Notion ready</span></div>
      </div>
      <div className="hero-visual" aria-label="CampusFlow workflow preview">
        <div className="visual-glow" />
        <div className="signal-card request-signal"><div className="signal-icon coral"><Waves size={17} /></div><div><small>NEW REQUEST</small><strong>Internship NOC needed by Friday</strong></div><span className="signal-status">01</span></div>
        <div className="visual-line line-one" />
        <div className="signal-card ai-signal"><div className="signal-icon blue"><Bot size={17} /></div><div><small>AI ANALYSIS</small><strong>High priority · NOC</strong><span>All required information found</span></div><span className="signal-check"><Check size={14} /></span></div>
        <div className="visual-line line-two" />
        <div className="approval-card"><div className="approval-top"><span><CircleDot size={14} /> STAFF REVIEW</span><span>READY</span></div><strong>Approve safe action</strong><div className="approval-bar"><i /><i /><i /><i /><i /></div><div className="approval-footer"><small>Notion sync active</small><ShieldCheck size={17} /></div></div>
      </div>
    </section>
    <section className="landing-ribbon" id="trust"><span>ONE SHARED SOURCE OF TRUTH</span><div><b>Requests</b><i /> <b>AI analysis</b><i /> <b>Approvals</b><i /> <b>Audit logs</b></div></section>
    <section className="landing-system" id="system"><div className="section-intro"><span className="landing-kicker">THE CAMPUSFLOW SYSTEM</span><h2>Less chasing. More closure.</h2><p>A calm operating layer for the moments between a student asking for help and your team getting it done.</p></div><div className="signal-grid">{signals.map((signal) => <article className="signal-step" key={signal.number}><span>{signal.number}</span><h3>{signal.title}</h3><p>{signal.text}</p></article>)}</div></section>
    <section className="landing-bottom"><div><span className="landing-kicker">READY WHEN YOU ARE</span><h2>Give every request a next step.</h2></div><Link className="button button-primary" to="/register">Enter CampusFlow <ArrowRight size={17} /></Link></section>
    <footer className="landing-footer">
      <div className="footer-brand"><Brand /><p>Human-led operations, with a little more clarity.</p></div>
      <div className="footer-links"><div><strong>Product</strong><a href="#system">How it works</a><Link to="/register">Get started</Link></div><div><strong>Workspace</strong><Link to="/login">Sign in</Link><a href="mailto:hello@campusflow.ai">Contact team</a></div></div>
      <div className="footer-meta"><span><i /> Systems operational</span><small>© 2026 CampusFlow AI</small><a href="#top" aria-label="Back to top"><ExternalLink size={14} /></a></div>
    </footer>
  </main>
}
