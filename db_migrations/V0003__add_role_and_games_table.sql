ALTER TABLE t_p41055692_sem_cool_website.users
  ADD COLUMN IF NOT EXISTS role VARCHAR(32) NOT NULL DEFAULT 'buyer';

UPDATE t_p41055692_sem_cool_website.users SET role = 'admin' WHERE username = 'DezeYT';

CREATE TABLE IF NOT EXISTS t_p41055692_sem_cool_website.games (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(128) NOT NULL,
  genre       VARCHAR(64)  NOT NULL,
  price       VARCHAR(32)  NOT NULL,
  badge       VARCHAR(32)  NOT NULL DEFAULT '',
  color       VARCHAR(128) NOT NULL DEFAULT 'from-purple-500 to-pink-500',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

INSERT INTO t_p41055692_sem_cool_website.games (title, genre, price, badge, color) VALUES
  ('Cyberpunk 2077', 'RPG', '1 299 ₽', 'Хит', 'from-yellow-500 to-orange-500'),
  ('Elden Ring', 'Action RPG', '2 499 ₽', 'Топ', 'from-purple-500 to-pink-500'),
  ('Hollow Knight', 'Метроидвания', '399 ₽', 'Инди', 'from-blue-500 to-cyan-500'),
  ('GTA VI', 'Open World', '4 999 ₽', 'Новинка', 'from-green-500 to-emerald-500');
