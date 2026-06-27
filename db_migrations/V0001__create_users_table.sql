CREATE TABLE t_p41055692_sem_cool_website.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  shop_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO t_p41055692_sem_cool_website.users (username, password_hash, shop_enabled)
VALUES ('DezeYT', '$2b$12$placeholder_will_be_set_on_first_login', TRUE);
