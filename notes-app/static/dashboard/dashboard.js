/**
 * dashboard.js — Notes App Frontend Logic
 *
 * What this file handles:
 *  - Character counter on the content textarea
 *  - "Edit" button → populates form with note data, switches to edit mode
 *  - "Cancel" edit → resets form back to create mode
 *  - Delete confirm modal (demo mode — for Flask, submit the hidden form instead)
 *  - Auto-dismiss flash messages after 4 seconds
 *  - Note count badge update
 *  - Empty-state display toggle
 */

/* =========================================================
   1. DOM REFERENCES
   ========================================================= */
const noteForm        = document.getElementById("note-form");
const noteIdInput     = document.getElementById("note-id-input");
const titleInput      = document.getElementById("note-title");
const contentInput    = document.getElementById("note-content");
const charCounter     = document.getElementById("char-counter");
const submitBtn       = document.getElementById("submit-btn");
const submitLabel     = document.getElementById("submit-label");
const cancelEditBtn   = document.getElementById("cancel-edit-btn");
const formSectionTitle = document.getElementById("form-section-title");
const notesGrid       = document.getElementById("notes-grid");
const emptyState      = document.getElementById("empty-state");
const noteCountLabel  = document.getElementById("note-count-label");
const deleteModal     = document.getElementById("delete-modal");
const modalCancel     = document.getElementById("modal-cancel");
const modalConfirm    = document.getElementById("modal-confirm");

/* =========================================================
   2. CHARACTER COUNTER
   ========================================================= */
contentInput.addEventListener("input", () => {
  const len = contentInput.value.length;
  charCounter.textContent = `${len} / 2000`;
  // Colour feedback when getting close to limit
  if (len > 1800) {
    charCounter.style.color = "#f87171"; // red
  } else if (len > 1500) {
    charCounter.style.color = "#fbbf24"; // amber
  } else {
    charCounter.style.color = "";
  }
});

/* =========================================================
   3. EDIT MODE
   ========================================================= */

/**
 * Called when the user clicks the Edit button on a note card.
 * Populates the form with the note's current data and switches
 * the form into "edit mode".
 *
 * When you connect Flask:
 *  - The form action should switch to e.g. /edit_note/<id>
 *  - The hidden note_id field carries the ID to the server
 *
 * @param {string} noteId      - The note's database ID
 * @param {string} noteTitle   - The note's current title
 * @param {string} noteContent - The note's current content
 */
function editNote(noteId, noteTitle, noteContent) {
  // Populate fields
  noteIdInput.value   = noteId;
  titleInput.value    = noteTitle;
  contentInput.value  = noteContent;

  // Update char counter
  charCounter.textContent = `${noteContent.length} / 2000`;

  // Switch to edit mode UI
  formSectionTitle.textContent = "Edit Note";
  submitLabel.textContent      = "Update Note";
  submitBtn.style.background   = "linear-gradient(135deg, #0ea5e9, #6366f1)";
  cancelEditBtn.classList.remove("hidden");

  // Update form action for Flask (e.g. /edit_note/<id>)
  noteForm.action = `/edit_note/${noteId}`;

  // Smoothly scroll to the form
  noteForm.closest("section").scrollIntoView({ behavior: "smooth", block: "start" });

  // Focus title input with a short delay (after scroll)
  setTimeout(() => titleInput.focus(), 400);
}

// Cancel edit — reset to create mode
cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  noteIdInput.value   = "";
  titleInput.value    = "";
  contentInput.value  = "";
  charCounter.textContent = "0 / 2000";
  charCounter.style.color = "";

  formSectionTitle.textContent = "Create a Note";
  submitLabel.textContent      = "Save Note";
  submitBtn.style.background   = "";
  cancelEditBtn.classList.add("hidden");

  // Reset form action back to create endpoint
  noteForm.action = "/create_note";

  titleInput.focus();
}

/* =========================================================
   4. DELETE CONFIRM MODAL
   ========================================================= */

/**
 * pendingDeleteTarget holds a reference to what needs to be
 * removed when the user confirms deletion.
 *
 * In DEMO mode: it's the card DOM element.
 * In FLASK mode: it's the <form> element to submit.
 *
 * confirmDelete() is called from the Jinja template's
 * onsubmit="return confirmDelete(event)" to intercept the
 * form submit and show the modal instead.
 */
let pendingDeleteTarget = null;

/**
 * Flask integration: intercept the delete form submit.
 * Add this as onsubmit on the delete <form> in the Jinja loop:
 *   <form ... onsubmit="return confirmDelete(event)">
 */
function confirmDelete(event) {
  event.preventDefault();
  pendingDeleteTarget = event.currentTarget; // the <form> element
  showModal();
  return false;
}

/**
 * Demo-only delete: removes the card from the DOM without
 * any server call.  Used by the hardcoded demo cards.
 */
function deleteNoteDemo(noteId) {
  const card = document.querySelector(`[data-note-id="${noteId}"]`);
  pendingDeleteTarget = { type: "demo", card };
  showModal();
}

function showModal() {
  deleteModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function hideModal() {
  deleteModal.classList.add("hidden");
  document.body.style.overflow = "";
  pendingDeleteTarget = null;
}

// "Keep it" — dismiss modal
modalCancel.addEventListener("click", hideModal);
// Close on backdrop click
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) hideModal();
});
// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideModal();
});

// "Yes, Delete" — perform deletion
modalConfirm.addEventListener("click", () => {
  if (!pendingDeleteTarget) return hideModal();

  if (pendingDeleteTarget.type === "demo") {
    // Demo mode: just remove the card from DOM
    const card = pendingDeleteTarget.card;
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    card.style.opacity    = "0";
    card.style.transform  = "scale(0.9)";
    setTimeout(() => {
      card.remove();
      updateNoteCount();
      toggleEmptyState();
    }, 300);
  } else {
    // Flask mode: submit the hidden form to the delete route
    pendingDeleteTarget.submit();
  }

  hideModal();
});

/* =========================================================
   5. NOTE COUNT BADGE + EMPTY STATE
   ========================================================= */
function updateNoteCount() {
  const cards = notesGrid.querySelectorAll(".note-card");
  const count  = cards.length;
  noteCountLabel.textContent = `${count} ${count === 1 ? "note" : "notes"}`;
}

function toggleEmptyState() {
  const cards = notesGrid.querySelectorAll(".note-card");
  if (cards.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }
}

/* =========================================================
   6. AUTO-DISMISS FLASH MESSAGES
   ========================================================= */
function autoDismissFlash() {
  const flashArea = document.getElementById("flash-area");
  if (!flashArea) return;
  const toasts = flashArea.querySelectorAll(".flash-toast");
  toasts.forEach((toast, i) => {
    setTimeout(() => {
      toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      toast.style.opacity    = "0";
      toast.style.transform  = "translateY(-8px)";
      setTimeout(() => toast.remove(), 400);
    }, 4000 + i * 600);
  });
}

/* =========================================================
   7. INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  updateNoteCount();
  toggleEmptyState();
  autoDismissFlash();
});

// Expose functions globally so they can be called from inline HTML onclick handlers
window.editNote       = editNote;
window.deleteNoteDemo = deleteNoteDemo;
window.confirmDelete  = confirmDelete;
