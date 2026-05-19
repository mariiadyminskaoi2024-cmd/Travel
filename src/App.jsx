import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Heart, Sparkles, Plane, CalendarDays, Wallet, User, MessageCircle, Clock,
  Hotel, Compass, Globe2, Sun, Mountain, Waves, Coffee, Menu, X, Send, Route,
  Luggage, Bell, LogIn, LogOut, Search, SlidersHorizontal, Database, ShieldCheck,
  BookOpen, Users, CreditCard, Star, CheckCircle2, PlusCircle
} from 'lucide-react'
import {
  firebaseEnabled, subscribeToUser, registerUser, loginUser, logoutUser,
  loadUserData, saveFavorite, saveHistory, saveBooking
} from './firebaseService.js'

const trips = [
  ['barcelona','Барселона: сонце, архітектура і тапас','Іспанія','Теплий міський відпочинок','warm','balanced','inspiration','medium',5,720,'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',['архітектура','море','їжа','прогулянки'],'Boutique Hotel Gothic Quarter','Wizz Air / Ryanair, сезонний прямий рейс','Ідеальна подорож для тих, хто хоче поєднати теплий клімат, красиву архітектуру, гастрономію та легкий ритм міста.'],
  ['zakopane','Закопане: гори, терми і slow travel','Польща','Затишний гірський відпочинок','cold','active','reset','low',4,380,'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',['гори','терми','бюджетно','природа'],'Wooden Chalet near Krupówki','Потяг/автобус до Кракова + трансфер','Маршрут для відновлення енергії: свіже повітря, легкі треки, термальні басейни та дерев’яна архітектура.'],
  ['prague','Прага: романтика, історія і кав’ярні','Чехія','Комфортна культурна подорож','mild','calm','romance','medium',3,460,'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80',['романтика','історія','кава','місто'],'Old Town Design Apartments','Потяг/автобус або авіарейс до Праги','Підійде парам і мандрівникам, які хочуть красивий, спокійний та добре організований city break без перевантаження.'],
  ['crete','Крит: море, тиша і гастрономія','Греція','Релакс біля моря','warm','calm','relax','high',7,980,'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',['море','релакс','острів','кухня'],'Seaside Eco Resort Crete','Авіарейс до Іракліона + трансфер','Для тих, кому потрібне перезавантаження без зайвої логістики: море, невеликі міста, локальна кухня і спокійний графік.'],
  ['lisbon','Лісабон: океан, трамваї і фаду','Португалія','Натхненний ocean city break','warm','balanced','inspiration','medium',5,690,'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',['океан','трамваї','фаду','видові точки'],'Alfama View Guesthouse','Авіарейс до Лісабона','Місто для легких прогулянок, красивих заходів сонця, океану та музики фаду.'],
  ['paris','Париж: музеї, сніданки і вечірня Сена','Франція','Романтичний культурний вікенд','mild','calm','romance','high',4,1050,'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',['романтика','музеї','кава','архітектура'],'Latin Quarter Hotel','Авіарейс або поїзд Європою','Класичний сценарій для романтичної подорожі з акцентом на атмосферу, музеї й вечері.'],
  ['rome','Рим: античність, паста і dolce vita','Італія','Сонячний культурно-гастрономічний маршрут','warm','balanced','inspiration','medium',5,760,'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80',['історія','паста','архітектура','сонце'],'Trastevere Boutique Stay','Авіарейс до Рима','Для тих, хто хоче багато вражень, красивих вулиць і смачної їжі без складної логістики.'],
  ['vienna','Відень: класика, палаци і десерти','Австрія','Елегантна міська подорож','mild','calm','inspiration','medium',3,520,'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80',['палаци','музика','десерти','музеї'],'Ringstrasse Comfort Hotel','Потяг/автобус або авіарейс','Спокійний маршрут для культури, кав’ярень, палаців і прогулянок без поспіху.'],
  ['budapest','Будапешт: терми, мости і нічні вогні','Угорщина','Бюджетний wellness city break','mild','balanced','reset','low',4,390,'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80',['терми','бюджетно','місто','нічні види'],'Danube Budget Hotel','Потяг/автобус або авіарейс','Недорогий відпочинок із термами, красивою архітектурою та вечірніми прогулянками біля Дунаю.'],
  ['istanbul','Стамбул: базари, Босфор і східний вайб','Туреччина','Контрастна емоційна подорож','warm','active','inspiration','medium',5,650,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80',['базари','Босфор','їжа','культура'],'Galata Design Hotel','Авіарейс до Стамбула','Маршрут для тих, хто любить живі міста, багато смаків, шумні вулиці та сильні враження.'],
  ['reykjavik','Ісландія: водоспади, лагуни і північне сяйво','Ісландія','Пригодницьке природне перезавантаження','cold','active','reset','high',6,1450,'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=1200&q=80',['водоспади','лагуни','північ','пригоди'],'Reykjavik Nordic Lodge','Авіарейс до Рейк’явіка + авто','Для активних мандрівників, які хочуть природу, драматичні пейзажі та повне відключення від рутини.'],
  ['bali','Балі: йога, океан і рисові тераси','Індонезія','Довгий wellness escape','warm','calm','relax','high',10,1600,'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',['йога','океан','тераси','релакс'],'Ubud Eco Villa','Авіарейс до Денпасара','Варіант для глибокого перезавантаження: природа, океан, йога, повільний темп і красиві локації.'],
  ['tbilisi','Тбілісі: вино, дворики і теплі вечори','Грузія','Душевна гастро-подорож','warm','balanced','inspiration','low',5,430,'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80',['вино','їжа','гори поруч','дворики'],'Old Tbilisi Guesthouse','Авіарейс або комбінований маршрут','Бюджетна й емоційна подорож для гастрономії, гостинності, прогулянок і красивих двориків.'],
  ['dubrovnik','Дубровник: море, фортеці і старе місто','Хорватія','Сонячна морська історія','warm','balanced','romance','high',6,980,'https://images.unsplash.com/photo-1555990538-c48dbe5f353e?auto=format&fit=crop&w=1200&q=80',['море','фортеці','романтика','старе місто'],'Adriatic Old Town Rooms','Авіарейс + трансфер узбережжям','Для романтичної подорожі з морем, вечірніми видами і затишним історичним центром.'],
  ['amsterdam','Амстердам: канали, музеї і велосипеди','Нідерланди','Легкий міський формат','mild','active','inspiration','medium',4,740,'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',['канали','музеї','велосипед','місто'],'Canal Side Hotel','Авіарейс до Амстердама','Активний city break з музеями, велосипедами, каналами та атмосферними районами.'],
  ['kyiv','Київ: схили Дніпра, кав’ярні і культура','Україна','Близька культурна подорож','mild','balanced','reset','low',3,220,'https://images.unsplash.com/photo-1564592259023-414274d68487?auto=format&fit=crop&w=1200&q=80',['місто','кава','парки','бюджетно'],'Podil Urban Stay','Потяг або автобус','Коротка бюджетна подорож з прогулянками, музеями, кав’ярнями та видами на Дніпро.']
].map(([id,title,country,vibe,climate,activity,mood,budget,days,baseCost,image,tags,hotel,flight,description]) => ({
  id,title,country,vibe,climate,activity,mood,budget,days,baseCost,image,tags,hotel,flight,description,
  itinerary: [
    ['09:00','Сніданок і план дня','Перевірка погоди, транспорту та бронювань'],
    ['11:00','Головна локація маршруту','Культурний або природний блок за настроєм подорожі'],
    ['14:00','Обід у локальному місці','Рекомендація за бюджетом і відгуками'],
    ['16:30','Вільне вікно','Час для відпочинку, фото або спонтанної прогулянки'],
    ['19:30','Вечірня активність','Панорама, вечеря або легка прогулянка']
  ],
  packing: climate === 'warm' ? ['сонцезахисний крем','окуляри','легкий одяг','пляшка для води'] : climate === 'cold' ? ['тепла куртка','термобілизна','трекінгове взуття','рукавички'] : ['зручне взуття','парасоля','павербанк','легка куртка']
}))

const questions = [
  { key: 'mood', title: 'Який у тебе настрій?', options: [['relax','Хочу спокою',Waves],['inspiration','Хочу натхнення',Sun],['reset','Потрібне перезавантаження',Mountain],['romance','Романтичний вайб',Coffee]] },
  { key: 'budget', title: 'Бюджет на одну людину?', options: [['low','До €400',Wallet],['medium','€400–800',Wallet],['high','€800+',Wallet]] },
  { key: 'activity', title: 'Який темп подорожі?', options: [['calm','Спокійний',Clock],['balanced','Збалансований',Compass],['active','Активний',Route]] },
  { key: 'climate', title: 'Клімат?', options: [['warm','Теплий',Sun],['mild','Помірний',Globe2],['cold','Прохолодний',Mountain]] },
]

const defaultAnswers = { mood: 'relax', budget: 'medium', activity: 'balanced', climate: 'warm' }
const budgetLabels = { low: 'до €400', medium: '€400–800', high: '€800+' }
const moodLabels = { relax: 'спокій', inspiration: 'натхнення', reset: 'перезавантаження', romance: 'романтика' }

function scoreTrip(trip, answers) {
  let score = 42
  if (answers.mood === trip.mood) score += 20
  if (answers.budget === trip.budget) score += 16
  if (answers.activity === trip.activity) score += 12
  if (answers.climate === trip.climate) score += 12
  if (answers.budget === 'high' && trip.budget === 'medium') score += 5
  if (answers.activity === 'balanced') score += 3
  return Math.min(99, score)
}
function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`btn ${variant}`}>{children}</button>
}
function Badge({ children }) { return <span className="badge">{children}</span> }

function Header({ page, setPage, user, onAuth, onLogout }) {
  const [menu, setMenu] = useState(false)
  const links = [['home','Головна'],['quiz','Smart Quiz'],['recommendations','Ідеї'],['profile','Профіль'],['backend','Backend']]
  return <header className="header"><div className="header-inner">
    <button className="logo" onClick={() => setPage('home')}><span><MapPin/></span><b>MapMyMood<small>Smart Travel Planner</small></b></button>
    <nav>{links.map(([k,l]) => <button key={k} className={page===k?'active':''} onClick={() => setPage(k)}>{l}</button>)}</nav>
    <div className="auth-zone">{user ? <><span className="user-pill"><User size={16}/>{user.name}</span><button className="icon-btn" onClick={onLogout} title="Вийти"><LogOut size={18}/></button></> : <Button onClick={onAuth}><LogIn size={18}/> Увійти</Button>}</div>
    <button className="menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
  </div><AnimatePresence>{menu && <motion.div className="mobile" initial={{height:0}} animate={{height:'auto'}} exit={{height:0}}>{links.map(([k,l]) => <button key={k} onClick={() => {setPage(k);setMenu(false)}}>{l}</button>)}{user ? <button onClick={onLogout}>Вийти</button> : <button onClick={onAuth}>Увійти</button>}</motion.div>}</AnimatePresence></header>
}

function AuthModal({ open, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: 'Марія', email: 'demo@mapmymood.app', password: '123456' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const user = mode === 'register' ? await registerUser(form) : await loginUser(form)
      onAuthSuccess(user); onClose()
    } catch (err) { setError(err.message || 'Не вдалося виконати авторизацію') }
    finally { setLoading(false) }
  }
  return <AnimatePresence>{open && <motion.div className="modal-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.form className="auth-modal" onSubmit={submit} initial={{y:30,scale:.96}} animate={{y:0,scale:1}} exit={{y:30,scale:.96}}>
    <button className="close" type="button" onClick={onClose}><X/></button>
    <Badge><ShieldCheck size={14}/> {firebaseEnabled ? 'Firebase Auth' : 'Demo local backend'}</Badge>
    <h2>{mode === 'login' ? 'Вхід в акаунт' : 'Реєстрація'}</h2>
    <p>Після входу зберігаються обране, історія тестів і чернетки бронювань. Без Firebase це працює в localStorage, з Firebase — у Firestore.</p>
    {mode === 'register' && <label>Ім’я<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>}
    <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
    <label>Пароль<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
    {error && <div className="error">{error}</div>}
    <Button type="submit" disabled={loading}>{loading ? 'Завантаження...' : mode === 'login' ? 'Увійти' : 'Створити акаунт'}</Button>
    <button className="link-btn" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Немає акаунта? Зареєструватися' : 'Вже є акаунт? Увійти'}</button>
  </motion.form></motion.div>}</AnimatePresence>
}

function Home({ setPage, user }) {
  return <main><section className="hero"><div><Badge><Sparkles size={14}/> AI Smart Travel Planner</Badge><h1>Подорож, яка підлаштовується під твій настрій, бюджет і стиль.</h1><p>Оновлена версія має вхід/вихід з акаунта, збереження обраного, історію тестів, чернетки бронювань, backend-ready Firebase інтеграцію та значно більшу базу ідей подорожей.</p><div className="row"><Button onClick={()=>setPage('quiz')}><Sparkles size={18}/> Пройти Smart Quiz</Button><Button variant="ghost" onClick={()=>setPage('recommendations')}><Compass size={18}/> Дивитись ідеї</Button></div><div className="stats">{[[trips.length,'ідей подорожей'],[user?'online':'demo','акаунт'],[firebaseEnabled?'Firebase':'local','backend mode']].map(([n,t])=><div key={t}><b>{n}</b><span>{t}</span></div>)}</div></div><div className="hero-img"><img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"/><div><b>Персональний підбір</b><span>Smart Quiz → Matchmaker → Daily Planner</span></div></div></section><section className="features">{[[LogIn,'Auth','Вхід, реєстрація та вихід з акаунта.'],[Database,'Data layer','Обране, історія, бронювання, профіль.'],[Compass,'Більше напрямків',`${trips.length} travel-ідей з фільтрами.`],[ShieldCheck,'Firebase-ready','Можна підключити справжній бекенд через .env.']].map(([Icon,t,d])=><div className="feature" key={t}><Icon/><h3>{t}</h3><p>{d}</p></div>)}</section></main>
}

function Quiz({ answers, setAnswers, setPage, user, setUserData }) {
  const [step,setStep]=useState(0); const q=questions[step]
  async function choose(value){ const next={...answers,[q.key]:value}; setAnswers(next); if(step<questions.length-1) setStep(step+1); else { if(user){ await saveHistory(user,{type:'quiz',answers:next}); setUserData(await loadUserData(user)) } setPage('recommendations') } }
  return <main className="page narrow"><div className="progress"><span style={{width:`${((step+1)/questions.length)*100}%`}}/></div><motion.section className="panel" key={q.key} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}}><Badge>Питання {step+1} з {questions.length}</Badge><h2>{q.title}</h2><p>Відповіді формують профіль користувача для Matchmaker.</p><div className="options">{q.options.map(([v,l,Icon])=><button key={v} className={answers[q.key]===v?'selected':''} onClick={()=>choose(v)}><span><Icon/></span><b>{l}</b></button>)}</div></motion.section></main>
}

function Recommendations({ answers, favorites, onFavorite, setSelected, setPage }) {
  const [query,setQuery]=useState(''); const [budget,setBudget]=useState('all'); const [sort,setSort]=useState('score')
  const ranked=useMemo(()=>trips.map(t=>({...t,score:scoreTrip(t,answers)})).filter(t=>(budget==='all'||t.budget===budget) && `${t.title} ${t.country} ${t.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=> sort==='price'?a.baseCost-b.baseCost:sort==='days'?a.days-b.days:b.score-a.score),[answers,query,budget,sort])
  return <main className="page"><div className="section-head"><div><Badge><Sparkles size={14}/> AI Matchmaker</Badge><h2>Ідеї подорожей</h2><p>Фільтруй напрямки, відкривай деталі та зберігай в обране.</p></div></div><div className="filters"><label><Search size={16}/><input placeholder="Пошук: море, гори, Прага..." value={query} onChange={e=>setQuery(e.target.value)}/></label><select value={budget} onChange={e=>setBudget(e.target.value)}><option value="all">Будь-який бюджет</option><option value="low">До €400</option><option value="medium">€400–800</option><option value="high">€800+</option></select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="score">За Match Score</option><option value="price">За ціною</option><option value="days">За днями</option></select></div><div className="trip-grid">{ranked.map(trip=><article className="trip-card" key={trip.id}><div className="trip-img"><img src={trip.image}/><span>{trip.score}% Match</span><button onClick={()=>onFavorite(trip.id)}><Heart className={favorites.includes(trip.id)?'liked':''}/></button></div><div className="trip-body"><div className="tags">{trip.tags.slice(0,3).map(t=><Badge key={t}>{t}</Badge>)}</div><h3>{trip.title}</h3><p>{trip.description}</p><div className="meta"><span><Wallet/>€{trip.baseCost}</span><span><CalendarDays/>{trip.days} днів</span><span><MapPin/>{trip.country}</span></div><Button onClick={()=>{setSelected(trip);setPage('details')}}>Деталі</Button></div></article>)}</div></main>
}

function Details({ trip, favorites, onFavorite, setPage, user, setUserData }) {
  const selected=trip||trips[0]; const budgetRows=[['Квитки',.34],['Житло',.38],['Їжа',.16],['Активності',.12]]
  async function book(){ if(!user){ alert('Спочатку увійди в акаунт'); return } await saveBooking(user,{tripId:selected.id,title:selected.title,total:selected.baseCost}); setUserData(await loadUserData(user)); alert('Чернетку бронювання збережено в профілі') }
  return <main className="page"><button className="back" onClick={()=>setPage('recommendations')}>← До ідей</button><section className="details"><div className="details-hero"><img src={selected.image}/><div><Badge>{scoreTrip(selected, defaultAnswers)}% Match</Badge><h1>{selected.title}</h1><p>{selected.vibe}</p></div></div><div className="details-content"><div><h2>Опис</h2><p>{selected.description}</p><div className="info-grid">{[[Hotel,'Житло',selected.hotel],[Plane,'Транспорт',selected.flight],[Bell,'Сповіщення','погода, гейт, нагадування']].map(([Icon,t,d])=><div className="info" key={t}><Icon/><b>{t}</b><span>{d}</span></div>)}</div><h2>Daily Planner</h2><div className="timeline">{selected.itinerary.map(([time,title,note],i)=><div className="time-row" key={title}><span>{i+1}</span><div><b>{time} · {title}</b><p>{note}</p></div></div>)}</div></div><aside><div className="budget"><h3>Бюджет</h3>{budgetRows.map(([l,p])=><div className="budget-row" key={l}><span>{l}</span><b>€{Math.round(selected.baseCost*p)}</b></div>)}<div className="total"><span>Усього</span><b>€{selected.baseCost}</b></div></div><div className="packing"><h3><Luggage/> Речі</h3>{selected.packing.map(i=><label key={i}><input type="checkbox"/> {i}</label>)}</div><Button onClick={()=>onFavorite(selected.id)}><Heart className={favorites.includes(selected.id)?'liked-white':''}/> {favorites.includes(selected.id)?'В обраному':'Додати в обране'}</Button><Button variant="dark" onClick={book}><CreditCard/> Зберегти бронювання</Button></aside></div></section></main>
}

function Profile({ user, data, setPage, setSelected }) {
  const saved=trips.filter(t=>(data.favorites||[]).includes(t.id)); const bookings=data.bookings||[]; const history=data.history||[]
  if(!user) return <main className="page narrow"><section className="panel center"><User size={56}/><h2>Профіль доступний після входу</h2><p>Увійди, щоб бачити обране, історію тестів і бронювання.</p></section></main>
  return <main className="page"><div className="profile-grid"><section className="profile-card"><div className="profile-head"><span><User/></span><div><small>{user.provider}</small><h2>{user.name}</h2><p>{user.email}</p></div></div><div className="profile-stats">{[[Heart,saved.length,'обрані'],[BookOpen,history.length,'історія'],[CreditCard,bookings.length,'бронювання'],[Star,trips.length,'ідей']].map(([Icon,n,l])=><div key={l}><Icon/><b>{n}</b><span>{l}</span></div>)}</div><div className="cloud"><b>Backend data</b><p>Дані користувача зберігаються у {firebaseEnabled?'Firestore':'localStorage demo'}. Після підключення Firebase це буде справжній бекенд.</p></div></section><section className="profile-card"><div className="section-head compact"><h2>Обране</h2><Button onClick={()=>setPage('recommendations')}><PlusCircle/> Додати</Button></div><div className="saved-list">{(saved.length?saved:trips.slice(0,3)).map(t=><button key={t.id} onClick={()=>{setSelected(t);setPage('details')}}><img src={t.image}/><div><small>{t.country} · {t.days} днів · €{t.baseCost}</small><b>{t.title}</b><p>{t.description}</p></div></button>)}</div><h2 className="mt">Чернетки бронювань</h2>{bookings.length?bookings.map(b=><div className="booking" key={b.id}><b>{b.title}</b><span>€{b.total} · {b.status}</span></div>):<p className="muted">Поки немає бронювань.</p>}</section></div></main>
}

function BackendPage() {
  return <main className="page"><section className="panel"><Badge><Database size={14}/> Backend-ready</Badge><h2>Що вже підготовлено для бекенду</h2><div className="backend-grid">{[[LogIn,'Auth','Реєстрація, вхід, вихід. Якщо додати Firebase .env — працює з Firebase Auth.'],[Database,'Firestore schema','Колекція users: favorites, history, bookings, profile, updatedAt.'],[Heart,'Favorites','Збереження обраних подорожей для конкретного користувача.'],[BookOpen,'History','Історія проходження Smart Quiz.'],[CreditCard,'Booking drafts','Чернетки бронювань із сумою та статусом.'],[SlidersHorizontal,'Travel catalog','Каталог з фільтрами, пошуком, сортуванням і Match Score.']].map(([Icon,t,d])=><div className="backend-card" key={t}><Icon/><h3>{t}</h3><p>{d}</p></div>)}</div><div className="codebox"><b>Firestore structure</b><pre>{`users/{uid}
  name: string
  email: string
  favorites: string[]
  history: object[]
  bookings: object[]
  createdAt / updatedAt`}</pre></div></section></main>
}

function Chat() { const [open,setOpen]=useState(false); const [text,setText]=useState(''); const [msgs,setMsgs]=useState([{role:'bot',text:'Привіт! Я Travel Assistant. Можу порадити напрямок, пояснити бюджет або бекенд.'}]); function send(){ if(!text.trim())return; const t=text; setMsgs(m=>[...m,{role:'user',text:t}]); setText(''); setTimeout(()=>setMsgs(m=>[...m,{role:'bot',text:t.toLowerCase().includes('бек')?'У новій версії є auth, favorites, history, booking drafts і Firebase-ready service.':'Спробуй Smart Quiz або фільтри в розділі Ідеї — там уже більше напрямків.'}]),250)} return <><button className="chat-fab" onClick={()=>setOpen(true)}><MessageCircle/></button><AnimatePresence>{open&&<motion.div className="chat" initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} exit={{opacity:0,y:25}}><div className="chat-head"><b>Travel Assistant</b><button onClick={()=>setOpen(false)}><X size={18}/></button></div><div className="chat-body">{msgs.map((m,i)=><div key={i} className={m.role}>{m.text}</div>)}</div><div className="chat-input"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Напиши питання..."/><button onClick={send}><Send size={18}/></button></div></motion.div>}</AnimatePresence></> }

export default function App(){
  const [page,setPage]=useState('home'); const [answers,setAnswers]=useState(defaultAnswers); const [selected,setSelected]=useState(null); const [authOpen,setAuthOpen]=useState(false); const [user,setUser]=useState(null); const [data,setData]=useState({favorites:[],history:[],bookings:[]})
  useEffect(()=>subscribeToUser(async u=>{setUser(u); setData(await loadUserData(u))}),[])
  async function onFavorite(id){ if(!user){setAuthOpen(true);return} const should=!(data.favorites||[]).includes(id); await saveFavorite(user,id,should); setData(await loadUserData(user)) }
  async function onLogout(){ await logoutUser(); setUser(null); setData({favorites:[],history:[],bookings:[]}); setPage('home') }
  return <div><Header page={page} setPage={setPage} user={user} onAuth={()=>setAuthOpen(true)} onLogout={onLogout}/>{page==='home'&&<Home setPage={setPage} user={user}/>} {page==='quiz'&&<Quiz answers={answers} setAnswers={setAnswers} setPage={setPage} user={user} setUserData={setData}/>} {page==='recommendations'&&<Recommendations answers={answers} favorites={data.favorites||[]} onFavorite={onFavorite} setSelected={setSelected} setPage={setPage}/>} {page==='details'&&<Details trip={selected} favorites={data.favorites||[]} onFavorite={onFavorite} setPage={setPage} user={user} setUserData={setData}/>} {page==='profile'&&<Profile user={user} data={data} setPage={setPage} setSelected={setSelected}/>} {page==='backend'&&<BackendPage/>}<footer><b>MapMyMood v2</b><p>React + Vite · Auth · Favorites · History · Booking drafts · Firebase-ready backend · GitHub Pages base /Travel/</p></footer><AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onAuthSuccess={async u=>{setUser(u);setData(await loadUserData(u))}}/><Chat/></div>
}
