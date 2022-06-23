/* Confirmation page */

let str = window.location.href;
let url = new URL(str);

// Get the order id from the URL
let orderId = url.searchParams.get("orderId");

// Show order id number to consumer
document.getElementById("orderId").textContent = `${orderId}`;

// End of order, clear cart

localStorage.clear();
