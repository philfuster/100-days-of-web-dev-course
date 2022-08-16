const updateBtnElements = document.querySelectorAll(".update-btn");
const cartQuantityElement = document.getElementById("cart-quantity");
const csrfToken = document
	.querySelector('meta[name="csrf-token"]')
	.getAttribute("content");

async function updateItemQuantity(event) {
	const updateBtnElement = event.target;
	const { productid } = updateBtnElement.dataset;
	const productQuantityInputElement = document.getElementById(
		`product-quantity-${productid}`
	);
	const productTotalPriceElement = document.getElementById(
		`product-total-price-${productid}`
	);
	const cartTotalPriceElement = document.getElementById("cart-total-price");
	const productQuantity = productQuantityInputElement.value;

	const updateInfo = {
		productid,
		quantity: productQuantity,
	};

	const response = await fetch("/cart/update", {
		method: "POST",
		body: JSON.stringify(updateInfo),
		headers: {
			"Content-Type": "application/json",
			"CSRF-Token": csrfToken,
		},
	});

	const { hasError, cartTotalPrice, totalQuantity, lineTotalPrice } =
		await response.json();
	if (!hasError) {
		cartQuantityElement.textContent = totalQuantity;
		productTotalPriceElement.textContent = lineTotalPrice;
		cartTotalPriceElement.textContent = cartTotalPrice;
	}
}

updateBtnElements.forEach((el) => {
	el.addEventListener("click", updateItemQuantity);
});
