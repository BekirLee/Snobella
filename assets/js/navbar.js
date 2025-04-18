const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const navbarUser = document.getElementById("navbar-user");

if (currentUser && navbarUser) {
    navbarUser.textContent = currentUser.user;
}
