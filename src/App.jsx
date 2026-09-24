import { useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Facebook,
  Instagram,
  Library,
  Menu,
  Quote,
  Search,
  Sparkles,
  Twitter,
  X
} from 'lucide-react'

const featuredBooks = [
  { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction', icon: BookOpen, color: 'sage' },
  { title: 'Braiding Sweetgrass', author: 'Robin Wall Kimmerer', genre: 'Nature & science', icon: Sparkles, color: 'gold' },
  { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', genre: 'Contemporary', icon: Library, color: 'coral' }
]

const initialForm = {
  fullName: '', email: '', phone: '', memberType: 'Reader', bookTitle: '', pickupDate: '', durationDays: '7', notes: '', updates: false
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Please enter your full name.'
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required.'
    else if (!/^\+?[\d\s().-]{7,}$/.test(form.phone)) nextErrors.phone = 'Enter a valid phone number.'
    if (!form.bookTitle.trim()) nextErrors.bookTitle = 'Choose a book to reserve.'
    if (!form.pickupDate) nextErrors.pickupDate = 'Choose a pickup date.'
    if (!form.durationDays || Number(form.durationDays) < 1 || Number(form.durationDays) > 30) nextErrors.durationDays = 'Choose between 1 and 30 days.'
    return nextErrors
  }

  const submitReservation = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          memberType: form.memberType,
          bookTitle: form.bookTitle,
          pickupDate: new Date(`${form.pickupDate}T12:00:00`).toISOString(),
          durationDays: Number(form.durationDays),
          notes: form.notes || null
        })
      })
    } catch {
      // Keep the local confirmation useful while the API is unavailable.
    }
    setSubmitted({ ...form })
    document.getElementById('confirmation')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const resetForm = () => {
    setForm(initialForm)
    setErrors({})
    setSubmitted(null)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Shelfspace home"><span className="brand-mark"><BookOpen size={19} /></span><span>Shelfspace<span className="brand-dot">.</span></span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <a href="#collection" onClick={() => setMenuOpen(false)}>Collection</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#stories" onClick={() => setMenuOpen(false)}>Readers</a>
          <a href="#reserve" className="nav-cta" onClick={() => setMenuOpen(false)}>Reserve a book <ArrowRight size={15} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> Your neighborhood, better read</p>
            <h1>Good books.<br /><em>Right on time.</em></h1>
            <p className="hero-description">A calmer way to discover and reserve the stories you have been meaning to read. Browse our shelves, then pick up your next favorite when it suits you.</p>
            <div className="hero-actions"><a className="button button-primary" href="#reserve">Book a title <ArrowRight size={17} /></a><a className="button button-secondary" href="#collection">Explore the shelves <ChevronDown size={17} /></a></div>
            <div className="hero-note"><span className="avatar-stack"><i>AL</i><i>JM</i><i>SK</i></span><span><strong>2,400+</strong> happy readers this month</span></div>
          </div>
          <div className="hero-art" aria-label="A stack of books on a reading table">
            <div className="sun-shape" />
            <div className="hero-card card-back" /><div className="hero-card card-middle" /><div className="hero-card card-front"><span>READ<br />WIDELY</span><small>Shelfspace library</small></div>
            <div className="art-caption"><span>01 / 03</span><span>Selected for curious minds</span></div>
          </div>
        </section>

        <section className="strip" id="how-it-works"><div className="strip-inner"><div><CalendarDays size={20} /><span><strong>Reserve ahead</strong> Choose your pickup window</span></div><div><Clock3 size={20} /><span><strong>Keep it awhile</strong> Flexible 7, 14, or 30 day loans</span></div><div><Search size={20} /><span><strong>Find your next</strong> Personal picks from real librarians</span></div></div></section>

        <section className="content-section section-wrap" id="collection"><div className="section-heading"><div><p className="eyebrow">The considered collection</p><h2>Stories worth<br /><em>making time for.</em></h2></div><a className="text-link" href="#reserve">View all books <ArrowRight size={16} /></a></div><div className="book-grid">{featuredBooks.map(({ title, author, genre, icon: Icon, color }) => <article className="book-card" key={title}><div className={`book-cover ${color}`}><Icon size={37} strokeWidth={1.4} /><span>{genre}</span></div><div className="book-info"><p className="book-type">Featured this week</p><h3>{title}</h3><p>by {author}</p><button className="card-button" onClick={() => { setForm((current) => ({ ...current, bookTitle: title })); document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' }) }}>Reserve this book <ArrowRight size={15} /></button></div></article>)}</div></section>

        <section className="quote-section" id="stories"><div className="quote-inner"><Quote size={36} className="quote-mark" /><blockquote>“Shelfspace makes borrowing feel like a small, lovely ritual again.”</blockquote><p>— Maya, member since 2022</p></div></section>

        <section className="reservation-section section-wrap" id="reserve"><div className="reservation-intro"><p className="eyebrow">Page 02 / Reservation desk</p><h2>Save your spot<br /><em>on the shelf.</em></h2><p>Tell us what you are looking for and when you would like to collect it. We will keep your title waiting for 48 hours after your pickup date.</p><div className="open-hours"><span className="open-dot" /><div><strong>Open today</strong><span>09:00 — 19:00</span></div></div></div><div className="form-panel"><form onSubmit={submitReservation} noValidate><div className="form-intro"><span>Reservation request</span><small>Fields marked * are required</small></div><div className="form-grid"><Field label="Full name" name="fullName" value={form.fullName} onChange={updateForm} error={errors.fullName} placeholder="Your name" /><Field label="Email address" name="email" value={form.email} onChange={updateForm} error={errors.email} placeholder="you@example.com" type="email" /><Field label="Phone number" name="phone" value={form.phone} onChange={updateForm} error={errors.phone} placeholder="+1 555 000 0000" type="tel" /><label className="field"><span>Membership type</span><select name="memberType" value={form.memberType} onChange={updateForm}><option>Reader</option><option>Student</option><option>Educator</option><option>Community partner</option></select></label><Field label="Book title" name="bookTitle" value={form.bookTitle} onChange={updateForm} error={errors.bookTitle} placeholder="What would you like to read?" wide /><Field label="Pickup date" name="pickupDate" value={form.pickupDate} onChange={updateForm} error={errors.pickupDate} type="date" /><Field label="Loan length" name="durationDays" value={form.durationDays} onChange={updateForm} error={errors.durationDays} type="number" min="1" max="30" /><label className="field wide"><span>Anything we should know? <small>(optional)</small></span><textarea name="notes" value={form.notes} onChange={updateForm} rows="3" placeholder="Accessibility needs, a note for our librarians..."></textarea></label><label className="checkbox-field wide"><input type="checkbox" name="updates" checked={form.updates} onChange={updateForm} /><span>Send me occasional reading recommendations and library news.</span></label></div><div className="form-actions"><button className="button button-primary" type="submit">Submit reservation <ArrowRight size={17} /></button><button className="reset-button" type="button" onClick={resetForm}>Reset form</button></div></form>{submitted && <div className="confirmation" id="confirmation"><div className="confirmation-icon"><Check size={20} /></div><div><strong>Reservation request received.</strong><p>{submitted.bookTitle} will be ready for {submitted.fullName} on {submitted.pickupDate}.</p></div></div>}</div></section>
      </main>

      <footer className="site-footer"><div className="footer-top"><a className="brand" href="#top"><span className="brand-mark"><BookOpen size={19} /></span><span>Shelfspace<span className="brand-dot">.</span></span></a><p>A little more reading<br />in every day.</p><div className="socials"><a href="#top" aria-label="Instagram"><Instagram size={18} /></a><a href="#top" aria-label="Facebook"><Facebook size={18} /></a><a href="#top" aria-label="Twitter"><Twitter size={18} /></a></div></div><div className="footer-bottom"><span>14 Lantern Lane, Brookfield</span><a href="mailto:hello@shelfspace.library">hello@shelfspace.library</a><span>© 2024 Shelfspace Library</span></div></footer>
    </div>
  )
}

function Field({ label, name, value, onChange, error, placeholder, type = 'text', wide = false, min, max }) {
  return <label className={`field ${wide ? 'wide' : ''}`}><span>{label} <b>*</b></span><input name={name} value={value} onChange={onChange} placeholder={placeholder} type={type} min={min} max={max} aria-invalid={Boolean(error)} />{error && <small className="field-error">{error}</small>}</label>
}

export default App
