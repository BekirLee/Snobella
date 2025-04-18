const BASE_URL = "http://localhost:3000/users";

// Qeydiyyat formu submit edildikdə
document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Formun yenilənməsinin qarşısını alır

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Yeni istifadəçi məlumatını hazırlayırıq
    const newUser = {
        user: username,
        email: email,
        password: password,
        wishlist: [], // Boş wishlist
        basket: []    // Boş basket
    };

    try {
        // Yeni istifadəçi serverə göndəririk
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            throw new Error("Qeydiyyat baş tutmadı");
        }

        // Serverdən gələn istifadəçi məlumatını alırıq
        const createdUser = await response.json();

        // Yeni istifadəçini localStorage-da saxlayırıq
        localStorage.setItem("currentUser", JSON.stringify(createdUser));

        // İstifadəçini ana səhifəyə yönləndiririk
        window.location.href = "login.html"; // Home səhifəsinə yönləndirir
    } catch (error) {
        console.error("Qeydiyyat xətası:", error);
        alert("Qeydiyyat zamanı xəta baş verdi. Xahiş edirik yenidən cəhd edin.");
    }
});
