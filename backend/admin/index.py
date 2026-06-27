import json
import os
import psycopg2

SCHEMA = "t_p41055692_sem_cool_website"
ADMIN = "DezeYT"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-User",
}

ROLES = ["buyer", "seller", "moderator", "admin"]


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def err(code, msg):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg})}


def ok(data):
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data)}


def handler(event: dict, context) -> dict:
    """Управление пользователями и играми — только для администратора DezeYT."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers") or {}
    admin_user = headers.get("X-Admin-User") or headers.get("x-admin-user") or ""
    if admin_user != ADMIN:
        return err(403, "Доступ запрещён")

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")

    conn = get_conn()
    cur = conn.cursor()

    try:
        # ── Пользователи ──────────────────────────────────────────
        if action == "list":
            cur.execute(
                f"SELECT id, username, shop_enabled, role, created_at FROM {SCHEMA}.users ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            users = [
                {"id": r[0], "username": r[1], "shop_enabled": r[2],
                 "role": r[3] or "buyer",
                 "created_at": r[4].strftime("%d.%m.%Y %H:%M") if r[4] else ""}
                for r in rows
            ]
            return ok({"users": users})

        if action == "toggle_shop":
            uid = body.get("user_id")
            if not uid:
                return err(400, "Не передан user_id")
            cur.execute(
                f"UPDATE {SCHEMA}.users SET shop_enabled = NOT shop_enabled WHERE id = %s RETURNING shop_enabled",
                (uid,)
            )
            row = cur.fetchone()
            if not row:
                return err(404, "Пользователь не найден")
            conn.commit()
            return ok({"shop_enabled": row[0]})

        if action == "set_role":
            uid = body.get("user_id")
            role = body.get("role")
            uname = body.get("username") or ""
            if uname == ADMIN:
                return err(400, "Нельзя изменить роль администратора")
            if role not in ROLES:
                return err(400, f"Роль должна быть одной из: {', '.join(ROLES)}")
            cur.execute(
                f"UPDATE {SCHEMA}.users SET role = %s WHERE id = %s RETURNING role",
                (role, uid)
            )
            if not cur.fetchone():
                return err(404, "Пользователь не найден")
            conn.commit()
            return ok({"role": role})

        if action == "delete":
            uid = body.get("user_id")
            username = body.get("username") or ""
            if username == ADMIN:
                return err(400, "Нельзя удалить администратора")
            if not uid:
                return err(400, "Не передан user_id")
            cur.execute(f"DELETE FROM {SCHEMA}.users WHERE id = %s", (uid,))
            conn.commit()
            return ok({"deleted": True})

        # ── Игры ──────────────────────────────────────────────────
        if action == "list_games":
            cur.execute(
                f"SELECT id, title, genre, price, badge, color FROM {SCHEMA}.games ORDER BY created_at ASC"
            )
            rows = cur.fetchall()
            games = [
                {"id": r[0], "title": r[1], "genre": r[2],
                 "price": r[3], "badge": r[4], "color": r[5]}
                for r in rows
            ]
            return ok({"games": games})

        if action == "add_game":
            title = (body.get("title") or "").strip()
            genre = (body.get("genre") or "").strip()
            price = (body.get("price") or "").strip()
            badge = (body.get("badge") or "").strip()
            color = body.get("color") or "from-purple-500 to-pink-500"
            if not title or not genre or not price:
                return err(400, "Заполните title, genre, price")
            cur.execute(
                f"INSERT INTO {SCHEMA}.games (title, genre, price, badge, color) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (title, genre, price, badge, color)
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return ok({"id": new_id, "title": title, "genre": genre,
                       "price": price, "badge": badge, "color": color})

        if action == "delete_game":
            gid = body.get("game_id")
            if not gid:
                return err(400, "Не передан game_id")
            cur.execute(f"DELETE FROM {SCHEMA}.games WHERE id = %s", (gid,))
            conn.commit()
            return ok({"deleted": True})

        return err(400, "Неизвестный action")

    finally:
        conn.close()
