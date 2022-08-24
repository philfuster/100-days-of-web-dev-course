const updateBtnElements = document.querySelectorAll(".update-btn");
const deleteBtnElements = document.querySelectorAll(".delete-btn");
const cartQuantityElement = document.getElementById("cart-quantity");
const cartTotalPriceElement = document.getElementById("cart-total-price");
const csrfToken = document
	.querySelector('meta[name="csrf-token"]')
	.getAttribute("content");

async function updateItemQuantity(event) {
	event.preventDefault();
	const updateBtnElement = event.target;
	const { productid } = updateBtnElement.dataset;
	const productQuantityInputElement = document.getElementById(
		`product-quantity-${productid}`
	);
	const productTotalPriceElement = document.getElementById(
		`product-total-price-${productid}`
	);
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
		const updateBtnElement = document.getElementById(`update-btn-${productid}`);
		updateBtnElement.setAttribute("disabled", true);
	}
}

updateBtnElements.forEach((el) => {
	el.addEventListener("click", updateItemQuantity);
});

async function deleteItemFromCart(event) {
	event.preventDefault();
	const deleteBtnElement = event.target;
	const { productid } = deleteBtnElement.dataset;

	const response = await fetch("/cart/deleteItem", {
		method: "POST",
		body: JSON.stringify({ productId: productid }),
		headers: {
			"Content-Type": "application/json",
			"CSRF-Token": csrfToken,
		},
	});
	const { hasError, cartTotalPrice, totalQuantity } = await response.json();
	if (!hasError) {
		const cartItemElement = document.getElementById(`cart-item-${productid}`);
		cartItemElement.remove();
		cartQuantityElement.textContent = totalQuantity;
		cartTotalPriceElement.textContent = cartTotalPrice;
	}
}

deleteBtnElements.forEach((el) => {
	el.addEventListener("click", deleteItemFromCart);
});

const cartItemQuantityElements =
	document.getElementsByClassName("productQuantity");
const cartItemQuantities = cartItemQuantityElements.map((el) => {
	return {
		qty: el.value,
		id: el.dataset["productid"],
	};
});

function enableUpdateButton(event) {
	const productQuantityInputElement = event.target;
	const { productid } = productQuantityInputElement.dataset;
	const updateBtnElement = document.getElementById(`update-btn-${productid}`);
	const { qty: originalQty } = cartItemQuantities.find((cartItem) => {
		return cartItem.id === productid;
	});
	if (originalQty) updateBtnElement.removeAttribute("disabled");
}

productQuantityInputElements.forEach((el) => {
	el.addEventListener("change", enableUpdateButton);
});
