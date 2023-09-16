const modalLoaderEl = document.querySelector(".modal-loader");
const overlayEl = document.querySelector(".overlay");

export const showLoader = function () {
  overlayEl.classList.remove("hidden");
  modalLoaderEl.classList.remove("hidden");
};

export const hideLoader = function () {
  overlayEl.classList.add("hidden");
  modalLoaderEl.classList.add("hidden");
};
