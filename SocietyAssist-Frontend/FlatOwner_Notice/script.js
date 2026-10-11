// API URLs
const getAllNoticesUrl = "http://localhost:8086/notice";

// Sidebar functionality
let sidebarExpanded = true;
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    if (sidebarExpanded) {
        sidebar.style.width = '70px';
        content.style.marginLeft = '70px';
        document.querySelectorAll('.nav-text').forEach(item => {
            item.style.display = 'none';
        });
        document.querySelector('.app-title').style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    } else {
        sidebar.style.width = '250px';
        content.style.marginLeft = '250px';
        setTimeout(() => {
            document.querySelectorAll('.nav-text').forEach(item => {
                item.style.display = 'inline';
            });
            document.querySelector('.app-title').style.display = 'block';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        }, 150);
    }
    
    sidebarExpanded = !sidebarExpanded;
}

// Function to fetch and display all notices
function fetchNotices() {
    fetch(getAllNoticesUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const noticeTableBody = document.querySelector('#noticeTable tbody');

            // Clear any existing data in the table
            noticeTableBody.innerHTML = '';

            // Check if data is an array
            if (!Array.isArray(data)) {
                console.error('Expected array of notices but got:', data);
                showNotification("Error loading notices: Invalid data format", "error");
                return;
            }

            // Check if there are any notices
            if (data.length === 0) {
                noticeTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No notices available</td></tr>';
                return;
            }

            // Loop through the data and create table rows
            data.forEach(notice => {
                const row = document.createElement('tr');

                // Create table cells for each piece of data
                row.innerHTML = `
                <td>${notice.id}</td>
                <td>${escapeHTML(notice.subject)}</td>
                <td>${escapeHTML(notice.description)}</td>
                `;

                // Append the row to the table body
                noticeTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching notices:', error);
            // Show error message to user
            const noticeTableBody = document.querySelector('#noticeTable tbody');
            noticeTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: red;">Error loading notices. Please check your connection.</td></tr>';
            showNotification("Failed to load notices. Please try again later.", "error");
        });
}

// Helper function to escape HTML to prevent XSS
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Function to show notification
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        document.body.removeChild(notif);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification and sidebar styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .notification.show {
        transform: translateX(0);
    }
    .notification.success {
        background-color: #4caf50;
    }
    .notification.error {
        background-color: #f44336;
    }
    textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        font-family: 'Poppins', sans-serif;
        resize: vertical;
        min-height: 100px;
        transition: border 0.3s ease;
    }
    textarea:focus {
        border-color: #3f51b5;
        outline: none;
        box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
    }
    
    /* Sidebar Styles */
    .sidebar {
        height: 100%;
        width: 250px;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #3f51b5;
        overflow-x: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }
    
    .app-title {
        color: white;
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        padding: 25px 0;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        transition: all 0.3s ease;
    }
    
    .nav-item {
        padding: 15px 20px;
        display: flex;
        align-items: center;
        color: white;
        text-decoration: none;
        font-size: 16px;
        transition: all 0.3s ease;
        border-left: 4px solid transparent;
    }
    
    .nav-item:hover, .nav-item.active {
        background-color: rgba(255,255,255,0.1);
        border-left-color: white;
    }
    
    .nav-icon {
        margin-right: 15px;
        width: 20px;
        text-align: center;
    }
    
    .nav-text {
        transition: opacity 0.2s ease;
        white-space: nowrap;
    }
    
    .content {
        margin-left: 250px;
        padding: 20px;
        transition: all 0.3s ease;
    }
    
    .sidebar-toggle {
        position: absolute;
        top: 50%;
        right: -10px;
        transform: translateY(-50%);
        background-color: #3f51b5;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    
    .sidebar-toggle:hover {
        background-color: #303f9f;
    }
    
    .logout-container {
        position: absolute;
        bottom: 20px;
        width: 100%;
        padding: 0 20px;
    }
    
    .logout-btn {
        width: 100%;
        background-color: rgba(255,255,255,0.1);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 12px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
    }
    
    .logout-btn:hover {
        background-color: rgba(255,255,255,0.2);
    }
    
    .logout-icon {
        margin-right: 15px;
        width: 20px;
        text-align: center;
    }
    
    /* Responsive adjustments for sidebar */
    @media (max-width: 768px) {
        .sidebar {
            width: 70px;
        }
        .content {
            margin-left: 70px;
        }
        .nav-text, .app-title {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Initialize sidebar toggle
document.addEventListener('DOMContentLoaded', function() {
    // Create sidebar toggle button
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sidebarToggle';
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    toggleBtn.addEventListener('click', toggleSidebar);
    sidebar.appendChild(toggleBtn);
    
    // Check for mobile view and auto-collapse sidebar if needed
    if (window.innerWidth <= 768) {
        sidebarExpanded = true; // Start expanded so toggle will collapse it
        toggleSidebar();
    }
    
    // Load notices
    fetchNotices();
});



document.getElementById("logoutBtn").addEventListener("click", function () {
    window.location.href = "/Landing Page/index.html";
  });