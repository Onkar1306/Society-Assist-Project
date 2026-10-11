// API URLs
const getAllNoticesUrl = "http://localhost:8086/notice";
const addNoticeUrl = "http://localhost:8086/notice/add";
const deleteNoticeUrl = "http://localhost:8086/notice/delete/"; // Base URL for delete endpoint

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
                noticeTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No notices available</td></tr>';
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
                <td>
                    <button class="delete-btn" data-id="${notice.id}">Delete</button>
                </td>
                `;

                // Append the row to the table body
                noticeTableBody.appendChild(row);
            });

            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const noticeId = this.getAttribute('data-id');
                    deleteNotice(noticeId);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching notices:', error);
            // Show error message to user
            const noticeTableBody = document.querySelector('#noticeTable tbody');
            noticeTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error loading notices. Please check your connection.</td></tr>';
            showNotification("Failed to load notices. Please try again later.", "error");
        });
}

// Function to delete a notice
function deleteNotice(id) {
    if (!confirm('Are you sure you want to delete this notice?')) {
        return;
    }

    fetch(deleteNoticeUrl + id, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Refresh the notices table
        fetchNotices();
        
        // Show success message
        showNotification("Notice deleted successfully!", "success");
    })
    .catch(error => {
        console.error('Error deleting notice:', error);
        showNotification("Error deleting notice. Please try again.", "error");
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

// Modal functionality
const modal = document.getElementById("addNoticeModal");
const btn = document.getElementById("addNoticeBtn");
const closeBtn = document.querySelector(".close");

// Open modal when the button is clicked
btn.onclick = function() {
    modal.style.display = "block";
    // Clear form fields when opening modal
    document.getElementById("addNoticeForm").reset();
};

// Close modal when the X is clicked
closeBtn.onclick = function() {
    modal.style.display = "none";
};

// Close modal when clicking outside the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Handle form submission
document.getElementById("addNoticeForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Get form values
    const subject = document.getElementById("subject").value.trim();
    const description = document.getElementById("description").value.trim();
    
    // Validate input
    if (!subject || !description) {
        showNotification("Please fill in all fields", "error");
        return;
    }
    
    const noticeData = {
        subject: subject,
        description: description
    };
    
    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Send POST request to add new notice
    fetch(addNoticeUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(noticeData)
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
        document.getElementById("addNoticeForm").reset();
        
        // Refresh the notices table
        fetchNotices();
        
        // Show success message
        showNotification("Notice added successfully!", "success");
    })
    .catch(error => {
        console.error("Error adding notice:", error);
        showNotification("Error adding notice. Please try again.", "error");
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

// Add notification styles
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
    .delete-btn {
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
    }
    .delete-btn:hover {
        background-color: #d32f2f;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);

// Initial load of notices data
document.addEventListener('DOMContentLoaded', function() {
    fetchNotices();
});