import { getDate } from "./helpers/index.js";
import { MenuPage } from "./components/MenuPage/index.js";

export const rootContainer = document.getElementById("root");
MenuPage();
getDate();