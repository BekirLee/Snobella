const BASE_URL = "http://localhost:3000";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

console.log(productId);

async function loadProductDetails() {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`);
    const product = await response.json();
    console.log(product);

    document.getElementById("detail-title").textContent = product.title;
    document.getElementById(
      "detail-price"
    ).textContent = `${product.price} AZN`;
    document.getElementById("detail-description").textContent =
      product.description;
    document.getElementById("detail-image").src = "../imgs" + product.photo;
  } catch (error) {
    console.error(":", error);
  }
}

if (productId) {
  loadProductDetails();
} else {
  document.body.innerHTML = "<h1>Ürün bulunamadı</h1>";
}
