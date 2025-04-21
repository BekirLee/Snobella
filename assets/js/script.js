const BASE_URL = "http://localhost:3000";
// const BASE_URL = "http://localhost:3000";

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

      console.log(product);

      const productElement = document.createElement("div");
      productElement.classList.add("product");

      const productImage = document.createElement("img");
      productImage.src = "../assets/imgs" + product.photo;
      productImage.alt = product.title;

      const productTitle = document.createElement("h3");
      productTitle.textContent = product.title;

      const productPrice = document.createElement("p");
      productPrice.textContent = `${product.price} AZN`;

      const productDescription = document.createElement("p");
      productDescription.textContent = product.description.slice(0, 60) + "..."; // Description

      const discountBadge = document.createElement("div");
      discountBadge.className = "discount";
      discountBadge.textContent = "30 %";

      productElement.addEventListener("click", (e) => {
        if (!e.target.closest(".wishlist-icon, .basket-icon")) {
          window.location.href = `../assets/pages/details.html?id=${product.id}`;
        }
      });

      const wishlistIcon = document.createElement("div");
      wishlistIcon.className = "wishlist-icon";
      wishlistIcon.innerHTML = isInWishlist
        ? '<i class="fas fa-heart"></i>'
        : '<i class="far fa-heart"></i>';

      wishlistIcon.addEventListener("click", () =>
        toggleWishlist(product.id, wishlistIcon)
      );

      const basketIcon = document.createElement("div");
      basketIcon.className = "basket-icon";
      basketIcon.innerHTML = isInBasket ? "Add to Cart" : "Add to Cart";

      basketIcon.addEventListener("click", () =>
        addToBasket(product.id, wishlistIcon)
      );

      const rating = document.createElement("div");
      rating.className = "rating";
      rating.innerHTML = "★★★★★";

      const priceWrapper = document.createElement("div");
      priceWrapper.innerHTML = `<span class="price">$${product.price}</span> `;

      productElement.appendChild(discountBadge);
      productElement.appendChild(wishlistIcon);
      productElement.appendChild(productImage);
      productElement.appendChild(rating);
      productElement.appendChild(productTitle);
      productElement.appendChild(priceWrapper);
      productElement.appendChild(productDescription); // Description ekle
      productElement.appendChild(basketIcon);

      productList.appendChild(productElement);
    });
  } catch (error) {
    console.error("Məhsullar alınarkən xəta baş verdi:", error);
  }
}

async function toggleWishlist(productId, icon) {
  if (!currentUser) {
    Toastify({
      text: "Zəhmət olmasa əvvəlcə daxil olun",
      backgroundColor: "red",
      duration: 2000,
    }).showToast();
    return;
  }

  try {
    const productRes = await fetch(`${BASE_URL}/products/${productId}`);
    const product = await productRes.json();
    const userRes = await fetch(`${BASE_URL}/users/${currentUser.id}`);
    const userData = await userRes.json();

    const isExist = userData.wishlist?.some(
      (item) => String(item.id) === String(productId)
    );

    let updatedWishlist;
    if (isExist) {
      updatedWishlist = userData.wishlist.filter(
        (item) => String(item.id) !== String(productId)
      );
      icon.innerHTML = '<i class="far fa-heart"></i>'; // Boş kalp
    } else {
      updatedWishlist = [...(userData.wishlist || []), product];
      icon.innerHTML = '<i class="fas fa-heart"></i>'; // Dolu kalp
    }

    const updateRes = await fetch(`${BASE_URL}/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishlist: updatedWishlist }),
    });

    if (!updateRes.ok) throw new Error("Server update failed");

    // Kullanıcı durumu senkronize edilir
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

window.onload = fetchProducts;
