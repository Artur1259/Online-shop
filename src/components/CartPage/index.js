import { getDate } from "../../helpers/index.js";
import { rootContainer } from "../../script.js";
import { MenuPage } from "../MenuPage/index.js";

export function CartPage() {
  const cart = JSON.parse(sessionStorage.getItem("cart"));
  const products = JSON.parse(sessionStorage.getItem("products"));


  const cartItems = [];
  cart &&
    cart.forEach((cartItem) => {
      const productId = Object.keys(cartItem)[0];
      const quantity = cartItem[productId];
      const product = products.filter((item) => item.id == productId);

      if (product) {
        cartItems.push({
          ...product,
          quantity,
        });
      }
    });

  const cartDropDown = document.createElement("div");
  cartDropDown.className =
    "fixed top-0 left-0 w-full h-full bg-gray-300 bg-opacity-50 z-50 flex justify-center items-start pt-20";

  const cartContent = document.createElement("div");
  cartContent.className = "bg-white rounded-lg shadow-xl w-full max-w-2xl p-6";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold mb-4";
  title.textContent = "Cart";

  const backButton = document.createElement("button");
  backButton.innerText = "← Back";
  backButton.className =
    "mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700";

  backButton.onclick = () => {
    rootContainer.innerHTML = "";
    getDate();
    MenuPage();
  };

  const container = document.createElement("div");
  container.className = "max-h-[60vh] overflow-y-auto pr-2"

  if (cartItems.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerText = "Cart is empty";
    emptyMessage.className = "text-lg font-semibold py-4";
    container.appendChild(emptyMessage);
  } else {
    cartItems.forEach((item) => {
      console.log(item)
      const productContainer = document.createElement("div");
      productContainer.className =
        "flex items-center justify-between py-2 border-b-gray-200";

      const productWrapper = document.createElement("div");
      productWrapper.className = "flex ";

      const productImage = document.createElement("img");
      productImage.src = item[0].thumbnail;
      productImage.className = "w-16 h-16 object-cover mr-4 rounded";

      const productDetails = document.createElement("div");
      productDetails.className = "pb-4";

      const productName = document.createElement("h3");
      productName.innerText = item[0].title;

      const productPrice = document.createElement("p");
      productPrice.innerText = "Price:" + item[0].price * item.quantity + "$";

      const productQuantity = document.createElement("p");
      productQuantity.innerText = "Quantity: " + item.quantity;

      const productDeleteButton = document.createElement("button");
      productDeleteButton.innerText = "Delete";
      productDeleteButton.className =
        "px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 ml-4 cursor-pointer";

      productDeleteButton.onclick = () => {
        const updatedCart = cart.filter((cartItem)=>Object.keys(cartItem)[0] !== item[0].id.toString());
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
        container.innerHTML = "";
        CartPage();
      };

      
      productDetails.appendChild(productName);
      productDetails.appendChild(productPrice);
      productDetails.appendChild(productQuantity);
      productContainer.appendChild(productWrapper);
      productWrapper.appendChild(productImage);
      productWrapper.appendChild(productDetails);
      productContainer.appendChild(productDeleteButton);
      container.appendChild(productContainer);
    });
  }

  cartDropDown.appendChild(cartContent);
  cartContent.appendChild(title);
  cartContent.appendChild(container);
  cartContent.appendChild(backButton);

  rootContainer.appendChild(cartDropDown);
}
