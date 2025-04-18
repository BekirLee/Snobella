const BASE_URL = "http://localhost:3000/users";

// Login formunun submit edilməsi
document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Formun yenilənməsinin qarşısını alır

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Bütün istifadəçiləri API-dən alırıq
        const response = await fetch(BASE_URL);
        const users = await response.json();

        // İstifadəçi doğrulamasını edirik
        const user = users.find(
            (user) => user.user === username && user.password === password
        );

        if (!user) {
            // Əgər istifadəçi tapılmadısa, Toast mesajı ilə xəbərdarlıq edirik
            return Toastify({
                text: "Yanlış istifadəçi adı və ya şifrə",
                backgroundColor: "red",
                duration: 2000,
            }).showToast();
        }

        // İstifadəçi tapıldıqda onu localStorage-a əlavə edirik
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Girişdən sonra səhifənin yönləndirilməsi
        setTimeout(function () {
            window.location.href = "../../index.html"; // Home səhifəsinə yönləndirir
        }, 500); // Yarım saniyəlik gecikmə ilə yönləndirmə
    } catch (error) {
        console.error("Login xətası:", error);
        alert("Giriş zamanı xəta baş verdi. Xahiş edirik yenidən cəhd edin.");
    }
});
