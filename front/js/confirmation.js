let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get("orderId");

document.getElementById("orderId").textContent = `${orderId}`;
