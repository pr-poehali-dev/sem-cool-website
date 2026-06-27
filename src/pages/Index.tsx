import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AUTH_URL = "https://functions.poehali.dev/3a7597af-1b8b-4bb0-becc-e8e7b31ec472";

const STATS = [
  { num: '120+', label: 'специалистов в команде' },
  { num: '8', label: 'лет на рынке' },
  { num: '40+', label: 'запущенных продуктов' },
  { num: '12', label: 'городов присутствия' },
];

const VALUES = [
  { icon: 'Rocket', title: 'Скорость', text: 'Запускаем гипотезы за дни, а не месяцы. Меньше совещаний — больше дела.' },
  { icon: 'Sparkles', title: 'Качество', text: 'Каждая деталь важна. Мы гордимся тем, что отдаём в продакшн.' },
  { icon: 'Users', title: 'Команда', text: 'Горизонтальная структура, доверие и поддержка на каждом этапе.' },
  { icon: 'TrendingUp', title: 'Рост', text: 'Бюджет на обучение, менторство и реальные карьерные треки.' },
];

const GAMES = [
  { title: 'Cyberpunk 2077', genre: 'RPG', price: '1 299 ₽', badge: 'Хит', color: 'from-yellow-500 to-orange-500' },
  { title: 'Elden Ring', genre: 'Action RPG', price: '2 499 ₽', badge: 'Топ', color: 'from-purple-500 to-pink-500' },
  { title: 'Hollow Knight', genre: 'Метроидвания', price: '399 ₽', badge: 'Инди', color: 'from-blue-500 to-cyan-500' },
  { title: 'GTA VI', genre: 'Open World', price: '4 999 ₽', badge: 'Новинка', color: 'from-green-500 to-emerald-500' },
];

type AuthUser = { username: string; shopEnabled: boolean } | null;

export default function Index() {
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(false);

  const [regName, setRegName] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regErr, setRegErr] = useState('');

  const [loginName, setLoginName] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  const openModal = () => { setModal(true); setTab('register'); setRegErr(''); setLoginErr(''); };
  const closeModal = () => setModal(false);

  const handleRegister = async () => {
    if (!regName.trim()) return setRegErr('Введите имя');
    if (regPass.length < 4) return setRegErr('Пароль минимум 4 символа');
    setLoading(true);
    setRegErr('');
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', username: regName, password: regPass }),
      });
      const data = await res.json();
      if (!res.ok) return setRegErr(data.error || 'Ошибка регистрации');
      setUser({ username: data.username, shopEnabled: data.shop_enabled });
      closeModal();
    } catch {
      setRegErr('Ошибка соединения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginName.trim()) return setLoginErr('Введите имя');
    if (!loginPass) return setLoginErr('Введите пароль');
    setLoading(true);
    setLoginErr('');
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username: loginName, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) return setLoginErr(data.error || 'Ошибка входа');
      setUser({ username: data.username, shopEnabled: data.shop_enabled });
      closeModal();
    } catch {
      setLoginErr('Ошибка соединения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden grain">

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 glass">
        <nav className="container flex items-center justify-between h-16">
          <a href="#" className="font-display font-900 text-2xl tracking-tight">
            S<span className="text-gradient">e</span>m
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">О компании</a>
            {user?.shopEnabled && (
              <a href="#shop" className="hover:text-foreground transition-colors text-accent font-medium">
                Магазин игр
              </a>
            )}
            <a href="#join" className="hover:text-foreground transition-colors">Стать частью</a>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden md:block">
                <span className="text-primary font-medium">{user.username}</span>
              </span>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setUser(null)}>
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          ) : (
            <Button onClick={openModal} className="rounded-full bg-primary hover:bg-primary/90 font-medium">
              <Icon name="LogIn" size={16} className="mr-1.5" />
              Аккаунт
            </Button>
          )}
        </nav>
      </header>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative glass rounded-2xl w-full max-w-md p-8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <Icon name="X" size={20} />
            </button>

            <div className="flex rounded-xl bg-secondary/50 p-1 mb-6">
              <button
                onClick={() => { setTab('register'); setRegErr(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'register' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Регистрация
              </button>
              <button
                onClick={() => { setTab('login'); setLoginErr(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'login' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Вход
              </button>
            </div>

            {tab === 'register' ? (
              <div className="space-y-4">
                <h3 className="font-display font-600 text-xl mb-2">Создать аккаунт</h3>
                <div className="space-y-2">
                  <Label>Имя пользователя</Label>
                  <Input
                    placeholder="Александра"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    className="h-11 bg-secondary/50 border-border rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Пароль</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                    className="h-11 bg-secondary/50 border-border rounded-xl"
                  />
                </div>
                {regErr && <p className="text-sm text-destructive">{regErr}</p>}
                <Button onClick={handleRegister} disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-medium">
                  {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <>Зарегистрироваться <Icon name="Sparkles" size={16} className="ml-1.5" /></>}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Уже есть аккаунт?{' '}
                  <button onClick={() => setTab('login')} className="text-primary hover:underline">Войти</button>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-display font-600 text-xl mb-2">Добро пожаловать</h3>
                <div className="space-y-2">
                  <Label>Имя пользователя</Label>
                  <Input
                    placeholder="DezeYT"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="h-11 bg-secondary/50 border-border rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Пароль</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="h-11 bg-secondary/50 border-border rounded-xl"
                  />
                </div>
                {loginErr && <p className="text-sm text-destructive">{loginErr}</p>}
                <Button onClick={handleLogin} disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-medium">
                  {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <>Войти <Icon name="LogIn" size={16} className="ml-1.5" /></>}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Нет аккаунта?{' '}
                  <button onClick={() => setTab('register')} className="text-primary hover:underline">Зарегистрироваться</button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative pt-40 pb-28">
        <div className="absolute top-20 -left-20 w-[28rem] h-[28rem] rounded-full bg-primary/30 blur-[120px] animate-float" />
        <div className="absolute top-40 right-0 w-[24rem] h-[24rem] rounded-full bg-accent/30 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -top-10 left-1/3 w-[20rem] h-[20rem] rounded-full bg-amber-500/20 blur-[120px] animate-float" style={{ animationDelay: '4s' }} />
        <div className="container relative text-center max-w-4xl">
          <h1 className="font-display font-900 text-5xl md:text-7xl leading-[1.05] mb-6 animate-fade-in">
            Создаём <span className="text-gradient">будущее</span><br />продуктов вместе
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Sem — команда инженеров, дизайнеров и мечтателей, которые строят технологии, меняющие правила игры.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-border bg-transparent hover:bg-secondary font-medium" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              О компании
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container -mt-4 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="font-display font-700 text-3xl md:text-4xl text-gradient">{s.num}</div>
              <div className="text-sm text-muted-foreground mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="container py-24">
        <div className="max-w-2xl mb-14">
          <p className="text-accent font-medium mb-3 tracking-wide uppercase text-sm">О компании</p>
          <h2 className="font-display font-700 text-4xl md:text-5xl leading-tight mb-5">
            Не просто работа.<br />Место, где растут.
          </h2>
          <p className="text-muted-foreground text-lg">
            Мы верим, что великие продукты создают люди, которым доверяют. Поэтому строим культуру свободы, ответственности и постоянного развития.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v, i) => (
            <div key={i} className="group glass rounded-2xl p-7 hover:border-primary/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Icon name={v.icon} size={22} className="text-white" />
              </div>
              <h3 className="font-display font-600 text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP — только для аккаунтов с shop_enabled */}
      {user?.shopEnabled && (
        <section id="shop" className="container py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-accent font-medium mb-3 tracking-wide uppercase text-sm">Магазин игр</p>
            <h2 className="font-display font-700 text-4xl md:text-5xl mb-4">
              Игровой <span className="text-gradient">магазин</span>
            </h2>
            <p className="text-muted-foreground text-lg">Эксклюзивный раздел для команды Sem.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GAMES.map((g, i) => (
              <div key={i} className="group glass rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-1">
                <div className={`h-36 bg-gradient-to-br ${g.color} flex items-center justify-center relative`}>
                  <Icon name="Gamepad2" size={48} className="text-white/80" />
                  <span className="absolute top-3 right-3 text-xs font-medium bg-black/30 text-white rounded-full px-2.5 py-1">
                    {g.badge}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">{g.genre}</p>
                  <h3 className="font-display font-600 text-base mb-3">{g.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{g.price}</span>
                    <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90 text-xs h-8">
                      Купить
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* JOIN */}
      <section id="join" className="container py-24">
        <div className="relative glass rounded-3xl overflow-hidden p-8 md:p-14 glow">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/30 blur-[100px]" />
          <div className="grid lg:grid-cols-2 gap-12 relative">
            <div>
              <p className="text-accent font-medium mb-3 tracking-wide uppercase text-sm">Стать частью команды</p>
              <h2 className="font-display font-700 text-4xl md:text-5xl leading-tight mb-5">
                Готов писать историю с нами?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Создай аккаунт — и получи доступ к закрытым вакансиям, прямому контакту с командой и индивидуальному карьерному треку.
              </p>
              <ul className="space-y-3">
                {['Прозрачный процесс найма', 'Отклик в один клик', 'Обратная связь по каждому этапу'].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Icon name="Check" size={14} className="text-white" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              {user ? (
                <div className="text-center glass rounded-2xl p-8 w-full">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-display font-600 text-xl mb-2">Вы уже в команде!</h3>
                  <p className="text-muted-foreground text-sm">Добро пожаловать, <span className="text-primary font-medium">{user.username}</span></p>
                </div>
              ) : (
                <div className="glass rounded-2xl p-8 w-full text-center">
                  <Icon name="UserPlus" size={48} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-display font-600 text-xl mb-4">Присоединяйся к Sem</h3>
                  <Button onClick={openModal} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-medium">
                    Создать аккаунт
                    <Icon name="Sparkles" size={16} className="ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border mt-12">
        <div className="container py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display font-900 text-2xl">
            S<span className="text-gradient">e</span>m
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Sem. Создаём будущее вместе.</p>
          <div className="flex gap-3">
            {['Send', 'Github', 'Linkedin'].map((s) => (
              <a key={s} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-primary/40 transition-colors">
                <Icon name={s} size={18} className="text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
