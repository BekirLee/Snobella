const basketItems = currentUser?.basket || [];

basketItems.forEach(async item => {
    const res = await fetch(`${BASE_URL}/products/${item.id}`);
    const product = await res.json();

});
