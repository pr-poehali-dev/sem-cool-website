import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AUTH_URL = "https://functions.poehali.dev/3a7597af-1b8b-4bb0-becc-e8e7b31ec472";
const ADMIN_URL = "https://functions.poehali.dev/26858908-34bb-4872-a5d2-2f5d3343f20a";

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
type Page = 'home' | 'account';
type AccountTab = 'profile' | 'users' | 'site';

interface UserRow {
  id: number;
  username: string;
  shop_enabled: boolean;
  created_at: string;
}

export default function Index() {
  const [authModal, setAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const [accountTab, setAccountTab] = useState<AccountTab>('profile');

  const [regName, setRegName] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regErr, setRegErr] = useState('');

  const [loginName, setLoginName] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  // Admin users list
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersErr, setUsersErr] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const isAdmin = user?.username === 'DezeYT';

  const openAuthModal = () => { setAuthModal(true); setAuthTab('register'); setRegErr(''); setLoginErr(''); };
  const closeAuthModal = () => setAuthModal(false);

  const adminFetch = useCallback(async (body: object) => {
    return fetch(ADMIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-User': 'DezeYT' },
      body: JSON.stringify(body),
    });
  }, []);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersErr('');
    try {
      const res = await adminFetch({ action: 'list' });
      const data = await res.json();
      if (!res.ok) return setUsersErr(data.error || 'Ошибка загрузки');
      setUsers(data.users);
    } catch {
      setUsersErr('Ошибка соединения');
    } finally {
      setUsersLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    if (accountTab === 'users' && isAdmin) loadUsers();
  }, [accountTab, isAdmin, loadUsers]);

  const toggleShop = async (uid: number) => {
    setActionLoading(uid);
    try {
      const res = await adminFetch({ action: 'toggle_shop', user_id: uid });
      const data = await res.json();
      if (!res.ok) return;
      setUsers((prev) => prev.map((u) => u.id === uid ? { ...u, shop_enabled: data.shop_enabled } : u));
    } finally { setActionLoading(null); }
  };

  const deleteUser = async (uid: number, username: string) => {
    if (!confirm(`Удалить аккаунт "${username}"?`)) return;
    setActionLoading(uid);
    try {
      const res = await adminFetch({ action: 'delete', user_id: uid, username });
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== uid));
    } finally { setActionLoading(null); }
  };

  const handleRegister = async () => {
    if (!regName.trim()) return setRegErr('Введите имя');
    if (regPass.length < 4) return setRegErr('Пароль минимум 4 символа');
    setLoading(true); setRegErr('');
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', username: regName, password: regPass }),
      });
      const data = await res.json();
      if (!res.ok) return setRegErr(data.error || 'Ошибка регистрации');
      setUser({ username: data.username, shopEnabled: data.shop_enabled });
      setPage('account'); setAccountTab('profile');
      closeAuthModal();
    } catch { setRegErr('Ошибка соединения. Попробуйте позже.'); }
    finally { setLoading(false); }
  };

  const handleLogin = async () => {
    if (!loginName.trim()) return setLoginErr('Введите имя');
    if (!loginPass) return setLoginErr('Введите пароль');
    setLoading(true); setLoginErr('');
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username: loginName, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) return setLoginErr(data.error || 'Ошибка входа');
      setUser({ username: data.username, shopEnabled: data.shop_enabled });
      setPage('account'); setAccountTab('profile');
      closeAuthModal();
    } catch { setLoginErr('Ошибка соединения. Попробуйте позже.'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { setUser(null); setPage('home'); };

  // ──────────────────────────── ACCOUNT PAGE ────────────────────────────
  if (page === 'account' && user) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden grain">
        <header className="fixed top-0 inset-x-0 z-50 glass">
          <nav className="container flex items-center justify-between h-16">
            <button onClick={() => setPage('home')} className="font-display font-900 text-2xl tracking-tight">
              S<span className="text-gradient">e</span>m
            </button>
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <button onClick={() => setPage('home')} className="hover:text-foreground transition-colors">На главную</button>
              {user.shopEnabled && (
                <button onClick={() => { setPage('home'); setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                  className="hover:text-foreground transition-colors text-accent font-medium">
                  Магазин игр
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm hidden md:block text-primary font-medium">{user.username}</span>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={handleLogout}>
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </nav>
        </header>

        <div className="container pt-28 pb-16 max-w-4xl">
          {/* User header */}
          <div className="flex items-center gap-5 mb-8 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-display font-700 text-2xl">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-display font-700 text-2xl">{user.username}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {isAdmin ? 'Владелец · Администратор' : 'Участник команды Sem'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <button onClick={() => setAccountTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${accountTab === 'profile' ? 'bg-primary text-white' : 'glass text-muted-foreground hover:text-foreground'}`}>
              <Icon name="User" size={15} /> Профиль
            </button>
            {isAdmin && (
              <>
                <button onClick={() => setAccountTab('users')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${accountTab === 'users' ? 'bg-accent text-white' : 'glass text-muted-foreground hover:text-foreground'}`}>
                  <Icon name="Users" size={15} /> Пользователи
                </button>
                <button onClick={() => setAccountTab('site')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${accountTab === 'site' ? 'bg-accent text-white' : 'glass text-muted-foreground hover:text-foreground'}`}>
                  <Icon name="Settings2" size={15} /> Управление сайтом
                </button>
              </>
            )}
          </div>

          {/* TAB: PROFILE */}
          {accountTab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">Информация</h3>
                <div className="space-y-1">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground text-sm">Имя пользователя</span>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground text-sm">Роль</span>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${isAdmin ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                      {isAdmin ? 'Администратор' : 'Участник'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground text-sm">Магазин игр</span>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${user.shopEnabled ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                      {user.shopEnabled ? 'Включён' : 'Недоступен'}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-xl border-border hover:bg-secondary h-11" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" /> Выйти из аккаунта
              </Button>
            </div>
          )}

          {/* TAB: USERS */}
          {accountTab === 'users' && isAdmin && (
            <div className="animate-fade-in">
              <div className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Все аккаунты
                  </h3>
                  <Button size="sm" variant="ghost" onClick={loadUsers} className="rounded-lg h-8 text-xs">
                    <Icon name="RefreshCw" size={14} className="mr-1.5" /> Обновить
                  </Button>
                </div>

                {usersLoading && (
                  <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                    <Icon name="Loader2" size={20} className="animate-spin" /> Загрузка...
                  </div>
                )}

                {usersErr && (
                  <div className="p-6 text-center text-destructive text-sm">{usersErr}</div>
                )}

                {!usersLoading && !usersErr && (
                  <div className="divide-y divide-border">
                    {users.length === 0 && (
                      <div className="py-12 text-center text-muted-foreground text-sm">Пользователей нет</div>
                    )}
                    {users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-sm font-bold">
                            {u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm flex items-center gap-2">
                              {u.username}
                              {u.username === 'DezeYT' && (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Владелец</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{u.created_at}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Toggle shop */}
                          <button
                            onClick={() => toggleShop(u.id)}
                            disabled={actionLoading === u.id}
                            title={u.shop_enabled ? 'Отключить магазин' : 'Включить магазин'}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${u.shop_enabled ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-muted text-muted-foreground hover:bg-secondary'}`}
                          >
                            {actionLoading === u.id
                              ? <Icon name="Loader2" size={13} className="animate-spin" />
                              : <Icon name={u.shop_enabled ? 'ShoppingBag' : 'ShoppingBag'} size={13} />
                            }
                            {u.shop_enabled ? 'Магазин вкл' : 'Магазин выкл'}
                          </button>
                          {/* Delete */}
                          {u.username !== 'DezeYT' && (
                            <button
                              onClick={() => deleteUser(u.id, u.username)}
                              disabled={actionLoading === u.id}
                              title="Удалить аккаунт"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                            >
                              <Icon name="Trash2" size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SITE */}
          {accountTab === 'site' && isAdmin && (
            <div className="space-y-4 animate-fade-in">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-5">Управление сайтом</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: 'LayoutDashboard', label: 'Главная страница', desc: 'Редактировать hero и статистику' },
                    { icon: 'Gamepad2', label: 'Магазин игр', desc: 'Добавить / удалить игры' },
                    { icon: 'Users', label: 'Пользователи', desc: 'Управление аккаунтами', action: () => setAccountTab('users') },
                    { icon: 'ToggleRight', label: 'Доступы', desc: 'Включить функции для аккаунтов', action: () => setAccountTab('users') },
                  ].map((item) => (
                    <div key={item.label} onClick={item.action}
                      className="group glass rounded-xl p-4 hover:border-accent/40 transition-all cursor-pointer hover:-translate-y-0.5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shrink-0">
                          <Icon name={item.icon} size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-5 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm">Сайт работает в штатном режиме</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ──────────────────────────── HOME PAGE ────────────────────────────
  return (
    <div className="min-h-screen bg-background overflow-x-hidden grain">
      <header className="fixed top-0 inset-x-0 z-50 glass">
        <nav className="container flex items-center justify-between h-16">
          <a href="#" className="font-display font-900 text-2xl tracking-tight">
            S<span className="text-gradient">e</span>m
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">О компании</a>
            {user?.shopEnabled && (
              <a href="#shop" className="hover:text-foreground transition-colors text-accent font-medium">Магазин игр</a>
            )}
            <a href="#join" className="hover:text-foreground transition-colors">Стать частью</a>
          </div>
          {user ? (
            <Button onClick={() => setPage('account')} className="rounded-full bg-primary hover:bg-primary/90 font-medium">
              <Icon name="User" size={16} className="mr-1.5" /> {user.username}
            </Button>
          ) : (
            <Button onClick={openAuthModal} className="rounded-full bg-primary hover:bg-primary/90 font-medium">
              <Icon name="LogIn" size={16} className="mr-1.5" /> Аккаунт
            </Button>
          )}
        </nav>
      </header>

      {/* AUTH MODAL */}
      {authModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={closeAuthModal}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass rounded-2xl w-full max-w-md p-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeAuthModal} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <Icon name="X" size={20} />
            </button>
            <div className="flex rounded-xl bg-secondary/50 p-1 mb-6">
              <button onClick={() => { setAuthTab('register'); setRegErr(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authTab === 'register' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                Регистрация
              </button>
              <button onClick={() => { setAuthTab('login'); setLoginErr(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authTab === 'login' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                Вход
              </button>
            </div>
            {authTab === 'register' ? (
              <div className="space-y-4">
                <h3 className="font-display font-600 text-xl mb-2">Создать аккаунт</h3>
                <div className="space-y-2">
                  <Label>Имя пользователя</Label>
                  <Input placeholder="Александра" value={regName} onChange={(e) => setRegName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()} className="h-11 bg-secondary/50 border-border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Пароль</Label>
                  <Input type="password" placeholder="••••••••" value={regPass} onChange={(e) => setRegPass(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()} className="h-11 bg-secondary/50 border-border rounded-xl" />
                </div>
                {regErr && <p className="text-sm text-destructive">{regErr}</p>}
                <Button onClick={handleRegister} disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-medium">
                  {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <>Зарегистрироваться <Icon name="Sparkles" size={16} className="ml-1.5" /></>}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Уже есть аккаунт?{' '}
                  <button onClick={() => setAuthTab('login')} className="text-primary hover:underline">Войти</button>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-display font-600 text-xl mb-2">Добро пожаловать</h3>
                <div className="space-y-2">
                  <Label>Имя пользователя</Label>
                  <Input placeholder="DezeYT" value={loginName} onChange={(e) => setLoginName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="h-11 bg-secondary/50 border-border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Пароль</Label>
                  <Input type="password" placeholder="••••••••" value={loginPass} onChange={(e) => setLoginPass(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="h-11 bg-secondary/50 border-border rounded-xl" />
                </div>
                {loginErr && <p className="text-sm text-destructive">{loginErr}</p>}
                <Button onClick={handleLogin} disabled={loading} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-medium">
                  {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <>Войти <Icon name="LogIn" size={16} className="ml-1.5" /></>}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Нет аккаунта?{' '}
                  <button onClick={() => setAuthTab('register')} className="text-primary hover:underline">Зарегистрироваться</button>
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
            <Button size="lg" variant="outline" className="rounded-full px-8 border-border bg-transparent hover:bg-secondary font-medium"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
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

      {/* SHOP */}
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
                  <span className="absolute top-3 right-3 text-xs font-medium bg-black/30 text-white rounded-full px-2.5 py-1">{g.badge}</span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">{g.genre}</p>
                  <h3 className="font-display font-600 text-base mb-3">{g.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{g.price}</span>
                    <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90 text-xs h-8">Купить</Button>
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
            <div className="flex flex-col items-center justify-center">
              {user ? (
                <div className="text-center glass rounded-2xl p-8 w-full">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-display font-600 text-xl mb-2">Вы уже в команде!</h3>
                  <p className="text-muted-foreground text-sm mb-4">Добро пожаловать, <span className="text-primary font-medium">{user.username}</span></p>
                  <Button onClick={() => setPage('account')} className="rounded-xl bg-primary hover:bg-primary/90">
                    Перейти в кабинет <Icon name="ArrowRight" size={16} className="ml-1.5" />
                  </Button>
                </div>
              ) : (
                <div className="glass rounded-2xl p-8 w-full text-center">
                  <Icon name="UserPlus" size={48} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-display font-600 text-xl mb-4">Присоединяйся к Sem</h3>
                  <Button onClick={openAuthModal} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-medium">
                    Создать аккаунт <Icon name="Sparkles" size={16} className="ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-12">
        <div className="container py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display font-900 text-2xl">S<span className="text-gradient">e</span>m</div>
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
