import { updateCartCount } from "../../helpers/index.js";
import { rootContainer } from "../../script.js";


function handleBuyButtonClick(productId) {
  const storedData = localStorage.getItem("cart");
  const cart = storedData ? JSON.parse(storedData) : {};
  const user = JSON.parse(sessionStorage.getItem("user")); 

  const cartKey = user ? `user_${user.id}` : "guest";

  if (!cart[cartKey]) {
    cart[cartKey] = [];
  }

  let productFound = false;
  for (const item of cart[cartKey]) {
    if (item[productId] !== undefined) {
      item[productId] += 1; 
      productFound = true;
      break;
    }
  }

  if (!productFound) {
    cart[cartKey].push({ [productId]: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  
  animateCartIcon()
  updateCartCount()
}

 function animateCartIcon() {
  const cartIcon = document.querySelector(".fa-shopping-cart");
  if (!cartIcon) return;

  cartIcon.classList.add("cart-pulse");

  setTimeout(() => {
    cartIcon.classList.remove("cart-pulse");
  }, 500);
}
export function renderProducts(products) {
  const slicedProducts = products.slice(0, 8);
  const containerWrapper = document.createElement("div");
  containerWrapper.className = "flex flex-col mx-auto my-10";
  const container = document.createElement("div");
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))";
  container.style.gap = "20px";
  container.style.padding = "20px";

  slicedProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "border-1 p-[15px] rounded-lg";
    card.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1))";

    const title = document.createElement("h3");
    title.innerText = product.title;
    title.className = "mt-0";

    const price = document.createElement("p");
    price.innerText = `Price: $${product.price}`;
    price.className = "font-bold";

    const discount = document.createElement("p");
    discount.innerText = `Discount: ${product.discountPercentage}% off`;
    discount.className = "text-green-400";

    const rating = document.createElement("p");
    rating.innerText = `Rating: ${product.rating}`;

    const thumbnail = document.createElement("img");
    thumbnail.src = product.thumbnail;
    thumbnail.alt = product.title;
    thumbnail.className = "w-full h-[200px] object-cover rounded";

    const button = document.createElement("button");
    button.innerText = "Buy";
    button.className =
      "py-2 px-5 mt-1 font-semibold bg-red-500 rounded cursor-pointer hover:bg-black hover:text-white";

    button.onclick = () => {
      handleBuyButtonClick(product.id);
    };

    container.appendChild(card);

    card.appendChild(thumbnail);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(discount);
    card.appendChild(rating);
    card.appendChild(button);
  });
  const shopButtonWrapper = document.createElement("div");
  shopButtonWrapper.className = "flex justify-center mt-5";
  const shopButton = document.createElement("button");
  shopButton.innerText = "Go to Shop";
  shopButton.className =
    "py-2 px-5 mt-1 font-semibold bg-red-500 rounded cursor-pointer hover:bg-black hover:text-white";
  shopButton.onclick = () => {
    window.location.href = "store.html";
  };

  shopButtonWrapper.appendChild(shopButton);
  containerWrapper.appendChild(container);
  containerWrapper.appendChild(shopButtonWrapper);
  if (rootContainer) {
    rootContainer.appendChild(containerWrapper);
  }
}
