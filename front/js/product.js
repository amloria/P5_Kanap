/* Product page */

let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id");

// Getting only one product by its ID from API
fetch(`http://localhost:3000/api/products/${productId}`)
  // If data is ok return data in json format
  .then(function (productData) {
    if (productData.ok) {
      return productData.json();
    }
  })
  // Display product details
  .then(function (productDetails) {
    document.getElementsByClassName("item__img")[0].innerHTML = `
    <img src="${productDetails.imageUrl}" alt="${productDetails.altTxt}">`;

    document.querySelector("title").innerHTML = `${productDetails.name}`;

    document.querySelector("h1").innerHTML = `${productDetails.name}`;

    document.getElementById("price").innerHTML = `${productDetails.price}`;

    document.getElementById(
      "description"
    ).innerHTML = `${productDetails.description}`;

    let colors = productDetails.colors;
    let select = document.getElementById("colors");
    // Display colors options on the product page
    colors.forEach(function (color) {
      let colorOption = document.createElement("option");
      colorOption.innerHTML = `${color}`;
      colorOption.value = `${color}`;
      select.appendChild(colorOption);
    });
  })

  .catch(function (err) {
    console.error(`Retour du serveur : ${err}`); // Show error if necessary
  });

// Listenning for the click on the "addToCart" button
// and checking that the color and quantity have been defined

document.getElementById("addToCart").addEventListener("click", function () {
  let color = document.getElementById("colors").value;
  let quantity = document.getElementById("quantity").value;
  // Product object to save in localStorage
  let product = {
    id: productId,
    color: color,
    quantity: quantity,
  };
  // Color option must be defined, quantity > 0 and <= 100
  if (color == "") {
    alert(`Veuillez sélectionner la couleur de votre préférence.`);
    return false;
  }
  if (quantity == 0) {
    alert(`Veuillez sélectionner la quantité d'unités souhaitée.`);
    return false;
  }
  if (quantity < 1) {
    alert("La quantité minimum de produits est de 1 unité");
    document.getElementById("quantity").style.background = "red";
    document.getElementById("quantity").style.color = "white";
    return false;
  }
  if (!quantity < 1) {
    document.getElementById("quantity").style.background = "white";
    document.getElementById("quantity").style.color =
      "var(--footer-secondary-color)";
  }
  if (window.localStorage.getItem("cart")) {
    let localStorageCart = window.localStorage.getItem("cart");
    let cart = JSON.parse(localStorageCart);
    let productFound = false; // Fuse on
    for (let item of cart) {
      // If there is already a product with the same id and color in cart,
      // only change quantity
      if (product.id === item.id && product.color === item.color) {
        productFound = true;
        item.quantity = parseInt(item.quantity) + parseInt(product.quantity);
        // Max quantity = 100 units per item
        if (item.quantity > 100) {
          item.quantity = 100;
          alert(
            `Il n'est possible de commander que 100 unités à la fois.
Nous avons fixé la quantité de votre produit souhaité à 100 unités.
Vous pouvez modifier cette quantité depuis votre panier.`
          );
        }
      }
    }
    if (productFound === false) {
      cart.push(product);
    }
    // Save product object in localStorage
    window.localStorage.setItem("cart", JSON.stringify(cart));
    // Inform customer that the selected item has been added to cart
    document.getElementById("addToCart").textContent = `
    Produit(s) ajouté(s) à votre panier
    `;
  } else {
    // In the case it is the first product to add to cart,
    // create an empty array and push the product inside
    let cart = [];
    cart.push(product);
    window.localStorage.setItem("cart", JSON.stringify(cart));
  }
});
