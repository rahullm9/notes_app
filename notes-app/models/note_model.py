from db import connection

def create_notes(user_id, title, content):
    conn = connection()
    cur = conn.cursor()

    query = 'INSERT INTO notes(user_id, title, content) VALUES (%s, %s, %s)'

    cur.execute(query, (user_id, title, content))

    conn.commit()
    cur.close()
    conn.close()

def get_notes(user_id):
    conn = connection()
    cur = conn.cursor()

    query = 'SELECT id, title, content, created_at FROM notes WHERE user_id = %s ORDER BY created_at DESC'

    cur.execute(query, (user_id,))
    rows = cur.fetchall()
    
    notes = []
    for row in rows:
        notes.append({
            'id': row[0],
            'title': row[1],
            'content': row[2],
            'created_at': row[3]
        })

    cur.close()
    conn.close()
    return notes

def get_note_by_id(note_id):
    conn = connection()
    cur = conn.cursor()

    query = 'SELECT id, user_id, title, content, created_at FROM notes WHERE id = %s'

    cur.execute(query, (note_id,))
    row = cur.fetchone()
    
    note = None
    if row:
        note = {
            'id': row[0],
            'user_id': row[1],
            'title': row[2],
            'content': row[3],
            'created_at': row[4]
        }

    cur.close()
    conn.close()
    return note

def update_note(note_id, title, content):
    conn = connection()
    cur = conn.cursor()

    query = 'UPDATE notes SET title = %s, content = %s WHERE id = %s'

    cur.execute(query, (title, content, note_id))

    conn.commit()
    cur.close()
    conn.close()

def delete_note(note_id):
    conn = connection()
    cur = conn.cursor()

    query = 'DELETE FROM notes WHERE id = %s'

    cur.execute(query, (note_id,))

    conn.commit()
    cur.close()
    conn.close()