ALTER TABLE t_p41055692_sem_cool_website.games
  ADD COLUMN IF NOT EXISTS vk_link TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS t_p41055692_sem_cool_website.game_requests (
  id          SERIAL PRIMARY KEY,
  seller_id   INTEGER NOT NULL REFERENCES t_p41055692_sem_cool_website.users(id),
  title       VARCHAR(128) NOT NULL,
  genre       VARCHAR(64)  NOT NULL,
  price       VARCHAR(32)  NOT NULL,
  badge       VARCHAR(32)  NOT NULL DEFAULT '',
  color       VARCHAR(128) NOT NULL DEFAULT 'from-purple-500 to-pink-500',
  vk_link     TEXT         NOT NULL DEFAULT '',
  status      VARCHAR(16)  NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
