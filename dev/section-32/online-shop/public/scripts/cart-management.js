const addToCartButtonElement = document.querySelector(
	"#product-details button"
);
const cartBadgeElements = document.querySelectorAll(".nav-items .badge");

async function addToCart(event) {
	event.preventDefault();
	const { productid: productId, csrf } = addToCartButtonElement.dataset;
	let response;
	try {
		response = await fetch("/cart/items", {
			method: "POST",
			body: JSON.stringify({
				productId: productId,
				_csrf: csrf,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		alert("something went wrong!");
		return;
	}

	if (!response.ok) {
		alert("Something went wrong!");
	}

	const responseData = await response.json();
	const { newTotalItems } = responseData;

	for (const cartBadgeElement of cartBadgeElements) {
		cartBadgeElement.textContent = newTotalItems;
	}
}

addToCartButtonElement.addEventListener("click", addToCart);
