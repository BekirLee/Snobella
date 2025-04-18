const BASE_URL = "http://localhost:3000";

document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();

    try {
        const res = await fetch(`${BASE_URL}/users`);
        const users = await res.json();
        const matchedUser = users.find(user => user.user === username);

        if (matchedUser) {
            localStorage.setItem("currentUser", JSON.stringify(matchedUser));
            window.location.href = "index.html";
        } else {
            Toastify({
                text: "İstifadəçi tapılmadı",
                backgroundColor: "red",
                duration: 2000,
            }).showToast();
        }
    } catch (error) {
        console.error("Login xətası:", error);
    }
});
