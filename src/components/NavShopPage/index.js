import { rootContainerForShop } from "../../../shop.js";
import { RenderShopPage } from "../RenderShopPage/index.js";
import { CartShopPage } from "../CartShopPage/index.js";
import { updateCartCount } from "../../helpers/index.js";
import { UserInfoPage } from "../UserInfoPage/index.js";
import { auth } from "../../helpers/auth.js";

async function loadCategories() {
  const url = `https://dummyjson.com/products/category-list`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function updateCategories(categoriesName) {
  const url = `https://dummyjson.com/products/category/${categoriesName}`;
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data)
  return data;
}

function showNoResultsMessage() {
  const existingMessage = rootContainerForShop.querySelector('.no-results-message');
  if (existingMessage) {
    existingMessage.remove();
  } 

  const messageElement = document.createElement('div');
  messageElement.className = 'no-results-message w-full text-center py-8 text-gray-500';
  messageElement.innerHTML = `
    <i class="fas fa-search fa-2x mb-2"></i>
    <p class="text-lg font-semibold">No products found</p>
    <p class="text-sm">Try changing the search query</p>
  `;

  rootContainerForShop.appendChild(messageElement);
}


function validateSearchInput(query) {
  console.log(query)
  const regex = /^[a-zA-Z0-9\s]*$/;
  const meaninglessPattern = /(.)\1{4,}/;

  if (query.length < 3) {
    return {
      isValid: false,
      message: "The minimum search length is 3 characters.",
    };
  }

  if (query.length > 20) {
    return {
      isValid: false,
      message: "The maximum search length is 20 characters.",
    };
  }

  if (!regex.test(query)) {
    return { isValid: false, message: "Only letters and numbers can be used." };
  }

  if (meaninglessPattern.test(query)) {
    return { isValid: false, message: "Please enter a meaningful query." };
  }
  return { isValid: true };
}

export async function NavShopPage() {
  const nav = document.createElement("div");
  nav.className =
    "max-w-[1280px] m-auto h-16 bg-red-600 rounded flex items-center justify-between px-10 py-8 my-2";

  const logoWrapper = document.createElement("div");
  const logo = document.createElement("p");
  logo.innerHTML = `<i class="fas fa-store"></i> Shop`;
  logo.className = "text-2xl text-white font-bold cursor-pointer";

  logoWrapper.onclick = () => {
    window.location.href = "/src/shop/store.html";
  };

  const menu = document.createElement("div");
  menu.className = "flex items-center gap-4";

  const categoryButton = document.createElement("button");
  categoryButton.innerHTML = `<i class="fas fa-book text-[14px]"></i> <br> Categories`;
  categoryButton.className =
    "relative group py-[7px] px-3 text-[8px] bg-red-500 text-white rounded hover:bg-red-700 cursor-pointer duration-300";

  const categories = document.createElement("div");
  categories.className =
    "absolute max-h-[35vh] overflow-y-auto  w-48 top-10 -left-4 bg-white shadow-lg rounded p-4 hidden group-hover:block ";

  const categoriesList = document.createElement("ul");
  categoriesList.className = "flex flex-col items-start";

  const categoriesData = await loadCategories();
  categoriesData.forEach((category) => {
    const firstLetter = category.charAt(0).toUpperCase();
    category = firstLetter + category.slice(1).toLowerCase();
    const categoryItem = document.createElement("li");
    categoryItem.className =
      "text-gray-700  font-semibold text-[14px] hover:bg-red-300 px-2 py-1 rounded cursor-pointer duration-300";
    categoryItem.innerText = category;

    categoryItem.addEventListener("click", async (e) => {
      e.preventDefault();
      const categoryName = e.target.innerText;
      const productsCategory = await updateCategories(categoryName);
      RenderShopPage(productsCategory.products);
    });

    categoriesList.appendChild(categoryItem);
  });

  const searchInputWrapper = document.createElement("div");
  searchInputWrapper.className = "relative w-64 h-10 border-gray-300";

  const searchInput = document.createElement("input");
  searchInput.placeholder = "Search";
  searchInput.maxLength = 25;
  searchInput.className =
    "w-full h-full bg-white rounded px-3 focus:outline-none";

  const searchIcon = document.createElement("button");
  searchIcon.className =
    "absolute right-0 top-0 h-full px-3 rounded bg-yellow-300/90 cursor-pointer hover:bg-yellow-300/75 duration-300";
  searchIcon.innerText = "🔍";

  async function searchProducts(query) {
    const validation = validateSearchInput(query);
    if (!validation.isValid) {
      showSearchError(validation.message);
      return;
    }

    searchIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
    const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
    const data = await response.json();
    
    if (data.products && data.products.length > 0) {
      RenderShopPage(data.products);
    } else {
      rootContainerForShop.innerHTML = '';
      await NavShopPage(); 
      showNoResultsMessage();
    }
    
  } catch (error) {
    console.error("Search error:", error);
    showSearchError("Ошибка при поиске. Попробуйте позже.");
  } finally {
    searchIcon.innerHTML = "🔍";
  }
  }
  function showSearchError(message) {
    const existingError = searchInputWrapper.querySelector(".search-error");
    if (existingError) {
      existingError.remove();
    }

    const errorElement = document.createElement("div");
    errorElement.className =
      "search-error absolute top-full left-0 mt-1 text-red-500 text-xs bg-white p-1 rounded shadow";
    errorElement.textContent = message;

    searchInputWrapper.appendChild(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 3000);
  }
  searchIcon.addEventListener("click", () => {
    const query = searchInput.value.trim();
   

    if (query.length > 0) {
      const validation = validateSearchInput(query);
      if (!validation.isValid) {
        showSearchError(validation.message);
      }else{
        searchProducts(query);
      }
    }
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();

      if (query.length > 0) {
        const validation = validateSearchInput(query);
        if (!validation.isValid) {
          showSearchError(validation.message);
        }else{
          searchProducts(query);
        }
      }
    }
  });

  const cart = document.createElement("div");
  cart.className =
    "relative cursor-pointer h-10 w-10 flex items-center justify-center rounded bg-red-500 hover:bg-red-700 duration-300";

  const cartIcon = document.createElement("i");
  cartIcon.className =
    "fas fa-shopping-cart text-xl relative text-white hover:scale-110 duration-300";

  const span = document.createElement("span");
  span.className =
    "absolute -top-1 -right-2 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] ";
  span.innerText = "0";

  cart.onclick = () => {
    rootContainerForShop.innerHTML = "";
    CartShopPage();
  };

  const userIcon = document.createElement("img");

  userIcon.className =
    "fas fa-user text-xl text-white cursor-pointer hover:scale-110 duration-300 user-icon";

  userIcon.onclick = () => {
    UserInfoPage();
  };

  const userContainer = document.createElement("div");
  userContainer.className =
    "flex items-center relative group user-icon-container";
  userContainer.appendChild(userIcon);
  menu.appendChild(userContainer);

  const updateUserIcon = () => {
    userContainer.innerHTML = "";
    console.log(auth);
    if (auth.isAuthenticated && auth.user) {
      const userIcon = document.createElement("img");
      userIcon.className =
        "w-8 h-8 rounded-full object-cover cursor-pointer hover:scale-110 duration-300 border-2 border-white";
      userIcon.src = auth.user.image;
      userIcon.alt = `${auth.user.firstName} ${auth.user.lastName}`;

      userIcon.onclick = async () => {
        rootContainerForShop.innerHTML = "";
        await NavShopPage();
        UserInfoPage(auth.user);
      };

      const userName = document.createElement("span");
      userName.className =
        "hidden group-hover:block absolute top-full right-0 mt-1 bg-black/80 text-white text-sm px-2 py-1 rounded z-10";
      userName.innerText = `${auth.user.firstName} ${auth.user.lastName}`;

      userContainer.appendChild(userIcon);
      userContainer.appendChild(userName);
    } else {
      const userIcon = document.createElement("i");
      userIcon.className =
        "fas fa-user text-xl text-white cursor-pointer hover:scale-110 duration-300";

      userIcon.onclick = () => {
        window.location.href = "/src/user.html";
        window.history.replaceState({}, "", "/src/shop/store.html");
      };

      userContainer.appendChild(userIcon);
    }
  };

  updateUserIcon();

  nav.appendChild(logoWrapper);
  nav.appendChild(menu);
  logoWrapper.appendChild(logo);
  menu.appendChild(categoryButton);
  categoryButton.appendChild(categories);
  categories.appendChild(categoriesList);
  searchInputWrapper.appendChild(searchInput);
  searchInputWrapper.appendChild(searchIcon);
  menu.appendChild(searchInputWrapper);
  menu.appendChild(cart);
  cart.appendChild(cartIcon);
  cart.appendChild(span);
  menu.appendChild(userContainer);

  rootContainerForShop.appendChild(nav);
  updateCartCount();
}
// try {
//   const userData = await getUser();

//   userIcon.className =
//     "w-8 h-8 rounded-full object-cover cursor-pointer hover:scale-110 duration-300 border-2 border-white";
//   userIcon.src = userData.image;
//   userIcon.alt = `${userData.firstName} ${userData.lastName}`;

//   userIcon.onclick = async () => {
//     rootContainerForShop.innerHTML = "";
//     await NavShopPage();
//     UserInfoPage(userData);
//   };
//   const userName = document.createElement("span");
//   userName.className =
//     "hidden group-hover:block absolute top-full right-0 mt-1 bg-black/80 text-white text-sm px-2 py-1 rounded z-10 user-name";
//   userName.innerText = `${userData.firstName} ${userData.lastName}`;
//   userContainer.appendChild(userName);
// } catch (error) {
//   console.error("Ошибка загрузки данных:", error);
// }
