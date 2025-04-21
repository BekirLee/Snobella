const BASE_URL = "http://localhost:3000/users";

document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(BASE_URL);
        const users = await response.json();

        const user = users.find(
            (user) => user.user === username && user.password === password
        );

        if (!user) {
            return Toastify({
                text: "Yanlış istifadəçi adı və ya şifrə",
                backgroundColor: "red",
                duration: 2000,
            }).showToast();
        }

        localStorage.setItem("currentUser", JSON.stringify(user));

        setTimeout(function () {
            window.location.href = "../../index.html"; 
        }, 500); 
    } catch (error) {
        console.error("Login xətası:", error);
        alert("Giriş zamanı xəta baş verdi. Xahiş edirik yenidən cəhd edin.");
    }
});
