const readline = require("readline-sync");

// fs (file system) module von node.js einbinden, um auf Dateien zuzugreifen
const fs = require("fs");

// Spielgeschichte aus der JSON-Datei laden
const data = JSON.parse(fs.readFileSync("story.json", "utf-8"));

// Vereinfachung durch Zuweisung => kürzerer Code
const title = data.meta.title; // meta = Objekt
const subtitle = data.meta.subtitle;
const version = data.meta.version;
const storyArray = data.story; // Array mit Objekten

//>> 1. Funktion
//* Findet Auswahlmöglichkeiten für eine bestimmte Situation in der Story anhand der ID des jeweiligen Objekts und gibt sie zurück.
function findId(searchedId) {
  for (let i = 0; i < storyArray.length; i++) {
    if (storyArray[i].id == searchedId) {
      return storyArray[i].choice;
    }
  }
}
// call erfolgt erst in findText()!

//>> 2. Zweite Funktion
//* Findet Text und Auswahlmöglichkeiten für eine bestimmte Situation in der Story, zeigt diese an und fordert Benutzer auf, Entscheidung zu treffen.
function findText(searched) {
  let text;
  for (let x = 0; x < storyArray.length; x++) {
    if (storyArray[x].id == searched) {
      text = storyArray[x].text + "\n\n";

      amountOfElementsInLinksArray = storyArray[x].thisLinksTo.length;

      for (let z = 0; z < amountOfElementsInLinksArray; z++) {
        let goTo = storyArray[x].thisLinksTo[z];

        let situationalText = findId(goTo);

        text = text + ">" + situationalText + " (Wähle " + z + ")\n";
      }
      break;
    }
  }
  console.log("\n>" + text + "\n");

  // check User Input

  const userInput = readline.question("Triff eine Entscheidung:");
  const userDecision = parseInt(userInput);
  if (
    !isNaN(userDecision) &&
    userDecision >= 0 &&
    userDecision < amountOfElementsInLinksArray
  ) {
    findText(storyArray[searched].thisLinksTo[userDecision]);
  } else {
    console.log(
      `Katzenminze im Kopf? Bitte versuche es erneut und wähle eine gültige Option.`
    );
    findText(searched);
  }
}
findText(0);
