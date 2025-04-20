document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  renderNavbar(currentUser);
});

function renderNavbar(user) {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const container = document.createElement("div");
  container.className = "navbar-container";

  // Brand
  const brand = document.createElement("div");
  brand.className = "navbar-brand";
  const brandLink = document.createElement("a");
  brandLink.href = "/";
  brandLink.textContent = "E-Ticaret";
  brand.appendChild(brandLink);

  // Ana Linklər
  const links = document.createElement("div");
  links.className = "navbar-links";

  const productsLink = document.createElement("a");
  productsLink.href = "/products.html";
  productsLink.textContent = "Məhsullar";

  const aboutLink = document.createElement("a");
  aboutLink.href = "/about.html";
  aboutLink.textContent = "Haqqımızda";

  links.appendChild(productsLink);
  links.appendChild(aboutLink);

  // Auth bölümü
  const authSection = document.createElement("div");
  authSection.className = "auth-section";

  if (!user) {
    const loginLink = document.createElement("a");
    loginLink.href = "/assets/pages/login.html";
    loginLink.textContent = "Daxil ol";
    loginLink.className = "login-btn";

    const registerLink = document.createElement("a");
    registerLink.href = "/register.html";
    registerLink.textContent = "Qeydiyyat";
    registerLink.className = "register-btn";

    authSection.appendChild(loginLink);
    authSection.appendChild(registerLink);
  } else {
    const wishlistLink = document.createElement("a");
    wishlistLink.href = "/assets/pages/wishlist.html";
    wishlistLink.textContent = `❤️ Favorilər (${user.wishlist?.length || 0})`;
    wishlistLink.className = "wishlist-btn";

    const cartLink = document.createElement("a");
    cartLink.href = "/assets/pages/basket.html";
    cartLink.textContent = `🛒 Səbət (${getCartItemCount(user.basket)})`;
    cartLink.className = "cart-btn";

    authSection.appendChild(wishlistLink);
    authSection.appendChild(cartLink);

    const dropdown = document.createElement("div");
    dropdown.className = "user-dropdown";

    const userMenu = document.createElement("button");
    userMenu.className = "user-menu";

    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = user.avatar || "https://via.placeholder.com/30";
    avatar.alt = "Profil";

    const username = document.createElement("span");
    username.id = "username";
    username.textContent = user.username || "İstifadəçi";

    const arrow = document.createTextNode(" ▼");

    userMenu.appendChild(avatar);
    userMenu.appendChild(username);
    userMenu.appendChild(arrow);

    const dropdownContent = document.createElement("div");
    dropdownContent.className = "dropdown-content";

    const profileLink = document.createElement("a");
    profileLink.href = "/profile.html";
    profileLink.textContent = "Profil";

    const ordersLink = document.createElement("a");
    ordersLink.href = "/orders.html";
    ordersLink.textContent = "Sifarişlər";

    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.textContent = "Çıxış";
    logoutBtn.addEventListener("click", logout);

    dropdownContent.appendChild(profileLink);
    dropdownContent.appendChild(ordersLink);
    dropdownContent.appendChild(logoutBtn);

    dropdown.appendChild(userMenu);
    dropdown.appendChild(dropdownContent);
    authSection.appendChild(dropdown);
  }

  links.appendChild(authSection);
  container.appendChild(brand);
  container.appendChild(links);
  nav.appendChild(container);

  const oldNav = document.querySelector("nav");
  if (oldNav) oldNav.remove();
  document.body.insertBefore(nav, document.body.firstChild);

  initDropdowns();
}

function getCartItemCount(basket) {
  if (!basket) return 0;
  return basket.reduce((total, item) => total + (item.count || 1), 0);
}

function logout() {
  localStorage.removeItem("currentUser");
  renderNavbar(null);
  Toastify({
    text: "Uğurla çıxış edildi",
    backgroundColor: "green",
    duration: 2000,
  }).showToast();
}

function initDropdowns() {
  const dropdowns = document.querySelectorAll(".user-dropdown");
  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".user-menu");
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("active");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".user-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  });
}

window.addEventListener("storage", (event) => {
  if (event.key === "currentUser") {
    const user = JSON.parse(event.newValue);
    renderNavbar(user);
  }
});
