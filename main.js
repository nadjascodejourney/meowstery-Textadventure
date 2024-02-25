//>> Projekt aufsetzen:

import readlineSync from "readline-sync";
import { catTemplate, mainMenuTemplate } from "./data/templates.js";
import { colors } from "./data/colors.js";
// import symbols from "./data/symbols";

// JSON file bzw. Daten der Geschichte mit ES Modules Node einlesen:
// 1.
import { readFile } from "fs/promises";
import { info } from "console";
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
const { story: storyArray } = data;

const infotext = data.meta.infotext;

// .................................
// .................................

//>> Text-Formatierungsfunktion
// Erläuterung siehe readme.md

function formatText(text, maxLength) {
  const words = text.split(" ");
  let formattedText = "";
  let lineLength = 0;

  words.forEach((word) => {
    if (lineLength + word.length + 1 > maxLength) {
      formattedText += "\n"; // man könnte hier noch weitere Zeile Abstand eingeben
      lineLength = 0;
    }
    formattedText += word + " ";
    lineLength += word.length + 1;
  });
  return formattedText;
}
// .................................
// .................................

//>> START DES PROGRAMMS

function startTextAdventure() {
  console.log(catTemplate);
  const pressStart = readlineSync.question(
    `\n${colors.c}Drücke ENTER. ${colors.reset}`
  );
  console.clear();

  const mainMenu = readlineSync.question(mainMenuTemplate);
  console.clear();

  switch (mainMenu.toLowerCase()) {
    case "p":
      console.log("Starte das Spiel...");

      //>> 1. Funktion für Situationen, 2. Funktion für Text und Auswahlmöglichkeiten
      //% 1. findID Funktion

      //* Findet bestimmte Situation in der Story anhand der ID des jeweiligen Objekts und gibt sie zurück.
      function findId(searchedId) {
        for (let i = 0; i < storyArray.length; i++) {
          if (storyArray[i].id == searchedId) {
            return storyArray[i].choice;
          }
        }
      }
      //! call erfolgt erst in findText()!

      //% 2. findText Funktion

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
              situationalText = formatText(situationalText, 80); //! Seltsames Verhalten, da Text unerwartet umbricht und scheinbar nicht auf Zeilenlänge reagiert

              text =
                text +
                `${colors.g} > ${situationalText} ${colors.reset}` +
                `\n${colors.y}(Wähle ${z})${colors.reset} \n\n`;
            }
            break;
          }
        }
        //% Textformatierung Haupttext + Maximale Zeilenlänge
        text = formatText(text, 80);
        console.log("\n> " + text + "\n");

        // Überprüfung, ob Auswahlmöglichkeiten vorhanden sind
        if (amountOfElementsInLinksArray === 0) {
          const restartChoice = readlineSync.question(
            `${colors.r} Wenn du möchtest, kannst du nochmal von vorne beginnen und Luna auf einem anderen Verlauf der Geschichte folgen (Ja/Nein).
            Du kannst das Spiel auch beenden indem du Strg + C drückst. ${colors.reset}`
          );

          if (restartChoice.toLowerCase() === "ja") {
            console.clear();
            startTextAdventure();
            return;
          } else {
            console.log(
              `${colors.y}Vielen Dank fürs Spielen! Bis zum nächsten Mal!${colors.reset}`
            );
            return;
          }
        } else {
          // check user Input, wenn Auswahlmöglichkeiten vorhanden
          const userInput = readlineSync.question(
            `\n${colors.c}Triff eine Entscheidung ${colors.reset}`
          );
          console.clear();

          const userDecision = parseInt(userInput);
          if (
            !isNaN(userDecision) &&
            userDecision >= 0 &&
            userDecision < amountOfElementsInLinksArray
          ) {
            findText(storyArray[searched].thisLinksTo[userDecision]);
          } else {
            console.log(
              `${colors.m}Katzenminze im Kopf? Bitte versuche es erneut und wähle eine gültige Option.${colors.reset} `
            );
            findText(searched); // damit Spieler erneut wählen kann
          }
        }
      }
      findText(0);

      break;
    case "l":
      console.log("Luna wird vorgestellt...");
      break;
    case "i":
      let gameinfo = formatText(infotext, 100);
      console.log("Über das Spiel...\n\n" + gameinfo + "\n");

      break;
    case "b":
      console.log("Beende das Spiel...");
      return;
    default:
      console.log("Katzenminze im Kopf?. Bitte versuche es erneut.");
      startTextAdventure();
      return;
  }
}
startTextAdventure();
// .....................................
