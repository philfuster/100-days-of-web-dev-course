const inputElement = document.getElementById('product-name');
const remainingCharsElement = document.getElementById('remaining-chars');
function updateRemainingCharacters(event) {
  const maxLength = event.target.maxLength;
  const enteredText = event.target.value;
  const enteredTextLength = enteredText.length;

  const remainingChars = maxLength - enteredTextLength;

  if (remainingChars === 0) {
    remainingCharsElement.classList.add('error');
    inputElement.classList.add('error');
  } else if (remainingChars <= 10) {
    remainingCharsElement.classList.add('warning');
    inputElement.classList.add('warning')
    remainingCharsElement.classList.remove('error');
    inputElement.classList.remove('error');
  } else {
    remainingCharsElement.classList.remove('warning');
    inputElement.classList.remove('warning');
  }

  remainingCharsElement.textContent = remainingChars;
}

inputElement.addEventListener('input', updateRemainingCharacters)