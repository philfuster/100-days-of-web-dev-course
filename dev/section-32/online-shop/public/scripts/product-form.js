const filePickerElement = document.getElementById("image");
const imagePreviewElement = document.getElementById("image-preview");
const fileUploadBtnElement = document.getElementById("file-upload-btn");

function showPreview(event) {
	const files = filePickerElement.files;
	if (files == null || files.length === 0) {
		imagePreviewElement.style.display = "none";
		return;
	}
	const pickedFile = files[0];
	imagePreviewElement.src = URL.createObjectURL(pickedFile);
	imagePreviewElement.style.display = "block";
}

function showFilePicker(event) {
	event.preventDefault();
	filePickerElement.click();
	return;
}

filePickerElement.addEventListener("change", showPreview);

fileUploadBtnElement.addEventListener("click", showFilePicker);
