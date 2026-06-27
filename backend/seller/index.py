import json
import os
import psycopg2

SCHEMA = "t_p41055692_sem_cool_website"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def err(code, msg):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg})}


def ok(data):
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data)}


def handler(event: dict, context) -> dict:
    """Подача заявки на добавление игры от продавца."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers") or {}
    user_id_str = headers.get("X-User-Id") or headers.get("x-user-id") or ""
    if not user_id_str:
        return err(401, "Не передан X-User-Id")

    try:
        user_id = int(user_id_str)
    except ValueError:
        return err(400, "Неверный X-User-Id")

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")

    conn = get_conn()
    cur = conn.cursor()

    try:
        # Проверяем что пользователь — продавец
        cur.execute(f"SELECT role FROM {SCHEMA}.users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        if not row:
            return err(404, "Пользователь не найден")
        if row[0] not in ("seller", "admin"):
            return err(403, "Только продавцы могут подавать заявки")

        if action == "submit_request":
            title = (body.get("title") or "").strip()
            genre = (body.get("genre") or "").strip()
            price = (body.get("price") or "").strip()
            badge = (body.get("badge") or "").strip()
            color = body.get("color") or "from-purple-500 to-pink-500"
            vk_link = (body.get("vk_link") or "").strip()

            if not title or not genre or not price:
                return err(400, "Заполните название, жанр и цену")
            if not vk_link:
                return err(400, "Укажите ссылку ВКонтакте")

            cur.execute(
                f"""INSERT INTO {SCHEMA}.game_requests
                    (seller_id, title, genre, price, badge, color, vk_link)
                    VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (user_id, title, genre, price, badge, color, vk_link)
            )
            rid = cur.fetchone()[0]
            conn.commit()
            return ok({"submitted": True, "request_id": rid})

        if action == "my_requests":
            cur.execute(
                f"""SELECT id, title, genre, price, badge, color, vk_link, status, created_at
                    FROM {SCHEMA}.game_requests WHERE seller_id = %s ORDER BY created_at DESC""",
                (user_id,)
            )
            rows = cur.fetchall()
            requests = [
                {"id": r[0], "title": r[1], "genre": r[2], "price": r[3],
                 "badge": r[4], "color": r[5], "vk_link": r[6],
                 "status": r[7],
                 "created_at": r[8].strftime("%d.%m.%Y %H:%M") if r[8] else ""}
                for r in rows
            ]
            return ok({"requests": requests})

        return err(400, "Неизвестный action")

    finally:
        conn.close()
