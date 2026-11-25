import { useEffect, useRef, useState } from 'react'

const services = [
  ['Industrial fabrication', 'Fabrication', 'Fabricated assemblies', 'Discuss the size, material and intended use of your fabricated assembly with the workshop.'],
  ['Rolling shutters', 'Fabrication', 'Shutter fabrication and fitting', 'Share the opening width, height and installation location for your rolling shutter.'],
  ['Grill work', 'Fabrication', 'Made-to-measure grills', 'Bring the opening dimensions and your preferred grill pattern for a home or commercial space.'],
  ['Erection work', 'Installation', 'On-site assembly', 'Discuss the fabricated parts, site access and installation requirements with SPK.'],
]

export function WorkshopFilm() {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const video = ref.current
    if (!video || failed) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    function update() {
      if (!visible || motion.matches || document.hidden || navigator.connection?.saveData) {
        video.pause()
        return
      }
      if (!video.hasAttribute('src')) video.src = '/media/welding.mp4'
      video.play().catch(() => {})
    }
    const hero = video.closest('.hero')
    function slowOnHover(event) {
      if (event.pointerType === 'mouse') video.playbackRate = 0.5
    }
    function restoreSpeed() {
      video.playbackRate = 1
    }
    hero.addEventListener('pointerenter', slowOnHover)
    hero.addEventListener('pointerleave', restoreSpeed)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(video)
    document.addEventListener('visibilitychange', update)
    motion.addEventListener('change', update)
    return () => {
      observer.disconnect()
      video.pause()
      hero.removeEventListener('pointerenter', slowOnHover)
      hero.removeEventListener('pointerleave', restoreSpeed)
      document.removeEventListener('visibilitychange', update)
      motion.removeEventListener('change', update)
    }
  }, [failed])
  return <video className="work-film" ref={ref} muted playsInline loop preload="none" poster="/media/welding.webp" aria-hidden="true" onError={() => setFailed(true)} />
}

const photos = [
  ['fabrication', 'A metalworker joining a frame at a workshop bench'],
  ['manual-shutter', 'Manual steel rolling shutter with an exposed overhead roller'],
  ['grills', 'Vertical metal bars joined to a horizontal crossbar'],
  ['erection', 'Steel canopy framing over a Chennai railway platform'],
]

function Preview({ index }) {
  const [file, description] = photos[index]
  return <figure className="work-preview" onPointerMove={e => {
    if (e.pointerType !== 'mouse') return
    const box=e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--pan', ((e.clientX-box.left)/box.width*8-4)+'px')
  }}>
    <div className="preview-face" key={index}><img loading="lazy" decoding="async" src={`/media/services/${file}.webp`} alt={description}/></div>
    <figcaption><span>Representative photograph</span><strong>{services[index][2]}</strong></figcaption>
  </figure>
}

export function ServiceNav({ choose }) {
  const [open,setOpen]=useState(false)
  const [index,setIndex]=useState(0)
  const trigger=useRef(null)
  const root=useRef(null)
  useEffect(()=>{
    if(!open) return
    const outside=e=>{if(!root.current?.contains(e.target)) setOpen(false)}
    document.addEventListener('pointerdown',outside)
    return ()=>document.removeEventListener('pointerdown',outside)
  },[open])
  return <div className="service-nav" ref={root} onPointerEnter={e=>{if(e.pointerType==='mouse')setOpen(true)}} onPointerLeave={e=>{if(e.pointerType==='mouse' && !root.current.contains(document.activeElement))setOpen(false)}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);trigger.current.focus()}}}>
    <button ref={trigger} aria-expanded={open} onClick={()=>setOpen(v=>!v)}>Services <span>⌄</span></button>
    {open && <div className="work-menu"><div>{services.map(([name],i)=><a key={name} href="#services" onFocus={()=>setIndex(i)} onPointerEnter={()=>setIndex(i)} onClick={()=>{choose(i);setOpen(false)}}>{name}<span>↗</span></a>)}</div><Preview index={index}/></div>}
  </div>
}

export function Explorer({ index, choose, enquire }) {
  const [expanded,setExpanded]=useState(null)
  const link=i=><a className="enquire-link" href="#contact-message" onClick={()=>enquire(services[i][0])}>Discuss {services[i][0].toLowerCase()} <span>↗</span></a>
  return <section className="services-section wrap" id="services">
    <div className="section-heading"><div><p className="eyebrow dark"><span/> What we do</p><h2>Workshop <em>capabilities.</em></h2></div></div>
    <div className="explorer">
      <div>{services.map(([name,,,detail],i)=> <article className={'service-row '+(index===i?'selected':'')} key={name}>
        <button aria-pressed={index===i} onPointerEnter={e=>{if(e.pointerType==='mouse'){choose(i)}}} onFocus={()=>{choose(i)}} onClick={()=>{choose(i);setExpanded(expanded===i?null:i)}}>
          <small>0{i+1}</small><strong>{name}</strong><span>↗</span></button>
        <div className={'mobile-detail '+(expanded===i?'expanded':'')}>{expanded===i && <Preview index={i}/>}<p>{detail}</p>{link(i)}</div>
      </article>)}</div>
      <div className="desktop-detail"><Preview index={index}/><p>{services[index][3]}</p>{link(index)}</div>
    </div>
  </section>
}
