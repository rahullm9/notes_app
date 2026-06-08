from db import connection

def create_user( username, email, password):
    conn = connection()
    cur = conn.cursor()

    query = """ 
    INSERT INTO USERS ( username, email, password )
    VALUES (%s, %s, %s)
    """

    cur.execute(query,(username, email, password))

    conn.commit()

    cur.close()
    conn.close()

def get_user_by_email(email):
    conn = connection()
    cur = conn.cursor()

    query = "SELECT * FROM users WHERE email = %s"

    cur.execute(query, (email,))

    user = cur.fetchone()

    cur.close()
    conn.close()

    return user