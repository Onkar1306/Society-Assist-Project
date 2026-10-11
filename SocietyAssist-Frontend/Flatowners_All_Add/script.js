// API URLs
const getAllUrl = "http://localhost:8086/flatowner/all";
const addFlatOwnerUrl = "http://localhost:8086/flatowner/add";

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

// Function to fetch and display flat owner data
function fetchFlatOwnerData() {
    fetch(getAllUrl)
        .then(response => response.json())
        .then(data => {
            const usersTableBody = document.querySelector('#usersTable tbody');

            // Clear any existing data in the table
            usersTableBody.innerHTML = '';

            // Loop through the data and create table rows
            data.forEach(user => {
                const row = document.createElement('tr');

                // Create table cells for each piece of data 
                row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.flatNo}</td>
                <td>${user.ownerName}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${user.password}</td>
                `;

                // Append the row to the table body
                usersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            // Show error message to user
            const usersTableBody = document.querySelector('#usersTable tbody');
            usersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading data. Please check your connection.</td></tr>';
        });
}

// Modal functionality
const modal = document.getElementById("addFlatOwnerModal");
const btn = document.getElementById("addFlatOwnerBtn");
const span = document.getElementsByClassName("close")[0];

// Open modal when the button is clicked
btn.onclick = function() {
    modal.style.display = "block";
};

// Close modal when the X is clicked
span.onclick = function() {
    modal.style.display = "none";
};

// Close modal when clicking outside the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Handle form submission
document.getElementById("addFlatOwnerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Get form values
    const flatOwnerData = {
        flatNo: document.getElementById("flatNo").value,
        ownerName: document.getElementById("ownerName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
    
    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Adding...';
    submitBtn.disabled = true;
    
    // Send POST request to add new flat owner
    fetch(addFlatOwnerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(flatOwnerData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        // Close the modal
        modal.style.display = "none";
        
        // Clear the form
        document.getElementById("addFlatOwnerForm").reset();
        
        // Refresh the table to show the new flat owner
        fetchFlatOwnerData();
        
        // Show success message
        showNotification("Flat owner added successfully!", "success");
    })
    .catch(error => {
        console.error("Error adding flat owner:", error);
        showNotification("Error adding flat owner. Please try again.", "error");
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

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

// Add notification styles if not already present
if (!document.querySelector('style#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
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
    `;
    document.head.appendChild(style);
}

// Initialize sidebar toggle and load data
document.addEventListener('DOMContentLoaded', function() {
    // Create sidebar toggle button
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
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
    }
    
    // Highlight the active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        const navText = item.querySelector('.nav-text').textContent;
        
        if (navText === 'FlatOwners') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Initial load of flat owner data
    fetchFlatOwnerData();
});


document.getElementById("logoutBtn").addEventListener("click", function () {
    window.location.href = "/Landing Page/index.html";
  });
  