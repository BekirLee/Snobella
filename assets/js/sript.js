// const BASE_URL = "http://localhost:3000";

// // Məhsulu favoritə əlavə et
// async function addToWishlist(productId) {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));

//     if (!currentUser) {
//         return Toastify({
//             text: "Zəhmət olmasa əvvəlcə daxil olun",
//             backgroundColor: "red",
//             duration: 2000,
//         }).showToast();
//     }

//     const updatedWishlist = currentUser.wishlist
//         ? [...currentUser.wishlist, productId]
//         : [productId];

//     try {
//         await fetch(`${BASE_URL}/users/${currentUser.id}`, {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ wishlist: updatedWishlist }),
//         });

//         currentUser.wishlist = updatedWishlist;
//         localStorage.setItem("currentUser", JSON.stringify(currentUser));

//         Toastify({
//             text: "Favoritlərə əlavə olundu",
//             backgroundColor: "green",
//             duration: 2000,
//         }).showToast();
//     } catch (error) {
//         console.error("Wishlist xətası:", error);
//     }
// }

// // Məhsulu səbətə əlavə et
// async function addToBasket(productId) {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));

//     if (!currentUser) {
//         return Toastify({
//             text: "Zəhmət olmasa əvvəlcə daxil olun",
//             backgroundColor: "red",
//             duration: 2000,
//         }).showToast();
//     }

//     let updatedBasket = currentUser.basket || [];
//     const existing = updatedBasket.find(item => item.id === productId);

//     if (existing) {
//         existing.count += 1;
//     } else {
//         updatedBasket.push({ id: productId, count: 1 });
//     }

//     try {
//         await fetch(`${BASE_URL}/users/${currentUser.id}`, {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ basket: updatedBasket }),
//         });

//         currentUser.basket = updatedBasket;
//         localStorage.setItem("currentUser", JSON.stringify(currentUser));

//         Toastify({
//             text: "Səbətə əlavə olundu",
//             backgroundColor: "green",
//             duration: 2000,
//         }).showToast();
//     } catch (error) {
//         console.error("Basket xətası:", error);
//     }
// }


const BASE_URL = "http://localhost:3000/products";

async function fetchProducts() {
    try {
        // Məhsulları serverdən alırıq
        const response = await fetch(BASE_URL);
        const products = await response.json();

        // Məhsulları HTML-ə əlavə edirik
        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Əvvəlki məzmunu təmizləyirik

        // Məhsulları dövr edirik
        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}" />
                <h3>${product.title}</h3>
                <p>${product.price} AZN</p>
                <button onclick="addToWishlist(${product.id})">Favoritə əlavə et</button>
                <button onclick="addToBasket(${product.id})">Səbətə əlavə et</button>
            `;
            productList.appendChild(productElement);
        });
    } catch (error) {
        console.error("Məhsullar alınarkən xəta baş verdi:", error);
    }
}

window.onload = fetchProducts;
