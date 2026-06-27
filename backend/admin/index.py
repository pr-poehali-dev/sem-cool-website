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


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def err(code, msg):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg})}


def ok(data):
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data)}


def handler(event: dict, context) -> dict:
    """Управление пользователями — только для администратора DezeYT."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    # Проверяем что запрос от DezeYT
    headers = event.get("headers") or {}
    admin_user = headers.get("X-Admin-User") or headers.get("x-admin-user") or ""
    if admin_user != ADMIN:
        return err(403, "Доступ запрещён")

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")

    conn = get_conn()
    cur = conn.cursor()

    try:
        # Список пользователей
        if action == "list":
            cur.execute(
                f"SELECT id, username, shop_enabled, created_at FROM {SCHEMA}.users ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            users = [
                {"id": r[0], "username": r[1], "shop_enabled": r[2],
                 "created_at": r[3].strftime("%d.%m.%Y %H:%M") if r[3] else ""}
                for r in rows
            ]
            return ok({"users": users})

        # Переключить shop_enabled
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

        # Удалить пользователя
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

        return err(400, "Неизвестный action")

    finally:
        conn.close()
