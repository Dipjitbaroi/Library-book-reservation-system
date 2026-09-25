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
  LogOut,
  Menu,
  MapPin,
  Phone,
  Pencil,
  Plus,
  Quote,
  Search,
  Sparkles,
  Twitter,
  X
} from 'lucide-react'

const bookIcons = { sage: BookOpen, gold: Sparkles, coral: Library }

/* ---- Shared Tailwind class strings (formerly reusable CSS classes) ---- */
const SECTION_WRAP = 'w-[min(1200px,calc(100%-64px))] mx-auto max-mob:w-[calc(100%-36px)]'
const BRAND = 'flex items-center gap-2.5 text-[19px] font-bold tracking-[-.5px]'
const BRAND_BUTTON = 'p-0 border-0 bg-transparent text-inherit cursor-pointer'
const BRAND_MARK = 'w-[34px] h-[34px] grid place-items-center text-cream bg-ink rounded-full'
const BRAND_DOT = 'text-coral'

const BTN = 'min-h-[46px] px-[19px] border border-transparent inline-flex items-center justify-center gap-2.5 text-[13px] font-bold cursor-pointer'
const BTN_PRIMARY = `${BTN} bg-ink text-cream hover:bg-deep-sage hover:-translate-y-0.5`
const BTN_SECONDARY = `${BTN} border-[#c8ccc4] text-ink bg-transparent hover:border-ink`

const NAV_CTA = 'px-[17px] py-3 flex items-center gap-2 border border-ink text-ink hover:bg-ink hover:text-cream max-mob:justify-center'
const NAV_LINK = 'hover:text-coral'

const EYEBROW = 'm-0 mb-5 flex items-center gap-2.5 uppercase tracking-[1.7px] text-deep-sage text-[10px] font-bold'

const FIELD = 'relative flex flex-col gap-2'
const FIELD_WIDE = `${FIELD} col-span-full max-mob:col-auto`
const FIELD_LABEL = 'text-[#67716b] text-[10px] font-bold'
const FIELD_ERROR = 'text-[#be5f4a] text-[10px]'
const INPUT = 'w-full px-3 py-[11px] border border-[#d8dcd4] rounded-none outline-none bg-white text-ink text-[12px] focus:border-deep-sage'
const CHECKBOX_FIELD = 'flex gap-[9px] items-center text-muted text-[11px] col-span-full max-mob:col-auto'
const RESET_BUTTON = 'border-0 bg-transparent text-muted text-[11px] cursor-pointer hover:text-coral'

const FORM_INTRO = 'pb-[23px] border-b border-line flex justify-between items-end'
const FORM_GRID = 'py-[26px] grid grid-cols-2 gap-x-[17px] gap-y-[21px] max-mob:grid-cols-1'
const FORM_ACTIONS = 'flex gap-3 items-center max-mob:flex-col max-mob:items-stretch'
const FORM_ERROR = 'text-[#be5f4a] text-[11px] leading-[1.5] mt-[18px]'
const DATA_ERROR = 'text-[#be5f4a] text-[11px] leading-[1.5] py-5'

const BOOK_GRID = 'grid grid-cols-3 gap-[22px] max-mob:grid-cols-1'
const CARD_BTN = 'mt-[23px] pb-[5px] flex items-center gap-2 border-0 border-b border-[#b3bdb2] bg-transparent text-ink text-[11px] font-bold cursor-pointer hover:text-coral hover:border-coral'
const BOOK_COVER = 'relative overflow-hidden w-full h-[225px] p-[25px] flex flex-col justify-between text-ink text-left border-0 cursor-pointer max-mob:h-[190px]'
const BOOK_COVER_IMG = 'absolute inset-0 w-full h-full object-cover'
const BOOK_COVER_SPAN = 'relative z-[1] text-[10px] uppercase tracking-[1.2px]'
const BOOK_INFO_H3 = 'mt-3 mb-1.5 max-w-[245px] font-serif text-[22px] leading-[1.15] font-medium'

const ICON_BUTTON = 'w-7 h-7 grid place-items-center border border-line bg-transparent text-muted cursor-pointer hover:text-ink hover:border-ink'
const ADMIN_PANEL = 'p-[27px] bg-cream'
const ADMIN_PANEL_HEADING = 'flex items-end justify-between pb-5 border-b border-line'
const PANEL_KICKER = 'text-deep-sage uppercase tracking-[1.5px] text-[9px] font-bold'
const ADMIN_PANEL_H2 = 'mt-2 font-serif text-[28px] font-medium tracking-[-.5px]'

const SHIMMER = 'bg-[linear-gradient(110deg,#d9dfd7_25%,#eef1eb_42%,#d9dfd7_58%)] bg-[length:200%_100%] animate-shimmer'
const SKELETON_LINE = `block ${SHIMMER} w-[82%] h-3 my-3`
const SKELETON_LINE_SHORT = `block ${SHIMMER} w-[34%] h-[9px] my-3`
const SKELETON_LINE_TINY = `block ${SHIMMER} w-[54%] h-[9px] my-3`
const SKELETON_LINE_TITLE = `block ${SHIMMER} w-[65%] h-[30px] my-[18px]`
const SKELETON_HERO_I = `absolute block w-[190px] h-[280px] ${SHIMMER} shadow-[14px_16px_24px_#4253482c] max-mob:w-[150px] max-mob:h-[220px]`

/* Map book.visualStyle -> its cover background colour. */
const styleBg = {
  sage: 'bg-[#b8c7b7]',
  gold: 'bg-[#dfbc7c]',
  coral: 'bg-[#d89378]'
}

/* Map the computed hero carousel slot -> its position / rotation utilities. */
const heroSlide = {
  0: 'left-[145px] top-[112px] z-[3] rotate-[-12deg] max-mob:left-[25%] max-mob:top-[68px]',
  1: 'left-[78px] top-[76px] z-[2] opacity-[.72] rotate-[10deg] scale-[.88] max-mob:left-[5%] max-mob:top-[45px]',
  2: 'left-[194px] top-[52px] z-[1] opacity-[.72] rotate-[16deg] scale-[.82] max-mob:left-[42%] max-mob:top-[30px]'
}
const HERO_CARD = 'absolute w-[190px] h-[280px] p-[24px_20px] border-0 flex flex-col justify-between items-start text-left text-ink cursor-pointer shadow-[14px_16px_24px_#4253482c] transition-[transform,opacity,left,top] duration-700 ease-in-out hover:opacity-100 hover:-translate-y-2 hover:rotate-[-9deg] hover:scale-[1.02] max-mob:w-[150px] max-mob:h-[220px] max-mob:p-[18px_15px]'
const HERO_CARD_SPAN = 'relative z-[1] max-w-[215px] font-serif text-[22px] leading-[1.1] max-mob:text-[16px]'
const HERO_CARD_SMALL = 'relative z-[1] text-[10px] text-[#405148]'
const HERO_CARD_IMG = 'w-full h-full absolute inset-0 object-cover opacity-[.82] mix-blend-normal'

const initialForm = {
  fullName: '', email: '', phone: '', memberType: 'Reader', bookId: '', bookTitle: '', pickupDate: '', durationDays: '7', notes: '', updates: false
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const bangladeshPhonePattern = /^(?:\+?880|0)1[3-9]\d{8}$/

const sanitizePhoneInput = (value) => {
  const digitsAndPlus = value.replace(/[^\d+]/g, '')
  const normalized = digitsAndPlus.startsWith('+')
    ? `+${digitsAndPlus.slice(1).replace(/\+/g, '')}`
    : digitsAndPlus.replace(/\+/g, '')

  return normalized.slice(0, 14)
}

const getFieldError = (name, value) => {
  const trimmedValue = String(value).trim()

  if (name === 'fullName' && !trimmedValue) return 'Please enter your full name.'
  if (name === 'email') {
    if (!trimmedValue) return 'Email is required.'
    if (!emailPattern.test(trimmedValue)) return 'Enter a valid email address.'
  }
  if (name === 'phone') {
    if (!trimmedValue) return 'Phone number is required.'
    if (!bangladeshPhonePattern.test(trimmedValue)) return 'Enter a valid Bangladesh mobile number, e.g. 01712345678.'
  }
  if (name === 'bookTitle' && !trimmedValue) return 'Choose a book to reserve.'
  if (name === 'pickupDate' && !trimmedValue) return 'Choose a pickup date.'
  if (name === 'durationDays' && (!trimmedValue || Number(trimmedValue) < 1 || Number(trimmedValue) > 30)) return 'Choose between 1 and 30 days.'

  return ''
}

function App() {
  const [route, setRoute] = useState(window.location.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(null)
  const [toast, setToast] = useState(null)
  const [books, setBooks] = useState([])
  const [story, setStory] = useState(null)
  const [dataError, setDataError] = useState('')
  const [showAllBooks, setShowAllBooks] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [bookDetailsLoading, setBookDetailsLoading] = useState(false)
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
    setBookDetailsLoading(true)
    setSelectedBook(book)
    fetch(`/api/books/${bookId}`).then((response) => response.ok ? response.json() : null).then((bookDetails) => {
      if (bookDetails) setSelectedBook(bookDetails)
    }).finally(() => setBookDetailsLoading(false))
  }, [route, books])

  useEffect(() => {
    if (highlightedBooks.length < 2) return undefined
    const timer = window.setInterval(() => setHeroIndex((current) => (current + 1) % highlightedBooks.length), 4200)
    return () => window.clearInterval(timer)
  }, [highlightedBooks.length])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const moveHero = (direction) => {
    setHeroIndex((current) => (current + direction + highlightedBooks.length) % highlightedBooks.length)
  }

  const showToast = (type, message) => setToast({ type, message })

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = name === 'phone' ? sanitizePhoneInput(value) : type === 'checkbox' ? checked : value
    setForm((current) => ({ ...current, [name]: nextValue }))
    if (touched[name] || errors[name]) {
      setErrors((current) => ({ ...current, [name]: getFieldError(name, nextValue), form: '' }))
    }
  }

  const validateFieldOnBlur = (event) => {
    const { name, value } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
    setErrors((current) => ({ ...current, [name]: getFieldError(name, value) }))
  }

  const validate = () => {
    const nextErrors = {}
    ;['fullName', 'email', 'phone', 'bookTitle', 'pickupDate', 'durationDays'].forEach((name) => {
      const error = getFieldError(name, form[name])
      if (error) nextErrors[name] = error
    })
    return nextErrors
  }

  const normalizeBangladeshPhone = (phone) => {
    const digits = phone.replace(/[\s()-]/g, '')
    if (digits.startsWith('+880')) return digits
    if (digits.startsWith('880')) return `+${digits}`
    return `+880${digits.slice(1)}`
  }

  const submitReservation = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setTouched({ fullName: true, email: true, phone: true, bookTitle: true, pickupDate: true, durationDays: true })
      showToast('error', 'Please correct the highlighted reservation fields.')
      return
    }
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: normalizeBangladeshPhone(form.phone),
          memberType: form.memberType,
          bookId: form.bookId,
          bookTitle: form.bookTitle,
          pickupDate: new Date(`${form.pickupDate}T12:00:00`).toISOString(),
          durationDays: Number(form.durationDays),
          notes: form.notes || null
        })
      })
      const responseBody = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(responseBody.error || 'Reservation could not be saved.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Reservation could not be saved.'
      setErrors({ form: message })
      showToast('error', message)
      return
    }
    setSubmitted({ ...form })
    setErrors({})
    setReservationModalOpen(false)
    showToast('success', 'Reservation submitted successfully.')
    document.getElementById('confirmation')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const resetForm = () => {
    setForm(initialForm)
    setErrors({})
    setTouched({})
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
  if (route.startsWith('/books/')) return <BookDetailsPage book={selectedBook} bookDetailsLoading={bookDetailsLoading} books={books} form={form} errors={errors} dataError={dataError} reservationModalOpen={reservationModalOpen} updateForm={updateForm} validateFieldOnBlur={validateFieldOnBlur} submitReservation={submitReservation} resetForm={resetForm} onDetails={openBookDetails} onHome={() => navigate('/')} onReserve={reserveBook} closeReservation={() => setReservationModalOpen(false)} toast={toast} dismissToast={() => setToast(null)} />
  if (route.startsWith('/admin')) return <AdminPage />

  return (
    <div>
      <header className={`${SECTION_WRAP} h-[84px] flex items-center justify-between max-mob:h-[70px]`}>
        <a className={BRAND} href="#top" aria-label="Shelfspace home"><span className={BRAND_MARK}><BookOpen size={19} /></span><span>Shelfspace<span className={BRAND_DOT}>.</span></span></a>
        <button className="hidden bg-transparent border-0 text-ink cursor-pointer max-mob:block" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={`flex items-center gap-[35px] text-[13px] text-[#56625b] max-mob:absolute max-mob:z-[5] max-mob:top-[70px] max-mob:left-0 max-mob:right-0 max-mob:p-[20px_18px_26px] max-mob:bg-cream max-mob:border-b max-mob:border-line max-mob:flex-col max-mob:items-stretch max-mob:gap-[18px] ${menuOpen ? 'max-mob:flex' : 'max-mob:hidden'}`}>
          <a className={NAV_LINK} href="#collection" onClick={() => setMenuOpen(false)}>Collection</a>
          <a className={NAV_LINK} href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a className={NAV_LINK} href="#stories" onClick={() => setMenuOpen(false)}>Readers</a>
          <a href="#reserve" className={NAV_CTA} onClick={() => setMenuOpen(false)}>Reserve a book <ArrowRight size={15} /></a>
        </nav>
      </header>

      <main id="top">
        <section className={`${SECTION_WRAP} min-h-[560px] pt-[58px] pb-[72px] grid grid-cols-2 gap-[70px] items-center max-mob:min-h-0 max-mob:pt-[45px] max-mob:pb-[55px] max-mob:grid-cols-1 max-mob:gap-[42px]`}>
          <div>
            <h1>Good books.<br /><em>Right on time.</em></h1>
            <p className="max-w-[450px] mt-[27px] mb-7 text-muted leading-[1.75] text-[15px]">A calmer way to discover and reserve the stories you have been meaning to read. Browse our shelves, then pick up your next favorite when it suits you.</p>
            <div className="flex gap-3 items-center"><a className={BTN_PRIMARY} href="#reserve">Book a title <ArrowRight size={17} /></a><a className={BTN_SECONDARY} href="#collection">Explore the shelves <ChevronDown size={17} /></a></div>
            <div className="mt-[37px] flex items-center gap-3 text-[11px] text-muted"><span className="flex"><i className="w-[25px] h-[25px] -mr-1.5 border-2 border-paper rounded-full grid place-items-center text-white text-[8px] not-italic bg-coral">AL</i><i className="w-[25px] h-[25px] -mr-1.5 border-2 border-paper rounded-full grid place-items-center text-white text-[8px] not-italic bg-deep-sage">JM</i><i className="w-[25px] h-[25px] -mr-1.5 border-2 border-paper rounded-full grid place-items-center text-white text-[8px] not-italic bg-gold">SK</i></span><span><strong className="text-ink">2,400+</strong> happy readers this month</span></div>
          </div>
          <div className="h-[410px] relative bg-[#dbe2d8] overflow-hidden max-mob:h-[300px]" aria-label="Highlighted books from the collection">
            <div className="w-[250px] h-[250px] absolute top-9 right-[54px] rounded-full bg-[#ecd5a5] max-mob:right-[5%] max-mob:top-[18px]" />
            {highlightedBooks.length ? highlightedBooks.map((book, index) => { const Icon = bookIcons[book.visualStyle] || BookOpen; const position = (index - heroIndex + highlightedBooks.length) % highlightedBooks.length; return <button className={`${HERO_CARD} ${heroSlide[position]} ${styleBg[book.visualStyle] || ''}`} key={book.id} onClick={() => openBookDetails(book)} aria-label={`View details for ${book.title}`}>{book.imageUrl ? <img className={HERO_CARD_IMG} src={book.imageUrl} alt={`${book.title} cover`} /> : <Icon className="relative z-[1] opacity-75" size={29} />}<span className={HERO_CARD_SPAN}>{book.title}</span><small className={HERO_CARD_SMALL}>by {book.author}</small></button> }) : dataError ? <div className="absolute inset-0 grid place-items-center text-muted text-[12px]">Collection unavailable</div> : <div className="absolute inset-0"><i className={`${SKELETON_HERO_I} left-[78px] top-[76px] rotate-[10deg] scale-[.88] max-mob:left-[5%] max-mob:top-[45px]`} /><i className={`${SKELETON_HERO_I} left-[194px] top-[52px] rotate-[16deg] scale-[.82] max-mob:left-[42%] max-mob:top-[30px]`} /><i className={`${SKELETON_HERO_I} left-[145px] top-[112px] rotate-[-12deg] z-[2] max-mob:left-[25%] max-mob:top-[68px]`} /></div>}
            <div className="absolute right-[18px] bottom-[37px] z-[5] flex items-center gap-2 text-deep-sage text-[10px] max-mob:bottom-[18px]"><button type="button" className="w-7 h-7 grid place-items-center border border-[#a7b8a8] bg-[#eef2ebaa] text-deep-sage cursor-pointer hover:bg-cream" onClick={() => moveHero(-1)} aria-label="Previous highlighted book"><ChevronLeft size={17} /></button><span>{highlightedBooks.length ? `${heroIndex + 1} / ${highlightedBooks.length}` : '—'}</span><button type="button" className="w-7 h-7 grid place-items-center border border-[#a7b8a8] bg-[#eef2ebaa] text-deep-sage cursor-pointer hover:bg-cream" onClick={() => moveHero(1)} aria-label="Next highlighted book"><ChevronRight size={17} /></button></div>
            <div className="absolute bottom-[18px] left-5 right-5 flex justify-between text-[#557061] text-[9px] uppercase tracking-[1px]"><span>Highlighted collection</span><span>Click a book to explore</span></div>
          </div>
        </section>

        <section className="bg-[#e7ece3] border-t border-b border-[#d8e0d6]" id="how-it-works"><div className={`${SECTION_WRAP} grid grid-cols-3 max-mob:grid-cols-1`}><div className="min-h-[82px] pl-0 pr-6 py-[18px] flex gap-[13px] items-center border-r border-[#d1dbd0] text-deep-sage max-mob:min-h-[65px] max-mob:py-[14px] max-mob:px-0 max-mob:border-r-0 max-mob:border-b max-mob:border-[#d1dbd0]"><CalendarDays size={20} /><span className="flex flex-col gap-[3px] text-[11px] text-muted"><strong className="text-[12px] text-ink">Reserve ahead</strong> Choose your pickup window</span></div><div className="min-h-[82px] px-6 py-[18px] flex gap-[13px] items-center border-r border-[#d1dbd0] text-deep-sage max-mob:min-h-[65px] max-mob:py-[14px] max-mob:px-0 max-mob:border-r-0 max-mob:border-b max-mob:border-[#d1dbd0]"><Clock3 size={20} /><span className="flex flex-col gap-[3px] text-[11px] text-muted"><strong className="text-[12px] text-ink">Keep it awhile</strong> Flexible 7, 14, or 30 day loans</span></div><div className="min-h-[82px] px-6 py-[18px] flex gap-[13px] items-center text-deep-sage max-mob:min-h-[65px] max-mob:py-[14px] max-mob:px-0 max-mob:border-b max-mob:border-[#d1dbd0]"><Search size={20} /><span className="flex flex-col gap-[3px] text-[11px] text-muted"><strong className="text-[12px] text-ink">Find your next</strong> Personal picks from real librarians</span></div></div></section>

        <section className={`${SECTION_WRAP} pt-[115px] pb-[120px] max-mob:py-20`} id="collection"><div className="flex items-end justify-between mb-[46px] max-mob:items-start max-mob:flex-col max-mob:gap-[25px]"><div><p className={EYEBROW}>The considered collection</p><h2 className="text-[52px] max-mob:text-[42px]">Stories worth<br /><em>making time for.</em></h2></div><button className="flex gap-2 items-center pb-[5px] border-0 border-b border-coral bg-transparent cursor-pointer text-[12px] font-bold hover:text-coral" onClick={() => navigate('/books')}>View all books <ArrowRight size={16} /></button></div>{dataError ? <p className={DATA_ERROR}>{dataError}</p> : books.length ? <div className={BOOK_GRID}>{books.filter((book) => book.featured).map((book) => { const Icon = bookIcons[book.visualStyle] || BookOpen; return <article className="bg-cream" key={book.id}><button className={`${BOOK_COVER} ${styleBg[book.visualStyle] || ''}`} onClick={() => openBookDetails(book)}>{book.imageUrl ? <img className={BOOK_COVER_IMG} src={book.imageUrl} alt={`${book.title} cover`} /> : <Icon size={37} strokeWidth={1.4} />}<span className={BOOK_COVER_SPAN}>{book.genre}</span></button><div className="pt-6 px-6 pb-[26px]"><p className="text-coral uppercase tracking-[1.3px] text-[9px] font-bold">Featured this week</p><h3 className={BOOK_INFO_H3}>{book.title}</h3><p className="m-0 text-muted text-[12px]">by {book.author}</p><div className="flex gap-[18px]"><button className={CARD_BTN} onClick={() => openBookDetails(book)}>View details <ArrowRight size={15} /></button><button className={CARD_BTN} onClick={() => reserveBook(book)}>Reserve <ArrowRight size={15} /></button></div></div></article> })}</div> : <BookSkeletons count={3} />}</section>

        <section className="py-[95px] px-5 bg-ink text-cream text-center" id="stories"><div className="max-w-[620px] mx-auto"><Quote size={36} className="text-coral" /><blockquote className="mt-5 mb-[19px] font-serif text-[32px] leading-[1.3] max-mob:text-[25px]">{story ? `“${story.quote}”` : 'Loading a reader story...'}</blockquote>{story && <p className="text-[#aab8ad] text-[11px]">— {story.author}, member since {story.memberSince}</p>}</div></section>

            <section className={`${SECTION_WRAP} pt-[120px] pb-[130px] grid grid-cols-[.75fr_1.25fr] gap-[100px] max-mob:grid-cols-1 max-mob:gap-[45px] max-mob:py-20`} id="reserve"><div><p className={EYEBROW}>Page 02 / Reservation desk</p><h2 className="text-[52px] max-mob:text-[42px]">Save your spot<br /><em>on the shelf.</em></h2><p className="max-w-[340px] my-[27px] text-muted text-[14px] leading-[1.7]">Tell us what you are looking for and when you would like to collect it. We will keep your title waiting for 48 hours after your pickup date.</p><div className="mt-[44px] flex items-center gap-3 text-[12px]"><span className="w-[9px] h-[9px] rounded-full bg-[#81a887] shadow-[0_0_0_5px_#dbe8dc]" /><div className="flex flex-col gap-[3px]"><strong>Open today</strong><span className="text-muted text-[11px]">09:00 — 19:00</span></div></div></div><div className="bg-cream p-8 max-mob:p-[22px_18px]"><form onSubmit={submitReservation} noValidate><div className={FORM_INTRO}><span className="font-serif text-[23px]">Reservation request</span><small className="text-muted text-[10px]">Fields marked * are required</small></div>{errors.form && <p className={FORM_ERROR}>{errors.form}</p>}<div className={FORM_GRID}><Field label="Full name" name="fullName" value={form.fullName} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.fullName} placeholder="Your name" autoComplete="name" /><Field label="Email address" name="email" value={form.email} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.email} placeholder="you@example.com" type="email" autoComplete="email" /><Field label="Phone number" name="phone" value={form.phone} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.phone} placeholder="+8801712345678" type="tel" inputMode="numeric" autoComplete="tel" /><label className={FIELD}><span className={FIELD_LABEL}>Membership type</span><select className={INPUT} name="memberType" value={form.memberType} onChange={updateForm}><option>Reader</option><option>Student</option><option>Educator</option><option>Community partner</option></select></label><label className={FIELD_WIDE}><span className={FIELD_LABEL}>Book title <b className="text-coral">*</b></span><select className={`${INPUT} ${errors.bookTitle ? 'border-coral' : ''}`} name="bookTitle" value={form.bookTitle} onChange={updateForm} onBlur={validateFieldOnBlur} aria-invalid={Boolean(errors.bookTitle)}><option value="">Choose a title</option>{books.map((book) => <option value={book.title} key={book.id}>{book.title}</option>)}</select>{errors.bookTitle && <small className={FIELD_ERROR}>{errors.bookTitle}</small>}</label><Field label="Pickup date" name="pickupDate" value={form.pickupDate} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.pickupDate} type="date" /><Field label="Loan length" name="durationDays" value={form.durationDays} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.durationDays} type="number" min="1" max="30" inputMode="numeric" /><label className={FIELD_WIDE}><span className={FIELD_LABEL}>Anything we should know? <small>(optional)</small></span><textarea className={`${INPUT} resize-y`} name="notes" value={form.notes} onChange={updateForm} rows="3" placeholder="Accessibility needs, a note for our librarians..."></textarea></label><label className={CHECKBOX_FIELD}><input className="accent-deep-sage" type="checkbox" name="updates" checked={form.updates} onChange={updateForm} /><span>Send me occasional reading recommendations and library news.</span></label></div><div className={FORM_ACTIONS}><button className={BTN_PRIMARY} type="submit">Submit reservation <ArrowRight size={17} /></button><button className={RESET_BUTTON} type="button" onClick={resetForm}>Reset form</button></div></form>{submitted && <div className="mt-6 p-4 flex gap-3 bg-[#e5f0e4] text-ink" id="confirmation"><div className="w-[26px] h-[26px] grid place-items-center rounded-full bg-deep-sage text-white"><Check size={20} /></div><div><strong className="text-[12px]">Reservation request received.</strong><p className="mt-[5px] text-muted text-[11px]">{submitted.bookTitle} will be ready for {submitted.fullName} on {submitted.pickupDate}.</p></div></div>}</div></section>
      </main>

      {reservationModalOpen && <ReservationModal form={form} errors={errors} books={books} updateForm={updateForm} validateFieldOnBlur={validateFieldOnBlur} submitReservation={submitReservation} resetForm={resetForm} close={() => setReservationModalOpen(false)} />}
      <Toast toast={toast} dismiss={() => setToast(null)} />
      <SiteFooter />
    </div>
  )
}

function SiteFooter() {
  return <footer className="pt-[48px] pb-[26px] px-[max(32px,calc((100%-1200px)/2))] bg-[#e6ebe3]"><div className="grid grid-cols-[1.15fr_1fr_1fr_auto] gap-9 items-start pb-[48px] max-mob:grid-cols-2 max-mob:gap-x-5 max-mob:gap-y-7"><div className="flex flex-col gap-5 max-mob:col-span-full"><a className={BRAND} href="/" aria-label="Shelfspace home"><span className={BRAND_MARK}><BookOpen size={19} /></span><span>Shelfspace<span className={BRAND_DOT}>.</span></span></a><p className="m-0 text-deep-sage font-serif text-[20px] leading-[1.25]">A little more reading<br />in every day.</p></div><div className="max-w-[265px]"><h2 className="mb-[13px] text-ink font-sans text-[11px] font-bold tracking-[1.2px] uppercase">About us</h2><p className="text-[#617067] font-sans text-[12px] leading-[1.65] max-mob:text-[11px]">Shelfspace is a neighborhood library that helps readers discover thoughtful books and make time for the stories they love.</p></div><div className="max-w-[265px] flex flex-col gap-[7px]"><h2 className="mb-[13px] text-ink font-sans text-[11px] font-bold tracking-[1.2px] uppercase">Contact</h2><a className="text-[#617067] font-sans text-[12px] leading-[1.65] flex items-center gap-[7px] w-max max-w-full hover:text-coral" href="mailto:hello@shelfspace.library">hello@shelfspace.library</a><a className="text-[#617067] font-sans text-[12px] leading-[1.65] flex items-center gap-[7px] w-max max-w-full hover:text-coral" href="tel:+8801712345678"><Phone size={14} /> +880 1712-345678</a><span className="text-[#617067] font-sans text-[12px] leading-[1.65] flex items-center gap-[7px] w-max max-w-full"><MapPin size={14} /> 14 Lantern Lane, Brookfield</span></div><div className="flex justify-end gap-4 max-mob:justify-start"><a className="text-deep-sage hover:text-coral" href="#top" aria-label="Instagram"><Instagram size={18} /></a><a className="text-deep-sage hover:text-coral" href="#top" aria-label="Facebook"><Facebook size={18} /></a><a className="text-deep-sage hover:text-coral" href="#top" aria-label="Twitter"><Twitter size={18} /></a></div></div><div className="pt-[17px] border-t border-[#ced8cc] flex justify-between text-[#738076] text-[10px] max-mob:gap-3 max-mob:flex-wrap"><span>© 2026 Shelfspace Library</span><span>Open daily, 09:00 — 19:00</span></div></footer>
}

function ReservationModal({ form, errors, books, updateForm, validateFieldOnBlur, submitReservation, resetForm, close }) {
  return <div className="fixed z-20 inset-0 px-[18px] py-7 grid place-items-center bg-[#21302bcc] overflow-auto" role="dialog" aria-modal="true" aria-labelledby="reservation-modal-title"><div className="relative w-[min(720px,100%)] max-h-[calc(100vh-56px)] overflow-auto p-8 bg-cream shadow-[0_24px_70px_#16231e55]"><button className="absolute top-4 right-4 w-[34px] h-[34px] grid place-items-center border border-line bg-transparent text-muted cursor-pointer hover:text-ink hover:border-ink" type="button" onClick={close} aria-label="Close reservation form"><X size={20} /></button><div className={FORM_INTRO}><span className="font-serif text-[23px]" id="reservation-modal-title">Reserve this book</span><small className="text-muted text-[10px]">Fields marked * are required</small></div><form onSubmit={submitReservation} noValidate>{errors.form && <p className={FORM_ERROR}>{errors.form}</p>}<div className={`${FORM_GRID} pb-5`}><Field label="Full name" name="fullName" value={form.fullName} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.fullName} placeholder="Your name" autoComplete="name" /><Field label="Email address" name="email" value={form.email} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.email} placeholder="you@example.com" type="email" autoComplete="email" /><Field label="Phone number" name="phone" value={form.phone} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.phone} placeholder="+8801712345678" type="tel" inputMode="numeric" autoComplete="tel" /><label className={FIELD}><span className={FIELD_LABEL}>Membership type</span><select className={INPUT} name="memberType" value={form.memberType} onChange={updateForm}><option>Reader</option><option>Student</option><option>Educator</option><option>Community partner</option></select></label><label className={FIELD_WIDE}><span className={FIELD_LABEL}>Book title <b className="text-coral">*</b></span><select className={`${INPUT} ${errors.bookTitle ? 'border-coral' : ''}`} name="bookId" value={form.bookId} onChange={(event) => { const book = books.find((item) => item.id === event.target.value); updateForm({ target: { name: 'bookId', value: event.target.value, type: 'select' } }); updateForm({ target: { name: 'bookTitle', value: book?.title || '', type: 'text' } }) }} aria-invalid={Boolean(errors.bookTitle)}><option value="">Choose a title</option>{books.map((book) => <option value={book.id} key={book.id}>{book.title}</option>)}</select>{errors.bookTitle && <small className={FIELD_ERROR}>{errors.bookTitle}</small>}</label><Field label="Pickup date" name="pickupDate" value={form.pickupDate} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.pickupDate} type="date" /><Field label="Loan length" name="durationDays" value={form.durationDays} onChange={updateForm} onBlur={validateFieldOnBlur} error={errors.durationDays} type="number" min="1" max="30" inputMode="numeric" /><label className={FIELD_WIDE}><span className={FIELD_LABEL}>Anything we should know? <small>(optional)</small></span><textarea className={`${INPUT} resize-y`} name="notes" value={form.notes} onChange={updateForm} rows="3" placeholder="Accessibility needs, a note for our librarians..."></textarea></label></div><div className={FORM_ACTIONS}><button className={BTN_PRIMARY} type="submit">Submit reservation <ArrowRight size={17} /></button><button className={RESET_BUTTON} type="button" onClick={resetForm}>Reset form</button></div></form></div></div>
}

const emptyBook = { title: '', author: '', genre: '', description: '', visualStyle: 'sage', imageUrl: '', featured: false }

function AdminSkeleton() {
  return <div className="min-h-screen bg-[#eef1eb]"><header className="h-[82px] px-[max(24px,calc((100%-1240px)/2))] flex justify-between items-center bg-cream border-b border-line max-mob:px-[18px]"><div className={`${SHIMMER} h-[25px] w-[155px]`} /><div className={`${SHIMMER} h-[25px] w-[120px]`} /></header><main className="w-[min(1240px,calc(100%-48px))] mx-auto pt-[65px] pb-[90px] max-mob:w-[calc(100%-36px)] max-mob:pt-[42px] max-mob:pb-[60px]"><div className="flex justify-between items-end mb-[42px] max-mob:items-start max-mob:flex-col max-mob:gap-5"><div><i className={SKELETON_LINE_SHORT} /><i className={`block ${SHIMMER} w-[280px] h-[48px] my-3`} /></div></div><section className="grid grid-cols-2 gap-[22px] max-mob:grid-cols-1"><div className={`${ADMIN_PANEL} min-h-[360px]`}><i className={SKELETON_LINE_SHORT} /><i className={SKELETON_LINE_TITLE} /><i className={SKELETON_LINE} /><i className={SKELETON_LINE} /><i className={SKELETON_LINE} /><i className={SKELETON_LINE} /></div><div className={`${ADMIN_PANEL} min-h-[360px]`}><i className={SKELETON_LINE_SHORT} /><i className={SKELETON_LINE_TITLE} />{[1, 2, 3, 4].map((item) => <div className="flex gap-3 items-center py-[15px] border-b border-line" key={item}><i className="w-[38px] h-[48px] bg-[#d9dfd7] animate-shimmer" /><span className="flex-1"><b className="block h-[10px] my-[5px] bg-[#d9dfd7] animate-shimmer w-[70%]" /><em className="block h-[10px] my-[5px] bg-[#d9dfd7] animate-shimmer w-[45%]" /></span></div>)}</div></section><div className={`${ADMIN_PANEL} min-h-[220px] mt-[22px]`}><i className={SKELETON_LINE_SHORT} /><i className={SKELETON_LINE_TITLE} /><i className={SKELETON_LINE} /><i className={SKELETON_LINE} /></div></main></div>
}

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('shelfspace_admin_token'))
  const [login, setLogin] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginErrors, setLoginErrors] = useState({})
  const [books, setBooks] = useState([])
  const [reservations, setReservations] = useState([])
  const [bookForm, setBookForm] = useState(emptyBook)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [adminLoading, setAdminLoading] = useState(true)

  const adminRequest = async (path, options = {}) => {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) } })
    if (response.status === 401) { localStorage.removeItem('shelfspace_admin_token'); setToken(null); throw new Error('Session expired') }
    if (!response.ok) throw new Error((await response.json()).error || 'Request failed')
    return response.status === 204 ? null : response.json()
  }

  const loadAdminData = async () => {
    setAdminLoading(true)
    try { const [bookData, reservationData] = await Promise.all([adminRequest('/api/admin/books'), adminRequest('/api/admin/reservations')]); setBooks(bookData); setReservations(reservationData) } catch (error) { setMessage(error.message) } finally { setAdminLoading(false) }
  }

  useEffect(() => { if (token) loadAdminData() }, [token])

  const submitLogin = async (event) => {
    event.preventDefault()
    const nextErrors = {
      email: !login.email.trim() ? 'Email is required.' : !emailPattern.test(login.email.trim()) ? 'Enter a valid email address.' : '',
      password: !login.password ? 'Password is required.' : ''
    }
    setLoginErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    try { const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(login) }); if (!response.ok) throw new Error((await response.json()).error); const data = await response.json(); localStorage.setItem('shelfspace_admin_token', data.token); setToken(data.token); setLoginError('') } catch (error) { setLoginError(error.message) }
  }

  const saveBook = async (event) => {
    event.preventDefault()
    try { const saved = await adminRequest(editingId ? `/api/admin/books/${editingId}` : '/api/admin/books', { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(bookForm) }); let finalBook = saved; if (imageFile) finalBook = await uploadBookImage(saved.id, imageFile); setBooks((current) => editingId ? current.map((book) => book.id === editingId ? finalBook : book) : [finalBook, ...current]); setBookForm(emptyBook); setImageFile(null); setImagePreview(''); setEditingId(null); setMessage('Book saved.') } catch (error) { setMessage(error.message) }
  }

  const uploadBookImage = async (bookId, file) => {
    setImageUploading(true)
    try {
      const imageData = new FormData()
      imageData.append('image', file)
      const imageResponse = await fetch(`/api/books/${bookId}/image`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: imageData })
      if (!imageResponse.ok) throw new Error((await imageResponse.json()).error || 'Image upload failed')
      const uploadedBook = await imageResponse.json()
      setBookForm((current) => ({ ...current, imageUrl: uploadedBook.imageUrl }))
      return uploadedBook
    } finally {
      setImageUploading(false)
    }
  }

  const selectBookImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    if (editingId) {
      try { await uploadBookImage(editingId, file); setImageFile(null); setMessage('Cover uploaded.') } catch (error) { setMessage(error.message) }
    }
  }

  const deleteBook = async (id) => { if (!window.confirm('Delete this book?')) return; try { await adminRequest(`/api/admin/books/${id}`, { method: 'DELETE' }); setBooks((current) => current.filter((book) => book.id !== id)); setMessage('Book deleted.') } catch (error) { setMessage(error.message) } }
  const updateReservation = async (id, status) => { try { const updated = await adminRequest(`/api/admin/reservations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setReservations((current) => current.map((item) => item.id === id ? { ...item, status: updated.status } : item)) } catch (error) { setMessage(error.message) } }
  const logout = () => { localStorage.removeItem('shelfspace_admin_token'); setToken(null) }

  if (!token) return <div className="min-h-screen grid place-items-center p-6 bg-ink"><div className="w-[min(440px,100%)] p-[42px] bg-cream max-mob:p-[28px_22px]"><span className={`${BRAND_MARK} mb-[35px]`}><BookOpen size={19} /></span><p className={EYEBROW}>Shelfspace administration</p><h1 className="text-[48px]">Welcome back.</h1><p className="mt-[18px] mb-[30px] text-muted leading-[1.6] text-[13px]">Sign in to manage the collection and reservations.</p><form className="grid gap-[18px]" onSubmit={submitLogin} noValidate><label className={FIELD}><span className={FIELD_LABEL}>Email</span><input className={`${INPUT} ${loginErrors.email ? 'border-coral' : ''}`} type="email" value={login.email} onChange={(event) => { setLogin({ ...login, email: event.target.value }); if (loginErrors.email) setLoginErrors({ ...loginErrors, email: '' }) }} aria-invalid={Boolean(loginErrors.email)} />{loginErrors.email && <small className={FIELD_ERROR}>{loginErrors.email}</small>}</label><label className={FIELD}><span className={FIELD_LABEL}>Password</span><input className={`${INPUT} ${loginErrors.password ? 'border-coral' : ''}`} type="password" value={login.password} onChange={(event) => { setLogin({ ...login, password: event.target.value }); if (loginErrors.password) setLoginErrors({ ...loginErrors, password: '' }) }} aria-invalid={Boolean(loginErrors.password)} />{loginErrors.password && <small className={FIELD_ERROR}>{loginErrors.password}</small>}</label>{loginError && <p className={FORM_ERROR}>{loginError}</p>}<button className={`${BTN_PRIMARY} mt-1.5`} type="submit">Sign in <ArrowRight size={16} /></button></form></div></div>
  if (adminLoading) return <AdminSkeleton />

  return <div className="min-h-screen bg-[#eef1eb]"><header className="h-[82px] px-[max(24px,calc((100%-1240px)/2))] flex justify-between items-center bg-cream border-b border-line max-mob:px-[18px]"><button className={`${BRAND} ${BRAND_BUTTON}`} onClick={() => window.location.href = '/'}><span className={BRAND_MARK}><BookOpen size={19} /></span><span>Shelfspace<span className={BRAND_DOT}>.</span></span></button><div className="flex items-center gap-6 max-mob:gap-[10px]"><span className={`${PANEL_KICKER} max-mob:hidden`}>Admin workspace</span><button className="flex items-center gap-[7px] border-0 bg-transparent text-muted text-[11px] cursor-pointer" onClick={logout}><LogOut size={15} /> Sign out</button></div></header><main className="w-[min(1240px,calc(100%-48px))] mx-auto pt-[65px] pb-[90px] max-mob:w-[calc(100%-36px)] max-mob:pt-[42px] max-mob:pb-[60px]"><div className="flex justify-between items-end mb-[42px] max-mob:items-start max-mob:flex-col max-mob:gap-5"><div><p className={EYEBROW}>Library operations</p><h1 className="text-[58px] max-mob:text-[44px]">Manage the shelf.</h1></div>{message && <p className="px-[14px] py-[10px] bg-[#e1efdf] text-deep-sage text-[11px]">{message}</p>}</div><section className="grid grid-cols-2 gap-[22px] max-mob:grid-cols-1"><div className={ADMIN_PANEL}><div className={ADMIN_PANEL_HEADING}><div><span className={PANEL_KICKER}>Collection</span><h2 className={ADMIN_PANEL_H2}>{editingId ? 'Edit book' : 'Add a book'}</h2></div>{editingId && <button className={RESET_BUTTON} onClick={() => { setEditingId(null); setBookForm(emptyBook); setImageFile(null); setImagePreview('') }}>Cancel edit</button>}</div><form className="pt-6 grid grid-cols-2 gap-x-[14px] gap-y-[18px] max-mob:grid-cols-1" onSubmit={saveBook}><label className={FIELD}><span className={FIELD_LABEL}>Title</span><input className={INPUT} value={bookForm.title} onChange={(event) => setBookForm({ ...bookForm, title: event.target.value })} required /></label><label className={FIELD}><span className={FIELD_LABEL}>Author</span><input className={INPUT} value={bookForm.author} onChange={(event) => setBookForm({ ...bookForm, author: event.target.value })} required /></label><label className={FIELD}><span className={FIELD_LABEL}>Genre</span><input className={INPUT} value={bookForm.genre} onChange={(event) => setBookForm({ ...bookForm, genre: event.target.value })} required /></label><label className={FIELD}><span className={FIELD_LABEL}>Upload cover photo</span><input className={INPUT} type="file" accept="image/*" onChange={selectBookImage} />{(imagePreview || bookForm.imageUrl) && <div className="relative w-full h-[170px] mt-[10px] overflow-hidden bg-[#e5ebe3]"><img className="w-full h-full object-cover" src={imagePreview || bookForm.imageUrl} alt="Selected book cover preview" />{imageUploading && <span className="absolute inset-0 flex items-center justify-center gap-2 bg-[#21302bb8] text-cream text-[11px]"><i className="w-[15px] h-[15px] border-2 border-[#ffffff66] border-t-cream rounded-full animate-upload-spin" /> Uploading...</span>}</div>}{imageUploading && <small className="text-deep-sage text-[10px]">Uploading photo to Cloudinary...</small>}{!imageUploading && imageFile && <small className="text-deep-sage text-[10px]">Photo selected. It will be uploaded automatically.</small>}</label><label className={FIELD}><span className={FIELD_LABEL}>Visual style</span><select className={INPUT} value={bookForm.visualStyle} onChange={(event) => setBookForm({ ...bookForm, visualStyle: event.target.value })}><option value="sage">Sage</option><option value="gold">Gold</option><option value="coral">Coral</option></select></label><label className={FIELD_WIDE}><span className={FIELD_LABEL}>Description</span><textarea className={`${INPUT} resize-y`} value={bookForm.description} onChange={(event) => setBookForm({ ...bookForm, description: event.target.value })} rows="4" required /></label><label className="flex items-center gap-2 text-muted text-[11px]"><input className="accent-deep-sage" type="checkbox" checked={bookForm.featured} onChange={(event) => setBookForm({ ...bookForm, featured: event.target.checked })} /> Feature this book</label><button className={`${BTN_PRIMARY} justify-self-start`} type="submit" disabled={imageUploading}>{imageUploading ? 'Uploading photo...' : editingId ? 'Update book' : 'Add book'} <Plus size={16} /></button></form></div><div className={ADMIN_PANEL}><div className={ADMIN_PANEL_HEADING}><div><span className={PANEL_KICKER}>Books</span><h2 className={ADMIN_PANEL_H2}>{books.length} titles</h2></div></div><div className="pt-3">{books.map((book) => <div className="flex items-center gap-[11px] py-[14px] border-b border-line" key={book.id}><div className="w-[38px] h-[48px] flex-none grid place-items-center overflow-hidden bg-sage">{book.imageUrl ? <img className="w-full h-full object-cover" src={book.imageUrl} alt="" /> : <BookOpen size={17} />}</div><div className="min-w-0 flex-1 flex flex-col gap-1"><strong className="truncate text-[12px]">{book.title}</strong><span className="text-muted text-[10px]">{book.author} · {book.featured ? 'Featured' : 'Hidden'}</span></div><button className={ICON_BUTTON} onClick={() => { setEditingId(book.id); setBookForm({ title: book.title, author: book.author, genre: book.genre, description: book.description, visualStyle: book.visualStyle, imageUrl: book.imageUrl || '', featured: book.featured }); setImageFile(null); setImagePreview('') }} aria-label="Edit book"><Pencil size={16} /></button><button className={`${ICON_BUTTON} hover:!text-[#be5f4a] hover:!border-[#be5f4a]`} onClick={() => deleteBook(book.id)} aria-label="Delete book"><X size={16} /></button></div>)}</div></div></section><section className={`${ADMIN_PANEL} mt-[22px]`}><div className={ADMIN_PANEL_HEADING}><div><span className={PANEL_KICKER}>Reservations</span><h2 className={ADMIN_PANEL_H2}>{reservations.length} requests</h2></div></div>{reservations.length ? <div className="pt-[6px]">{reservations.map((reservation) => <div className="flex items-center gap-[11px] py-[14px] border-b border-line max-mob:items-start max-mob:flex-wrap" key={reservation.id}><div className="min-w-0 flex-1 flex flex-col gap-1"><strong className="truncate text-[12px]">{reservation.fullName}</strong><span className="text-muted text-[10px]">{reservation.book?.title || reservation.bookTitle}</span><small className="text-muted text-[10px]">{reservation.email} · pickup {new Date(reservation.pickupDate).toLocaleDateString()}</small></div><select className="min-w-[120px] p-2 border border-line bg-white text-ink text-[10px] max-mob:ml-[49px]" value={reservation.status} onChange={(event) => updateReservation(reservation.id, event.target.value)}><option value="PENDING">Pending</option><option value="READY">Ready</option><option value="PICKED_UP">Picked up</option><option value="RETURNED">Returned</option><option value="CANCELLED">Cancelled</option></select></div>)}</div> : <p className="text-muted text-[12px] pt-5 pb-[5px]">No reservations yet.</p>}</section></main></div>
}

function PageHeader({ onHome }) {
  return <header className={`${SECTION_WRAP} h-[84px] flex items-center justify-between max-mob:h-[70px]`}><button className={`${BRAND} ${BRAND_BUTTON}`} onClick={onHome} aria-label="Shelfspace home"><span className={BRAND_MARK}><BookOpen size={19} /></span><span>Shelfspace<span className={BRAND_DOT}>.</span></span></button><nav className="flex items-center gap-[35px] text-[13px] text-[#56625b]"><button className={`${BRAND_BUTTON} ${NAV_LINK}`} onClick={onHome}>Home</button><a className={NAV_LINK} href="/books">Collection</a><a href="/#reserve" className={NAV_CTA}>Reserve a book <ArrowRight size={15} /></a></nav></header>
}

function PageFooter() {
  return <SiteFooter />
}

function BooksPage({ books, dataError, onDetails, onHome }) {
  return <div><PageHeader onHome={onHome} /><main className={`${SECTION_WRAP} pt-[90px] pb-[120px] max-mob:pt-[56px] max-mob:pb-[72px]`}><p className={EYEBROW}><span className="w-7 h-px bg-coral" /> The complete collection</p><h1 className="text-[60px] max-mob:text-[42px] max-mob:leading-[1.08] max-mob:tracking-normal">Every story<br /><em>on our shelves.</em></h1><p className="max-w-[470px] mt-[25px] mb-[55px] text-muted leading-[1.7]">Browse the full Shelfspace collection and choose the next book to make time for.</p>{dataError ? <p className={DATA_ERROR}>{dataError}</p> : books.length ? <div className={`${BOOK_GRID} mt-[55px]`}>{books.map((book) => { const Icon = bookIcons[book.visualStyle] || BookOpen; return <article className="bg-cream" key={book.id}><button className={`${BOOK_COVER} ${styleBg[book.visualStyle] || ''}`} onClick={() => onDetails(book)}>{book.imageUrl ? <img className={BOOK_COVER_IMG} src={book.imageUrl} alt={`${book.title} cover`} /> : <Icon size={37} strokeWidth={1.4} />}<span className={BOOK_COVER_SPAN}>{book.genre}</span></button><div className="pt-6 px-6 pb-[26px]"><p className="text-coral uppercase tracking-[1.3px] text-[9px] font-bold">From the collection</p><h3 className={BOOK_INFO_H3}>{book.title}</h3><p className="m-0 text-muted text-[12px]">by {book.author}</p><button className={CARD_BTN} onClick={() => onDetails(book)}>View details <ArrowRight size={15} /></button></div></article> })}</div> : <BookSkeletons count={6} />}</main><PageFooter /></div>
}

function BookDetailsPage({ book, bookDetailsLoading, books, form, errors, dataError, reservationModalOpen, updateForm, validateFieldOnBlur, submitReservation, resetForm, onHome, onReserve, closeReservation, toast, dismissToast }) {
  return <div><PageHeader onHome={onHome} /><main className={`${SECTION_WRAP} pt-[90px] pb-[120px] max-mob:pt-[56px] max-mob:pb-[72px]`}>{dataError && <p className={DATA_ERROR}>{dataError}</p>}{book && !bookDetailsLoading ? <><button className="flex items-center gap-2 mb-[30px] border-0 bg-transparent text-muted text-[12px] cursor-pointer max-mob:mb-[22px]" onClick={() => window.history.back()}><ArrowRight className="rotate-180" size={15} /> Back to collection</button><section className="pt-[35px] pb-[75px] grid grid-cols-[280px_1fr] gap-[55px] items-center max-mob:grid-cols-1 max-mob:gap-7 max-mob:items-start max-mob:pt-3 max-mob:pb-0"><div className={`relative overflow-hidden min-h-[300px] p-7 flex flex-col justify-between text-ink max-mob:w-[min(100%,360px)] max-mob:min-h-0 max-mob:aspect-[3/4] max-mob:p-[22px] ${styleBg[book.visualStyle] || ''}`}>{book.imageUrl ? <img className="absolute inset-0 w-full h-full object-cover" src={book.imageUrl} alt={`${book.title} cover`} /> : <BookOpen className="relative z-[1]" size={48} />}<span className="relative z-[1] text-[11px] uppercase tracking-[1px]">{book.genre}</span></div><div className="min-w-0"><p className={EYEBROW}>Book details</p><h1 className="text-[60px] max-mob:text-[42px] max-mob:leading-[1.08] max-mob:tracking-normal">{book.title}</h1><p className="text-coral text-[14px]">by {book.author}</p><p className="max-w-[500px] text-muted leading-[1.7] max-mob:max-w-none max-mob:text-[14px]">{book.description}</p><div className="mt-7 flex items-center gap-5 max-mob:mt-6"><button className={`${BTN_PRIMARY} max-mob:w-full`} onClick={() => onReserve(book)}>Reserve this book <ArrowRight size={17} /></button></div></div></section></> : <BookDetailSkeleton />}</main>{reservationModalOpen && <ReservationModal form={form} errors={errors} books={books} updateForm={updateForm} validateFieldOnBlur={validateFieldOnBlur} submitReservation={submitReservation} resetForm={resetForm} close={closeReservation} />}<Toast toast={toast} dismiss={dismissToast} /><PageFooter /></div>
}

function BookSkeletons({ count }) {
  return <div className={`${BOOK_GRID} min-h-[220px]`}>{Array.from({ length: count }, (_, index) => <article className="bg-cream" key={index}><div className={`${SHIMMER} h-[225px]`} /><div className="pt-6 px-6 pb-[26px]"><i className={SKELETON_LINE_SHORT} /><i className={SKELETON_LINE} /><i className={SKELETON_LINE_TINY} /></div></article>)}</div>
}

function BookDetailSkeleton() {
  return <section className="pt-[35px] pb-[75px] grid grid-cols-[280px_1fr] gap-[55px] items-center min-h-[360px] max-mob:grid-cols-1 max-mob:gap-7 max-mob:items-start max-mob:pt-3 max-mob:pb-0"><div className={`${SHIMMER} min-h-[300px]`} /><div className="w-full"><i className={SKELETON_LINE_SHORT} /><i className={SKELETON_LINE_TITLE} /><i className={SKELETON_LINE} /><i className={SKELETON_LINE} /></div></section>
}

function Toast({ toast, dismiss }) {
  if (!toast) return null
  const Icon = toast.type === 'success' ? Check : X
  const accent = toast.type === 'success' ? 'border-l-4 border-l-deep-sage' : 'border-l-4 border-l-[#be5f4a]'
  const iconColor = toast.type === 'success' ? 'text-deep-sage' : 'text-[#be5f4a]'
  return <div className={`fixed z-50 right-6 bottom-6 w-[min(390px,calc(100%-48px))] min-h-[56px] py-[14px] pr-3 pl-4 flex items-center gap-[11px] border border-line shadow-[0_16px_38px_#21302b33] bg-cream text-ink text-[12px] font-semibold max-mob:right-[18px] max-mob:bottom-[18px] max-mob:w-[calc(100%-36px)] ${accent}`} role="status"><Icon className={iconColor} size={18} /><span className="flex-1 leading-[1.4]">{toast.message}</span><button className="w-7 h-7 grid place-items-center border-0 bg-transparent text-muted cursor-pointer hover:text-ink" type="button" onClick={dismiss} aria-label="Dismiss notification"><X size={16} /></button></div>
}

function Field({ label, name, value, onChange, onBlur, error, placeholder, type = 'text', wide = false, min, max, inputMode, autoComplete }) {
  const errorId = `${name}-error`
  return <label className={wide ? FIELD_WIDE : FIELD}><span className={FIELD_LABEL}>{label} <b className="text-coral">*</b></span><input className={`${INPUT} ${error ? 'border-coral' : ''}`} name={name} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} type={type} min={min} max={max} inputMode={inputMode} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />{error && <small className={FIELD_ERROR} id={errorId}>{error}</small>}</label>
}

export default App
