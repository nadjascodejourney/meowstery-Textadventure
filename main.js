const readline = require("readline-sync");

const { catTemplate } = require("./data/templates");

// fs (file system) module von node.js einbinden, um auf Dateien zuzugreifen
const fs = require("fs");
const { format } = require("path");

// Spielgeschichte aus der JSON-Datei laden
const data = JSON.parse(fs.readFileSync("story.json", "utf-8"));

// Vereinfachung durch Zuweisung => kürzerer Code
const title = data.meta.title; // meta = Objekt
const subtitle = data.meta.subtitle;
const version = data.meta.version;
const storyArray = data.story; // Array mit Objekten

// Startbildschirm anzeigen
console.log(catTemplate);
// console.clear; //TODO: Herausfinden, wo ich clearen muss, damit das template nur 1x am Anfang angezeigt wird und dann nicht mehr solange das Spiel läuft

// .................................
//% Text-Formatierungsfunktion
// Erläuterung siehe readme.md

function formatText(text, maxLength) {
  const words = text.split(" "); //! Achtung, Text muss ein string sein; wird durch .split zu substrings im array 'words'
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

//>> 1. Hauptfunktion
//* Findet Auswahlmöglichkeiten für eine bestimmte Situation in der Story anhand der ID des jeweiligen Objekts und gibt sie zurück.
function findId(searchedId) {
  for (let i = 0; i < storyArray.length; i++) {
    if (storyArray[i].id == searchedId) {
      return storyArray[i].choice;
    }
  }
}
// call erfolgt erst in findText()!

//>> 2. Zweite Hauptfunktion
//* Findet Text und Auswahlmöglichkeiten für eine bestimmte Situation in der Story, zeigt diese an und fordert Benutzer auf, Entscheidung zu treffen.
function findText(searched) {
  let text;
  for (let x = 0; x < storyArray.length; x++) {
    if (storyArray[x].id == searched) {
      // Hier testweise den Wert von storyArray[x].text ausgeben, um Ausgabe/Datentyp zu checken
      // console.log("Text aus storyArray[x].text:", storyArray[x].text);

      text = storyArray[x].text + "\n\n";

      amountOfElementsInLinksArray = storyArray[x].thisLinksTo.length;

      for (let z = 0; z < amountOfElementsInLinksArray; z++) {
        let goTo = storyArray[x].thisLinksTo[z];

        let situationalText = findId(goTo);

        // Test, um zu prüfen, welche Ausgabe bzw. welcher Datentyp hier erfolgt
        // console.log("situationalText:", situationalText);
        // console.log("Aktueller Wert von text vor der Zeile:", text);

        situationalText = situationalText.join(" "); //! Achtung, situationalText ist zunächst ein Array, muss also vor der Formattierung und der Konkatenierung in string umgewandelt werden

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

  const userInput = readline.question("Triff eine Entscheidung:");
  console.clear(); // Bisherige Ausgabe in der Konsole löschen //! funktioniert aber bisher nur beim Text, nicht beim template
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
