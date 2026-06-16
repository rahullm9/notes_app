from flask import Blueprint, request, jsonify, render_template, redirect, flash, session
from models.user_model import create_user, get_user_by_email

import bcrypt

auth = Blueprint("auth", __name__)

@auth.route("/register", methods = ['POST', 'GET'])
def register():
    if request.method == 'GET':
        return render_template('index.html')
    data = request.form

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
    flash("Registration successful!", "success")
    return redirect('/login')


@auth.route('/login', methods = ['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template('index.html')
    data = request.form

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

    if not password_match:
        return jsonify({"message": "Invalid email or password"}),401
    
    session['user_id'] = user[0]
    session['username'] = user[1]

    return redirect('/dashboard')

@auth.route('/dashboard', methods = ['GET'])
def dashboard():
    if 'user_id' not in session:
        flash("Please login first.", "error")
        return redirect('/login')
    username = session.get('username')
    return render_template('dashboard.html', username=username)

@auth.route('/logout')
def logout():
    session.clear()
    flash("Logout successfully.", "success")
    return redirect('/login')