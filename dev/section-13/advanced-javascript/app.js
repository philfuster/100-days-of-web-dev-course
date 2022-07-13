let paragraphElement = document.querySelector('p');

function changeParagraphText() {
  paragraphElement.textContent = 'Clicked!';
  console.log('paragraph clicked');
}

paragraphElement.addEventListener('click', changeParagraphText)

let inputElement = document.querySelector('input');
let textCountElement = document.getElementById('text-count');

function retrieveUserInput(event) {
  let maxLength = event.target.maxLength;
  // console.log(inputElement.value);
  console.log(event.target.value);
}
// `input` event is typically what event is used when dealing with user input.
inputElement.addEventListener("input", retrieveUserInput)