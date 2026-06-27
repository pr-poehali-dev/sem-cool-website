import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = "t_p41055692_sem_cool_website"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    salt = "sem_secret_salt_2026"
    return hashlib.sha256((salt + password).encode()).hexdigest()


def handler(event: dict, context) -> dict:
    """Регистрация и вход пользователей Sem."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")  # "register" | "login"
    username = (body.get("username") or "").strip()
    password = body.get("password") or ""

    if not username or not action:
        return {"statusCode": 400, "headers": CORS,
                "body": json.dumps({"error": "Укажите username и action"})}

    conn = get_conn()
    cur = conn.cursor()

    if action == "register":
        if len(username) < 2:
            conn.close()
            return {"statusCode": 400, "headers": CORS,
                    "body": json.dumps({"error": "Имя минимум 2 символа"})}
        if len(password) < 4:
            conn.close()
            return {"statusCode": 400, "headers": CORS,
                    "body": json.dumps({"error": "Пароль минимум 4 символа"})}

        pw_hash = hash_password(password)
        try:
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (username, password_hash, role) VALUES (%s, %s, 'buyer') RETURNING id, shop_enabled, role",
                (username, pw_hash)
            )
            row = cur.fetchone()
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            conn.close()
            return {"statusCode": 409, "headers": CORS,
                    "body": json.dumps({"error": "Пользователь уже существует"})}

        token = secrets.token_hex(32)
        conn.close()
        return {"statusCode": 200, "headers": CORS,
                "body": json.dumps({"ok": True, "token": token,
                                    "username": username, "shop_enabled": row[1], "role": row[2]})}

    if action == "login":
        pw_hash = hash_password(password)

        # Особый случай: DezeYT — обновляем хэш при первом входе если пароль задан
        cur.execute(
            f"SELECT id, password_hash, shop_enabled, role FROM {SCHEMA}.users WHERE username = %s",
            (username,)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 404, "headers": CORS,
                    "body": json.dumps({"error": "Пользователь не найден"})}

        stored_hash = row[1]
        shop_enabled = row[2]
        role = row[3]

        if stored_hash == "$2b$12$placeholder_will_be_set_on_first_login":
            cur.execute(
                f"UPDATE {SCHEMA}.users SET password_hash = %s WHERE id = %s",
                (pw_hash, row[0])
            )
            conn.commit()
        elif stored_hash != pw_hash:
            conn.close()
            return {"statusCode": 401, "headers": CORS,
                    "body": json.dumps({"error": "Неверный пароль"})}

        token = secrets.token_hex(32)
        conn.close()
        return {"statusCode": 200, "headers": CORS,
                "body": json.dumps({"ok": True, "token": token,
                                    "username": username, "shop_enabled": shop_enabled, "role": role})}

    conn.close()
    return {"statusCode": 400, "headers": CORS,
            "body": json.dumps({"error": "Неизвестный action"})}