from flask import request, Blueprint, session, jsonify
from models.note_model import create_notes, get_notes



notes = Blueprint('notes',__name__)

@notes.route('/create_notes', methods = ['POST'])
def add_notes():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorizes. Please login"}), 401
    
    # user_id = session['user_id']
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    create_notes(user_id, title, content)

    return jsonify({"message": "Note created successfully"})