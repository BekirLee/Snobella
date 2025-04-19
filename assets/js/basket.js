const BASE_URL = "http://localhost:3000/products";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const basketItems = currentUser?.basket || [];

async function fetchBasket() {
  const basketContainer = document.getElementById("basket-list");
  basketContainer.innerHTML = "";

  for (const item of basketItems) {
    const res = await fetch(`${BASE_URL}/${item.id}`);
    const product = await res.json();

    const productElement = document.createElement("div");
    productElement.classList.add("product");

    productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>${product.price} AZN</p>
            <p>Say: ${item.count}</p>
        `;

    basketContainer.appendChild(productElement);
  }
}

window.onload = fetchBasket;
