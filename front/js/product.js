let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id");

fetch(`http://localhost:3000/api/products/${productId}`)
  .then(function (productData) {
    if (productData.ok) {
      return productData.json();
    }
  })
  .then(function (productDetails) {
    document.getElementsByClassName("item__img")[0].innerHTML = `
    <img src="${productDetails.imageUrl}" alt="${productDetails.altTxt}">`;

    document.getElementById("title").innerHTML = `
    ${productDetails.name}`;

    document.getElementById("price").innerHTML = `
    ${productDetails.price}`;

    document.getElementById("description").innerHTML = `
    ${productDetails.description}`;

    let colors = productDetails.colors;
    let select = document.getElementById("colors");
    colors.forEach((color) => {
      let colorOption = document.createElement("option");

      colorOption.innerHTML = `${color}`;
      colorOption.value = `${color}`;

      select.appendChild(colorOption);
    });
  })

  .catch(function (err) {
    console.error(`Retour du serveur : ${err}`); // Une erreur est survenue
  });

document.getElementById("addToCart").addEventListener("click", function () {
  let color = document.getElementById("colors").value;
  let quantity = document.getElementById("quantity").value;
  let product = {
    id: productId,
    color: color,
    quantity: quantity,
  };
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
  } else {
    document.getElementById("quantity").style.background = "white";
    document.getElementById("quantity").style.color =
      "var(--footer-secondary-color)";
  }
  if (window.localStorage.getItem("cart")) {
    let localStorageCart = window.localStorage.getItem("cart");
    let cart = JSON.parse(localStorageCart);
    let productFound = false;
    for (let item of cart) {
      if (product.id === item.id && product.color === item.color) {
        productFound = true;
        item.quantity = parseInt(item.quantity) + parseInt(product.quantity);
        if (item.quantity > 100) {
          item.quantity = 100;
          alert(
            `Il n'est possible de commander que 100 unités à la fois. Nous avons fixé la quantité de votre produit souhaité à 100 unités. Vous pouvez modifier cette quantité depuis votre panier.`
          );
        }
      }
    }
    if (productFound === false) {
      cart.push(product);
    }
    window.localStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById("addToCart").textContent = `
    Produit(s) ajouté(s) à votre panier
    `;
  } else {
    let cart = [];
    cart.push(product);
    window.localStorage.setItem("cart", JSON.stringify(cart));
  }
});
