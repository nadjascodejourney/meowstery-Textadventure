- Bei den frühen Textadventures gibt man als Spieler nur Textbefehle ein und muss selber erraten, welche Befehle das sein könnten je nachdem, was einem die Situation so bietet. Recht anspruchsvoll und vllt auch frustrierend, gerade am Anfang. Daher biete ich zu Beginn erst mal ein paar Optionen an und mit der Zeit wird es dann schwieriger, sodass der User durchaus auch selbst Eingaben machen muss, um weiterzukommen

- ich muss hin und wieder eine zurückfunktion einbauen, weil ich nicht jeden Handlungsstrang weiterführen kann in der mir zur Verfügung stehenden Zeit; zudem will ich vermeiden, dass der Spieler das Spiel dann jedes Mal abbrechen muss

- Kann ich eine Spielstandspeicherfunktion einbauen? Ja

---

1. Zuerst wird die readline-sync-Bibliothek importiert, um Benutzereingaben im Terminal zu lesen.

const readline = require("readline-sync");

2. fs (file system) module von node.js einbinden, um auf Dateien zuzugreifen
   const fs = require("fs");

3. Lade die Spielgeschichte aus der JSON-Datei
   const geschichte = JSON.parse(fs.readFileSync("story.json", "utf-8"));

   ***

Die Trennung der zwei Funktionen findId(searchedId) und findText(searched) ermöglicht eine klarere Strukturierung des Codes und eine bessere Wiederverwendbarkeit. Außerdem sorgt es für eine klare Abgrenzung der Verantwortlichkeiten zwischen den Funktionen, auch wenn die findText Funktion mit der ersten Funktion findID arbeitet.
