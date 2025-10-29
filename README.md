# Projekt

Ni ska lämna in er kod till projektet här. Behöver ni hjälp med git är ni välkomna att fråga assistenterna.

Tänk på att hålla en någolunda snygg och tydlig githistorik där det syns att alla jobbat på projektet. Försök att hålla commits så små som möjligt (atomic).

## Gitignore

Det är bra att i början av ett projekt skapa en bra `.gitignore` så att ni inte råkar pusha upp byggfiler, paket eller annat som inte hör hemma i ett gitrepo.
En bra sida för att generera en gitignore är [gitignore.io](https://gitignore.io/). Där kan ni skriva in de språk/editors/operativsystem ni använder och därmed få en rimlig gitignore.

## Kommandos

När repot är clonat så är det viktigt att göra

```
npm install
```

För att installera alla dependencis som behövs för hemsidan.

För att köra hemsidan och starta upp både backend och frontend

```
npm start
```

## Projekt ide

Projektet ska vara en hemsida för att spela kortspelet Vändtia. **Spelet regler defineras senare**.
Sakerna som måste finnas med är:

- Måste ha ett lobbysystem. Ska kunna skapa nya matcher och kunna gå med i andras matcher.
- Måste ha Sessionhantering!
- Måste ha Loginvy, regsteringsvy och navigationsmenu.
- Måste ha en databas där vi sparar användarkonto. På databasen ska det sparas: Anänvarnamn, lösenord, vunna/spelade matcher och skapade resurser (matchhistorik)
-Ska inte kunna ta emot SQL injections.

## Specs

Tanken är att vi ska användas oss av Node.js och express.js för själva hemsidan. För databasen tänker vi använda SQLite. För CSS kan vi använda oss av Bootstrap, men inget är bestämt ännu.

## Spelregler

1. Alla börjar med tre nedvända kort och tre uppvända kort samt tre på handen. Ingen av dessa får bytas innan spelstart (KLAR)
2. Spelet börjar med att en slumpad spelare får börja. Sedan går spelet medurs.(KLAR)
3. Vad man får lägga:(KLAR)
    - Kort av samma eller högre valör
    - 2a
    - 10a
4. Varje spelare får endast lägga ett kort på sin runda. Undantag om personen lagt en 2a eller 10a.(KLAR)
5. Om 4 av samma valör har lagts händer ingenting (ELLER?????)
6. Om en person inte kan lägga får dem ta upp alla kort i högen och turen går till nästa spelare.(KLAR)
7. När ens tur är slut, om man har <3 kort får man ta upp tills man har 3 eller korthögen är tom. (KLAR)
8. När en person har slut på kort på handen får de använda sina uppvända tills dem är slut och sedan använda sina nedvända.(KLART?)
9. Om en spelare tar upp kort efter att börjat använda uppvända/nedvända övergår den till att använda handen igen. (KLART?)
10. Man får inte avsluta sitt spel med att lägga korten 10 eller 2. Om man gör detta förloar man och får den sämsta möjliga plaseringen.
