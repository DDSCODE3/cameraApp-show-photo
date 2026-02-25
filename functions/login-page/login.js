import { login } from "../../auth/auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitInput = document.getElementById("submit");

const baseApiUrl = "https://camera-app-745e7-default-rtdb.firebaseio.com/";

let users = [];

// async function
const getUsers = async () => {
  try {
    const response = await fetch(`${baseApiUrl}users.json`);
    const data = await response.json();
    users = Object.values(data);

    console.log("users loaded:", users); // برای تست
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const checkUser = (email, password) => {
  if (users.length === 0) {
    alert("لطفاً کمی صبر کنید...");
    return;
  }

  const currentUser = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (currentUser) {
    login(currentUser);

    alert("ورود موفقیت آمیز بود!");

    window.location.href = "../../index.html";
  } else {
    alert("ایمیل یا رمز عبور اشتباه است.");
  }
};

submitInput.addEventListener("click", (event) => {
  event.preventDefault();
  checkUser(emailInput.value, passwordInput.value);
});

window.addEventListener("DOMContentLoaded", async () => {
  await getUsers();
});

console.log("login.js loaded");
