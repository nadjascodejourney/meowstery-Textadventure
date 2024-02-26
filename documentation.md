## Bezug zu klassischen Textadventures und Konzept Auswahltexte

Bei den frühen Textadventures gibt man als Spieler nur Textbefehle ein und muss selber erraten, welche Befehle das sein könnten je nachdem, was einem die Situation so bietet. Recht anspruchsvoll und vllt auch frustrierend, gerade am Anfang. Daher biete ich zu Beginn erst mal ein paar Optionen an. Im weiteren Spielverlauf könnte man auch mit Usereingaben weiterarbeiten, um das Spiel anspruchsvoller zu gestalten.

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

# JSON und ES modules node

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
