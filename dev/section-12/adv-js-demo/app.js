let inputElement = document.querySelector('input');

function textLimitCalculator(event) {
  let maxLength = event.target.maxLength;
  let remainingChars = maxLength - event.target.value.length;
  console.log(remainingChars);
  let remainingCharElement = event.target.nextElementSibling;
  remainingCharElement.textContent = remainingChars + "/" + maxLength;
}
inputElement.addEventListener('input', textLimitCalculator)