const filePickerElement = document.getElementById('image');
const imagePreviewElement = document.getElementById('image-preview');

function showPreview(event) {
  const files = filePickerElement.files;
  if (files == null || files.length === 0) {
    imagePreviewElement.style.display = 'none';
    return;
  }
  const pickedFile = files[0];
  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  imagePreviewElement.style.display = 'block';
}
filePickerElement.addEventListener('change', showPreview);