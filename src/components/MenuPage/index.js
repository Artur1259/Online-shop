import { updateCartCount } from "../../helpers/index.js";
import { rootContainer } from "../../script.js";
import { CartPage } from "../CartPage/index.js";

export function MenuPage() {
  if (!rootContainer) {
    return;
  }

  const menu = document.createElement("div");
  menu.className = "w-full h-10 flex items-center justify-between px-10 py-8 font-bold text-2xl";

  const logo = document.createElement("p");
  logo.innerText = "LOGO";

  const cart = document.createElement("div");
  cart.className = "relative cursor-pointer";

  const cartIcon = document.createElement("i");
  cartIcon.className = "fas fa-shopping-cart text-2xl relative";

  const span = document.createElement("span");
  span.className = "absolute -top-1 -right-2 bg-red-700 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] ";
  span.innerText = "0";

  cart.onclick = () => {
    if (rootContainer) {
      rootContainer.innerHTML = "";
      CartPage();
    }
  };

  menu.appendChild(logo);
  menu.appendChild(cart);
  cart.appendChild(cartIcon);
  cart.appendChild(span);
  
  rootContainer.innerHTML = "";
  rootContainer.appendChild(menu);

  updateCartCount();
}