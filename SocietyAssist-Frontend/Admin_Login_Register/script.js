document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form-section');
    
    function switchTab(tabId) {
      // Deactivate all tabs and forms
      tabs.forEach(tab => tab.classList.remove('active'));
      forms.forEach(form => form.classList.remove('active'));
      
      // Activate selected tab and form
      document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
      document.getElementById(`${tabId}-form`).classList.add('active');
    }
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab.getAttribute('data-tab'));
      });
    });
    
    // Switch to login from register footer link
    document.getElementById('go-to-login').addEventListener('click', () => {
      switchTab('login');
    });
    
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.password-toggle');
    
    togglePasswordButtons.forEach(button => {
      button.addEventListener('click', () => {
        const passwordInput = button.previousElementSibling;
        const icon = button.querySelector('i');
        
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          passwordInput.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });
    
    // Form Submission Logic
    const loginForm = document.getElementById('adminLoginForm');
    const registerForm = document.getElementById('adminRegisterForm');
    
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      // Validate login credentials
      if (email === 'admin@example.com' && password === 'admin@123') {
        // Success - redirect to admin dashboard
        alert('Login successful! Redirecting to admin dashboard...');
        window.location.href = '/Admin_Dashboard/index.html';
      } else {
        // Error - show message
        alert('Invalid email or password. Please try again.');
      }
    });
    
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      
      // Validate registration
      if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
      }
      
      // Check if credentials match the expected values
      if (username === 'Admin1' && email === 'admin@example.com' && password === 'admin@123') {
        // Success - show message and switch to login
        alert('Registration successful! Please log in with your credentials.');
        switchTab('login');
      } else {
        // For demo purposes, still show success
        alert('Registration successful! Please log in with your credentials.');
        switchTab('login');
      }
    });
  });