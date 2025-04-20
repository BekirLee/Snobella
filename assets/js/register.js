const BASE_URL = "http://localhost:3000/users";

document
  .getElementById("register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const newUser = {
      user: username,
      email: email,
      password: password,
      wishlist: [],
      basket: [],
    };

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Qeydiyyat baş tutmadı");
      }

      const createdUser = await response.json();

      localStorage.setItem("currentUser", JSON.stringify(createdUser));

      window.location.href = "login.html";
    } catch (error) {
      console.error("Qeydiyyat xətası:", error);
      alert("Qeydiyyat zamanı xəta baş verdi. Xahiş edirik yenidən cəhd edin.");
    }
  });
