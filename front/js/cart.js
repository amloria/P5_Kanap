let localStorageCart = window.localStorage.getItem("cart");
let cart = JSON.parse(localStorageCart);
let totalQuantity = 0;
let totalPrice = 0;

// for (let item of cart) {
//   fetch(`http://localhost:3000/api/products/${item.id}`)
//     .then(function (apiData) {
//     if (apiData.ok) {
//       return apiData.json();
//     }
//   })
//   .then(function(product) {
//       console.log(product);
//   })
// }

fetch("http://localhost:3000/api/products")
  .then(function (apiData) {
    if (apiData.ok) {
      return apiData.json();
    }
  })
  .then(function (products) {
    let itemsSection = document.getElementById("cart__items");
    for (let item of cart) {
      const product = products.find((element) => element._id == item.id);
      if (item.id == product._id) {
        itemsSection.insertAdjacentHTML(
          "beforeend",
          `
            <article class="cart__item" data-id="${item.id}" data-color="${
            item.color
          }">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${item.color}</p>
                        <p class="price">${product.price * item.quantity} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
                              item.quantity
                            }">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`
        );
      }
    }
    totalCartQuantity();
    totalCartPrice();
  })
  .then(function () {
    let itemQuantity = document.getElementsByClassName("itemQuantity");
    for (let item of itemQuantity) {
      item.addEventListener("change", function () {
        let quantity = item.value;
        let id = item.closest("article").getAttribute("data-id");
        let color = item.closest("article").getAttribute("data-color");
        let productToChangeQuantity = cart.find(
          (element) => element.id == id && element.color == color
        );
        if (quantity < 1) {
          alert("La quantité minimum de produits est de 1 unité");
          item.closest("input").style.background = "red";
          item.closest("input").style.color = "white";
          return false;
        } else {
          item.closest("input").style.background = "white";
          item.closest("input").style.color = "var(--footer-secondary-color)";
          productToChangeQuantity.quantity = quantity;
          window.localStorage.setItem("cart", JSON.stringify(cart));
        }
        fetch(`http://localhost:3000/api/products/${id}`)
          .then(function (apiData) {
            if (apiData.ok) {
              return apiData.json();
            }
          })
          .then(function (product) {
            item.closest("article").querySelector("p.price").innerHTML = `
            ${quantity * product.price} €
            `;
            totalCartQuantity();
            totalCartPrice();
          });
      });
    }
  })
  .then(function () {
    let deleteButtons = document.getElementsByClassName("deleteItem");
    for (let deleteButton of deleteButtons) {
      deleteButton.addEventListener("click", function () {
        let productId = deleteButton.closest("article").getAttribute("data-id");
        let productColor = deleteButton
          .closest("article")
          .getAttribute("data-color");
        let productToDelete = cart.find(
          (element) => element.id == productId && element.color == productColor
        );
        let indexOfproductToDelete = cart.indexOf(productToDelete);
        cart.splice(indexOfproductToDelete, 1);
        window.localStorage.setItem("cart", JSON.stringify(cart));
        deleteButton.closest("article").remove();
        totalCartQuantity();
        totalCartPrice();
      });
    }
  })
  .catch(function (err) {
    console.error(`Retour du serveur : ${err}`); // Une erreur est survenue
  });

function totalCartQuantity() {
  totalQuantity = 0;
  for (let item of document.getElementsByClassName("itemQuantity")) {
    totalQuantity = parseInt(totalQuantity) + parseInt(item.value);
  }
  document.getElementById("totalQuantity").innerHTML = `
        <span id="totalQuantity">${totalQuantity}</span>
    `;
}
function totalCartPrice() {
  totalPrice = 0;
  for (let item of document.getElementsByClassName("price")) {
    totalPrice = parseInt(totalPrice) + parseInt(item.textContent);
  }
  document.getElementById("totalPrice").innerHTML = `
      <span id="totalPrice">${totalPrice}</span>
  `;
}

/* Form validation */

let order = document.getElementById("order");

let regexName = /^[A-Za-z -]+$/;
let regexAddress = /^[A-Za-z0-9]+$/;
let regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

order.addEventListener("click", orderFormValidation);

function orderFormValidation(event) {
  event.preventDefault(); // Eviter que le bouton adopte son comportement par defaut

  let userFirstName = document.getElementById("firstName").value.trim();
  let userLastName = document.getElementById("lastName").value.trim();
  let userAddress = document.getElementById("address").value.trim();
  let userCity = document.getElementById("city").value.trim();
  let userEmail = document.getElementById("email").value.trim();

  let validInput = false;
  if (!regexName.test(userFirstName)) {
    alert("stop");
    validInput = false;
  }
  if (!regexName.test(userLastName)) {
    validInput = false;
  }
  if (!regexAddress.test(userAddress)) {
    validInput = false;
  }
  if (!regexName.test(userCity)) {
    validInput = false;
  }
  if (!regexEmail.test(userEmail)) {
    validInput = false;
  }

  let contact = {
    firstName: userFirstName,
    lastName: userLastName,
    address: userAddress,
    city: userCity,
    email: userEmail,
  };

  console.log(contact);

  let productsInCartIds = [];

  for (let item of cart) {
    productsInCartIds.push(item.id);
  }

  //   fetch("http://localhost:3000/api/products/order", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       contact: contact,
  //       products: productsId,
  //     }),
  //   })
  //     .then(function (apiData) {
  //       if (apiData.ok) {
  //         return apiData.json();
  //       }
  //     })
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (err) {
  //       console.error(`Retour du serveur : ${err}`); // Une erreur est survenue
  //     });
}
