fetch("http://localhost:3000/api/products")
  .then(function (apiData) {
    if (apiData.ok) {
      return apiData.json();
    }
  })
  .then(function (products) {
    let itemsSection = document.getElementById("items");
    for (let product of products) {
      itemsSection.insertAdjacentHTML(
        "beforeend",
        `<a href="./product.html?id=${product._id}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>`
      );
    }
  })
  .catch(function (err) {
    console.error(`Retour du serveur : ${err}`); // Une erreur est survenue
  });
