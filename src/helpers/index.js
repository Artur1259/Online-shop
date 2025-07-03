import { renderProducts } from "../components/RenderPage/index.js";

export function getDate() {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const products = data.products;
      sessionStorage.setItem("products", JSON.stringify(products));
      renderProducts(products);
    });
}

export function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const user = sessionStorage.getItem("user");

    const cartKey = user ? `user_${JSON.parse(user).id}` : "guest";
    const currentCart = cart[cartKey] || [];

    const cartIcon = document.querySelector(".fa-shopping-cart");
    if (!cartIcon) throw new Error("Иконка корзины не найдена");

    const span = cartIcon.nextElementSibling;
    if (!span || !span.classList.contains("absolute")) {
      throw new Error("Элемент счётчика не найден рядом с иконкой");
    }

    span.innerText = currentCart.length;
  } catch (error) {
    console.error("Ошибка в updateCartCount:", error);
  }
}

//Login user and get tokens

export async function loginUser(username, password) {
  try {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

export async function getUser() {
  const ACCESS_TOKEN = sessionStorage.getItem("token");
  console.log(ACCESS_TOKEN);
  const response = await fetch("https://dummyjson.com/user/me", {
    method: "GET",
    headers: {
      Authorization: ACCESS_TOKEN, // Pass JWT via Authorization header
    },
  });
  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return await response.json();
}
