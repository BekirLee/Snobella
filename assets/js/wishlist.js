const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
  wishlist: [],
};

// console.log(currentUser.wishlist);

fetchWishlist();

function fetchWishlist() {
  const wishlistContainer = document.getElementById("wishlist-list");
  wishlistContainer.innerHTML = "";

  const wishlistItems = currentUser.wishlist;
  console.log(wishlistItems);

  if (!wishlistItems || wishlistItems.length === 0) {
    wishlistContainer.innerHTML = `
      <div class="empty-wishlist">
        <p>Favori ürününüz bulunmamaktadır</p>
        <a href="../../index.html">Ürünlere Gözat</a>
      </div>
    `;
    return;
  }

  wishlistItems.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("wishlist-product");

    productElement.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div class="product-info">
        <h3>${product.title}</h3>
        <p class="price">${product.price} AZN</p>
        <div class="wishlist-buttons">
          <button onclick="removeFromWishlist('${product.id}', this)" class="remove-btn">
            ❌ Sil
          </button>
          <button onclick="addToBasket('${product.id}')" class="add-to-cart">
            🛒 Səbətə Əlavə Et
          </button>
        </div>
      </div>
    `;

    wishlistContainer.appendChild(productElement);
  });
}

function removeFromWishlist(productId, element) {
  const updatedWishlist = currentUser.wishlist.filter(
    (item) => String(item.id) !== String(productId)
  );

  fetch(`${BASE_URL}/users/${currentUser.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wishlist: updatedWishlist }),
  })
    .then(() => {
      currentUser.wishlist = updatedWishlist;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      element.closest(".wishlist-product").remove();

      Toastify({
        text: "Ürün favorilerden çıkarıldı",
        backgroundColor: "orange",
        duration: 2000,
      }).showToast();

      if (updatedWishlist.length === 0) {
        document.getElementById("wishlist-list").innerHTML = `
          <div class="empty-wishlist">
            <p>Favori ürününüz bulunmamaktadır</p>
          </div>
        `;
      }
    })
    .catch((error) => {
      console.error("Favori silme hatası:", error);
    });
}

function addToBasket(productId) {
  if (!currentUser) {
    Toastify({
      text: "Zəhmət olmasa əvvəlcə daxil olun",
      backgroundColor: "red",
      duration: 2000,
    }).showToast();
    return;
  }

  const productToAdd = currentUser.wishlist.find(
    (item) => String(item.id) === String(productId)
  );
  if (!productToAdd) return;

  const existingIndex =
    currentUser.basket?.findIndex(
      (item) => String(item.id) === String(productId)
    ) ?? -1;

  let updatedBasket = [...(currentUser.basket || [])];

  if (existingIndex !== -1) {
    updatedBasket[existingIndex].count += 1;
  } else {
    updatedBasket.push({
      ...productToAdd,
      count: 1,
      addedAt: new Date().toISOString(),
    });
  }

  fetch(`${BASE_URL}/users/${currentUser.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ basket: updatedBasket }),
  })
    .then(() => {
      currentUser.basket = updatedBasket;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      Toastify({
        text: "✔ Səbətə əlavə olundu",
        backgroundColor: "green",
        duration: 2000,
      }).showToast();
    })
    .catch((error) => {
      console.error("Səbətə əlavə edilərkən xəta:", error);
    });
}
