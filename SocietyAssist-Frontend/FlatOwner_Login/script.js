document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    const togglePasswordButton = document.querySelector('.password-toggle');
    
    togglePasswordButton.addEventListener('click', () => {
      const passwordInput = document.getElementById('login-password');
      const icon = togglePasswordButton.querySelector('i');
      
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
    
    // Form Submission Logic
    const loginForm = document.getElementById('flatOwnerLoginForm');
    
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const flatNo = document.getElementById('login-flatno').value;
      const password = document.getElementById('login-password').value;
      
      // Validate login credentials
      if (flatNo === 'A-101' && password === 'securepassword') {
        // Success - redirect to flat owner complaint page
        alert('Login successful! Redirecting to Dashboard page...');
        window.location.href = '/FlatOwner_Dashboard/index.html';
      } else {
        // Error - show message
        alert('Invalid flat number or password. Please try again.');
      }
    });
  });