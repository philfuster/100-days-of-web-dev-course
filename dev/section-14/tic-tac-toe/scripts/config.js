function openPlayerConfig(event) {
  editedPlayer = +event.target.dataset.playerid; // +'1' = 1
  backdropElement.style.display = "block";
  playerConfigOverlayElement.style.display = "block";
}

function closePlayerConfig(event) {
  backdropElement.style.display = "none";
  playerConfigOverlayElement.style.display = "none";
  formElement.firstElementChild.classList.remove('error');
  errorsOutputElement.textContent = '';
  // probably should get by id instead. Just wanted to practice dom structure digging.
  formElement.firstElementChild.lastElementChild.value = '';
  // const playerNameInput = document.getElementById('playername');
  // playerNameInput.value = '';
}

function savePlayerConfig(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const enteredPlayername = formData.get("playername").trim();
  
  if (!enteredPlayername) {
    event.target.firstElementChild.classList.add('error');
    errorsOutputElement.textContent = "Please enter a valid name!";
    return;
  }
  
  // const updatedPlayerDataElement = document.getElementId('player-' + editedPlayer + '-data');
  // updatedPlayerDataElement.children[1].textContent = editedPlayerName;
  const playerNameElement = document.querySelector(`#player-${editedPlayer}-data h3`);
  playerNameElement.textContent = enteredPlayername;
  
  players[editedPlayer - 1].name = enteredPlayername;

  closePlayerConfig();
}
