import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VACANCIES = [
  { id: 1, title: 'Frontend-разработчик', spec: 'dev', exp: 'middle', city: 'Москва', salary: '180–260к', tags: ['React', 'TypeScript'] },
  { id: 2, title: 'Product Designer', spec: 'design', exp: 'senior', city: 'Удалённо', salary: '200–300к', tags: ['Figma', 'UX'] },
  { id: 3, title: 'Junior QA-инженер', spec: 'qa', exp: 'junior', city: 'Казань', salary: '80–120к', tags: ['Manual', 'Postman'] },
  { id: 4, title: 'Backend-разработчик', spec: 'dev', exp: 'senior', city: 'Удалённо', salary: '280–400к', tags: ['Python', 'PostgreSQL'] },
  { id: 5, title: 'Маркетолог-аналитик', spec: 'marketing', exp: 'middle', city: 'Москва', salary: '150–220к', tags: ['SQL', 'GA4'] },
  { id: 6, title: 'UX-исследователь', spec: 'design', exp: 'middle', city: 'Удалённо', salary: '160–230к', tags: ['Research', 'CustDev'] },
];

const SPECS = [
  { value: 'all', label: 'Все направления' },
  { value: 'dev', label: 'Разработка' },
  { value: 'design', label: 'Дизайн' },
  { value: 'qa', label: 'Тестирование' },
  { value: 'marketing', label: 'Маркетинг' },
];

const EXP = [
  { value: 'all', label: 'Любой опыт' },
  { value: 'junior', label: 'Junior' },
  { value: 'middle', label: 'Middle' },
  { value: 'senior', label: 'Senior' },
];

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

const Index = () => {
  const [spec, setSpec] = useState('all');
  const [exp, setExp] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = VACANCIES.filter(
    (v) =>
      (spec === 'all' || v.spec === spec) &&
      (exp === 'all' || v.exp === exp) &&
      v.title.toLowerCase().includes(query.toLowerCase()),
  );

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
            <a href="#vacancies" className="hover:text-foreground transition-colors">Вакансии</a>
            <a href="#join" className="hover:text-foreground transition-colors">Стать частью</a>
          </div>
          <Button className="rounded-full bg-primary hover:bg-primary/90 font-medium">
            <Icon name="LogIn" size={16} className="mr-1.5" />
            Аккаунт
          </Button>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative pt-40 pb-28">
        <div className="absolute top-20 -left-20 w-[28rem] h-[28rem] rounded-full bg-primary/30 blur-[120px] animate-float" />
        <div className="absolute top-40 right-0 w-[24rem] h-[24rem] rounded-full bg-accent/30 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -top-10 left-1/3 w-[20rem] h-[20rem] rounded-full bg-amber-500/20 blur-[120px] animate-float" style={{ animationDelay: '4s' }} />

        <div className="container relative text-center max-w-4xl">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Сейчас открыто {VACANCIES.length} вакансий
          </span>
          <h1 className="font-display font-900 text-5xl md:text-7xl leading-[1.05] mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Создаём <span className="text-gradient">будущее</span><br />продуктов вместе
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Sem — команда инженеров, дизайнеров и мечтателей, которые строят технологии, меняющие правила игры.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 px-8 glow font-medium">
              Смотреть вакансии
              <Icon name="ArrowRight" size={18} className="ml-1.5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-border bg-transparent hover:bg-secondary font-medium">
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

      {/* VACANCIES */}
      <section id="vacancies" className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-accent font-medium mb-3 tracking-wide uppercase text-sm">Вакансии</p>
          <h2 className="font-display font-700 text-4xl md:text-5xl mb-4">Найди своё место</h2>
          <p className="text-muted-foreground text-lg">Отфильтруй по специальности и уровню опыта.</p>
        </div>

        {/* FILTERS */}
        <div className="glass rounded-2xl p-5 mb-10 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 h-12 bg-secondary/50 border-border rounded-xl"
            />
          </div>
          <Select value={spec} onValueChange={setSpec}>
            <SelectTrigger className="md:w-56 h-12 bg-secondary/50 border-border rounded-xl">
              <SelectValue placeholder="Специальность" />
            </SelectTrigger>
            <SelectContent>
              {SPECS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={exp} onValueChange={setExp}>
            <SelectTrigger className="md:w-44 h-12 bg-secondary/50 border-border rounded-xl">
              <SelectValue placeholder="Опыт" />
            </SelectTrigger>
            <SelectContent>
              {EXP.map((e) => (
                <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* LIST */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((v) => (
            <div key={v.id} className="group glass rounded-2xl p-6 hover:border-primary/40 transition-all hover:-translate-y-1 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-display font-600 text-xl">{v.title}</h3>
                <span className="text-sm font-medium text-primary whitespace-nowrap">{v.salary} ₽</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-xs glass rounded-full px-3 py-1 text-muted-foreground flex items-center gap-1">
                  <Icon name="MapPin" size={12} /> {v.city}
                </span>
                {v.tags.map((t) => (
                  <span key={t} className="text-xs glass rounded-full px-3 py-1 text-muted-foreground">{t}</span>
                ))}
              </div>
              <Button variant="ghost" className="mt-auto justify-start px-0 text-primary hover:text-accent hover:bg-transparent w-fit">
                Откликнуться
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-50" />
            По вашему запросу вакансий не найдено
          </div>
        )}
      </section>

      {/* JOIN / REGISTER */}
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

            <div className="glass rounded-2xl p-7">
              <h3 className="font-display font-600 text-xl mb-6">Регистрация аккаунта</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" placeholder="Александра" className="h-11 bg-secondary/50 border-border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@mail.ru" className="h-11 bg-secondary/50 border-border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass">Пароль</Label>
                  <Input id="pass" type="password" placeholder="••••••••" className="h-11 bg-secondary/50 border-border rounded-xl" />
                </div>
                <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-medium mt-2">
                  Создать аккаунт
                  <Icon name="Sparkles" size={16} className="ml-1.5" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Уже есть аккаунт? <a href="#" className="text-primary hover:underline">Войти</a>
                </p>
              </div>
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
};

export default Index;
