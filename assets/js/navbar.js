document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  renderNavbar(currentUser);
});

function renderNavbar(user) {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const container = document.createElement("div");
  container.className = "navbar-container";

  const brand = document.createElement("div");
  brand.className = "navbar-brand";
  const brandLink = document.createElement("a");
  brandLink.href = "/";
  brandLink.textContent = "Snobella";
  brand.appendChild(brandLink);

  const searchForm = document.createElement("form");
  searchForm.className = "search-form";
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
    }
  });

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search all product";
  searchInput.className = "search-input";

  const searchBtn = document.createElement("button");
  searchBtn.type = "submit";
  searchBtn.className = "search-btn";
  searchBtn.innerHTML = "<img src='../assets/imgs/search 1.png'>";

  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchBtn);

  const authSection = document.createElement("div");
  authSection.className = "auth-section";

  if (!user) {
    const loginLink = document.createElement("a");
    loginLink.href = "/assets/pages/login.html";
    loginLink.textContent = "Sign up";
    loginLink.className = "login-btn";

    authSection.appendChild(iconLink("👤", loginLink));
  } else {
    const wishlistLink = document.createElement("a");
    wishlistLink.href = "/assets/pages/wishlist.html";
    wishlistLink.textContent = "Wishlist";
    wishlistLink.className = "wishlist-btn";

    const cartLink = document.createElement("a");
    cartLink.href = "/assets/pages/basket.html";
    cartLink.textContent = "Basket";
    cartLink.className = "cart-btn";

    authSection.appendChild(iconLink("🤍", wishlistLink));
    authSection.appendChild(iconLink("🛍️", cartLink));

    const dropdown = document.createElement("div");
    dropdown.className = "user-dropdown";

    const userMenu = document.createElement("button");
    userMenu.className = "user-menu";

    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = "../assets/imgs/Group.png";
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

    // const profileLink = document.createElement("a");
    // profileLink.href = "/profile.html";
    // profileLink.textContent = "Profil";

    // const ordersLink = document.createElement("a");
    // ordersLink.href = "/orders.html";
    // ordersLink.textContent = "Sifarişlər";

    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.textContent = "Çıxış";
    logoutBtn.addEventListener("click", logout);

    // dropdownContent.appendChild(profileLink);
    // dropdownContent.appendChild(ordersLink);
    dropdownContent.appendChild(logoutBtn);

    dropdown.appendChild(userMenu);
    dropdown.appendChild(dropdownContent);
    authSection.appendChild(dropdown);
  }

  container.appendChild(brand);
  container.appendChild(searchForm);
  container.appendChild(authSection);
  nav.appendChild(container);

  const oldNav = document.querySelector("nav");
  if (oldNav) oldNav.remove();
  document.body.insertBefore(nav, document.body.firstChild);

  initDropdowns();
}

function iconLink(icon, linkElement) {
  const wrapper = document.createElement("div");
  wrapper.className = "icon-link";
  const iconSpan = document.createElement("span");
  iconSpan.textContent = icon;
  wrapper.appendChild(iconSpan);
  wrapper.appendChild(linkElement);
  return wrapper;
}

function getCartItemCount(basket) {
  if (!basket) return 0;
  return basket.reduce((total, item) => total + (item.count || 1), 0);
}

function logout() {
  let inner = document.querySelector("#product-list");
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
