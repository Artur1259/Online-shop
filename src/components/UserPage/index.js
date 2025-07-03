import { rootContainerForUsers } from "../../../user.js";
import { auth } from "../../helpers/auth.js";
import { loginUser } from "../../helpers/index.js";

export function UserPage() {
  const userPageWrapper = document.createElement("div");
  userPageWrapper.className =
    "fixed top-0 left-0 w-full h-full bg-gray-300 bg-opacity-50 z-50 flex justify-center items-center ";
  const userPageContainer = document.createElement("div");
  userPageContainer.className =
    "bg-white rounded-lg shadow-xl w-full max-w-xl py-16 px-10 flex flex-col gap-5";

  const userPageTitle = document.createElement("h2");
  userPageTitle.innerText = "Welcome Back";
  userPageTitle.className = "text-4xl font-bold pb-4";

  const userLoginForm = document.createElement("form");
  userLoginForm.className = "flex flex-col gap-3";

  const userNameLabel = document.createElement("label");
  userNameLabel.innerText = "Username";
  const userNameInput = document.createElement("input");
  userNameInput.type = "text";
  userNameInput.placeholder = "Enter your username";
  userNameInput.className = "p-2 border-2 border-gray-300 rounded-lg invalid:border-pink-500 focus:outline-sky-500";

  const userPasswordLabel = document.createElement("label");
  userPasswordLabel.innerText = "Password";
  const userPasswordInput = document.createElement("input");
  userPasswordInput.type = "password";
  userPasswordInput.placeholder = "Enter your password";
  userPasswordInput.className = "p-2 border-2 border-gray-300 rounded-lg focus:outline-sky-500";

  const userLoginButton = document.createElement("button");
  userLoginButton.type = "submit";
  userLoginButton.innerText = "Login";
  userLoginButton.className =
    "bg-red-500 text-white font-semibold mt-3 p-2 rounded cursor-pointer hover:bg-red-600 duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  userLoginButton.disabled = true;

  function validateInputs() {
    const isUsernameValid = userNameInput.value.trim() !== "";
    const isPasswordValid = userPasswordInput.value.trim() !== "";

    if (isUsernameValid) {
      userNameInput.classList.remove("border-red-500");
    } else {
      userNameInput.classList.add("border-red-500");
    }

    if (isPasswordValid) {
      userPasswordInput.classList.remove("border-red-500");
    } else {
      userPasswordInput.classList.add("border-red-500");
    }

    userLoginButton.disabled = !(isUsernameValid && isPasswordValid);
  }

  userNameInput.addEventListener("input", validateInputs);
  userPasswordInput.addEventListener("input", validateInputs);

  userLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = userNameInput.value;
    const password = userPasswordInput.value;
    userNameInput.value = "";
    userPasswordInput.value = "";
    const userData = await loginUser(username, password);
    console.log("User Data:", userData);
    auth.login(userData);

    if (userData?.id) {
      const userId = `user_${userData.id}`;
      const cart = JSON.parse(localStorage.getItem("cart")) || {};

      if (cart.guest) {
        if (!cart[userId]) {
          cart[userId] = [];
        }
        cart.guest.forEach((guestProduct) => {
          const productId = Object.keys(guestProduct)[0];
          const quantity = guestProduct[productId];

          const existingItem = cart[userId].find(
            (item) => item[productId] !== undefined
          );

          if (existingItem) {
            existingItem[productId] += quantity;
          } else {
            cart[userId].push({ [productId]: quantity });
          }
        });
        delete cart.guest;
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      window.history.replaceState({}, "", "index.html");
      window.location.href = "store.html";
    }
  });

  const userSpanWrapper = document.createElement("div");
  userSpanWrapper.className = "flex justify-center items-center gap-2 mt-3";
  const userSpan = document.createElement("span");
  userSpan.innerText = "Don't have an account? ";
  const userSpanLink = document.createElement("a");
  userSpanLink.innerText = "Sign Up";
  userSpanLink.className = "text-blue-500 hover:underline cursor-pointer";
  userSpanWrapper.appendChild(userSpan);
  userSpanWrapper.appendChild(userSpanLink);

  userPageContainer.appendChild(userPageTitle);
  userPageContainer.appendChild(userLoginForm);
  userLoginForm.appendChild(userNameLabel);
  userLoginForm.appendChild(userNameInput);
  userLoginForm.appendChild(userPasswordLabel);
  userLoginForm.appendChild(userPasswordInput);
  userLoginForm.appendChild(userLoginButton);
  userPageContainer.appendChild(userSpanWrapper);
  userPageWrapper.appendChild(userPageContainer);
  rootContainerForUsers.appendChild(userPageWrapper);
}
