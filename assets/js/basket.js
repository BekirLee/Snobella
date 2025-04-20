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

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;

    const title = document.createElement("h3");
    title.textContent = product.title;

    const price = document.createElement("p");
    price.textContent = `${product.price} AZN`;

    const count = document.createElement("p");
    count.textContent = `Say: ${item.count}`;

    productElement.appendChild(img);
    productElement.appendChild(title);
    productElement.appendChild(price);
    productElement.appendChild(count);

    basketContainer.appendChild(productElement);
  }
}

window.onload = fetchBasket;
