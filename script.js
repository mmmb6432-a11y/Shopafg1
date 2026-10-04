/* =====================================================
   بازارچه افغانستان
   Firebase Authentication + Marketplace
   ===================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


/* =====================================================
   FIREBASE
   ===================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyDqZaolshJaT89YXmx9Vazawbu0DLeXAEM",
  authDomain: "afghan-bazaar-ad9fd.firebaseapp.com",
  projectId: "afghan-bazaar-ad9fd",
  storageBucket: "afghan-bazaar-ad9fd.firebasestorage.app",
  messagingSenderId: "960217197565",
  appId: "1:960217197565:web:4fb3a7c50823f15eb08794",
  measurementId: "G-6XDE8XXFTV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


/* =====================================================
   PRODUCTS
   ===================================================== */

let products = [
  {
    id: 1,
    title: "Poco X3 NFC",
    price: 5500,
    category: "موبایل",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
    description: "گوشی Poco X3 NFC در وضعیت خوب."
  },

  {
    id: 2,
    title: "لپتاپ Lenovo",
    price: 18000,
    category: "لپتاپ",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    description: "لپتاپ مناسب برای کارهای روزمره."
  },

  {
    id: 3,
    title: "موتر Toyota",
    price: 350000,
    category: "موتر",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
    description: "موتر در وضعیت مناسب."
  },

  {
    id: 4,
    title: "لباس مردانه",
    price: 900,
    category: "لباس",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800",
    description: "لباس نو و با کیفیت."
  }
];

let selectedCategory = "همه";


/* =====================================================
   ELEMENTS
   ===================================================== */

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");

const accountModal = document.getElementById("accountModal");
const productModal = document.getElementById("productModal");
const detailsModal = document.getElementById("detailsModal");

const loginArea = document.getElementById("loginArea");
const registerArea = document.getElementById("registerArea");
const userArea = document.getElementById("userArea");

const toast = document.getElementById("toast");


/* =====================================================
   LOCAL STORAGE
   ===================================================== */

try {
  const savedProducts =
    JSON.parse(localStorage.getItem("market_products"));

  if (Array.isArray(savedProducts)) {
    products = savedProducts;
  }
} catch (error) {
  console.log("Products storage error");
}


/* =====================================================
   TOAST
   ===================================================== */

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


/* =====================================================
   MODALS
   ===================================================== */

function openModal(modal) {
  if (modal) {
    modal.classList.add("show");
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove("show");
  }
}


document.querySelectorAll("[data-close]").forEach(button => {

  button.addEventListener("click", () => {

    const id = button.dataset.close;
    const modal = document.getElementById(id);

    closeModal(modal);
  });

});


window.addEventListener("click", event => {

  if (event.target.classList.contains("modal")) {
    closeModal(event.target);
  }

});


/* =====================================================
   ACCOUNT
   ===================================================== */

function openAccount() {
  openModal(accountModal);
}

document
  .getElementById("accountBtn")
  .addEventListener("click", openAccount);

document
  .getElementById("mobileAccountBtn")
  .addEventListener("click", openAccount);


/* =====================================================
   LOGIN / REGISTER SWITCH
   ===================================================== */

document
  .getElementById("showRegisterBtn")
  .addEventListener("click", () => {

    loginArea.classList.add("hidden");
    registerArea.classList.remove("hidden");

  });


document
  .getElementById("showLoginBtn")
  .addEventListener("click", () => {

    registerArea.classList.add("hidden");
    loginArea.classList.remove("hidden");

  });


/* =====================================================
   REGISTER
   ===================================================== */

document
  .getElementById("registerBtn")
  .addEventListener("click", async () => {

    const name =
      document.getElementById("registerName")
        .value.trim();

    const email =
      document.getElementById("registerEmail")
        .value.trim();

    const password =
      document.getElementById("registerPassword")
        .value;

    const password2 =
      document.getElementById("registerPassword2")
        .value;


    if (!name) {
      showToast("نام خود را وارد کنید.");
      return;
    }

    if (!email) {
      showToast("ایمیل را وارد کنید.");
      return;
    }

    if (password.length < 6) {
      showToast("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    if (password !== password2) {
      showToast("رمزهای عبور یکسان نیستند.");
      return;
    }


    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;


      localStorage.setItem(
        "market_user_name",
        name
      );


      await sendEmailVerification(user);


      showToast(
        "حساب ساخته شد. ایمیل تأیید برای شما ارسال شد."
      );


      registerArea.classList.add("hidden");
      userArea.classList.remove("hidden");


    } catch (error) {

      handle