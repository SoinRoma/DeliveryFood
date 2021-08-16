'use strict';

const basketButton = document.querySelector("#cart-button");
const modalBasket = document.querySelector(".modal");
const closeModalBasket = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeModalAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

const cardsRestaurants = document.querySelector(".cards-restaurants");
const cardsMenu = document.querySelector(".cards-menu");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");

let login = localStorage.getItem("loginForDeliveryFood");

// Открытие модального окна для корзины
function toggleModal() {
  modalBasket.classList.toggle("is-open");
}

// Открытие модального окна авторизации
function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

// Если авторизован пользователь
function autorized() {

  // Функция выхода
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

// Если не авторизован пользователь
function notAutorized() {

  // Функци входа
  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    // Если пользователь ввёл логин
    if (login != "") {
      localStorage.setItem("loginForDeliveryFood", login);
      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeModalAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    }
    // Если не ввёл логин
    else {
      loginInput.placeholder = "Введите логин";
    }

  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeModalAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
}

// Функция проверки на вторизацию
function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}


function createCardRestaurent() {

  const card = `
      <a class="card card-restaurant wow animate__animated animate__backInUp">
        <img src="img/tanuki/preview.jpg" alt="image" class="card-image" />
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">Тануки</h3>
            <span class="card-tag tag">60 мин</span>
          </div>
          <div class="card-info">
            <div class="rating">4.5</div>
            <div class="price">От 1 200 ₽</div>
            <div class="category">Суши, роллы</div>
          </div>
        </div>
      </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}


function createCardGood() {
  const card = document.createElement("div");
  card.className = "card";

  card.insertAdjacentHTML("beforeend", `
  		<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image" />
			<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">Пицца Классика</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">
        Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,грибы.
				</div>
			</div>
			<div class="card-buttons">
        <button class="button button-primary button-add-cart">
        <span class="button-card-text">В корзину</span>
        <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
			</div>
		</div>
  `);

  cardsMenu.insertAdjacentElement("beforeend", card);
}


function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest(".cards-restaurants");
  if (restaurant) {
    cardsMenu.textContent = '';
    containerPromo.classList.add("hide");
    restaurants.classList.add("hide");
    menu.classList.remove("hide");

    createCardGood();
  }

}


basketButton.addEventListener("click", toggleModal);
closeModalBasket.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener("click", openGoods);
logo.addEventListener("click", function () {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
})

// Анимация на сайте
new WOW().init();

checkAuth();

createCardRestaurent();
createCardRestaurent();
createCardRestaurent();