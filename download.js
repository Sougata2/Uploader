import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { showLoader, hideLoader } from "./loader.js";
import {
  collection,
  addDoc,
  setDoc,
  getFirestore,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

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
const linkNotifyEl = document.querySelector(".alert");
const downloadfilenameEl = document.querySelector("#download-file-name");

////////////////////////////
//////////Functions////////
//////////////////////////
async function getFromDB() {
  showLoader();
  const docRef = collection(db, "files");
  const q = query(docRef, orderBy("timestamp"));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    download_fileEl.insertAdjacentHTML(
      "beforebegin",
      `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Oops!</strong> No files to download.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`
    );
    hideLoader();
    return;
  }
  querySnapshot.forEach((doc) => {
    const { filename, size, type, timestamp } = doc.data();
    download_fileEl.insertAdjacentHTML(
      "afterbegin",
      `<div class="alert alert-primary my-3 file-list-name" role="alert" style="cursor:pointer;">${filename}</div>`
    );
  });
  hideLoader();
}

const download_fileEl = document.querySelector(".download-file");
download_fileEl.addEventListener("click", function (e) {
  console.log(e.target.textContent);
  const file_name = e.target.textContent;
  getDownloadURL(ref(storage, file_name))
    .then((url) => {
      // `url` is the download URL for 'files/{file-name}'

      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open("GET", url);
      xhr.send();

      // Or inserted into an <img> element
      const img = document.getElementById("download-link");
      linkNotifyEl.classList.remove("hidden");
      downloadfilenameEl.textContent = `${file_name}`;
      img.href = url;
    })
    .catch((error) => {
      // Handle any errors
    });
});

getFromDB();
