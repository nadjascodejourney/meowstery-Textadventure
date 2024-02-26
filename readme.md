- Bei den frühen Textadventures gibt man als Spieler nur Textbefehle ein und muss selber erraten, welche Befehle das sein könnten je nachdem, was einem die Situation so bietet. Recht anspruchsvoll und vllt auch frustrierend, gerade am Anfang. Daher biete ich zu Beginn erst mal ein paar Optionen an und mit der Zeit wird es dann schwieriger, sodass der User durchaus auch selbst Eingaben machen muss, um weiterzukommen

# Wichtige Funktionen:

- ich muss hin und wieder eine zurückfunktion einbauen, weil ich nicht jeden Handlungsstrang weiterführen kann in der mir zur Verfügung stehenden Zeit; zudem will ich vermeiden, dass der Spieler das Spiel dann jedes Mal abbrechen muss

- Kann ich eine Spielstandspeicherfunktion einbauen? Ja

---

# readline sync und JSON Daten laden mit require

Ich habe später zwar dann doch mit import/export und modules gearbeitet, aber man könnte es auch so machen:

1. Zuerst wird die readline-sync-Bibliothek importiert, um Benutzereingaben im Terminal zu lesen.

const readline = require("readline-sync");

2. fs (file system) module von node.js einbinden, um auf Dateien zuzugreifen
   const fs = require("fs");

3. Lade die Spielgeschichte aus der JSON-Datei
   const geschichte = JSON.parse(fs.readFileSync("story.json", "utf-8"));

   ***

# Kommentar Hauptfunktionen

Die Trennung der zwei Funktionen findId(searchedId) und findText(searched) ermöglicht eine klarere Strukturierung des Codes und eine bessere Wiederverwendbarkeit. Außerdem sorgt es für eine klare Abgrenzung der Verantwortlichkeiten zwischen den Funktionen, auch wenn die findText Funktion mit der ersten Funktion findID arbeitet.

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

Prozess: Nachdem ich zunächst die Fehlermeldung Typeerror: text.split ist not a function bekommen habe, musste ich rausfinden, warum .split nicht auf 'text' angewendet werden kann. Die Vermutung lag nahe, dass 'text' vielleicht nicht den richtigen Datentyp hat. Daher habe ich nach und nach durch folgende Konsolenbefehle herausgefunden, dass 'text' ein string ist (also wie gewünscht) und somit nicht das Problem ist, sondern dass 'situationalText' zunächst ein Array ist, 'text' aber weiter unten mit 'situationalText' konkateniert wird (=> string + array).

console.log("Text aus storyArray[x].text:", storyArray[x].text);
console.log("situationalText:", situationalText);
console.log("Aktueller Wert von text vor der Zeile:", text);

Diese Teytbefehle schreibt man VOR den Call der Funktion formatText(). So wird das Skript noch gelesen und zu gleich kann man in der Konsole aber auch noch die Fehlermeldung sehen.

Die Konkatenation führte zu einem unerwartetem Ergebnis bzw. zu der Fehlermeldung.

# JSON und ES modules node

// import data from "./story.json" assert { type: "json" }; => klappt nicht, siehe auch: https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/

# Text in der Konsole kursiv ausgeben mit ANSI Escape

Um Text in der Konsole kursiv auszugeben, wenn du mit Node.js und readline-sync in VSCode arbeitest, kannst du ANSI-Escape-Sequenzen verwenden. Hier ist ein Beispiel, wie du den Text kursiv formatieren kannst:

javascript
Copy code
const readlineSync = require('readline-sync');

// ANSI-Escape-Sequenzen für kursiven Text
const italicText = "\x1b[3mKatzenminze im Kopf?. Bitte versuche es erneut.\x1b[0m";

// Ausgabe des kursiven Texts
console.log(italicText);
In diesem Beispiel wird der Text zwischen \x1b[3m und \x1b[0m eingefügt. \x1b[3m aktiviert den Kursivmodus, und \x1b[0m deaktiviert alle angewendeten Formatierungen.

Stelle sicher, dass du diese Ausgabe in einem Terminal ausführst, das ANSI-Escape-Sequenzen unterstützt, da nicht alle Terminals oder Konsolen diese unterstützen. In VSCode sollte die Ausgabe korrekt funktionieren.
