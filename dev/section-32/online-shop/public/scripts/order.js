const orderStatusUpdateButtonElements = Array.from(
	document.getElementsByClassName("update-order-status-btn")
);
const csrfToken = document
	.querySelector('meta[name="csrf-token"]')
	.getAttribute("content");

async function updateOrderStatus(event) {
	const orderId = event.target.dataset["orderid"];
	const orderStatusSelectElement = document.getElementById(
		`order-status-select-${orderId}`
	);
	const enteredOrderStatus =
		orderStatusSelectElement.options[orderStatusSelectElement.selectedIndex]
			.value;
	const updateInfo = {
		orderStatus: enteredOrderStatus,
	};
	const response = await fetch(`/admin/orders/${orderId}/updateStatus`, {
		method: "POST",
		body: JSON.stringify(updateInfo),
		headers: {
			"Content-Type": "application/json",
			"CSRF-Token": csrfToken,
		},
	});
	if (!response.hasError) {
		const orderStatusElement = document.getElementById(
			`order-status-${orderId}`
		);
		orderStatusElement.textContent = enteredOrderStatus;
	}
}

orderStatusUpdateButtonElements.forEach((el) => {
	el.addEventListener("click", updateOrderStatus);
});
