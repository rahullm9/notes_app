// 1. Switch between Login and Register views
const goToRegisterBtn = document.getElementById("go-to-register");
const goToLoginBtn = document.getElementById("go-to-login");
const loginFormWrapper = document.getElementById("login-form-wrapper");
const registerFormWrapper = document.getElementById("register-form-wrapper");
const statusMessage = document.getElementById("status-message");

function clearStatusMessage() {
  statusMessage.className = "status-message-box";
  statusMessage.style.display = "none";
}

goToRegisterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearStatusMessage();

  loginFormWrapper.classList.remove("active-form");
  loginFormWrapper.classList.add("hidden-form");

  registerFormWrapper.classList.remove("hidden-form");
  registerFormWrapper.classList.add("active-form");
});

goToLoginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearStatusMessage();

  registerFormWrapper.classList.remove("active-form");
  registerFormWrapper.classList.add("hidden-form");

  loginFormWrapper.classList.remove("hidden-form");
  loginFormWrapper.classList.add("active-form");
});

// 2. Password Visibility Show/Hide toggles
const passwordToggleBtns = document.querySelectorAll(".password-toggle-btn");

passwordToggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const inputWrapper = btn.closest(".input-wrapper");
    const passwordInput = inputWrapper.querySelector("input");
    const eyeIconOpen = btn.querySelector(".eye-icon-open");
    const eyeIconClosed = btn.querySelector(".eye-icon-closed");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIconOpen.style.display = "none";
      eyeIconClosed.style.display = "block";
    } else {
      passwordInput.type = "password";
      eyeIconOpen.style.display = "block";
      eyeIconClosed.style.display = "none";
    }
  });
});

// =======================================================================
// NOTE TO DEVELOPER (Learning Exercise):
// Add your custom fetch handlers here to handle login and registration.
//
// Example structure:
//
// document.getElementById('login-form').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const email = document.getElementById('login-email').value;
//   const password = document.getElementById('login-password').value;
//
//   try {
//     const response = await fetch('/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password })
//     });
//
//     if (response.ok) {
//        const data = await response.json();
//        // Handle success (e.g. redirect or show banner)
//     } else {
//        // Handle invalid credentials
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//   }
// });
// =======================================================================

// 3. Auto-dismiss Flash/Toast Notifications
document.addEventListener("DOMContentLoaded", () => {
  const toastCards = document.querySelectorAll(".toast-card");
  toastCards.forEach((toast) => {
    // Automatically fade out after 4 seconds
    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      // Remove from DOM after transition completes (350ms matching the CSS transition)
      setTimeout(() => {
        toast.remove();
      }, 350);
    }, 4000);
  });
});
