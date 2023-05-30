import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// files with translations for specific languages
import latin from "./latin.json";
import cyrillic from "./cyrillic.json";

export const supportedLanguages = ["latin", "cyrillic"];

const initializeI18N = () => {
  i18n.use(initReactI18next).init({
    resources: {
      latin: {
        translation: latin,
      },
      cyrillic: {
        translation: cyrillic,
      },
    },
    // trying to obtain previously used langugage, which is stored in local storage
    lng: localStorage.getItem("language"),
    // if language specified as lng value can not be found, fallbackLng will bi used
    fallbackLng: "latin",
  });
};

export default initializeI18N;
