// Открытие модального окна для корзины
const basketButton = document.querySelector("#cart-button");
const modalBasket = document.querySelector(".modal");
const closeModalBasket = document.querySelector(".close");

basketButton.addEventListener("click", toggleModal);
closeModalBasket.addEventListener("click", toggleModal);

function toggleModal() {
  modalBasket.classList.toggle("is-open");
}

// Анимация на сайте
new WOW().init();

// Авторизация пользователя
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeModalAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem("loginForDeliveryFood");

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function autorized() {

  function logOut() {
    login = null;
    localStorage.removeItem("loginForDeliveryFood");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    loginInput.placeholder = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";
  buttonOut.addEventListener("click", logOut);
}

function notAutorized() {

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    if (login != "") {
      localStorage.setItem("loginForDeliveryFood", login);
      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeModalAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    }
    else {
      loginInput.placeholder = "Введите логин";
    }

  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeModalAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}

checkAuth();