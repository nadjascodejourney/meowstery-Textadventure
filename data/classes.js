// Klasse für Katze Luna erstellen

export class Luna {
  constructor(color, age, breed, pattern, character, specialFeature) {
    this.color = color;
    this.age = age;
    this.breed = breed;
    this.pattern = pattern;
    this.character = character;
    this.specialFeature = specialFeature;
  }
  // Methode
  purr() {
    return "Purrrr";
  }
  meow() {
    return "Miau!";
  }
  groom() {
    return this.name + " putzt sich.";
  }
  scratch() {
    return this.name + " zerkratzt die Couch.";
  }
  explore() {
    return this.name + " erkundet ihre Umgebung.";
  }
  sleep() {
    return this.name + " schläft.";
  }
}
