# Textadventures

Textadventure-Spiele, auch bekannt als Interactive Fiction, begannen in den 1970er Jahren mit einfachen Textbasierten Spielen wie "Adventure". In den 1980er Jahren erlebten sie mit Titeln wie "Zork" und "The Hitchhiker's Guide to the Galaxy" ihren Höhepunkt. Die Popularität ging in den 1990er Jahren zurück, erlebte jedoch in den 2000ern eine Renaissance dank moderner Entwicklungswerkzeuge und Online-Plattformen. Heute werden Textadventures oft von unabhängigen Entwicklern erstellt und finden auf verschiedenen Plattformen eine treue Fangemeinde.

## Bezug zu klassischen Textadventures und Konzept

Bei den ganz frühen Textadventures gibt man als Spieler nur Textbefehle ein und muss selber erraten, welche Befehle das sein könnten je nachdem, was einem die Situation so bietet. Recht anspruchsvoll und vllt auch frustrierend, gerade am Anfang.
Daher biete ich zu Beginn erst mal ein paar Optionen an. Im weiteren Spielverlauf könnte man auch mit Usereingaben weiterarbeiten, um das Spiel anspruchsvoller zu gestalten.

Da das Spiel nur im Terminal läuft, erschien mir das Bauen eines Textadventures inhaltlich recht passend.

Zu Beginn des Projekts habe ich mir erst einmal Zeit für Recherche zum Genre genommen:
[Research Board on Miro](https://miro.com/app/board/uXjVNqn4rVc=/?share_link_id=253230906656)

## Code-Aufbau (grob)

Dieser Code richtet ein textbasiertes Adventure-Spiel in JavaScript ein.

1. Imports: Er importiert erforderliche Module und Daten aus externen Dateien.

2. Liest JSON-Datei: Er liest eine JSON-Datei mit den ausgelagerten Story-Daten ein.

3. Startet das TextAdventure Programm: Die Funktion 'startTextAdventure' ist die Hauptfunktion, die für die Ausführung der Spielschleife verantwortlich ist und sich solange selbst aufruft, bis der Spieler das Spiel beendet.

4. Hauptmenü: Es präsentiert dem Spieler ein Hauptmenü mit verschiedenen Optionen bzw. Modi wie 'Play', 'Luna' (Anpassen der Attribute von Luna), 'Info' (Anzeigen von Spielinformationen) und 'Beenden'.

5. Play-Modus: Wenn der Spieler wählt zu spielen, navigiert das Programm anhander der beiden Funktionen 'findID' und 'findText' durch die Geschichte bzw. zeigt Text und Optionen basierend auf der aktuellen Situation in der Geschichte an. (Eine detailreichere Erläuterung zu diesem Abschnitt findet sich weiter unten in der Dokumentation)

6. Luna-Modus: Erlaubt es dem Spieler, die Attribute von Luna wie Farbe, Alter, Rasse usw. anzupassen.

7. Info-Modus: Zeigt Spielinformationen wie Titel, Untertitel, Version, Jahr und Autor an.

8. Weitere Funktionen: Enthält Funktionen zum Formatieren von Text, Leeren der Konsole und zum Umgang mit Quizfragen innerhalb der Geschichte.(Eine detailreichere Erläuterung zu diesem Abschnitt findet sich weiter unten in der Dokumentation)

9. Sonstiges: Farben, Schriftformatierung, Einbau von Emojis

## JSON und ES modules node

```javascript
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
´´´
```

In diesem Code-Ausschnitt wird eine Funktion namens readJSONFile definiert, die eine JSON-Datei liest und deren Inhalt als JavaScript-Objekt zurückgibt. Hier ist eine Erläuterung, was im Code passiert:

1. Es wird readFile aus dem Modul "fs/promises" importiert. Dieses Modul bietet eine Promis-basierte API für Dateioperationen in Node.js, was bedeutet, dass die Dateioperationen asynchron sind und Promises zurückgeben.

   Eine Promis-basierte API für Dateioperationen in Node.js ist eine Möglichkeit, Dateioperationen wie Lesen, Schreiben und Bearbeiten von Dateien durch die Verwendung von Promises zu handhaben.

2. Die Funktion readJSONFile wird definiert. Sie ist mit dem Schlüsselwort async gekennzeichnet, was bedeutet, dass sie eine asynchrone Funktion ist. Asynchrone Funktionen in JavaScript ermöglichen es, Code zu schreiben, der asynchronen Operationen durch die Verwendung von await handhabt.

3. Innerhalb der Funktion wird versucht, den Inhalt der JSON-Datei mit readFile(filePath, "utf-8") zu lesen. readFile gibt ein Promise zurück, das den Inhalt der Datei enthält, wenn die Operation erfolgreich ist.

   try und catch sind Schlüsselwörter in JavaScript, die verwendet werden, um Fehler in einem Codeblock abzufangen und zu behandeln. Hier ist eine kurze Erklärung, wie sie funktionieren:

4. Wenn das Promise erfolgreich aufgelöst wird, wird der Inhalt der Datei als JSON-String (jsonData) zurückgegeben.

5. Der JSON-String wird dann mit JSON.parse(jsonData) in ein JavaScript-Objekt umgewandelt und zurückgegeben.

6. Wenn während des Lesens oder Analysierens der Datei ein Fehler auftritt, wird der Fehler im catch-Block abgefangen, die Fehlermeldung wird auf der Konsole ausgegeben, und die Funktion gibt null zurück.

Zusammenfassend: Die Funktion readJSONFile liest eine JSON-Datei asynchron, wandelt deren Inhalt in ein JavaScript-Objekt um und gibt es zurück. Die Verwendung von async ermöglicht es, asynchronen Code zu schreiben und zu handhaben, während await verwendet wird, um auf die Auflösung von asynchronen Operationen zu warten.

## Play-Modus

1. Fall "p" (Spiel starten):

```javascript
case "p":
´´´
```

2. Konsolenbereinigung und Startnachricht:

```javascript
console.clear();
console.log(`${colors.c}Starte das Spiel...${colors.reset}`);
´´´
```

3. Funktion findId:

Diese Funktion durchläuft das Story-Array, um die Wahlmöglichkeiten einer bestimmten Situation basierend auf ihrer ID zu finden und zurückzugeben.

```javascript
function findId(searchedId) {
  // Durchlaufe die Story-Array, um die passende Situation basierend auf der ID zu finden
  for (let i = 0; i < storyArray.length; i++) {
    if (storyArray[i].id == searchedId) {
      return storyArray[i].choice; // Gib die Wahlmöglichkeiten dieser Situation zurück
    }
  }
}

´´´
```

4. Funktion findText:

```javascript
function findText(searched) { // Diese Zeile definiert die Funktion findText, die einen Parameter searched erwartet. Dieser Parameter repräsentiert die ID der gesuchten Situation im Spiel.
let text;
let amountOfElementsInLinksArray;

for (let x = 0; x < storyArray.length; x++) {
if (storyArray[x].id == searched) { // Eine Schleife durchläuft das storyArray, um die passende Situation basierend auf der übergebenen ID (searched) zu finden.
text = storyArray[x].text + "\n\n";
amountOfElementsInLinksArray = storyArray[x].thisLinksTo.length;
// Wenn die passende Situation gefunden wurde, wird der Text dieser Situation in der Variablen text gespeichert. Außerdem wird die Anzahl der Auswahlmöglichkeiten für diese Situation in amountOfElementsInLinksArray gespeichert.

      for (let z = 0; z < amountOfElementsInLinksArray; z++) {
        //Eine weitere Schleife durchläuft die Auswahlmöglichkeiten (Links) für die aktuelle Situation.

        let goTo = storyArray[x].thisLinksTo[z];
        let situationalText = findId(goTo);
        situationalText = situationalText.join(" ");

        // Für jede Auswahlmöglichkeit wird die ID der nächsten Situation abgerufen und der dazugehörige Text wird aus dem storyArray mithilfe der Funktion findId abgerufen. Der Text wird dann formatiert und in der Variablen situationalText gespeichert.

        // Zusammengefasst bedeutet die Zeile, dass goTo auf die ID der Situation verweist, zu der die aktuelle Verlinkung führt. Dies ist wichtig, um den Text und die Auswahlmöglichkeiten für die nächste Situation im Spiel zu finden und anzuzeigen.

        // Indem goTo innerhalb der Funktion definiert wird, bleibt der gesamte Prozess zur Verarbeitung der Auswahlmöglichkeiten in einem zusammenhängenden Kontext.

        //... [weiterer Code]
      }
      break; // Die Schleife wird unterbrochen, sobald die passende Situation gefunden wurde.
    }

}
text = formatText(text, 80);
console.log("\n> " + text + "\n");
// Der gesamte Text für die aktuelle Situation wird formatiert und dann in der Konsole ausgegeben.
// ...
}
´´´
```

Nähere Erklärung:

- 'findText' ist Eine Funktion, die verwendet wird, um den Text und die Auswahlmöglichkeiten für eine bestimmte Situation im Spiel zu finden und anzuzeigen.
- 'searched': Der Parameter, der die ID der gesuchten Situation darstellt.
- Die Funktion durchläuft das 'storyArray', um den Text und die Auswahlmöglichkeiten zu finden. Sie bereitet den Text formatiert vor und zeigt ihn an.
- Die Funktion enthält auch eine Schleife für die Auswahlmöglichkeiten innerhalb einer Situation.

5. Quiz Funktion

Diese Funktion steht derzeit innerhalb der findText(), da ja erst die Situation gefunden werden muss, die auch ein Quiz beinhaltet. Wegen diesem Kontext habe ich mich dazu entschieden, die Funktion hier zu setzen. Ein Pro-Argument hierfür ist, dass die quiz()-Funktion innerhalb von findText() zu platzieren, da sie eng miteinander verbunden sind. Beide Funktionen arbeiten zusammen, um dem Spieler die Situation im Spiel zu präsentieren und mögliche Quizfragen zu stellen.

Es gibt aber auch Nachteile, weshalb ich die Funktionen beim nächsten Mal lieber getrennt schreiben möchte. Nachteile sind: Unübersichtlichkeit, Wiederverwendbarkeit, Fehlende Trennung von Funktionsverantwortlichkeiten, nicht so klare Kapselung, schwer zu lesen für andere Entwickler.

## Luna Modus

Dieser Codeblock ermöglicht es dem Benutzer, die Eigenschaften von Luna individuell festzulegen und diese im weiteren Verlauf des Text-Abenteuers zu verwenden.

- Ein neues Luna-Objekt wird mit den vom Benutzer eingegebenen Eigenschaften erstellt. Falls der Benutzer keine Eingaben gemacht hat, werden Standardwerte verwendet.

- Das Luna-Objekt wird mit new Luna(...) erstellt, wobei die eingegebenen oder Standardwerte als Argumente übergeben werden.

- Das erstellte Luna-Objekt wird dann dem Array catCharacter hinzugefügt, um es später im Spiel zu verwenden.

## Weitere Funktionen:

# Formatierungsfunktion:

```javascript
function formatText(text, maxLength) {
   // zwei Parameter, text => erwartet string, maxLength = max. Zeilenlänge => soll number sein.
const words = text.split(" "); // Teilt Text in Wörter auf bzw. macht aus einem string ein array ('words') aus substrings; Leerzeichen als Trennzeichen. Achtung: 'text' muss ein string sein (sonst kommt ein TypeError: text.split is not a function)
let formattedText = ""; // hier hinein kommt der formattierte Text, der schrittweise aufgebaut wird und am Ende zurückgegeben wird => ist dann wieder ein string
let lineLength = 0; // Die Länge der aktuellen Zeile im Text. Dieser Wert wird benötigt, um sicherzustellen, dass kein Wort hinzugefügt wird, das die maximale Zeilenlänge überschreitet.Jedes Mal, wenn ein Wort hinzugefügt wird, wird seine Länge zu lineLength hinzugefügt. Auf diese Weise kann die Funktion überprüfen, ob das Hinzufügen eines weiteren Worts die maximale Zeilenlänge überschreiten würde.

words.forEach((word) => {
   // Die forEach()-Methode wird auf dem Array words angewendet, um jedes Wort im Eingabetext zu verarbeiten. Hier findet die eigentliche Formatierung statt.
if (lineLength + word.length + 1 > maxLength) {
   // Für jedes Wort wird überprüft, ob die Hinzufügung dieses Wortes sowie plus 1 (für das Leerzeichen) zur aktuellen Zeile die maximale Zeilenlänge überschreiten würde. Wenn ja, dann ....
formattedText += "\n"; // ....dem formatierten Text wird ein Zeilenumbruch hinzugefügt
lineLength = 0; // ...Zeilenlänge wird wieder auf 0 gesetzt
}
formattedText += word + " "; // dann wird das aktuelle Wort und ein Leerzeichen in 'formattetText' hinzugefügt
lineLength += word.length + 1; // Zeilenlänge wird um die Länge des aktuellen Worts plus 1 (für das Leerzeichen) erhöht
});
return formattedText; // Am Ende wird der formattedText, der den gesamten formatierten Text enthält, zurückgegeben.
}
´´´
```

Da das Hinzufügen eines weiteren Worts zur aktuellen Zeile die einzige Situation ist, in der ein Zeilenumbruch erforderlich sein könnte, ist es nicht notwendig, ein else-statement zu verwenden. Wenn die Bedingung nicht erfüllt ist (also, wenn das Hinzufügen des aktuellen Worts die maximale Zeilenlänge nicht überschreitet), wird der Code innerhalb der if-Anweisung übersprungen und das aktuelle Wort wird einfach zur aktuellen Zeile hinzugefügt.
Es gibt also nur zwei mögliche Zustände: entweder wird ein Zeilenumbruch eingefügt, oder nicht. Die if-Anweisung prüft diesen Zustand und führt entsprechende Aktionen aus oder eben nicht.

An späterer Stelle, wenn ich den situationaltext formattieren will, muss ich daran denken, dass situationalText zunächst ein Array ist. Ich kann aber die .split Methode aus der formatText() nicht auf ein Array anwenden. Um die Funktion trotzdem anwenden zu können, schreibe ich daher

```javascript
 situationalText = situationalText.join(" "); //situationalText ist zunächst Array => vor der Formattierung und der Konkatenierung in string umwandeln
// Dann Textformatierung durch Anwendung der formatText()
situationalText = formatText(situationalText, 60);

´´´
```

Prozess:
Nachdem ich zunächst die Fehlermeldung Typeerror: text.split ist not a function bekommen habe, musste ich rausfinden, warum .split nicht auf 'text' angewendet werden kann. Die Vermutung lag nahe, dass 'text' vielleicht nicht den richtigen Datentyp hat. Daher habe ich nach und nach durch folgende Konsolenbefehle herausgefunden, dass 'text' ein string ist (also wie gewünscht) und somit nicht das Problem ist, sondern dass 'situationalText' zunächst ein Array ist, 'text' aber weiter unten mit 'situationalText' konkateniert wird (=> string + array).

console.log("Text aus storyArray[x].text:", storyArray[x].text);
console.log("situationalText:", situationalText);
console.log("Aktueller Wert von text vor der Zeile:", text);

Diese Teytbefehle schreibt man VOR den Call der Funktion formatText(). So wird das Skript noch gelesen und zu gleich kann man in der Konsole aber auch noch die Fehlermeldung sehen.

Die Konkatenation führte zu einem unerwartetem Ergebnis bzw. zu der Fehlermeldung.

Momentan besteht noch das Problem, dass die formatText() nicht richtig auf die situationalText Variable angewendet wird. Vermutlich liegt das an der Konkatenierung von situationalText und text (beides wird dann zu text assignd) und der anschließenden Formatierung von text mit formatText().

# Konsole clearen (Eigene Funktion)

Die clearConsole-Funktion ist darauf ausgelegt, die Konsolenausgabe zu löschen, aber nur wenn die Standardausgabe des aktuellen Prozesses (process.stdout) an ein TTY (Teletypschreiber) angeschlossen ist, was normalerweise bedeutet, dass sie in einem Terminal oder einer Eingabeaufforderung ausgeführt wird.

process.stdout.isTTY: Diese Eigenschaft überprüft, ob die Standardausgabe mit einem TTY verbunden ist. Wenn dies der Fall ist, bedeutet dies, dass das Programm wahrscheinlich in einem Terminal läuft, in dem Konsolenmanipulationsbefehle wie das Löschen des Bildschirms anwendbar sind.

process.stdout.write("\x1Bc"): Diese Zeile sendet den ANSI-Escape-Code \x1Bc an die Standardausgabe. In ANSI-Escape-Codes repräsentiert \x1B das Escape-Zeichen, und c ist eine Steuersequenz, die normalerweise das Terminal anweist, den Bildschirm zu löschen.

Wenn also clearConsole() aufgerufen wird, löscht es den Konsolenbildschirm nur, wenn die Ausgabe ein TTY ist, was es für die Verwendung in Befehlszeilenanwendungen oder Skripten geeignet macht.

## Sonstiges

# Text in der Konsole kursiv ausgeben mit ANSI Escape

Dafür kann man ANSI-Escape-Sequenzen verwenden. Hier ist ein Beispiel, wie man das nutzen kann:

```javascript
const italicText = "\x1b[3mKatzenminze im Kopf?. Bitte versuche es erneut.\x1b[0m";
console.log(italicText);


// In diesem Beispiel wird der Text zwischen \x1b[3m und \x1b[0m eingefügt.
// \x1b[3m aktiviert den Kursivmodus, und \x1b[0m deaktiviert alle angewendeten Formatierungen.

´´´
```

Man sollte sicherstellen, dass du man Ausgabe in einem Terminal ausführt, das ANSI-Escape-Sequenzen unterstützt, da nicht alle Terminals oder Konsolen diese unterstützen. In VSCode sollte die Ausgabe korrekt funktionieren.

# Emojis

- Quelle der Javascript Codes: https://keyboard.cool/

# Farben

Verwendung der Farben:

```javascript
console.log(colors.red + "Roter Text" + colors.reset);
console.log(colors.green + "Grüner Text" + colors.reset);
onsole.log(colors.blue + "Blauer Text" + colors.reset);
console.log(colors.yellow + "Gelber Text" + colors.reset);
console.log(colors.magenta + "Magenta Text" + colors.reset);
console.log(colors.cyan + "Cyan Text" + colors.reset);
console.log(colors.white + "Weißer Text" + colors.reset);
´´´
```

Info: https://talyian.github.io/ansicolors/
