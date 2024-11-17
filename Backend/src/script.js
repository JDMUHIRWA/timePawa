// Get the current URL path
const currentPath = window.location.pathname;

// Remove any active class that might be lingering
document.querySelectorAll('.nav-list li').forEach((item) => {
  item.classList.remove('active');
});

// Add the active class based on the current URL
if (currentPath.includes("home.html")) {
  document.getElementById("home-link").classList.add("active");
} else if (currentPath.includes("breaks.html")) {
  document.getElementById("my-breaks-link").classList.add("active");
} else if (currentPath.includes("swaps.html")) {
  document.getElementById("swaps-link").classList.add("active");
} else if (currentPath.includes("schedule.html")) {
  document.getElementById("schedule-link").classList.add("active");
} else if (currentPath.includes("agents.html")) {
  document.getElementById("agents-link").classList.add("active");
}
