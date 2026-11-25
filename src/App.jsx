import { useEffect, useState } from 'react'
import './App.css'
import './workshop.css'
import { Explorer, ServiceNav, WorkshopFilm } from './Workshop.jsx'

const mapLocationUrl = 'https://maps.app.goo.gl/po1XhTCn47Vcacbn7?g_st=iw'

function App() {
  const [active,setActive] = useState(0)
  const [enquiry, setEnquiry] = useState('')
  function selectService(name) {
    const suggestion = 'I would like to enquire about ' + name.toLowerCase() + '. '
    setEnquiry(current => !current.trim() || /^I would like to enquire about [^.]+\. $/.test(current) ? suggestion : current)
    requestAnimationFrame(() => document.getElementById('contact-message')?.focus({ preventScroll: true }))
  }

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
      setEnquiry('')
      setContactStatus({ type: 'success', message: 'Thanks for reaching out. Your message has been sent.' })
    } catch (error) {
      setContactStatus({ type: 'error', message: error.message || 'Unable to send your message right now. Please call or email us.' })
    }
  }

  return (
    <main className="site" data-theme={theme}>
      <header className="topbar">
        <div className="reading-progress" aria-hidden="true" />
        <div className="wrap topbar-inner">
        <a className="brand" href="#home" aria-label="SPK Engineering home"><img className="weld-mark" src="/weld-mark.svg" width="42" height="42" alt="" /><span className="weld-wordmark"><strong>SPK</strong><span>ENGINEERING</span></span></a>
        <nav aria-label="Main navigation"><ServiceNav choose={setActive}/><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <div className="header-actions"><button className="theme-toggle" type="button" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} aria-pressed={theme === 'dark'} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><span className="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'}</span></button><a className="nav-call" href="tel:+919840343163">Call us <span>↗</span></a></div>
        </div>
      </header>

      <section className="hero" id="home">
        <WorkshopFilm/>
        <div className="film-shade"/>
        <div className="wrap hero-inner"><div className="hero-copy">
          <p className="eyebrow"><span/> SPK Engineering / Saidapet, Chennai</p>
          <h1>Metalwork<br/><em>made to fit.</em></h1>
          <p className="hero-intro">Custom metal fabrication and on-site installation from our workshop in Chennai.</p>
          <div className="hero-actions"><a className="button button-orange" href="#services">Explore our services <span>↓</span></a><a className="text-link" href="#contact">Discuss a project ↗</a></div>
        </div></div>
        <div className="wrap hero-bottom"><a href="#services">↓ &nbsp; Explore capabilities</a><span>Illustrative welding footage</span></div>
      </section>
      <Explorer index={active} choose={setActive} enquire={selectService}/>
      <section className="about-section" id="about">
        <div className="wrap process-layout">
          <div className="process-intro"><p className="eyebrow"><span/> About SPK</p>
            <h2>From a drawing<br/>to <em>finished metal.</em></h2>
            <p>SPK Engineering is a metal fabrication business in Saidapet, Chennai. We work with customers on made-to-order parts, assemblies and installations.</p>
            <a className="button button-outline" href="#contact">Talk through your project <span>↗</span></a>
          </div>
          <ol className="process-list">
            <li><h3>Define the job</h3><p>A sketch, dimensions or a description of the site helps us understand what the work needs to do.</p></li>
            <li><h3>Shape the metal</h3><p>Metal sections are cut to size and joined to form frames, grills and other made-to-order assemblies.</p></li>
            <li><h3>Fit on site</h3><p>For shutters, grills and erection work, the opening, fixing points and site access guide the installation discussion.</p></li>
          </ol>
        </div>
      </section>
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
              <label htmlFor="contact-message">Message</label><textarea id="contact-message" value={enquiry} onChange={event => setEnquiry(event.target.value)} name="message" placeholder="Tell us about the work you need…" rows="5" maxLength="4000" required />
              <div className="contact-trap" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" type="text" tabIndex="-1" autoComplete="off" /></div>
              <button className="button button-orange contact-submit" type="submit" disabled={contactStatus.type === 'pending'}><span>{contactStatus.type === 'pending' ? 'Sending…' : 'Send Message'}</span><span aria-hidden="true">↗</span></button>
              <p className={`contact-status ${contactStatus.type}`} role="status" aria-live="polite">{contactStatus.message}</p>
            </form>
          </div>
          <details className="terms">
            <summary>Terms and conditions</summary>
            <p>Use the contact form for project enquiries. Please share only the details needed to discuss your work. SPK Engineering uses your contact details to respond.</p>
            <p>Submitting an enquiry does not confirm an order. Materials, dimensions, pricing and installation dates are agreed separately with the workshop before work begins.</p>
          </details>
          <div className="footer-bottom"><a className="brand" href="#home"><span className="brand-mark">S<span>P</span>K</span><span className="brand-name">SPK <b>ENGINEERING</b></span></a><span>© 2002 SPK Engineering. All rights reserved.<small className="designer-credit">Website by <a href="https://www.linkedin.com/in/pradeep-j-175b38404/" target="_blank" rel="noopener noreferrer">@Pradeep</a></small></span><a href="#home">BACK TO TOP ↑</a></div>
        </div>
      </footer>
    </main>
  )
}

export default App
