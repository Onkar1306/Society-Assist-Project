// Sidebar Toggle Logic
let sidebarExpanded = true;

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const toggleBtn = document.getElementById('sidebarToggle');

  if (sidebarExpanded) {
    sidebar.style.width = '70px';
    content.style.marginLeft = '70px';
    document.querySelectorAll('.nav-text').forEach(el => el.style.display = 'none');
    document.querySelector('.app-title').style.display = 'none';
    toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  } else {
    sidebar.style.width = '250px';
    content.style.marginLeft = '250px';
    setTimeout(() => {
      document.querySelectorAll('.nav-text').forEach(el => el.style.display = 'inline');
      document.querySelector('.app-title').style.display = 'block';
      toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    }, 150);
  }

  sidebarExpanded = !sidebarExpanded;
}

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'sidebarToggle';
  toggleBtn.className = 'sidebar-toggle';
  toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  toggleBtn.onclick = toggleSidebar;
  sidebar.appendChild(toggleBtn);

  if (window.innerWidth <= 768) {
    sidebarExpanded = true;
    toggleSidebar();
  }
});




document.getElementById("logoutBtn").addEventListener("click", function () {
  window.location.href = "/Landing Page/index.html";
});