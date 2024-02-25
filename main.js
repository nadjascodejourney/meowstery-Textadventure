//>> Projekt aufsetzen:

import readlineSync from "readline-sync";
import { catTemplate } from "./data/templates.js";
// import colors from "./data/colors";
// import symbols from "./data/symbols";

// JSON file bzw. Daten der Geschichte mit ES Modules Node einlesen:
// 1.
import { readFile } from "fs/promises";
// 2.
async function readJSONFile(filePath) {
  try {
    const jsonData = await readFile(filePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}
// 3.
const data = await readJSONFile("./story.json");
// 4.
const { title, subtitle, version, story: storyArray } = data;

// .................................

//>> Text-Formatierungsfunktion
// Erläuterung siehe readme.md

function formatText(text, maxLength) {
  const words = text.split(" ");
  let formattedText = "";
  let lineLength = 0;

  words.forEach((word) => {
    if (lineLength + word.length + 1 > maxLength) {
      formattedText += "\n";
      lineLength = 0;
    }
    formattedText += word + " ";
    lineLength += word.length + 1;
  });
  return formattedText;
}
// .................................

function startTextAdventure() {
  const startScreen = readlineSync.question(catTemplate); // question clg automatically

  //>> findID Funktion
  //* Findet Auswahlmöglichkeiten für eine bestimmte Situation in der Story anhand der ID des jeweiligen Objekts und gibt sie zurück.
  function findId(searchedId) {
    for (let i = 0; i < storyArray.length; i++) {
      if (storyArray[i].id == searchedId) {
        return storyArray[i].choice;
      }
    }
  }
  // call erfolgt erst in findText()!

  //>> 2. findText Funktion
  //* Findet Text und Auswahlmöglichkeiten für eine bestimmte Situation in der Story, zeigt diese an und fordert Benutzer auf, Entscheidung zu treffen.
  function findText(searched) {
    let text;
    let amountOfElementsInLinksArray;
    for (let x = 0; x < storyArray.length; x++) {
      if (storyArray[x].id == searched) {
        // Test
        // console.log("Text aus storyArray[x].text:", storyArray[x].text);

        text = storyArray[x].text + "\n\n";

        amountOfElementsInLinksArray = storyArray[x].thisLinksTo.length;

        for (let z = 0; z < amountOfElementsInLinksArray; z++) {
          let goTo = storyArray[x].thisLinksTo[z];

          let situationalText = findId(goTo);

          // Test
          // console.log("situationalText:", situationalText);
          // console.log("Aktueller Wert von text vor der Zeile:", text);

          situationalText = situationalText.join(" ");

          //% Textformatierung Situationstext und Maximale Zeilenlänge
          situationalText = formatText(situationalText, 60);

          text = text + ">" + situationalText + " (Wähle " + z + ")\n\n";
        }
        break;
      }
    }
    //% Textformatierung Haupttext + Maximale Zeilenlänge
    text = formatText(text, 80);

    console.log("\n>" + text + "\n");

    // check User Input
    // ? Soll ich hier lieber eine eigene Funktion schreiben, die ich dann hier aufrufe?
    // ? Soll der UserInput Code weiter oben stehen?

    const userInput = readlineSync.question("Triff eine Entscheidung:");
    console.clear(); // Bisherige Ausgabe in der Konsole löschen, wenn User eine Entscheidung getroffen hat
    //! funktioniert aber bisher nur beim Text, nicht beim template

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
}
startTextAdventure();
// .....................................
