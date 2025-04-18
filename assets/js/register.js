const BASE_URL = "http://localhost:3000/users";

document.getElementById("registerBtn").addEventListener("click", async () => {
    const username = document.getElementById("registerUsername").value.trim();

    if (!username) {
        return Toastify({
            text: "Zəhmət olmasa username daxil edin",
            backgroundColor: "red",
            duration: 2000,
        }).showToast();
    }

    try {
        // Əvvəlcədən user varsa, qeydiyyat bloklansın
        const res = await fetch(`${BASE_URL}/users`);
        const users = await res.json();
        const isUserExist = users.find(user => user.user === username);

        if (isUserExist) {
            return Toastify({
                text: "Bu istifadəçi artıq mövcuddur",
                backgroundColor: "orange",
                duration: 2000,
            }).showToast();
        }

        // Yeni user object
        const newUser = {
            user: username,
            wishlist: [],
            basket: []
        };

        // POST ilə serverə əlavə et
        const addRes = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });

        const createdUser = await addRes.json();

        // localStorage-a yaz
        localStorage.setItem("currentUser", JSON.stringify(createdUser));

        Toastify({
            text: "Uğurla qeydiyyatdan keçdiniz",
            backgroundColor: "green",
            duration: 2000,
        }).showToast();

        // Ana səhifəyə yönləndir
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        console.error("Qeydiyyat xətası:", error);
    }
});
