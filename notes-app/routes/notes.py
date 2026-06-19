from flask import request, Blueprint, session, flash, redirect
from models.note_model import create_notes, get_note_by_id, update_note, delete_note

notes = Blueprint('notes', __name__)

@notes.route('/create_notes', methods=['POST'])
def add_notes():
    user_id = session.get('user_id')
    if not user_id:
        flash("Please log in first.", "error")
        return redirect('/login')

    title = request.form.get('title')
    content = request.form.get('content')
    
    if title and content:
        create_notes(user_id, title, content)
        flash("Note created successfully", "success")
    else:
        flash("Empty note not allowed", "error")
        
    return redirect('/dashboard')

@notes.route('/edit_note/<int:note_id>', methods=['POST'])
def edit_note(note_id):
    user_id = session.get('user_id')
    if not user_id:
        flash("Please log in first.", "error")
        return redirect('/login')

    note = get_note_by_id(note_id)
    if not note or note['user_id'] != user_id:
        flash("Unauthorized or note not found.", "error")
        return redirect('/dashboard')

    title = request.form.get('title')
    content = request.form.get('content')
    
    if title and content:
        update_note(note_id, title, content)
        flash("Note updated successfully", "success")
    else:
        flash("Empty note not allowed", "error")
        
    return redirect('/dashboard')

@notes.route('/delete_note/<int:note_id>', methods=['POST'])
def delete_note_route(note_id):
    user_id = session.get('user_id')
    if not user_id:
        flash("Please log in first.", "error")
        return redirect('/login')

    note = get_note_by_id(note_id)
    if not note or note['user_id'] != user_id:
        flash("Unauthorized or note not found.", "error")
        return redirect('/dashboard')

    delete_note(note_id)
    flash("Note deleted successfully", "success")
    return redirect('/dashboard')
