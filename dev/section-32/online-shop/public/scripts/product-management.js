const deleteProductBtnElements = document.querySelectorAll(
	".product-item button"
);

async function deleteProduct(event) {
	event.preventDefault();
	const buttonElement = event.target;
	const { productid, csrftoken } = buttonElement.dataset;
	const response = await fetch(
		`/admin/products/${productid}?_csrf=${csrftoken}`,
		{
			method: "DELETE",
		}
	);
	if (!response.ok) {
		alert("something went wrong..");
		return;
	}
	// practicing DOM traversal. it definitely breaks if I change the HTML structure
	buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductBtnElement of deleteProductBtnElements) {
	deleteProductBtnElement.addEventListener("click", deleteProduct);
}
