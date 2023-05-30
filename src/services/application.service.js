export const changeLanguage = (language) => {
  localStorage.setItem("language", language);
  window.location.reload();
  console.log("Reloaded!");
};

export default {
  changeLanguage,
};
