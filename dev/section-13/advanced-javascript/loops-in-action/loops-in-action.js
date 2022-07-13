// first example - sum numbers
const calculateSumButtonElement = document.querySelector("#calculator button");

function calculateSum() {
  const userNumberInputElement = document.getElementById("user-number");
  const userNumber = userNumberInputElement.value;

  let sum = 0;

  for (let i = 0; i <= userNumber; i++) {
    sum += i;
  }

  const sumOutputElement = document.getElementById("calculated-sum");

  sumOutputElement.textContent = sum;
  sumOutputElement.style.display = "block";
}

calculateSumButtonElement.addEventListener("click", calculateSum);

// Highlight Links

const highlightLinksButtonElement = document.querySelector(
  "#highlight-links button"
);

function highlightLinks() {
  const anchorElements = document.querySelectorAll("#highlight-links a");

  for (const anchorElement of anchorElements) {
    anchorElement.classList.add("highlight");
  }
}

highlightLinksButtonElement.addEventListener("click", highlightLinks);

// Display User Data

const dummyUserData = {
  firstName: "Phil",
  lastName: "Fuster",
  age: 27,
};

const userDataOutputButton = document.querySelector("#user-data button");

function displayUserData() {
  const userDataOutputElement = document.getElementById("output-user-data");
  userDataOutputElement.innerHTML = "";
  for (const key in dummyUserData) {
    const newElement = document.createElement("li");
    const outputText = key.toUpperCase() + ": " + dummyUserData[key];
    newElement.textContent = outputText;
    userDataOutputElement.append(newElement);
  }
}

userDataOutputButton.addEventListener("click", displayUserData);

// while loop

const rollDiceButton = document.querySelector("#statistics button");

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function deriveNumberOfDiceRolls() {
  const targetNumberElement = document.getElementById("user-target-number");
  const diceRollsElement = document.getElementById("dice-rolls");

  let hasRolledTargetNumber = false;
  const targetNumber = parseInt(targetNumberElement.value, 10);
  const numbersRolled = [];

  while (!hasRolledTargetNumber) {
    // random number 1 thru 6.
    const numRolled = rollDice();
    numbersRolled.push(numRolled);
    // if (numRolled === targetNumber) {
    //   hasRolledTargetNumber = true;
    // }// if the purpose of a conditional is to set a boolean to the value of the conditional - just set the boolean variable to that conditional expression. (as seen below)
    hasRolledTargetNumber = numRolled === targetNumber;
  }

  // update dice rolls list.
  diceRollsElement.innerHTML = "";
  let rollsCount = 0;
  for (const num of numbersRolled) {
    const newElement = document.createElement("li");
    rollsCount++;
    newElement.textContent = "roll " + rollsCount + ": " + num;
    diceRollsElement.appendChild(newElement);
  }

  // update rolls summary
  const outputTotalRollsElement = document.getElementById("output-total-rolls");
  const outputTargetNumberElement = document.getElementById(
    "output-target-number"
  );

  outputTotalRollsElement.textContent = numbersRolled.length;
  outputTargetNumberElement.textContent = targetNumber;
}

rollDiceButton.addEventListener("click", deriveNumberOfDiceRolls);
