import { updateCartCount } from "../../helpers/index.js";
import { rootContainerForShop } from "../../shop/shop.js";
import { NavShopPage } from "../NavShopPage/index.js";
const limit = 8;
let skip = 0;

async function loadProducts() {
  const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.products;
}


function handleBuyButtonClick(productId) {
  const storedData = localStorage.getItem("cart");
  const cart = storedData ? JSON.parse(storedData) : {};
  const user = JSON.parse(sessionStorage.getItem("user")); // Может быть null

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
}

function createProductCard(item) {
  const productCard = document.createElement("div");
  productCard.className = "bg-gray-100 p-[15px]  rounded-lg ";
  productCard.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

  const thumbnail = document.createElement("img");
  thumbnail.src = item.thumbnail;
  thumbnail.alt = item.title;
  thumbnail.className =
    "w-full h-[200px] object-cover rounded hover:scale-110 duration-300 p-4";

  const title = document.createElement("h3");
  title.innerText = item.title;
  title.className = "mt-0";

  const price = document.createElement("p");
  price.innerText = `Price: $${item.price}`;
  price.className = "font-bold py-1";

  const discount = document.createElement("p");
  discount.innerText = `Discount: ${item.discountPercentage}%`;
  discount.className = "text-red-500 py-1";

  const buyButton = document.createElement("button");
  buyButton.innerText = "Buy Now";
  buyButton.className =
    "bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-black hover:text-white duration-300";

  buyButton.onclick = () => {
    handleBuyButtonClick(item.id);
    updateCartCount();
  };

  productCard.append(thumbnail, title, price, discount, buyButton);
  return productCard;
}

export async function RenderShopPage(productsCategory) {
  const wrapper = document.createElement("div");
  wrapper.className = "max-w-[1280px] m-auto";
  const productsContainer = document.createElement("div");
  productsContainer.className =
    "max-w-[1280px] m-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4";

  if (productsCategory) {
    rootContainerForShop.innerHTML = "";
    await NavShopPage();

    const backButton = document.createElement("button");
    backButton.textContent = "← All Products";
    backButton.className =
      "my-1 ml-4 px-4 py-2 bg-red-500 rounded cursor-pointer hover:bg-red-600";

    backButton.addEventListener("click", () => {
      rootContainerForShop.innerHTML = "";
      skip = 0;
      productsContainer.innerHTML = "";
      NavShopPage();
      RenderShopPage();
    });

    wrapper.appendChild(backButton);

    productsCategory.forEach((item) => {
      const productCard = createProductCard(item);
      productsContainer.appendChild(productCard);
    });
    wrapper.appendChild(productsContainer);
    rootContainerForShop.appendChild(wrapper);
    return;
  }

  const initialProducts = await loadProducts(limit, skip);
  initialProducts.forEach((item) => {
    productsContainer.appendChild(createProductCard(item));
    wrapper.appendChild(productsContainer);
  });

  skip += limit;

  const shopButtonWrapper = document.createElement("div");
  shopButtonWrapper.className = "w-full flex justify-center items-center py-6";

  const shopButton = document.createElement("button");
  shopButton.innerText = "Load More Products";
  shopButton.className =
    "py-2 px-5 mt-1 font-semibold bg-red-500 rounded cursor-pointer hover:bg-black hover:text-white";

  shopButton.onclick = async () => {
    shopButton.disabled = true;
    shopButton.innerText = "Loading...";
    const newProducts = await loadProducts(limit, skip);
    if (newProducts.length === 0) {
      shopButton.innerText = "No More Products";
      shopButton.disabled = true;
      return;
    }
    newProducts.forEach((item) => {
      productsContainer.appendChild(createProductCard(item));
    });
    skip += limit;
    shopButton.innerText = "Load More Products";
    shopButton.disabled = false;
  };

  shopButtonWrapper.appendChild(shopButton);
  wrapper.appendChild(shopButtonWrapper);
  rootContainerForShop.appendChild(wrapper);
}
