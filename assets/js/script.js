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

      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>${product.price} AZN</p>
        <button onclick="toggleWishlist(${product.id}, this)">
          ${isInWishlist ? "✔ Favoritdədir" : "Favoritə əlavə et"}
        </button>
        <button onclick="addToBasket(${product.id}, this)">
          ${isInBasket ? "✔ Səbətdədir" : "Səbətə əlavə et"}
        </button>
      `;

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

    currentUser.wishlist = updatedWishlist;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

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

    console.log("Ürün ID:", product.id, "Tip:", typeof product.id);
    console.log("Sepet Öğeleri:", userData.basket);

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

    currentUser.basket = updatedBasket;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    button.textContent = "✔ Səbətdədir";

    Toastify({
      text: "Səbətə əlavə olundu",
      backgroundColor: "green",
      duration: 2000,
    }).showToast();

    console.log("Son Sepet:", updatedBasket);
  } catch (error) {
    console.error("Kritik Hata:", error);
    Toastify({
      text: `Xəta: ${error.message}`,
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
  }
}

async function updateUserDataOnServer() {
  if (!currentUser?.id) return;

  try {
    await fetch(`${BASE_URL}/users/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wishlist: currentUser.wishlist || [],
        basket: currentUser.basket || [],
      }),
    });
  } catch (error) {
    console.error("Serverə istifadəçi məlumatı yenilənərkən xəta:", error);
  }
}

window.onload = fetchProducts;
