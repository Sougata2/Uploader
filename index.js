import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { showLoader, hideLoader } from "./loader.js";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// variables
const up_form = document.querySelector("#file_upload_form");
const notificationsEl = document.querySelector(".notifications");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq-W-Jo9kbFRSreCDdhr3tGjvRM8fMqXk",
  authDomain: "sendfile-10eb9.firebaseapp.com",
  projectId: "sendfile-10eb9",
  storageBucket: "sendfile-10eb9.appspot.com",
  messagingSenderId: "877532672068",
  appId: "1:877532672068:web:940f039df7e43957700c11",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

////////////////////////////
//////////Functions////////
//////////////////////////
// Add the file name to the
function add_file_name(file_name, size, type, timestamp) {
  const docRef = setDoc(doc(db, "files", file_name), {
    filename: file_name,
    size: size,
    type: type,
    timestamp: timestamp,
  });
  // throw new Error("Your file could not be saved!")
}
// Upload function
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
  console.log(name, size, type, storageRef);
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
    const timestamp = new Date();
    add_file_name(name, size, type, timestamp);
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
