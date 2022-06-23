/* Home page */

// Getting data from API
fetch("http://localhost:3000/api/products")
  // If data is ok return data in json format
  .then(function (apiData) {
    if (apiData.ok) {
      return apiData.json();
    }
  })
  .then(function (products) {
    let itemsSection = document.getElementById("items");
    // Find and display products and their details on the homepage
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
    console.error(`Retour du serveur : ${err}`); // Show error if necessary
  });
