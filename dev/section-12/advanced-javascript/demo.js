const inputElement = document.getElementById('product-name');
const remainingCharsElement = document.getElementById('remaining-chars');
function updateRemainingCharacters(event) {
  const maxLength = event.target.maxLength;
  const enteredText = event.target.value;
  const enteredTextLength = enteredText.length;

  const remainingChars = maxLength - enteredTextLength;

  if (remainingChars <= 10) {
    remainingCharsElement.classList.add('warning');
    inputElement.classList.add('warning');
  } else {
    remainingCharsElement.classList.remove('warning');
    inputElement.classList.remove('warning');
  }

  remainingCharsElement.textContent = remainingChars;
}

inputElement.addEventListener('input', updateRemainingCharacters)