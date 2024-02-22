const readline = require("readline-sync");

// fs (file system) module von node.js einbinden, um auf Dateien zuzugreifen
const fs = require("fs");

// Lade die Spielgeschichte aus der JSON-Datei
const data = JSON.parse(fs.readFileSync("story.json", "utf-8"));

const title = data.meta.title;
const subtitle = data.meta.subtitle;
const version = data.meta.version;

const storyArray = data.story;

//>> 1. Funktion
// Finds the choice(s) for a specific situation in the story by id and returns them.
function findId(searchedId) {
  for (let i = 0; i < storyArray.length; i++) {
    if (storyArray[i].id == searchedId) {
      return storyArray[i].choice;
    }
  }
}

//>> 2. Zweite Funktion
// Finds the text and choices for a particular situation in the story, displays them and prompts the user to make a decision.
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
