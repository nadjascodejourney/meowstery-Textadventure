//>>-------------------------------------------------------------------------------------------
//>>-------------------------------------Projekt aufsetzen-------------------------------------

// Imports
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

//>>-------------------------------------------------------------------------------------------
//>>-------------------------------------Hilfsfunktionen---------------------------------------

//>>  Text-Formatierungsfunktion
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

// .............................................................................................

//>> Funktion, um Starttemplates aus der Konsole zu leeren
// clc alleine reicht nicht bei komplexeren Templates
// Funktion leert die Konsole, indem sie ANSI Escape-Sequenzen verwendet

function clearConsole() {
  // process.stdout.isTTY => This is a property in Node.js
  if (process.stdout.isTTY) {
    // standard output
    process.stdout.write("\x1Bc");
  }
}

//>>--------------------------------------------------------------------------------------------
//>>---------------------------------------- Variablen -----------------------------------------

//>> globale Variablen
//* Sammlung von Luna-Objekten, die im Spiel erstellt werden
const catCharacter = [];
//* Sammlung von Gegenständen, die Luna im Spiel findet
const lunasBag = [];

//* Meldungen
const startAlert = `${colors.c}Starte das Spiel...${colors.reset}`;
const backToMainMenu = `${colors.c}Drücke ENTER, um ins Hauptmenü zurückzukehren.${colors.reset}`;
const tschauMiau = `\n${colors.y}Tschau Miau, bis zum nächsten Mal! ${colors.reset}\n`;
const error = `\n${colors.m}Katzenminze im Kopf? Bitte versuche es erneut.${colors.reset}\n`;

//% --------------------------------------------------------------------------------------------
//% ------------------------------------------- SPIEL ------------------------------------------

//>> Startscreen (Katzen-Template)

console.log(catTemplate);
readlineSync.question(`\n${colors.c}Drücke ENTER. ${colors.reset}`);
console.clear();

// ..............................................................................................

//>> START DES PROGRAMMS

function startTextAdventure() {
  // Hauptmenü
  const mainMenu = readlineSync.question(mainMenuTemplate);

  clearConsole(); // entfernt bisherige Ausgaben

  // switch-case für Hauptmenü:
  // P = Play, L = Luna, I = Info, B = Beenden

  switch (mainMenu.toLowerCase()) {
    // ..................................case P(lay)......................................

    case "p": // P = Play (Starte das Spiel)
      console.clear();
      console.log(startAlert);

      //>> 1. findID Funktion
      //* durchläuft das Story-Array, um die Wahlmöglichkeiten einer bestimmten Situation basierend auf der ID des jeweiligen Objekts zu finden und zurückzugeben.

      function findId(searchedId) {
        for (let i = 0; i < storyArray.length; i++) {
          if (storyArray[i].id == searchedId) {
            return storyArray[i].choice;
          }
        }
      }
      // call erfolgt erst in findText()

      //>> 2. findText Funktion

      //* Findet Text und Auswahlmöglichkeiten für eine bestimmte Situation in der Story, zeigt diese an und fordert Benutzer auf, Entscheidung zu treffen.
      // 'searched': Parameter für ID der gesuchten Situation

      function findText(searched) {
        let text;
        let amountOfElementsInLinksArray;

        // Durchlaufe Story-Array, um Text und Auswahlmöglichkeiten für die aktuelle Situation zu finden
        for (let x = 0; x < storyArray.length; x++) {
          if (storyArray[x].id == searched) {
            text = storyArray[x].text + "\n\n"; // text = "text" der aktuellen Situation

            // Anzahl der Auswahlmöglichkeiten innerhalb der jew. Situation ermitteln und in Variable 'amountOfElementsInLinksArray' speichern
            amountOfElementsInLinksArray = storyArray[x].thisLinksTo.length;

            // In der jew. Situation alle Auswahlmöglichkeiten durchlaufen und anzeigen
            for (let z = 0; z < amountOfElementsInLinksArray; z++) {
              let goTo = storyArray[x].thisLinksTo[z];
              // 'storyArray[x].thisLinksTo[z]' verweist auf die ID der Situationen, zu der die aktuell verfügbaren Verlinkungen führen => um den Text und die Auswahlmöglichkeiten für die NÄCHSTE Situation im Spiel zu finden
              // console.log(goTo); //Test: gibt die ID der nächsten Situation aus

              // 'goTo' in findId() als Parameter einsetzen; die nächste Situation wird anhand der ID gefunden und in 'situationalText' gespeichert
              // Erinnerung: return von findID ist 'storyArray[i].choice' mit der jeweils verlinkten ID;
              let situationalText = findId(goTo);

              //% Formatierung des Textes für die nächste Situation
              situationalText = situationalText.join(" "); // Array in String umwandeln
              situationalText = formatText(situationalText, 80); //! Seltsames Umbruchverhalten

              // Text für die aktuelle Situation + Auswahlmöglichkeiten anzeigen sowie Nummerierung der Auswahlmöglichkeiten anhand von 'z'-Index
              text =
                text +
                `${colors.g} > ${situationalText} ${colors.reset}` +
                `\n${colors.c}(Wähle ${z})${colors.reset} \n\n`;

              // .................................................................................

              //>> Quiz-Funktion (sofern in der Situation vorhanden)

              function quiz() {
                let quizPassed = false;

                if (storyArray[x].quiz) {
                  // Wenn Quiz vorhanden ist, durchlaufe die Fragen

                  let correctAnswersCount = 0; // Zähler für richtige Antworten

                  for (const quiz of storyArray[x].quiz) {
                    // quiz ist ein Array voller Objekte => for of

                    console.log(
                      `\n${colors.y}Frage: ${colors.reset}` + quiz.question
                    );
                    const userAnswer = readlineSync.question(
                      `${colors.m}Antwort: ${colors.reset}`
                    );
                    if (
                      userAnswer.toLowerCase() ===
                      quiz.answer.toString().toLowerCase()
                    ) {
                      console.log(`${colors.g}"Richtig!${colors.reset}`);

                      correctAnswersCount++; // Zähler für richtige Antworten erhöhen

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
                  if (quizPassed) {
                    console.clear();
                    findText(storyArray[x].thisLinksTo[0]);
                    // Wenn das Quiz bestanden ist, gehe zur nächsten Situation, die von der aktuellen Situation aus zugänglich ist (= thisLinksTo[0])
                  }
                }
                // if (quizPassed) {
                //   console.clear();
                //   findText(storyArray[x].thisLinksTo[0]); // Wenn das Quiz bestanden ist, gehe zur nächsten Situation, die von der aktuellen Situation aus zugänglich ist (= thisLinksTo[0])
                // }
              }
              quiz();
              // .................................
            }
            break; // Die äußere Schleife wird unterbrochen, sobald die passende Situation gefunden wurde.
          }
        }

        text = formatText(text, 80); //% Textformatierung Haupttext + Maximale Zeilenlänge
        console.log("\n> " + text + "\n");

        //* Überprüfung, ob überhaupt Auswahlmöglichkeiten vorhanden sind

        if (amountOfElementsInLinksArray === 0) {
          const restartChoice = readlineSync.question(
            `${colors.g} Schreibe 'Ja', wenn du ins Hauptmenü zurück möchtest.
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

          // Wenn Auswahlmöglichkeiten vorhanden sind, wird auf Benutzereingabe gewartet und überprüft, ob die Eingabe gültig ist.
          const userDecision = parseInt(userInput);
          if (
            !isNaN(userDecision) && // überprüft, ob die Eingabe eine Zahl ist
            userDecision >= 0 && // überprüft, ob die Eingabe größer oder gleich 0 ist
            userDecision < amountOfElementsInLinksArray
            // überprüft, ob die Eingabe kleiner als die Anzahl der Auswahlmöglichkeiten im Array ist
          ) {
            findText(storyArray[searched].thisLinksTo[userDecision]);
            //% Wenn die Eingabe gültig ist, wird die nächste Situation basierend auf der Eingabe des Benutzers (ID) gefunden und angezeigt
          } else {
            console.log(error);
            findText(searched); // damit Spieler erneut wählen kann
          }
        }
      }
      findText(0); // Startet das Spiel mit der ersten Situation (ID = 0)

      //* In der findText-Funktion wird der gesamte Ablauf für das Auffinden und Anzeigen des Textes und der Auswahlmöglichkeiten einer bestimmten Situation im Spiel abgewickelt. Dazu gehört auch das Finden und Verarbeiten der Verlinkungen (Auswahlmöglichkeiten), um den Spieler zur nächsten Situation zu führen.

      break;

    // ..................................case L(una)......................................

    case "l": // L = Luna (Eigenschaften von Luna festlegen)
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
      const breed = readlineSync.question(
        "Zu welcher Katzenrasse gehört Luna? ..."
      );
      const pattern = readlineSync.question(
        "Hat Luna ein besonderes Fellmuster? Getigert, getupft oder etwas anderes?: ... "
      );
      const character = readlineSync.question("Beschreibe Lunas Charakter:");
      const specialFeature = readlineSync.question(
        "Welche besondere Fähigkeit hat Luna?"
      );

      // Luna-Objekt erstellen und default-Werte setzen, falls keine Eingabe erfolgt
      const myLuna = new Luna(
        color ? color : "grau",
        age ? age : "5",
        breed ? breed : "Ägyptische Mau",
        pattern ? pattern : "getupft",
        character ? character : "freundlich, neugierig, verspielt, intelligent",
        specialFeature ? specialFeature : "Sie kann lesen und sprechen"
      );

      catCharacter.push(myLuna); // Luna-Objekt in Array speichern, um es später im Spiel zu verwenden

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

    // ..................................case I(nfo)......................................

    case "i": // I = Info (Spielinformationen anzeigen)
      console.clear();
      let gameinfo = formatText(infotext, 100); // hier verwende ich wieder Textformatierungsfunktion

      console.log(
        `\n${colors.b}${title}: ${subtitle}${colors.reset} (${version}) ist ein Text-Adventure-Spiel, das ${colors.b}${year}${colors.reset} von ${author} entwickelt wurde.\n`
      );

      console.log(`\x1b[3m${gameinfo}\x1b[0m \n`); // kursiver Text mit \x1b[3m => ANSI-Escape-Sequenz

      // zurück zum Hauptmenü
      readlineSync.question(backToMainMenu);
      console.clear();
      startTextAdventure();

      break;
    // ..................................case B(eenden)......................................
    case "b":
      console.clear();
      console.log(tschauMiau);
      return;
    default:
      console.clear();
      console.log(error);
      startTextAdventure();
      return;
  }
}
startTextAdventure();
// .....................................
