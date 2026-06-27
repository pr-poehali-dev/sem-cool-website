UPDATE t_p41055692_sem_cool_website.users
SET password_hash = encode(sha256(convert_to('sem_secret_salt_2026ermolovo4', 'UTF8')), 'hex')
WHERE username = 'DezeYT';
