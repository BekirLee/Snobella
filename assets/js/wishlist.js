const BASE_URL = "http://localhost:3000/products";

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const wishlistIDs = currentUser?.wishlist || [];

async function fetchWishlist() {
  const wishlistContainer = document.getElementById("wishlist-list");
  wishlistContainer.innerHTML = "";

  for (const id of wishlistIDs) {
    const res = await fetch(`${BASE_URL}/${id}`);
    const product = await res.json();

    const productElement = document.createElement("div");
    productElement.classList.add("product");

    productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>${product.price} AZN</p>
        `;

    wishlistContainer.appendChild(productElement);
  }
}

window.onload = fetchWishlist;
