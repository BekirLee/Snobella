const BASE_URL = "http://localhost:3000";

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const products = await response.json();

    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach((product) => {
      const isInWishlist =
        currentUser?.wishlist?.some((item) => item.id === product.id) || false;
      const isInBasket =
        currentUser?.basket?.some((item) => item.id === product.id) || false;

      const productElement = document.createElement("div");
      productElement.classList.add("product");

      const productImage = document.createElement("img");
      productImage.src = product.image;
      productImage.alt = product.title;

      const productTitle = document.createElement("h3");
      productTitle.textContent = product.title;

      const productPrice = document.createElement("p");
      productPrice.textContent = `${product.price} AZN`;

      const discountBadge = document.createElement("div");
      discountBadge.className = "discount";
      discountBadge.textContent = "30 %";

      const wishlistIcon = document.createElement("div");
      wishlistIcon.className = "wishlist-icon";
      wishlistIcon.innerHTML = "❤";

      const rating = document.createElement("div");
      rating.className = "rating";
      rating.innerHTML = "★★★★★";

      const priceWrapper = document.createElement("div");
      priceWrapper.innerHTML = `<span class="price">$${product.price}</span> <span class="old-price">$${product.oldPrice}</span>`;

      const wishlistButton = document.createElement("button");
      wishlistButton.textContent = isInWishlist
        ? "✔ Favoritdədir"
        : "Favoritə əlavə et";
      wishlistButton.addEventListener("click", () =>
        toggleWishlist(product.id, wishlistButton)
      );

      const basketButton = document.createElement("button");
      basketButton.textContent = isInBasket
        ? "✔ Səbətdədir"
        : "Səbətə əlavə et";
      basketButton.addEventListener("click", () =>
        addToBasket(product.id, basketButton)
      );

      productElement.appendChild(discountBadge);
      productElement.appendChild(wishlistIcon);
      productElement.appendChild(productImage);
      productElement.appendChild(rating);
      productElement.appendChild(productTitle);
      // productElement.appendChild(productDescription); 
      productElement.appendChild(priceWrapper);
      productElement.appendChild(basketButton);
      productElement.appendChild(productImage);
      productElement.appendChild(productTitle);
      productElement.appendChild(productPrice);
      productElement.appendChild(wishlistButton);
      productElement.appendChild(basketButton);

      productList.appendChild(productElement);
    });
  } catch (error) {
    console.error("Məhsullar alınarkən xəta baş verdi:", error);
  }
}

async function toggleWishlist(productId, button) {
  if (!currentUser) {
    Toastify({
      text: "Zəhmət olmasa əvvəlcə daxil olun",
      backgroundColor: "red",
      duration: 2000,
    }).showToast();
    return;
  }

  try {
    productId = String(productId);

    const [productRes, userRes] = await Promise.all([
      fetch(`${BASE_URL}/products/${productId}`),
      fetch(`${BASE_URL}/users/${currentUser.id}`),
    ]);

    const product = await productRes.json();
    const userData = await userRes.json();

    const isExist =
      userData.wishlist?.some(
        (item) =>
          String(item.id) === productId || String(item.productId) === productId
      ) || false;

    let updatedWishlist;
    if (isExist) {
      updatedWishlist = userData.wishlist.filter(
        (item) =>
          String(item.id) !== productId && String(item.productId) !== productId
      );
      button.textContent = "Favoritə əlavə et";
    } else {
      updatedWishlist = [...(userData.wishlist || []), product];
      button.textContent = "✔ Favoritdədir";
    }

    const updateRes = await fetch(`${BASE_URL}/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishlist: updatedWishlist }),
    });

    if (!updateRes.ok) throw new Error("Server update failed");

    syncUserState({ ...currentUser, wishlist: updatedWishlist });

    Toastify({
      text: isExist ? "Favorilərdən çıxarıldı" : "Favorilərə əlavə edildi",
      backgroundColor: isExist ? "orange" : "green",
      duration: 2000,
    }).showToast();
  } catch (error) {
    console.error("Xəta:", error);
    Toastify({
      text: `Xəta: ${error.message}`,
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  }
}

async function addToBasket(productId, button) {
  if (!currentUser) {
    Toastify({
      text: "Zəhmət olmasa əvvəlcə daxil olun",
      backgroundColor: "red",
      duration: 2000,
    }).showToast();
    return;
  }

  try {
    productId = String(productId);

    const [productRes, userRes] = await Promise.all([
      fetch(`${BASE_URL}/products/${productId}`),
      fetch(`${BASE_URL}/users/${currentUser.id}`),
    ]);

    const product = await productRes.json();
    const userData = await userRes.json();

    let updatedBasket = Array.isArray(userData.basket)
      ? [...userData.basket]
      : [];

    const existingIndex = updatedBasket.findIndex(
      (item) =>
        String(item.id) === String(productId) ||
        String(item.productId) === String(productId)
    );

    if (existingIndex !== -1) {
      updatedBasket[existingIndex].count += 1;
    } else {
      updatedBasket.push({
        id: product.id,
        ...product,
        count: 1,
        addedAt: new Date().toISOString(),
      });
    }

    const updateRes = await fetch(`${BASE_URL}/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ basket: updatedBasket }),
    });

    if (!updateRes.ok) throw new Error("Sunucu güncelleme başarısız");

    syncUserState({ ...currentUser, basket: updatedBasket });
    button.textContent = "✔ Səbətdədir";

    Toastify({
      text: "Səbətə əlavə olundu",
      backgroundColor: "green",
      duration: 2000,
    }).showToast();
  } catch (error) {
    console.error("Kritik Hata:", error);
    Toastify({
      text: `Xəta: ${error.message}`,
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  }
}

function syncUserState(user) {
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
  renderNavbar(user);
}

// navbar
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
  brandLink.textContent = "E-Ticaret";
  brand.appendChild(brandLink);

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
    wishlistLink.href = "/wishlist.html";
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

window.onload = fetchProducts;
