'use strict';

const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeModalAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const logo = document.querySelector(".logo");

const cardsRestaurants = document.querySelector(".cards-restaurants");
const cardsMenu = document.querySelector(".cards-menu");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");

const title = document.querySelector(".restaurant-title");
const rating = document.querySelector(".rating");
const minPrice = document.querySelector(".price");
const category = document.querySelector(".category");

const basketButton = document.querySelector("#cart-button");
const modalBasket = document.querySelector(".modal");
const closeModalBasket = document.querySelector(".close");
const cart = [];
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

let login = localStorage.getItem("loginForDeliveryFood");

const getData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status} !`);
  }
  return await response.json();
};

// Открытие модального окна для корзины
function toggleModal() {
  modalBasket.classList.toggle("is-open");
}

// Открытие модального окна авторизации
function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function returnMain() {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
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
    basketButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    returnMain();
  }

  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  basketButton.style.display = "flex";
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


function createCardRestaurent(restaurant) {

  const { image, kitchen, name, price, stars, products, time_of_delivery } = restaurant;

  const card = `
      <a class="card card-restaurant wow animate__animated animate__backInUp"
      data-products="${products}" data-info="${[name, stars, price, kitchen]}">
        <img src="${image}" alt="image" class="card-image" />
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${time_of_delivery} мин</span>
          </div>
          <div class="card-info">
            <div class="rating">${stars}</div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
      </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}


function createCardGood(goods) {

  const { description, name, image, price, id } = goods;
  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML("beforeend", `
  		<img src="${image}" alt="image" class="card-image" />
			<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}</div>
			</div>
			<div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
        <span class="button-card-text">В корзину</span>
        <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
			</div>
		</div>
  `);

  cardsMenu.insertAdjacentElement("beforeend", card);
}


function openGoods(event) {
  const target = event.target;
  if (login) {
    const restaurant = target.closest(".card-restaurant");
    if (restaurant) {

      const info = restaurant.dataset.info;
      const [name, stars, price, kitchen] = info.split(',');

      cardsMenu.textContent = '';
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      title.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;

      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  }
  else {
    toggleModalAuth();
  }

}

// Добавление в корзину
function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest(".button-add-cart");
  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function (item) {
      return item.id === id;
    })

    if (food) {
      food.count += 1;
    }
    else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      })
    }
  }

}

// Формирование корзины
function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
			<strong class="food-price">${cost}</strong>
			<div class="food-counter">
				<button class="counter-button counter-minus" data-id="${id}">-</button>
				<span class="counter">${count}</span>
				<button class="counter-button counter-plus" data-id="${id}">+</button>
			</div>
		</div>
    `;

    modalBody.insertAdjacentHTML("beforeend", itemCart);
  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';
}

// Изменения товаров в корзине
function changeCount(event) {
  const target = event.target;

  if (target.classList.contains("counter-button")) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });

    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    };
    if (target.classList.contains("counter-plus")) food.count++;

    renderCart();
  }

}

// Смена главной рекламы
function changePromo() {

  let count = 0;

  function change1() {
    containerPromo.textContent = '';
    const promo = `
  <section class="promo sushi">
		<h1 class="promo-title">Сеты со скидкой до 30% <br> в ресторанах</h1>
		<p class="promo-text">
			Скидки на сеты до 30 мая по промокоду DADADA
		</p>
	</section>
  `;
    containerPromo.insertAdjacentHTML("beforeend", promo);
  }

  function change2() {
    containerPromo.textContent = '';
    const promo = `
        <section class="promo vegetables">
					<h1 class="promo-title">Скидка 20% на всю еду <br> по промокоду LOVE.JS</h1>
					<p class="promo-text">
						Блюдо из ресторана привезут вместе с двумя подарочными книгами по фронтенду
					</p>
				</section>
  `;

    containerPromo.insertAdjacentHTML("beforeend", promo);
  }

  function change3() {
    containerPromo.textContent = '';
    const promo = `
        <section class="promo kebab">
					<h1 class="promo-title">Шашлыки на майские <br> со скидкой 35%</h1>
					<p class="promo-text">
						Закажите шашлыки в любом ресторане до 10 мая и получите скидку по промокоду OMAGAD
					</p>
				</section>
  `;
    containerPromo.insertAdjacentHTML("beforeend", promo);
  }

  function change4() {
    containerPromo.textContent = '';
    const promo = `
        <section class="promo pizza">
					<h1 class="promo-title">Онлайн-сервис <br />доставки еды на дом</h1>
					<p class="promo-text">
						Блюда из любимого ресторана привезет курьер в перчатках, маске и с антисептиком
					</p>
				</section>
  `;
    containerPromo.insertAdjacentHTML("beforeend", promo);
  }

  change1();
  setInterval(function () {
    count++;
    if (count === 5) {
      change2();
    }
    if (count === 10) {
      change3();
    }
    if (count === 15) {
      change4();
    }
    if (count === 20) {
      change1();
      count = 0;
    }
  }, 1000);

}


function init() {

  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurent);
  });

  basketButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });
  buttonClearCart.addEventListener("click", function () {
    cart.length = 0;
    renderCart();
  })
  modalBody.addEventListener("click", changeCount);
  closeModalBasket.addEventListener("click", toggleModal);
  cardsMenu.addEventListener("click", addToCart);
  cardsRestaurants.addEventListener("click", openGoods);
  logo.addEventListener("click", returnMain);

  // Анимация на сайте
  new WOW().init();


  changePromo();
  checkAuth();
}

init();

