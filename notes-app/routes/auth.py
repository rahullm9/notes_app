from flask import Blueprint, request
from models.user_model import create_user, get_user_by_email
from flask import session, jsonify

import bcrypt

auth = Blueprint("auth", __name__)

@auth.route("/register", methods = ['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )
    exist_email = get_user_by_email(email)
    if exist_email:
        return jsonify({"message": "This Email already exist Try Login!"})

    create_user(username, email, hashed_password.decode("utf-8"))

    return 'User registered successfully'


@auth.route('/login', methods = ['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    user = get_user_by_email(email)

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401
    
    stored_password = user[3]

    password_match = bcrypt.checkpw(
        password.encode("utf-8"),
        stored_password.encode("utf-8")
    )

    if password_match:
        session['user_id'] = user[0]
        return jsonify({"message": f"{user[1]} welcome Back"}), 200
    return "Invalid password"