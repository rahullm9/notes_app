from db import connection

def create_notes(user_id, title, content):
    conn = connection()
    cur = conn.cursor()

    query = 'INSERT INTO notes(user_id, title, content) VALUES (%s, %s, %s)'

    cur.execute(query, (user_id, title, content))

    conn.commit()
    cur.close()
    conn.close()

def get_notes(id):
    conn = connection()
    cur = conn.cursor()

    query = 'SELECT * FROM notes WHERE id = id '

    cur.execute(query,)
    cur.close()
    conn.close()