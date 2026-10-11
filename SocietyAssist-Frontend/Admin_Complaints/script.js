// API URLs
const getAllComplaintsUrl = "http://localhost:8086/complaint/all";
const deleteComplaintUrl = "http://localhost:8086/complaint/delete/"; // Base URL for delete endpoint

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

// Helper function to get category styling class
function getCategoryClass(category) {
    if (!category) return '';
    
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('plumb')) return 'category-plumbing';
    if (categoryLower.includes('electric')) return 'category-electrical';
    if (categoryLower.includes('security') || categoryLower.includes('safety')) return 'category-security';
    return 'category-general';
}

// Function to fetch and display all complaints
function fetchComplaints() {
    fetch(getAllComplaintsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const complaintTableBody = document.querySelector('#noticeTable tbody');

            // Clear any existing data in the table
            complaintTableBody.innerHTML = '';

            // Check if data is an array
            if (!Array.isArray(data)) {
                console.error('Expected array of complaints but got:', data);
                showNotification("Error loading complaints: Invalid data format", "error");
                return;
            }

            // Check if there are any complaints
            if (data.length === 0) {
                complaintTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No complaints available</td></tr>';
                return;
            }

            // Loop through the data and create table rows
            data.forEach(complaint => {
                const row = document.createElement('tr');

                // Format date if it exists
                const formattedDate = complaint.date ? new Date(complaint.date).toLocaleDateString() : 'N/A';
                
                // Get category styling
                const categoryClass = getCategoryClass(complaint.category);

                // Create table cells for each piece of data
                row.innerHTML = `
                <td>${complaint.id}</td>
                <td><span class="${categoryClass}">${escapeHTML(complaint.category || 'N/A')}</span></td>
                <td>${escapeHTML(complaint.description || 'N/A')}</td>
                <td>${formattedDate}</td>
                <td>${complaint.flatOwnerId || 'N/A'}</td>
                <td>
                    <button class="delete-btn" data-id="${complaint.id}" data-owner="${complaint.flatOwnerId}">Delete</button>
                </td>
                `;

                // Append the row to the table body
                complaintTableBody.appendChild(row);
            });

            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const complaintId = this.getAttribute('data-id');
                    const ownerId = this.getAttribute('data-owner');
                    deleteComplaint(complaintId, ownerId);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching complaints:', error);
            // Show error message to user
            const complaintTableBody = document.querySelector('#noticeTable tbody');
            complaintTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading complaints. Please check your connection.</td></tr>';
            showNotification("Failed to load complaints. Please try again later.", "error");
        });
}

// Function to delete a complaint
function deleteComplaint(id, ownerId) {
    if (!confirm(`Are you sure you want to delete complaint #${id} from owner #${ownerId}?`)) {
        return;
    }

    // Use the correct URL based on your API structure
    // This assumes your API expects the complaint ID in the URL
    // If you need to also pass the flatOwnerId, we'll add it as a query parameter
    const deleteUrl = `${deleteComplaintUrl}${id}?flatOwnerId=${ownerId}`;

    fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // Add any required headers here, like authorization if needed
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        return response.json().catch(() => {
            // If the response is not JSON, just return an empty success indicator
            return { success: true };
        });
    })
    .then(data => {
        // Refresh the complaints table
        fetchComplaints();
        
        // Show success message
        showNotification("Complaint deleted successfully!", "success");
    })
    .catch(error => {
        console.error('Error deleting complaint:', error);
        showNotification("Error deleting complaint. Please try again.", "error");
    });
}

// Helper function to escape HTML to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    return str
        .toString()
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

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
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
document.head.appendChild(notificationStyle);

// Initialize sidebar toggle
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
    
    // Highlight the active nav item - fix to highlight Complaints instead of Notices
    document.querySelectorAll('.nav-item').forEach(item => {
        const navText = item.querySelector('.nav-text').textContent;
        
        if (navText === 'Complaints') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Load complaints
    fetchComplaints();
});



document.getElementById("logoutBtn").addEventListener("click", function () {
    window.location.href = "/Landing Page/index.html";
  });