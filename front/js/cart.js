let localStorageCart = window.localStorage.getItem("cart");
let cart = JSON.parse(localStorageCart);
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
      console.log(product);

      if (item.id == product._id) {
        itemsSection.insertAdjacentHTML(
          "beforeend",
          `
            <article class="cart__item" data-id="${product._id}" data-color="${product.colors}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${item.color}</p>
                        <p>${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem" onclick="${onDelete}">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`
        );
      }
    }
  })

  .catch(function (err) {
    console.error(`Retour du serveur : ${err}`); // Une erreur est survenue
  });

function onDelete(event) {
  console.log("click de supression");
}

// let deleteButtons = document.querySelector("p.deleteItem");
// console.log(deleteButtons);

// function saveCart(cart) {
//   localStorage.setItem(`cart`, JSON.stringify(cart));
// }

// function removeFromCart(product) {
//   let cart = getCart(product);
//   cart = cart.filter((product) => product._id != productDetails._id);
//   saveCart(cart);
// }

// function getCart() {
//   let cart = localStorage.getItem(cart);
//   if ((cart = null)) {
//     return [];
//   } else {
//     return JSON.parse(cart);
//   }
// }

// function addProductToCart(product) {
//   let cart = getCart();
//   let selectedProduct = cart.find((p) => p._id == productDetails._id);
//   if (selectedProduct != undefined) {
//     selectedProduct.quantity++;
//   } else {
//     selectedProduct.quantity = 1;
//     cart.push(product);
//   }
//   saveCart(cart);
// }

// function changeQuantity(product) {
//   let cart = getCart(product);
//   cart = cart.filter((product) => product._id != productDetails._id);
//   if (selectedProduct != undefined) {
//     selectedProduct.quantity += quantity;
//     if (selectedProduct.quantity <= 0) {
//       removeFromCart(selectedProduct);
//     } else {
//       saveCart(cart);
//     }
//   }
// }

// function getTotalCart() {
//   let cart = getCart();
//   let number = 0;
//   for (let product of cart) {
//     number += product.quantity;
//   }
//   return number;
// }

// function getTotalPrice() {
//   let cart = getCart();
//   let total = 0;
//   for (let product of cart) {
//     total += product.quantity * product.price;
//   }
//   return total;
// }
