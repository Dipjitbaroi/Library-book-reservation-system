import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
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

const bookIcons = { sage: BookOpen, gold: Sparkles, coral: Library }

const initialForm = {
  fullName: '', email: '', phone: '', memberType: 'Reader', bookId: '', bookTitle: '', pickupDate: '', durationDays: '7', notes: '', updates: false
}

function App() {
  const [route, setRoute] = useState(window.location.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)
  const [books, setBooks] = useState([])
  const [story, setStory] = useState(null)
  const [dataError, setDataError] = useState('')
  const [showAllBooks, setShowAllBooks] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const highlightedBooks = books.filter((book) => book.featured).slice(0, 3)

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setRoute(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const loadLibraryData = async () => {
      try {
        const [booksResponse, storyResponse] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/stories/featured')
        ])
        if (!booksResponse.ok || !storyResponse.ok) throw new Error('Library data unavailable')
        setBooks(await booksResponse.json())
        setStory(await storyResponse.json())
      } catch {
        setDataError('The collection is temporarily unavailable. Please try again shortly.')
      }
    }
    loadLibraryData()
  }, [])

  useEffect(() => {
    const bookId = new URLSearchParams(window.location.search).get('bookId')
    if (new URLSearchParams(window.location.search).get('reserve') === '1') setReservationModalOpen(true)
    if (!bookId || !books.length) return
    const book = books.find((item) => item.id === bookId)
    if (book) setForm((current) => ({ ...current, bookId: book.id, bookTitle: book.title }))
  }, [books])

  useEffect(() => {
    if (!route.startsWith('/books/') || !books.length) return
    const bookId = route.split('/')[2]
    const book = books.find((item) => item.id === bookId)
    if (!book) return
    setSelectedBook(book)
    fetch(`/api/books/${bookId}`).then((response) => response.ok ? response.json() : null).then((bookDetails) => {
      if (bookDetails) setSelectedBook(bookDetails)
    })
  }, [route, books])

  useEffect(() => {
    if (highlightedBooks.length < 2) return undefined
    const timer = window.setInterval(() => setHeroIndex((current) => (current + 1) % highlightedBooks.length), 4200)
    return () => window.clearInterval(timer)
  }, [highlightedBooks.length])

  const moveHero = (direction) => {
    setHeroIndex((current) => (current + direction + highlightedBooks.length) % highlightedBooks.length)
  }

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
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          memberType: form.memberType,
          bookId: form.bookId,
          pickupDate: new Date(`${form.pickupDate}T12:00:00`).toISOString(),
          durationDays: Number(form.durationDays),
          notes: form.notes || null
        })
      })
      if (!response.ok) throw new Error('Reservation could not be saved')
    } catch {
      setErrors({ form: 'We could not save your reservation. Please check that the library database is connected and try again.' })
      return
    }
    setSubmitted({ ...form })
    document.getElementById('confirmation')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const resetForm = () => {
    setForm(initialForm)
    setErrors({})
    setSubmitted(null)
  }

  const openBookDetails = async (book) => {
    setSelectedBook(book)
    navigate(`/books/${book.id}`)
    try {
      const response = await fetch(`/api/books/${book.id}`)
      if (response.ok) setSelectedBook(await response.json())
    } catch {
      setDataError('Book details are temporarily unavailable.')
    }
    document.getElementById('book-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const reserveBook = (book) => {
    setForm((current) => ({ ...current, bookId: book.id, bookTitle: book.title }))
    setReservationModalOpen(true)
  }

  if (route === '/books') return <BooksPage books={books} dataError={dataError} onDetails={openBookDetails} onHome={() => navigate('/')} />
  if (route.startsWith('/books/')) return <BookDetailsPage book={selectedBook} books={books} form={form} errors={errors} dataError={dataError} reservationModalOpen={reservationModalOpen} updateForm={updateForm} submitReservation={submitReservation} resetForm={resetForm} onDetails={openBookDetails} onHome={() => navigate('/')} onReserve={reserveBook} closeReservation={() => setReservationModalOpen(false)} />

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
         <select name="bookId" value={form.bookId} onChange={(event) => { const book = books.find((item) => item.id === event.target.value); setForm((current) => ({ ...current, bookId: event.target.value, bookTitle: book?.title || '' })) }} aria-invalid={Boolean(errors.bookTitle)}><option value="">Choose a title</option>{books.map((book) => <option value={book.id} key={book.id}>{book.title}</option>)}</select>{errors.bookTitle && <small className="field-error">{errors.bookTitle}</small>}
            <h1>Good books.<br /><em>Right on time.</em></h1>
            <p className="hero-description">A calmer way to discover and reserve the stories you have been meaning to read. Browse our shelves, then pick up your next favorite when it suits you.</p>
            <div className="hero-actions"><a className="button button-primary" href="#reserve">Book a title <ArrowRight size={17} /></a><a className="button button-secondary" href="#collection">Explore the shelves <ChevronDown size={17} /></a></div>
            <div className="hero-note"><span className="avatar-stack"><i>AL</i><i>JM</i><i>SK</i></span><span><strong>2,400+</strong> happy readers this month</span></div>
          </div>
          <div className="hero-art" aria-label="Highlighted books from the collection">
            <div className="sun-shape" />
            {highlightedBooks.length ? highlightedBooks.map((book, index) => { const Icon = bookIcons[book.visualStyle] || BookOpen; const position = (index - heroIndex + highlightedBooks.length) % highlightedBooks.length; return <button className={`hero-card hero-slide-${position} ${book.visualStyle}`} key={book.id} onClick={() => openBookDetails(book)} aria-label={`View details for ${book.title}`}><Icon size={29} /><span>{book.title}</span><small>by {book.author}</small></button> }) : dataError ? <div className="hero-loading">Collection unavailable</div> : <div className="hero-skeleton"><i /><i /><i /></div>}
            <div className="hero-controls"><button type="button" onClick={() => moveHero(-1)} aria-label="Previous highlighted book"><ChevronLeft size={17} /></button><span>{highlightedBooks.length ? `${heroIndex + 1} / ${highlightedBooks.length}` : '—'}</span><button type="button" onClick={() => moveHero(1)} aria-label="Next highlighted book"><ChevronRight size={17} /></button></div>
            <div className="art-caption"><span>Highlighted collection</span><span>Click a book to explore</span></div>
          </div>
        </section>

        <section className="strip" id="how-it-works"><div className="strip-inner"><div><CalendarDays size={20} /><span><strong>Reserve ahead</strong> Choose your pickup window</span></div><div><Clock3 size={20} /><span><strong>Keep it awhile</strong> Flexible 7, 14, or 30 day loans</span></div><div><Search size={20} /><span><strong>Find your next</strong> Personal picks from real librarians</span></div></div></section>

        <section className="content-section section-wrap" id="collection"><div className="section-heading"><div><p className="eyebrow">The considered collection</p><h2>Stories worth<br /><em>making time for.</em></h2></div><button className="text-link link-button" onClick={() => navigate('/books')}>View all books <ArrowRight size={16} /></button></div>{dataError ? <p className="data-error">{dataError}</p> : books.length ? <div className="book-grid">{books.filter((book) => book.featured).map(({ id, title, author, genre, visualStyle }) => { const Icon = bookIcons[visualStyle] || BookOpen; return <article className="book-card" key={id}><button className={`book-cover ${visualStyle} cover-button`} onClick={() => openBookDetails({ id, title, author, genre, visualStyle })}><Icon size={37} strokeWidth={1.4} /><span>{genre}</span></button><div className="book-info"><p className="book-type">Featured this week</p><h3>{title}</h3><p>by {author}</p><div className="card-actions"><button className="card-button" onClick={() => openBookDetails({ id, title, author, genre, visualStyle })}>View details <ArrowRight size={15} /></button><button className="card-button" onClick={() => reserveBook({ id, title })}>Reserve <ArrowRight size={15} /></button></div></div></article> })}</div> : <BookSkeletons count={3} />}</section>

        <section className="quote-section" id="stories"><div className="quote-inner"><Quote size={36} className="quote-mark" /><blockquote>{story ? `“${story.quote}”` : 'Loading a reader story...'}</blockquote>{story && <p>— {story.author}, member since {story.memberSince}</p>}</div></section>

        <section className="reservation-section section-wrap" id="reserve"><div className="reservation-intro"><p className="eyebrow">Page 02 / Reservation desk</p><h2>Save your spot<br /><em>on the shelf.</em></h2><p>Tell us what you are looking for and when you would like to collect it. We will keep your title waiting for 48 hours after your pickup date.</p><div className="open-hours"><span className="open-dot" /><div><strong>Open today</strong><span>09:00 — 19:00</span></div></div></div><div className="form-panel"><form onSubmit={submitReservation} noValidate><div className="form-intro"><span>Reservation request</span><small>Fields marked * are required</small></div>{errors.form && <p className="form-error">{errors.form}</p>}<div className="form-grid"><Field label="Full name" name="fullName" value={form.fullName} onChange={updateForm} error={errors.fullName} placeholder="Your name" /><Field label="Email address" name="email" value={form.email} onChange={updateForm} error={errors.email} placeholder="you@example.com" type="email" /><Field label="Phone number" name="phone" value={form.phone} onChange={updateForm} error={errors.phone} placeholder="+1 555 000 0000" type="tel" /><label className="field"><span>Membership type</span><select name="memberType" value={form.memberType} onChange={updateForm}><option>Reader</option><option>Student</option><option>Educator</option><option>Community partner</option></select></label><label className="field wide"><span>Book title <b>*</b></span><select name="bookTitle" value={form.bookTitle} onChange={updateForm} aria-invalid={Boolean(errors.bookTitle)}><option value="">Choose a title</option>{books.map((book) => <option value={book.title} key={book.id}>{book.title}</option>)}</select>{errors.bookTitle && <small className="field-error">{errors.bookTitle}</small>}</label><Field label="Pickup date" name="pickupDate" value={form.pickupDate} onChange={updateForm} error={errors.pickupDate} type="date" /><Field label="Loan length" name="durationDays" value={form.durationDays} onChange={updateForm} error={errors.durationDays} type="number" min="1" max="30" /><label className="field wide"><span>Anything we should know? <small>(optional)</small></span><textarea name="notes" value={form.notes} onChange={updateForm} rows="3" placeholder="Accessibility needs, a note for our librarians..."></textarea></label><label className="checkbox-field wide"><input type="checkbox" name="updates" checked={form.updates} onChange={updateForm} /><span>Send me occasional reading recommendations and library news.</span></label></div><div className="form-actions"><button className="button button-primary" type="submit">Submit reservation <ArrowRight size={17} /></button><button className="reset-button" type="button" onClick={resetForm}>Reset form</button></div></form>{submitted && <div className="confirmation" id="confirmation"><div className="confirmation-icon"><Check size={20} /></div><div><strong>Reservation request received.</strong><p>{submitted.bookTitle} will be ready for {submitted.fullName} on {submitted.pickupDate}.</p></div></div>}</div></section>
      </main>

      {reservationModalOpen && <ReservationModal form={form} errors={errors} books={books} updateForm={updateForm} submitReservation={submitReservation} resetForm={resetForm} close={() => setReservationModalOpen(false)} />}
      <footer className="site-footer"><div className="footer-top"><a className="brand" href="#top"><span className="brand-mark"><BookOpen size={19} /></span><span>Shelfspace<span className="brand-dot">.</span></span></a><p>A little more reading<br />in every day.</p><div className="socials"><a href="#top" aria-label="Instagram"><Instagram size={18} /></a><a href="#top" aria-label="Facebook"><Facebook size={18} /></a><a href="#top" aria-label="Twitter"><Twitter size={18} /></a></div></div><div className="footer-bottom"><span>14 Lantern Lane, Brookfield</span><a href="mailto:hello@shelfspace.library">hello@shelfspace.library</a><span>© 2024 Shelfspace Library</span></div></footer>
    </div>
  )
}

function ReservationModal({ form, errors, books, updateForm, submitReservation, resetForm, close }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reservation-modal-title"><div className="reservation-modal-card"><button className="modal-close" type="button" onClick={close} aria-label="Close reservation form"><X size={20} /></button><div className="form-intro"><span id="reservation-modal-title">Reserve this book</span><small>Fields marked * are required</small></div><form onSubmit={submitReservation} noValidate>{errors.form && <p className="form-error">{errors.form}</p>}<div className="form-grid"><Field label="Full name" name="fullName" value={form.fullName} onChange={updateForm} error={errors.fullName} placeholder="Your name" /><Field label="Email address" name="email" value={form.email} onChange={updateForm} error={errors.email} placeholder="you@example.com" type="email" /><Field label="Phone number" name="phone" value={form.phone} onChange={updateForm} error={errors.phone} placeholder="+1 555 000 0000" type="tel" /><label className="field"><span>Membership type</span><select name="memberType" value={form.memberType} onChange={updateForm}><option>Reader</option><option>Student</option><option>Educator</option><option>Community partner</option></select></label><label className="field wide"><span>Book title <b>*</b></span><select name="bookId" value={form.bookId} onChange={(event) => { const book = books.find((item) => item.id === event.target.value); updateForm({ target: { name: 'bookId', value: event.target.value, type: 'select' } }); updateForm({ target: { name: 'bookTitle', value: book?.title || '', type: 'text' } }) }} aria-invalid={Boolean(errors.bookTitle)}><option value="">Choose a title</option>{books.map((book) => <option value={book.id} key={book.id}>{book.title}</option>)}</select>{errors.bookTitle && <small className="field-error">{errors.bookTitle}</small>}</label><Field label="Pickup date" name="pickupDate" value={form.pickupDate} onChange={updateForm} error={errors.pickupDate} type="date" /><Field label="Loan length" name="durationDays" value={form.durationDays} onChange={updateForm} error={errors.durationDays} type="number" min="1" max="30" /><label className="field wide"><span>Anything we should know? <small>(optional)</small></span><textarea name="notes" value={form.notes} onChange={updateForm} rows="3" placeholder="Accessibility needs, a note for our librarians..."></textarea></label></div><div className="form-actions"><button className="button button-primary" type="submit">Submit reservation <ArrowRight size={17} /></button><button className="reset-button" type="button" onClick={resetForm}>Reset form</button></div></form></div></div>
}

function PageHeader({ onHome }) {
  return <header className="site-header"><button className="brand brand-button" onClick={onHome} aria-label="Shelfspace home"><span className="brand-mark"><BookOpen size={19} /></span><span>Shelfspace<span className="brand-dot">.</span></span></button><nav className="main-nav page-nav"><button onClick={onHome}>Home</button><a href="/books">Collection</a><a href="/#reserve" className="nav-cta">Reserve a book <ArrowRight size={15} /></a></nav></header>
}

function PageFooter() {
  return <footer className="site-footer"><div className="footer-bottom"><span>14 Lantern Lane, Brookfield</span><a href="mailto:hello@shelfspace.library">hello@shelfspace.library</a><span>© 2024 Shelfspace Library</span></div></footer>
}

function BooksPage({ books, dataError, onDetails, onHome }) {
  return <div className="app-shell"><PageHeader onHome={onHome} /><main className="collection-page section-wrap"><p className="eyebrow"><span className="eyebrow-line" /> The complete collection</p><h1>Every story<br /><em>on our shelves.</em></h1><p className="page-lede">Browse the full Shelfspace collection and choose the next book to make time for.</p>{dataError ? <p className="data-error">{dataError}</p> : books.length ? <div className="book-grid">{books.map((book) => { const Icon = bookIcons[book.visualStyle] || BookOpen; return <article className="book-card" key={book.id}><button className={`book-cover ${book.visualStyle} cover-button`} onClick={() => onDetails(book)}><Icon size={37} strokeWidth={1.4} /><span>{book.genre}</span></button><div className="book-info"><p className="book-type">From the collection</p><h3>{book.title}</h3><p>by {book.author}</p><button className="card-button" onClick={() => onDetails(book)}>View details <ArrowRight size={15} /></button></div></article> })}</div> : <BookSkeletons count={6} />}</main><PageFooter /></div>
}

function BookDetailsPage({ book, books, form, errors, dataError, reservationModalOpen, updateForm, submitReservation, resetForm, onHome, onReserve, closeReservation }) {
  return <div className="app-shell"><PageHeader onHome={onHome} /><main className="detail-page section-wrap">{dataError && <p className="data-error">{dataError}</p>}{book ? <><button className="back-link" onClick={() => window.history.back()}><ArrowRight size={15} /> Back to collection</button><section className="book-detail"><div className={`detail-cover ${book.visualStyle}`}><BookOpen size={48} /><span>{book.genre}</span></div><div className="detail-copy"><p className="eyebrow">Book details</p><h1>{book.title}</h1><p className="detail-author">by {book.author}</p><p>{book.description}</p><div className="detail-actions"><button className="button button-primary" onClick={() => onReserve(book)}>Reserve this book <ArrowRight size={17} /></button></div></div></section></> : <BookDetailSkeleton />}</main>{reservationModalOpen && <ReservationModal form={form} errors={errors} books={books} updateForm={updateForm} submitReservation={submitReservation} resetForm={resetForm} close={closeReservation} />}<PageFooter /></div>
}

function BookSkeletons({ count }) {
  return <div className="book-grid skeleton-grid">{Array.from({ length: count }, (_, index) => <article className="book-card skeleton-card" key={index}><div className="skeleton-cover" /><div className="book-info"><i className="skeleton-line short" /><i className="skeleton-line" /><i className="skeleton-line tiny" /></div></article>)}</div>
}

function BookDetailSkeleton() {
  return <section className="book-detail skeleton-detail"><div className="skeleton-detail-cover" /><div><i className="skeleton-line short" /><i className="skeleton-line title" /><i className="skeleton-line" /><i className="skeleton-line" /></div></section>
}

function Field({ label, name, value, onChange, error, placeholder, type = 'text', wide = false, min, max }) {
  return <label className={`field ${wide ? 'wide' : ''}`}><span>{label} <b>*</b></span><input name={name} value={value} onChange={onChange} placeholder={placeholder} type={type} min={min} max={max} aria-invalid={Boolean(error)} />{error && <small className="field-error">{error}</small>}</label>
}

export default App
