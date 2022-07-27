// const job = {
//   title: 'Developer',
//   location: 'New York',
//   salary: 50_000,
// };

// const job2 = {
//   title: 'Cook',
//   location: 'Munich',
//   salary: 35_000,
// };

class Job {
  constructor(jobTitle, place, salary) {
    this.title = jobTitle;
    this.location = place;
    this.salary = salary;
  }

  describe() {
    console.log(`I'm a ${this.title}, I work in ${this.location} and I earn ${this.salary}.`);
  }
}

const developer = new Job('Developer', 'New Jersey', 50_000);
const cook = new Job('Cook', 'Munich', 35_000);

developer.describe();
cook.describe();


