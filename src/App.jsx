import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Heart, Sparkles, Plane, CalendarDays, Wallet, User, MessageCircle,
  CheckCircle2, Clock, Hotel, Compass, ShieldCheck, Globe2, Sun, Mountain,
  Waves, Coffee, Menu, X, Send, Route, Luggage, Bell, Moon
} from 'lucide-react';

const trips = [
  {
    id: 1,
    title: 'Барселона: сонце, архітектура і тапас',
    country: 'Іспанія',
    vibe: 'Теплий міський відпочинок',
    climate: 'warm',
    activity: 'balanced',
    mood: 'inspiration',
    budget: 'medium',
    days: 5,
    baseCost: 720,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    tags: ['архітектура', 'море', 'їжа', 'прогулянки'],
    hotel: 'Boutique Hotel Gothic Quarter',
    flight: 'Wizz Air / Ryanair, 2 пересадки або прямий сезонний рейс',
    description: 'Ідеальна подорож для тих, хто хоче поєднати теплий клімат, красиву архітектуру, гастрономію та легкий ритм міста.',
    itinerary: [
      ['09:00', 'Сніданок біля La Rambla', 'Кава, круасан і перший огляд центру'],
      ['11:00', 'Sagrada Família', 'Візит за попереднім тайм-слотом'],
      ['14:00', 'Тапас-ланч у Born', 'Пішки 18 хвилин від попередньої точки'],
      ['17:00', 'Пляж Barceloneta', 'Вільне вікно для відпочинку'],
      ['20:00', 'Bunkers del Carmel', 'Панорама міста на заході сонця']
    ],
    packing: ['сонцезахисний крем', 'зручні кросівки', 'легка куртка', 'пляшка для води']
  },
  {
    id: 2,
    title: 'Закопане: гори, терми і slow travel',
    country: 'Польща',
    vibe: 'Затишний гірський відпочинок',
    climate: 'cold',
    activity: 'active',
    mood: 'reset',
    budget: 'low',
    days: 4,
    baseCost: 380,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    tags: ['гори', 'терми', 'бюджетно', 'природа'],
    hotel: 'Wooden Chalet near Krupówki',
    flight: 'Автобус/поїзд до Кракова + трансфер',
    description: 'Маршрут для відновлення енергії: свіже повітря, легкі треки, термальні басейни та дерев’яна архітектура.',
    itinerary: [
      ['08:30', 'Сніданок у шале', 'План дня та перевірка погоди'],
      ['10:00', 'Підйом на Губалувку', 'Панорамна прогулянка'],
      ['13:00', 'Обід у локальній корчмі', 'Спробувати осципек'],
      ['16:00', 'Термальні басейни', 'Відпочинок після активного дня'],
      ['19:30', 'Krupówki', 'Вечірня прогулянка та сувеніри']
    ],
    packing: ['термобілизна', 'трекінгове взуття', 'купальник', 'дощовик']
  },
  {
    id: 3,
    title: 'Прага: романтика, історія і кав’ярні',
    country: 'Чехія',
    vibe: 'Комфортна культурна подорож',
    climate: 'mild',
    activity: 'calm',
    mood: 'romance',
    budget: 'medium',
    days: 3,
    baseCost: 460,
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80',
    tags: ['романтика', 'історія', 'кава', 'місто'],
    hotel: 'Old Town Design Apartments',
    flight: 'Потяг/автобус або авіарейс до Праги',
    description: 'Підійде парам і мандрівникам, які хочуть красивий, спокійний та добре організований city break без перевантаження.',
    itinerary: [
      ['09:30', 'Кав’ярня біля Староміської площі', 'Повільний старт дня'],
      ['11:00', 'Карлів міст', 'Фото та прогулянка'],
      ['13:30', 'Празький град', 'Культурний блок'],
      ['16:30', 'Вільний час', 'Сувеніри або відпочинок'],
      ['19:00', 'Вечеря з видом на Влтаву', 'Романтичний фінал дня']
    ],
    packing: ['парасоля', 'зручне взуття', 'павербанк', 'святковий образ']
  },
  {
    id: 4,
    title: 'Крит: море, тиша і гастрономія',
    country: 'Греція',
    vibe: 'Релакс біля моря',
    climate: 'warm',
    activity: 'calm',
    mood: 'relax',
    budget: 'high',
    days: 7,
    baseCost: 980,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    tags: ['море', 'релакс', 'острів', 'кухня'],
    hotel: 'Seaside Eco Resort Crete',
    flight: 'Авіарейс до Іракліона + трансфер',
    description: 'Для тих, кому потрібне перезавантаження без зайвої логістики: море, невеликі міста, локальна кухня і спокійний графік.',
    itinerary: [
      ['09:00', 'Сніданок у готелі', 'Легкий старт без поспіху'],
      ['10:30', 'Пляж Elafonissi', 'Відпочинок і купання'],
      ['14:00', 'Таверна біля моря', 'Обід з морепродуктами'],
      ['17:00', 'Старе місто Ханья', 'Прогулянка вузькими вулицями'],
      ['20:00', 'Вечірній променад', 'Фото та десерт']
    ],
    packing: ['купальник', 'капелюх', 'сонцезахисні окуляри', 'легка сорочка']
  }
];

const questions = [
  { key: 'mood', title: 'Який у тебе настрій для подорожі?', subtitle: 'MapMyMood починає з емоцій, а вже потім переходить до бюджету й дат.', options: [
    ['relax', 'Хочу спокою', Waves, 'море, тиша, slow travel'],
    ['inspiration', 'Хочу натхнення', Sun, 'міста, культура, нові ідеї'],
    ['reset', 'Потрібне перезавантаження', Mountain, 'природа, гори, свіже повітря'],
    ['romance', 'Романтичний вайб', Coffee, 'атмосфера, вечері, прогулянки']
  ]},
  { key: 'budget', title: 'Який бюджет на одну людину?', subtitle: 'Система врахує фінансові обмеження та покаже прозорий кошторис.', options: [
    ['low', 'До €400', Wallet, 'економно та практично'],
    ['medium', '€400–800', Wallet, 'баланс ціни й комфорту'],
    ['high', '€800+', Wallet, 'більше комфорту']
  ]},
  { key: 'activity', title: 'Який темп тобі підходить?', subtitle: 'Daily Planner залишить вільні вікна, щоб маршрут не виснажував.', options: [
    ['calm', 'Спокійний', Clock, 'менше переїздів'],
    ['balanced', 'Збалансований', Compass, 'активності + відпочинок'],
    ['active', 'Активний', Route, 'трекінг, екскурсії, рух']
  ]},
  { key: 'climate', title: 'Який клімат обрати?', subtitle: 'Алгоритм ранжує напрямки за відповідністю твоєму профілю.', options: [
    ['warm', 'Теплий', Sun, 'сонце, море, легкий одяг'],
    ['mild', 'Помірний', Globe2, 'міста, прогулянки'],
    ['cold', 'Прохолодний', Mountain, 'гори, терми, затишок']
  ]}
];

function scoreTrip(trip, answers) {
  let score = 48;
  if (answers.mood === trip.mood) score += 18;
  if (answers.budget === trip.budget) score += 14;
  if (answers.activity === trip.activity) score += 12;
  if (answers.climate === trip.climate) score += 12;
  if (answers.budget === 'high' && trip.budget === 'medium') score += 5;
  if (answers.activity === 'balanced') score += 4;
  return Math.min(98, score);
}

function Button({ children, onClick, variant = 'primary', className = '' }) {
  return <button onClick={onClick} className={`btn ${variant} ${className}`}>{children}</button>;
}
function Badge({ children }) { return <span className="badge">{children}</span>; }

function Header({ current, setCurrent, menu, setMenu, user }) {
  const links = [['home','Головна'],['quiz','Smart Quiz'],['recommendations','Рекомендації'],['profile','Профіль']];
  return <header className="header">
    <div className="header-inner">
      <button className="logo" onClick={() => setCurrent('home')}><span className="logo-icon"><MapPin /></span><span><b>MapMyMood</b><small>Твій настрій — твоя подорож</small></span></button>
      <nav className="nav">{links.map(([k,l]) => <button key={k} onClick={() => setCurrent(k)} className={current===k?'active':''}>{l}</button>)}</nav>
      <div className="header-actions"><span className="user-pill"><User size={16}/>{user.name}</span><Button onClick={() => setCurrent('quiz')}>Почати тест</Button></div>
      <button className="menu-btn" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </div>
    <AnimatePresence>{menu && <motion.div className="mobile-menu" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>{links.map(([k,l]) => <button key={k} onClick={() => {setCurrent(k);setMenu(false)}}>{l}</button>)}</motion.div>}</AnimatePresence>
  </header>;
}

function Home({ setCurrent }) {
  return <main>
    <section className="hero">
      <div className="hero-text">
        <Badge><Sparkles size={14}/> AI Smart Travel Planner</Badge>
        <h1>Подорож, яка підлаштовується під твій настрій, бюджет і стиль.</h1>
        <p>MapMyMood замінює годинний пошук готовим рішенням: пройди короткий Smart Quiz, отримай персональні напрямки, бюджет, житло, активності та маршрут по днях.</p>
        <div className="hero-buttons"><Button onClick={() => setCurrent('quiz')}><Sparkles size={18}/> Пройти Smart Quiz</Button><Button variant="ghost" onClick={() => setCurrent('recommendations')}><Compass size={18}/> Переглянути демо</Button></div>
        <div className="stats">{[['≤ 2 сек','генерація результатів'],['85%+','ціль точності підбору'],['3','готові концепції поїздки']].map(([n,l]) => <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>)}</div>
      </div>
      <div className="hero-card"><img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"/><div className="floating-card"><b>Крит: море, тиша і гастрономія</b><span>93% Match · €980 · 7 днів</span></div></div>
    </section>
    <section className="features">{[[Sparkles,'Smart Quiz','Візуальний тест step-by-step: настрій, бюджет, клімат, темп.'],[Compass,'AI Matchmaker','Алгоритм рахує профіль мандрівника і Match Score.'],[CalendarDays,'Daily Planner','План по днях із таймінгом, активностями та вільними вікнами.'],[MessageCircle,'Travel Assistant','Плаваючий чат-помічник на кожному екрані.']].map(([Icon,t,d]) => <div className="feature" key={t}><Icon/><h3>{t}</h3><p>{d}</p></div>)}</section>
  </main>;
}

function Quiz({ answers, setAnswers, setCurrent }) {
  const [step, setStep] = useState(0);
  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;
  const choose = (value) => {
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    setTimeout(() => step < questions.length - 1 ? setStep(step + 1) : setCurrent('recommendations'), 180);
  };
  return <main className="page narrow"><div className="progress"><motion.div animate={{width:`${progress}%`}} /></div>
    <AnimatePresence mode="wait"><motion.section key={q.key} className="quiz-card" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
      <Badge>Питання {step+1} з {questions.length}</Badge><h2>{q.title}</h2><p>{q.subtitle}</p>
      <div className="option-grid">{q.options.map(([value,label,Icon,hint]) => <button className={`option ${answers[q.key]===value?'selected':''}`} key={value} onClick={() => choose(value)}><span><Icon/></span><b>{label}</b><small>{hint}</small></button>)}</div>
    </motion.section></AnimatePresence>
  </main>;
}

function Recommendations({ answers, favorites, toggleFavorite, setSelectedTrip, setCurrent }) {
  const ranked = useMemo(() => trips.map(t => ({...t, score: scoreTrip(t, answers)})).sort((a,b)=>b.score-a.score), [answers]);
  return <main className="page"><div className="section-head"><div><Badge><Sparkles size={14}/> AI Matchmaker</Badge><h2>Твої персональні рекомендації</h2><p>Результати ранжуються за відповідністю профілю: настрій, бюджет, темп і клімат.</p></div><Button variant="ghost" onClick={() => setCurrent('quiz')}>Пройти тест ще раз</Button></div>
    <div className="trip-grid">{ranked.slice(0,3).map(trip => <article className="trip-card" key={trip.id}><div className="trip-img"><img src={trip.image}/><span>{trip.score}% Match</span><button onClick={() => toggleFavorite(trip.id)}><Heart className={favorites.includes(trip.id)?'liked':''}/></button></div><div className="trip-body"><div className="tags">{trip.tags.slice(0,3).map(t=><Badge key={t}>{t}</Badge>)}</div><h3>{trip.title}</h3><p>{trip.description}</p><div className="trip-meta"><span><Wallet/>€{trip.baseCost}</span><span><CalendarDays/>{trip.days} днів</span><span><MapPin/>{trip.country}</span></div><Button className="full" onClick={() => {setSelectedTrip(trip);setCurrent('details')}}>Переглянути маршрут</Button></div></article>)}</div>
  </main>;
}

function TripDetails({ trip, favorites, toggleFavorite, setCurrent }) {
  const selected = trip || trips[0];
  const rows = [['Квитки / трансфер', .34], ['Житло', .38], ['Харчування', .16], ['Активності', .12]];
  return <main className="page"><button className="back" onClick={() => setCurrent('recommendations')}>← Назад до рекомендацій</button>
    <section className="details"><div className="details-hero"><img src={selected.image}/><div><Badge>{selected.score || 93}% Match Score</Badge><h1>{selected.title}</h1><p>{selected.vibe}</p></div></div>
      <div className="details-content"><div><h2>Опис подорожі</h2><p>{selected.description}</p><div className="info-grid">{[[Hotel,'Житло',selected.hotel],[Plane,'Квитки',selected.flight],[Bell,'Сповіщення','погода, зміни рейсу, нагадування']].map(([Icon,t,d]) => <div className="info" key={t}><Icon/><b>{t}</b><span>{d}</span></div>)}</div><h2>Daily Planner</h2><div className="timeline">{selected.itinerary.map(([time,title,note],i)=><div className="time-row" key={title}><span>{i+1}</span><div><b>{time} · {title}</b><p>{note}</p></div></div>)}</div></div>
        <aside><div className="budget"><h3>Бюджет подорожі</h3>{rows.map(([l,k]) => <div className="budget-row" key={l}><span>{l}</span><b>€{Math.round(selected.baseCost*k)}</b></div>)}<div className="total"><span>Усього</span><b>€{selected.baseCost}</b></div></div><div className="packing"><h3><Luggage/> Список речей</h3>{selected.packing.map(item=><label key={item}><input type="checkbox"/> {item}</label>)}</div><Button className="full" onClick={() => toggleFavorite(selected.id)}><Heart className={favorites.includes(selected.id)?'liked-white':''}/> {favorites.includes(selected.id)?'Збережено':'Додати в обране'}</Button><Button variant="dark" className="full"><Plane/> Імітувати бронювання</Button></aside>
      </div>
    </section>
  </main>;
}

function Profile({ favorites, setSelectedTrip, setCurrent }) {
  const saved = trips.filter(t => favorites.includes(t.id));
  return <main className="page"><div className="profile-grid"><section className="profile-card"><div className="profile-head"><span><User/></span><div><small>Demo account</small><h2>Марія Димінська</h2><p>marusadiminska@gmail.com</p></div></div><div className="profile-stats">{[[CheckCircle2,'4','пройдені тести'],[Heart,String(favorites.length),'обрані подорожі'],[ShieldCheck,'100%','демо-захист даних'],[Moon,'Dark','підтримка теми']].map(([Icon,n,l])=><div key={l}><Icon/><b>{n}</b><span>{l}</span></div>)}</div><div className="cloud"><b>Хмара документів</b><p>Паспорт, страховка, бронювання готелю та квитки можуть зберігатися в особистому кабінеті.</p></div></section><section className="profile-card"><div className="section-head compact"><div><h2>Історія та обране</h2><p>Збережені маршрути доступні для повторного перегляду.</p></div><Button onClick={() => setCurrent('quiz')}>Новий тест</Button></div><div className="saved-list">{(saved.length?saved:trips.slice(0,2)).map(trip=><button key={trip.id} onClick={() => {setSelectedTrip(trip);setCurrent('details')}}><img src={trip.image}/><span><b>{trip.title}</b><small>{trip.country} · {trip.days} днів · €{trip.baseCost}</small><p>{trip.description}</p></span></button>)}</div></section></div></main>;
}

function AssistantChat({ open, setOpen }) {
  const [messages, setMessages] = useState([{role:'bot', text:'Привіт! Я Travel Assistant. Можу пояснити бюджет, маршрут, список речей або допомогти обрати напрямок.'}]);
  const [text, setText] = useState('');
  const send = () => {
    if (!text.trim()) return;
    const userText = text.trim(); setMessages(m => [...m,{role:'user',text:userText}]); setText('');
    setTimeout(() => setMessages(m => [...m,{role:'bot',text: userText.toLowerCase().includes('бюдж') ? 'Бюджет розбивається на квитки, житло, харчування й активності. У Trip Details є прозорий кошторис.' : userText.toLowerCase().includes('реч') ? 'Список речей формується залежно від клімату й типу активності.' : 'Раджу пройти Smart Quiz: алгоритм врахує настрій, бюджет, клімат і темп, а потім покаже найкращі напрямки з Match Score.'}]), 300);
  };
  return <><button className="chat-fab" onClick={() => setOpen(true)}><MessageCircle/></button><AnimatePresence>{open && <motion.div className="chat" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}}><div className="chat-head"><b>Travel Assistant</b><button onClick={()=>setOpen(false)}><X size={18}/></button></div><div className="chat-body">{messages.map((m,i)=><div key={i} className={m.role}>{m.text}</div>)}</div><div className="chat-input"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Напиши питання..."/><button onClick={send}><Send size={18}/></button></div></motion.div>}</AnimatePresence></>;
}

export default function App() {
  const [current, setCurrent] = useState('home');
  const [menu, setMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [answers, setAnswers] = useState({ mood:'relax', budget:'medium', activity:'balanced', climate:'warm' });
  const [favorites, setFavorites] = useState([4]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const toggleFavorite = id => setFavorites(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  return <div className="app"><Header current={current} setCurrent={setCurrent} menu={menu} setMenu={setMenu} user={{name:'Марія'}} />{current==='home'&&<Home setCurrent={setCurrent}/>} {current==='quiz'&&<Quiz answers={answers} setAnswers={setAnswers} setCurrent={setCurrent}/>} {current==='recommendations'&&<Recommendations answers={answers} favorites={favorites} toggleFavorite={toggleFavorite} setSelectedTrip={setSelectedTrip} setCurrent={setCurrent}/>} {current==='details'&&<TripDetails trip={selectedTrip} favorites={favorites} toggleFavorite={toggleFavorite} setCurrent={setCurrent}/>} {current==='profile'&&<Profile favorites={favorites} setSelectedTrip={setSelectedTrip} setCurrent={setCurrent}/>}<footer><b>MapMyMood · MVP-прототип</b><p>React SPA · демо-логіка Matchmaker · адаптивний mobile-first UI · основа для Firebase, Node.js та Google Maps API.</p></footer><AssistantChat open={chatOpen} setOpen={setChatOpen}/></div>;
}
