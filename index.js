import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { showLoader, hideLoader } from "./loader.js";

// variables
const up_form = document.querySelector("#file_upload_form");
const notificationsEl = document.querySelector(".notifications");

const firebaseConfig = {
  storageBucket: "gs://sendfile-10eb9.appspot.com",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Functions
function uploadFile(e) {
  e.preventDefault();
  const [file] = document.forms.file_upload_form.file.files;

  // For empty input
  if (!file) {
    return;
  }

  const { name, size, type } = file;
  const storageRef = ref(storage, name);
  showLoader();
  console.log(name, size, type);
  try {
    // TODO : Make a function for the taking snapshots;
    uploadBytes(storageRef, file).then((snapshot) => {
      const html_success = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Nice!</strong> You just upload file : ${name}.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
      notificationsEl.insertAdjacentHTML("afterbegin", html_success);
      hideLoader();
    });
  } catch (error) {
    const html_danger = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Opps!</strong> An error has occured!.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    notificationsEl.insertAdjacentHTML("afterbegin", html_danger);
    hideLoader();
  }
  up_form.reset();
}

// Event listeners
up_form.addEventListener("submit", uploadFile.bind(this));
