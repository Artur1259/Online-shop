import { auth } from "../../helpers/auth.js";
import { rootContainerForShop } from "../../../shop.js";
import { NavShopPage } from "../NavShopPage/index.js";
import { RenderShopPage } from "../RenderShopPage/index.js";

export async function UserInfoPage(userData) {
  const wrapper = document.createElement("div");
  wrapper.className = "max-w-[1280px] m-auto ";

  const userInfoContainer = document.createElement("div");
  userInfoContainer.className = "w-full bg-gray-200 p-5";


  const userImageWrapper =document.createElement("div")
  userImageWrapper.className = "w-20 h-20 rounded-full border-2 border-black p-1 "
  const userImage = document.createElement("img");
  userImage.src = userData.image;

  const userName = document.createElement('h1')
  userName.innerText = userData.firstName + " " + userData.lastName
  userName.className ="font-bold text-2xl"

  const userEmail = document.createElement('p')
  userEmail.innerText = userData.email



  const logOutButton = document.createElement("button")
  logOutButton.innerText = "LogOut"
  logOutButton.className = "mt-10 py-2 px-5 bg-red-500 rounded-lg cursor-pointer text-white hover:scale-105 hover:bg-red-700"

  logOutButton.onclick = () => {
    auth.logout();
    rootContainerForShop.innerHTML = '';
    NavShopPage().then(() => {
      RenderShopPage();
    });
  };



  userImageWrapper.appendChild(userImage)
  userInfoContainer.append(userImageWrapper,userName,userEmail, logOutButton);
  wrapper.appendChild(userInfoContainer);

  rootContainerForShop.appendChild(wrapper);
}
