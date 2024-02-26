//>> Projekt aufsetzen:

import readlineSync from "readline-sync";
import { catTemplate, mainMenuTemplate } from "./data/templates.js";
import { colors } from "./data/colors.js";
import { Luna } from "./data/classes.js";
import { symbols } from "./data/symbols.js";

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
const { story: storyArray } = data;

const infotext = data.meta.infotext;
const title = data.meta.title;
const subtitle = data.meta.subtitle;
const version = data.meta.version;
const author = data.meta.author;
const year = data.meta.year;

// .................................
// .................................

//>> Text-Formatierungsfunktion
// Erläuterung siehe readme.md

function formatText(text, maxLength) {
  const words = text.split(" ");
  let formattedText = "";
  let lineLength = 0;

  words.forEach((word, index) => {
    let isUppercase = /^[A-Z]/.test(word);
    if (
      lineLength + word.length + 1 > maxLength &&
      index != 0 &&
      !isUppercase
    ) {
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

//>> Funktion, um Starttemplates aus der Konsole zu leeren
// clc alleine reicht nicht bei komplexeren Templates

function clearConsole() {
  // process.stdout.isTTY => This is a property in Node.js
  if (process.stdout.isTTY) {
    // standard output
    process.stdout.write("\x1Bc");
  }
}
// .................................
// .................................

//>> Startscreen

console.log(catTemplate);
readlineSync.question(`\n${colors.c}Drücke ENTER. ${colors.reset}`);
console.clear();

// .................................
// .................................

//>> globale Variablen
//* Sammlung von Luna-Objekten, die im Spiel erstellt werden
const catCharacter = [];
//* Sammlung von Gegenständen, die Luna im Spiel findet
const lunasBackbag = [];

const backToMainMenu = `${colors.c}Drücke ENTER, um ins Hauptmenü zurückzukehren.${colors.reset}`;
const tschauMiau = `\n${colors.y}Tschau Miau, bis zum nächsten Mal! ${colors.reset}\n`;

// .................................
// .................................

//>> START DES PROGRAMMS

function startTextAdventure() {
  // console.log(catTemplate);
  // const pressStart = readlineSync.question(
  //   `\n${colors.c}Drücke ENTER. ${colors.reset}`
  // );
  // console.clear();

  // Hauptmenü
  const mainMenu = readlineSync.question(mainMenuTemplate);

  clearConsole();

  switch (mainMenu.toLowerCase()) {
    //% P = Play, L = Luna, I = Info, B = Beenden

    // P = Play (Starte das Spiel)
    case "p":
      console.clear();
      console.log(`${colors.c}Starte das Spiel...${colors.reset}`);

      //>> 1. Funktion für Situationen, 2. Funktion für Text und Auswahlmöglichkeiten
      //>> 1. findID Funktion

      //* Findet bestimmte Situation in der Story anhand der ID des jeweiligen Objekts und gibt sie zurück.
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
            text = storyArray[x].text + "\n\n";

            amountOfElementsInLinksArray = storyArray[x].thisLinksTo.length;

            for (let z = 0; z < amountOfElementsInLinksArray; z++) {
              let goTo = storyArray[x].thisLinksTo[z];

              let situationalText = findId(goTo);

              situationalText = situationalText.join(" ");

              //% Textformatierung Situationstext und Maximale Zeilenlänge
              situationalText = formatText(situationalText, 80); //! Seltsames Verhalten, da Text unerwartet umbricht und nicht auf Zeilenlänge reagiert

              text =
                text +
                `${colors.g} > ${situationalText} ${colors.reset}` +
                `\n${colors.c}(Wähle ${z})${colors.reset} \n\n`;

              // .................................

              //>> Quiz-Funktion (wenn in der Situation vorhanden)

              function quiz() {
                let quizPassed = false;

                if (storyArray[x].quiz) {
                  // Wenn Quiz vorhanden ist, durchlaufe die Fragen

                  let correctAnswersCount = 0; // Zähler für richtige Antworten

                  for (const quiz of storyArray[x].quiz) {
                    console.log("\nFrage: " + quiz.question);
                    const userAnswer = readlineSync.question("Antwort: ");
                    if (
                      userAnswer.toLowerCase() ===
                      quiz.answer.toString().toLowerCase()
                    ) {
                      console.log("Richtig!");

                      correctAnswersCount++; // Erhöhe den Zähler für richtige Antworten

                      if (correctAnswersCount >= 4) {
                        // Wenn 4 oder mehr aufeinanderfolgende Antworten richtig sind
                        quizPassed = true;
                        // Spieler soll in die nächste Situation gelangen
                        break;
                      }
                    } else {
                      console.log(
                        "Das war leider falsch. Beginne die Prüfung erneut."
                      );
                      console.clear();
                      startTextAdventure();
                      return;
                    }
                  }
                }

                if (quizPassed) {
                  console.clear();
                  findText(storyArray[x].thisLinksTo[0]); // Wenn das Quiz bestanden ist, gehe zur nächsten Situation, die von der aktuellen Situation aus zugänglich ist (= thisLinksTo[0])
                }
              }
              quiz();
              // .................................
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
            `${colors.g} Wenn du möchtest, kehre zurück ins Hauptmenü und folge Luna auf einem anderen Weg der Geschichte (Ja/Nein).
             Du kannst das Programm auch ganz beenden indem du Strg + C drückst. ${colors.reset}`
          );

          if (restartChoice.toLowerCase() === "ja") {
            console.clear();
            // Hauptmenü erneut anzeigen
            startTextAdventure();
            return;
          } else {
            console.clear(); // vorherige ausgaben clearen
            console.log(tschauMiau);
            return;
          }
        } else {
          // check user Input, wenn Auswahlmöglichkeiten vorhanden
          const userInput = readlineSync.question(
            `\n${colors.c}... ${colors.reset}`
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

    case "l": //% L = Luna (Eigenschaften von Luna festlegen)
      console.clear();
      console.log(
        `${colors.c}Hier kannst du Luna ein paar Eigenschaften nach deinen Vorstellungen geben.${colors.reset}\n`
      );
      console.log(
        `${colors.b}Wenn du keine Angaben machen und dich lieber überraschen lassen möchtest, drücke nach jeder Frage einfach die ENTER-Taste.${colors.reset}\n`
      );
      // User Input für Luna

      const color = readlineSync.question("Welche Fellfarbe hat Luna? ... ");
      const age = readlineSync.question("Wie alt ist Luna? ... ");
      const breed = readlineSync.question("Zu welcher Rasse gehört Luna? ...");
      const pattern = readlineSync.question(
        "Hat Luna ein besonderes Fellmuster? Beschreibe es: ... "
      );
      const character = readlineSync.question("Beschreibe Lunas Charakter:");
      const specialFeature = readlineSync.question(
        "Welche besondere Fähigkeit hat Luna?"
      );

      const myLuna = new Luna(
        color ? color : "grau",
        age ? age : "5",
        breed ? breed : "Ägyptische Mau",
        pattern ? pattern : "getupft",
        character ? character : "freundlich, neugierig, verspielt, intelligent",
        specialFeature ? specialFeature : "Sie kann lesen und sprechen"
      );

      catCharacter.push(myLuna);

      console.clear(); // vorherige Eingabeauforderungen clearen

      console.log(`\n Luna ist einzigartig! ${symbols.catHappy} \n `);

      console.log(
        `Luna ist ${colors.m}${myLuna.color}${colors.reset} und ${colors.b}${myLuna.age}${colors.reset} Jahre alt.`
      );
      console.log(
        `Sie gehört zur Katzenrasse ${colors.g}${myLuna.breed}${colors.reset}. Ihr Fellmuster ist: ${colors.r}${myLuna.pattern}${colors.reset}.`
      );
      console.log(
        `Lunas Charakter ist ${colors.c}${myLuna.character}${colors.reset}.`
      );
      console.log(
        `Ihre besondere Fähigkeit ist: ${colors.y}${myLuna.specialFeature}${colors.reset}.\n`
      );

      // zurück zum Hauptmenü
      readlineSync.question(backToMainMenu);
      console.clear();
      startTextAdventure();

      break;

    case "i": //% I = Info (Spielinformationen anzeigen)
      console.clear();
      let gameinfo = formatText(infotext, 100);

      console.log(
        `\n${colors.b}${title}: ${subtitle}${colors.reset} (${version}) ist ein Text-Adventure-Spiel, das ${colors.b}${year}${colors.reset} von ${author} entwickelt wurde.\n`
      );

      console.log(`\x1b[3m${gameinfo}\x1b[0m \n`); // kursiver Text mit \x1b[3m => ANSI-Escape-Sequenz

      // zurück zum Hauptmenü
      readlineSync.question(backToMainMenu);
      console.clear();
      startTextAdventure();

      break;

    case "b":
      console.clear();
      console.log(tschauMiau);
      return;
    default:
      console.clear();
      console.log(
        `\n ${colors.m}Katzenminze im Kopf? Bitte versuche es erneut.${colors.reset} \n`
      );
      startTextAdventure();
      return;
  }
}
startTextAdventure();
// .....................................
