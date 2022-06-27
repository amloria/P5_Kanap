/* Cart page */

let localStorageCart = window.localStorage.getItem("cart");
let cart = JSON.parse(localStorageCart);
let totalQuantity = 0;
let totalPrice = 0;

// Another way to get the same result as below

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

// Getting data from API
fetch("http://localhost:3000/api/products")
  // If data is ok return data in json format
  .then(function (apiData) {
    if (apiData.ok) {
      return apiData.json();
    }
  })
  .then(function (products) {
    let itemsSection = document.getElementById("cart__items");
    for (let item of cart) {
      // Getting data from API for displaying the products in cart
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
                            <input
                            type="number"
                            class="itemQuantity"
                            name="itemQuantity"
                            min="1"
                            max="100"
                            value="${item.quantity}">
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
  // Changing the quantity of a product
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
        // Quantity must be > than 0
        if (quantity < 1) {
          alert("La quantité minimum de produits est de 1 unité");
          item.closest("input").style.background = "red";
          item.closest("input").style.color = "white";
          return false;
        }
        // Max quantity = 100 units per item
        if (quantity > 100) {
          alert(
            `Il n'est possible de commander que 100 unités à la fois.
Veuillez entrer un numéro de quantité inférieur à 100 unités.`
          );
          item.closest("input").style.background = "red";
          item.closest("input").style.color = "white";
          return false;
        } else {
          item.closest("input").style.background = "white";
          item.closest("input").style.color = "var(--footer-secondary-color)";
          productToChangeQuantity.quantity = quantity;
          window.localStorage.setItem("cart", JSON.stringify(cart));
        }
        // Getting the product concerned by its ID from the API to update price
        fetch(`http://localhost:3000/api/products/${id}`)
          // If data is ok return data in json format
          .then(function (apiData) {
            if (apiData.ok) {
              return apiData.json();
            }
          })
          .then(function (product) {
            // Update price
            item.closest("article").querySelector("p.price").innerHTML = `
            ${quantity * product.price} €
            `;
            totalCartQuantity();
            totalCartPrice();
          });
      });
    }
  })
  // Deleting a product from the cart
  .then(function () {
    let deleteButtons = document.getElementsByClassName("deleteItem");
    for (let deleteButton of deleteButtons) {
      // Find the item to delete by listening for the click in the delete button
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
    console.error(`Retour du serveur : ${err}`); // Show error if necessary
  });

// Show total cart quantity
function totalCartQuantity() {
  totalQuantity = 0;
  for (let item of document.getElementsByClassName("itemQuantity")) {
    totalQuantity = parseInt(totalQuantity) + parseInt(item.value);
  }
  document.getElementById("totalQuantity").innerHTML = `
        <span id="totalQuantity">${totalQuantity}</span>
    `;
}

// Show total cart price
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

let regexName = /^[A-Za-z\-]+$/;
let regexAddress = /^[0-9\sA-Za-z,']+$/;
let regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

order.addEventListener("click", orderFormValidation);

function orderFormValidation(event) {
  // Prevent the button from adopting its default behavior
  event.preventDefault();

  let userFirstName = document.getElementById("firstName").value.trim();
  let userLastName = document.getElementById("lastName").value.trim();
  let userAddress = document.getElementById("address").value.trim();
  let userCity = document.getElementById("city").value.trim();
  let userEmail = document.getElementById("email").value.trim();

  let validInput = true; // Fuse on

  // Checking all user inputs and displaying error messages if needed
  if (!regexName.test(userFirstName)) {
    document.getElementById("firstNameErrorMsg").textContent =
      "Prénom invalide";
    document.getElementById("firstNameErrorMsg").style.color = "#ECB7C3";
    validInput = false;
  } else {
    document.getElementById("firstNameErrorMsg").textContent = "Prénom valide";
    document.getElementById("firstNameErrorMsg").style.color = "#41FD32";
  }
  if (!regexName.test(userLastName)) {
    document.getElementById("lastNameErrorMsg").textContent = "Nom invalide";
    document.getElementById("lastNameErrorMsg").style.color = "#ECB7C3";
    validInput = false;
  } else {
    document.getElementById("lastNameErrorMsg").textContent = "Nom valide";
    document.getElementById("lastNameErrorMsg").style.color = "#41FD32";
  }
  if (!regexAddress.test(userAddress)) {
    document.getElementById("addressErrorMsg").textContent = "Adresse invalide";
    document.getElementById("addressErrorMsg").style.color = "#ECB7C3";
    validInput = false;
  } else {
    document.getElementById("addressErrorMsg").textContent = "Adresse valide";
    document.getElementById("addressErrorMsg").style.color = "#41FD32";
  }
  if (!regexName.test(userCity)) {
    document.getElementById("cityErrorMsg").textContent = "Ville invalide";
    document.getElementById("cityErrorMsg").style.color = "#ECB7C3";
    validInput = false;
  } else {
    document.getElementById("cityErrorMsg").textContent = "Ville valide";
    document.getElementById("cityErrorMsg").style.color = "#41FD32";
  }
  if (!regexEmail.test(userEmail)) {
    document.getElementById("emailErrorMsg").textContent =
      "Adresse email invalide";
    document.getElementById("emailErrorMsg").style.color = "#ECB7C3";
    validInput = false;
  } else {
    document.getElementById("emailErrorMsg").textContent =
      "Adresse email valide";
    document.getElementById("emailErrorMsg").style.color = "#41FD32";
  }
  if (validInput === false) {
    document.getElementById("order").value =
      "Veuillez corriger les champs marqués en rouge et réessayer";
    return false;
  }

  // Contact object to send to the backend
  let contact = {
    firstName: userFirstName,
    lastName: userLastName,
    address: userAddress,
    city: userCity,
    email: userEmail,
  };

  // Thanks message when confirming the order
  document.getElementById("order").value =
    "Toute l'équipe KANAP vous remercie pour votre commande !";

  // Creating an array of all the products id in cart
  let productsIdInCart = [];
  for (let item of cart) {
    productsIdInCart.push(item.id);
  }

  // Posting data in the API
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact: contact,
      products: productsIdInCart,
    }),
  })
    // If data is ok return data in json format
    .then(function (apiData) {
      if (apiData.ok) {
        return apiData.json();
      }
    })
    .then(function (response) {
      let orderId = response.orderId;
      // Display thanks message for 1500ms
      // and redirect customer to confirmation page
      setTimeout(() => {
        document.location.replace(`./confirmation.html?orderId=${orderId}`);
      }, 1500);
    })
    .catch(function (err) {
      console.error(`Retour du serveur : ${err}`); // Show error if necessary
    });
}
