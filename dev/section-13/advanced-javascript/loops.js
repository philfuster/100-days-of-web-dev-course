for (let i = 0; i < 10; i++) {
  console.log(`yeller: ${i}`);
}

const users = ['Bill', 'Elon', 'Jeff'];

for (const user of users) {
  console.log(user);
}

const loggedInUser = {
  name: 'Phil',
  age: 27,
  isAdmin: true
};

for (const propertyName in loggedInUser) {
  console.log(propertyName);
  console.log(loggedInUser[propertyName]);
}

let isFinished = false;
while (!isFinished) {
  isFinished = confirm('Finished?');
}

console.log('done');