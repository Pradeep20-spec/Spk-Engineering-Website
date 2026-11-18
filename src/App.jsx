import { useEffect, useState } from 'react'
import './App.css'

const mapLocationUrl = 'https://maps.app.goo.gl/po1XhTCn47Vcacbn7?g_st=iw'
const streetViewUrl = 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=tMch4POqn0wpL3aWEP5v_w&cb_client=search.gws-prod.grass&yaw=222.13881&pitch=-3.4456308&thumbfov=100&w=1200&h=780'

const services = [
  { number: '01', name: 'Turning', detail: 'Precision turning for components and custom fabrication requirements.', mark: '◉' },
  { number: '02', name: 'Milling', detail: 'Machining work shaped around your part, dimensions and application.', mark: '⌗' },
  { number: '03', name: 'Industrial fabrication', detail: 'Fabrication work for practical industrial and structural needs.', mark: '▤' },
  { number: '04', name: 'Rolling shutters', detail: 'Rolling shutter fabrication and installation for your space.', mark: '▥' },
  { number: '05', name: 'Grill work', detail: 'Made-to-measure grill work for homes and commercial properties.', mark: '▦' },
  { number: '06', name: 'Erection work', detail: 'On-site erection support to bring fabricated work together.', mark: '⌂' },
]

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return window.localStorage.getItem('spk-theme') === 'dark' ? 'dark' : 'light'
  })
  const [contactStatus, setContactStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('spk-theme', theme)
  }, [theme])

  async function handleContactSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    setContactStatus({ type: 'pending', message: 'Sending your message…' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Unable to send your message right now.')
      form.reset()
      setContactStatus({ type: 'success', message: 'Thanks for reaching out. Your message has been sent.' })
    } catch (error) {
      setContactStatus({ type: 'error', message: error.message || 'Unable to send your message right now. Please call or email us.' })
    }
  }

  return (
    <main className="site" data-theme={theme}>
      <header className="topbar wrap">
        <a className="brand" href="#home" aria-label="SPK Engineering home"><span className="brand-mark">S<span>P</span>K</span><span className="brand-name">SPK <b>ENGINEERING</b></span></a>
        <nav aria-label="Main navigation"><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <div className="header-actions"><button className="theme-toggle" type="button" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} aria-pressed={theme === 'dark'} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><span className="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'}</span></button><a className="nav-call" href="tel:+919840343163">Call us <span>↗</span></a></div>
      </header>

      <section className="hero" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Chennai, Tamil Nadu · Since day one, built to fit</p>
            <h1>Metalwork made<br />for <em>real work.</em></h1>
            <p className="hero-intro">From precision machining to on-site erection, SPK Engineering brings practical metal fabrication services together under one roof.</p>
            <div className="hero-actions"><a className="button button-orange" href="#services">Explore our services <span>↓</span></a><a className="text-link" href="#contact">Talk about your project <span>↗</span></a></div>
            <div className="hero-note"><span className="note-rule" />Turning · Milling · Fabrication · Installation</div>
          </div>
          <div className="hero-art">
            <a className="hero-photo" href={mapLocationUrl} target="_blank" rel="noreferrer" aria-label="Open SPK Engineering’s Saidapet location on Google Maps">
              <img src={streetViewUrl} alt="Google Street View panorama at SPK Engineering’s Saidapet location in Chennai" />
              <span className="hero-photo-shade" />
              <span className="hero-photo-label"><b>SPK / SAIDAPET</b><span>CHENNAI, TAMIL NADU</span></span>
              <span className="hero-photo-link">VIEW LOCATION ↗</span>
            </a>
            <span className="hero-photo-index">LOCATION PHOTO · GOOGLE STREET VIEW</span>
          </div>
        </div>
        <div className="hero-bottom wrap"><span>BUILT WITH CARE. BUILT TO LAST.</span><span>13°00' N &nbsp; 80°13' E</span></div>
      </section>

      <section className="services-section wrap" id="services">
        <div className="section-heading"><div><p className="eyebrow dark"><span /> WHAT WE DO</p><h2>One workshop.<br /><em>Many capabilities.</em></h2></div><p className="section-intro">A versatile range of metalworking services for projects big and small. Tell us what you need—we’ll help shape the right solution.</p></div>
        <div className="service-grid">{services.map((service) => <article className="service-card" key={service.number}><div className="card-top"><span>{service.number} / 06</span><span className="service-mark">{service.mark}</span></div><h3>{service.name}</h3><p>{service.detail}</p><a href="#contact" aria-label={`Enquire about ${service.name}`}>Discuss this service <span>↗</span></a></article>)}</div>
        <div className="service-foot"><span>HAVE A DIFFERENT REQUIREMENT?</span><a href="#contact">Let’s talk through it <span>↗</span></a></div>
      </section>

      <section className="about-section" id="about"><div className="wrap about-inner"><div className="about-index">SPK<br /><span>ENGINEERING</span><b>CHENNAI · INDIA</b></div><div className="about-copy"><p className="eyebrow"><span /> ABOUT SPK</p><h2>Good work starts<br />with <em>good listening.</em></h2><p>SPK Engineering is a Chennai-based metal fabrication and machining business serving practical, made-to-order needs. We work closely with customers to understand the job and deliver work that fits its purpose.</p><a className="button button-outline" href="#contact">Start a conversation <span>↗</span></a></div><div className="about-side"><span className="side-number">01—06</span><p>TURNING<br />MILLING<br />FABRICATION<br />ROLLING SHUTTERS<br />GRILL WORK<br />ERECTION</p><span className="side-caption">YOUR REQUIREMENT, MADE REAL.</span></div></div></section>

      <footer id="contact">
        <div className="wrap footer-inner">
          <div className="footer-main">
            <div><p className="eyebrow"><span /> HAVE A PROJECT IN MIND?</p><h2>Let’s make<br /><em>it happen.</em></h2></div>
            <a className="button button-orange footer-cta" href="tel:+919840343163">Call Jayakumar <span>↗</span></a>
          </div>
          <div className="contact-layout">
            <div className="contact-grid">
              <div><span className="contact-label">CALL</span><a href="tel:+919840343163">+91 98403 43163</a><span className="contact-note">Call Jayakumar to discuss your requirements</span></div>
              <div><span className="contact-label">EMAIL</span><a href="mailto:spk.engineering@yahoo.co.in">spk.engineering@yahoo.co.in</a><span className="contact-note">Reach us directly by email</span></div>
              <div><span className="contact-label">LOCATION</span><p>No. 1/3, Bharathi Street, Kaveri Nagar,<br />Saidapet, Chennai - 600 015</p><span className="contact-note">Near Aranganathan Subway</span><a className="map-link" href={mapLocationUrl} target="_blank" rel="noreferrer">Open location in Google Maps <span>↗</span></a></div>
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <h3>Send a Message</h3>
              <label htmlFor="contact-name">Name</label><input id="contact-name" name="name" type="text" placeholder="Your full name" autoComplete="name" maxLength="100" required />
              <label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength="254" required />
              <label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" placeholder="Tell us about the work you need…" rows="5" maxLength="4000" required />
              <div className="contact-trap" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" type="text" tabIndex="-1" autoComplete="off" /></div>
              <button className="button button-orange contact-submit" type="submit" disabled={contactStatus.type === 'pending'}><span>{contactStatus.type === 'pending' ? 'Sending…' : 'Send Message'}</span><span aria-hidden="true">↗</span></button>
              <p className={`contact-status ${contactStatus.type}`} role="status" aria-live="polite">{contactStatus.message}</p>
            </form>
          </div>
          <div className="footer-bottom"><a className="brand" href="#home"><span className="brand-mark">S<span>P</span>K</span><span className="brand-name">SPK <b>ENGINEERING</b></span></a><span>© {new Date().getFullYear()} SPK Engineering · Chennai, India</span><a href="#home">BACK TO TOP ↑</a></div>
        </div>
      </footer>
    </main>
  )
}

export default App
