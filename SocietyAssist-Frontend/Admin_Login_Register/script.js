
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8086';

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form-section');

    function switchTab(tabId) {
        tabs.forEach(tab => tab.classList.remove('active'));
        forms.forEach(form => form.classList.remove('active'));

        const selectedTab = document.querySelector(
            `.tab[data-tab="${tabId}"]`
        );
        const selectedForm = document.getElementById(`${tabId}-form`);

        if (selectedTab) selectedTab.classList.add('active');
        if (selectedForm) selectedForm.classList.add('active');
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.getAttribute('data-tab'));
        });
    });

    // Switch to login from register footer link
    document.getElementById('go-to-login')?.addEventListener('click', () => {
        switchTab('login');
    });

    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.password-toggle');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.previousElementSibling;
            const icon = button.querySelector('i');

            if (!passwordInput || !icon) return;

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

    // Form references
    const loginForm = document.getElementById('adminLoginForm');
    const registerForm = document.getElementById('adminRegisterForm');

    // Admin Login: call the real Spring Boot API
    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            alert('Please enter your email and password.');
            return;
        }

        try {
            const params = new URLSearchParams({ email, password });

            const response = await fetch(
                `${API_BASE_URL}/admin/login?${params.toString()}`,
                { method: 'POST' }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Invalid email or password.');
                } else {
                    alert(`Login failed (HTTP ${response.status}).`);
                }
                return;
            }

            const data = await response.json();

            if (!data.token || data.role !== 'ADMIN') {
                alert('The server returned an invalid admin login response.');
                return;
            }

            // Store the JWT for subsequent authenticated API requests.
            localStorage.setItem('adminJwt', data.token);
            localStorage.setItem('adminRole', data.role);
            localStorage.setItem('adminUserId', String(data.userId));

            alert('Admin login successful! Redirecting to dashboard...');

            // Relative path works when the frontend is served over HTTP.
            window.location.href = '../Admin_Dashboard/index.html';

        } catch (error) {
            console.error('Admin login error:', error);
            alert(
                'Cannot connect to the backend. Ensure Spring Boot is running on port 8086 and CORS is configured.'
            );
        }
    });

    // Admin Registration
    // Requires an existing admin JWT. Never expose the bootstrap token here.
    registerForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document
            .getElementById('register-username').value.trim();
        const email = document
            .getElementById('register-email').value.trim();
        const password = document
            .getElementById('register-password').value;
        const confirmPassword = document
            .getElementById('register-confirm-password').value;

        if (!username || !email || !password) {
            alert('Please complete all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const token = localStorage.getItem('adminJwt');

        if (!token || localStorage.getItem('adminRole') !== 'ADMIN') {
            alert(
                'Please log in as an administrator before registering another admin.'
            );
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/admin/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    alert(
                        'Registration denied. Your admin session may be invalid or you lack permission.'
                    );
                } else {
                    alert(`Registration failed (HTTP ${response.status}).`);
                }
                return;
            }

            alert('Admin registered successfully. You can now log in.');

            registerForm.reset();
            switchTab('login');

        } catch (error) {
            console.error('Admin registration error:', error);
            alert(
                'Cannot connect to the backend. Ensure Spring Boot is running on port 8086.'
            );
        }
    });
});
