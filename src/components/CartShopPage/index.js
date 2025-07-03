import { rootContainerForShop } from "../../../shop.js";
import { NavShopPage } from "../NavShopPage/index.js";


export function CartShopPage() {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const products = JSON.parse(sessionStorage.getItem("products"));
  const user = sessionStorage.getItem("user");

  const cartKey = user ? `user_${JSON.parse(user).id}` : "guest";

  const cartItems = [];
  cart[cartKey] &&
    cart[cartKey]?.forEach((cartItem) => {
      const productId = Object.keys(cartItem)[0];
      const quantity = cartItem[productId];
      const product = products.find((item) => item.id == productId);

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
  backButton.innerText = "← Continue Shopping";
  backButton.className =
    "my-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer";

  backButton.onclick = () => {
    const loader = document.createElement("div");
    loader.className =
      "fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50";
    loader.innerHTML = `
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto"></div>
      <p class="mt-3 text-lg font-medium text-gray-700">Loading store...</p>
    </div>
  `;

    document.body.appendChild(loader);

    rootContainerForShop.innerHTML = "";
    NavShopPage();
    setTimeout(() => {
      loader.classList.add("opacity-0", "transition-opacity", "duration-300");
      setTimeout(() => {
        document.body.removeChild(loader);
        window.location.href = "/src/shop/store.html";
      }, 300);
    }, 1000);
  };

  const container = document.createElement("div");
  container.className = "max-h-[60vh] overflow-y-auto pr-2";

  if (cartItems.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerText = "Cart is empty";
    emptyMessage.className = "text-lg font-semibold py-4";
    container.appendChild(emptyMessage);
  } else {
    cartItems.forEach((item) => {
      console.log(item);
      const productContainer = document.createElement("div");
      productContainer.className =
        "flex items-center justify-between py-1 rounded-lg my-2 bg-gray-200 px-5";

      const productWrapper = document.createElement("div");
      productWrapper.className = "flex ";

      const productImage = document.createElement("img");
      productImage.src = item.thumbnail;
      productImage.className = "w-16 h-16 object-cover mr-4 rounded";

      const productDetails = document.createElement("div");
      productDetails.className = "pb-4";

      const productName = document.createElement("h3");
      productName.innerText = item.title;

      const productPrice = document.createElement("p");
      productPrice.innerText = "Price:" + item.price * item.quantity + "$";

      const productQuantityWrapper = document.createElement("div");
      productQuantityWrapper.className = "flex items-center gap-2";

      const productQuantityName = document.createElement("span");
      productQuantityName.innerText = "Quantity: ";
      const productQuantity = document.createElement("p");
      productQuantity.innerText = item.quantity;

      const productQuantityPlus = document.createElement("button");
      productQuantityPlus.className =
        "px-2 py-[3px] bg-gray-100 rounded-lg cursor-pointer";
      productQuantityPlus.innerText = "+";
      const productQuantityMinus = document.createElement("button");
      productQuantityMinus.className =
        "px-2 py-[3px] bg-gray-100 rounded-lg cursor-pointer";
      productQuantityMinus.innerText = "-";

      productQuantityPlus.onclick = () => {
        item.quantity++;
        productQuantity.innerText = item.quantity;

        cart[cartKey] = cart[cartKey].map((cartItem) => {
          if (Object.keys(cartItem)[0] === item.id.toString()) {
            return { [item.id]: item.quantity };
          }
          return cartItem;
        });

        localStorage.setItem("cart", JSON.stringify(cart));
      };
      productQuantityMinus.onclick = () => {
        if (item.quantity > 1) {
          item.quantity--;
          productQuantity.innerText = item.quantity;

          cart[cartKey] = cart[cartKey].map((cartItem) => {
            if (Object.keys(cartItem)[0] === item.id.toString()) {
              return { [item.id]: item.quantity };
            }
            return cartItem;
          });

          localStorage.setItem("cart", JSON.stringify(cart));

          productPrice.innerText =
            "Price:" + item.price * item.quantity + "$";
        }
      };

      productQuantityWrapper.append(
        productQuantityName,
        productQuantityMinus,
        productQuantity,
        productQuantityPlus
      );

      const productDeleteButton = document.createElement("button");
      productDeleteButton.innerText = "Delete";
      productDeleteButton.className =
        "px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 ml-4 cursor-pointer";

      productDeleteButton.onclick = () => {
        cart[cartKey] = cart[cartKey].filter(
          (cartItem) => Object.keys(cartItem)[0] !== item.id.toString()
        );
        localStorage.setItem("cart", JSON.stringify(cart));
        container.innerHTML = "";
        CartShopPage();
      };

      productDetails.appendChild(productName);
      productDetails.appendChild(productPrice);
      productDetails.appendChild(productQuantityWrapper);
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

  rootContainerForShop.appendChild(cartDropDown);
}
