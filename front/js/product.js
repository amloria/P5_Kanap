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
    <h1 id="title">${productDetails.name}</h1>`;

    document.getElementById("price").innerHTML = `
    <span id="price">${productDetails.price}</span>`;

    document.getElementById("description").innerHTML = `
    <p id="description">${productDetails.description}</p>`;

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
  } else {
    let cart = [];
    cart.push(product);
    window.localStorage.setItem("cart", JSON.stringify(cart));
  }
});
