const productQuantityElement = document.getElementById("product-quantity");
const productNameElement = document.getElementById("product-name");
const addToCartBtnElement = document.getElementById("add-to-cart-btn");
const cartQuantityElement = document.getElementById("cart-quantity");
const csrfToken = document
	.querySelector('meta[name="csrf-token"]')
	.getAttribute("content");

function updateCartTotalQuantity() {}

async function addProductToCart(event) {
	const productId = productNameElement.dataset.productid;
	console.dir(productNameElement);
	console.log(productId);
	const productInfo = {
		productId,
	};

	const response = await fetch(`/cart/add`, {
		method: "POST",
		body: JSON.stringify(productInfo),
		headers: {
			"Content-Type": "application/json",
			"CSRF-Token": csrfToken,
		},
	});

	if (response.ok) {
		updateCartTotalQuantity();
	}
}

addToCartBtnElement.addEventListener("click", addProductToCart);