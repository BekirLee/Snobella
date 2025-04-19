const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const wishlistIDs = currentUser?.wishlist || [];

wishlistIDs.forEach(async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  const product = await res.json();
});
