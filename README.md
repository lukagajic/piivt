# Projekat iz predmeta "Praktikum - Internet i veb tehnologije" - 2020/2021.

## Sadržaj spremišta

Ovde se nalazi projekat za predmet Praktikum - Internet i veb tehnologije - 2020/2021

## Struktura spremišta

- U direktorijumu [01-documentation](./01-documentation) se nalazi dokumentacija...
- U direktorijumu [02-resources](./02-resources) se nalaze dodatni materijali:
  - Eksport baze podataka
  - Eksportovana Postman kolekcija sa svim HTTP zahtevima
- U direktorijumu [03-back-end](./03-back-end) se nalazi kod projekta za API.
- U direktorijumu [04-front-end](./04-front-end) se nalazi kod projekta za front end deo aplikacije.

## Kako se pokreće aplikacija

1. Klonira se GitHub projekat na lokalnu mašinu
2. Podigne se baza podataka iz SQL dump datoteke sa koju možete naći u [02-resources](./02-resources) folderu.
3. Otvori se prozor komandne linije i uđe se u folder [03-back-end](./03-back-end)
4. Izrši se komanda `npm run start:dev`.
5. Po uspešnom pokretanju servera biće dostupan na adresi http://localhost:9001
6. Otvori se novi terminal i uđe se u folder [04-front-end](./04-front-end)
7. Izvrši se komanda `npm start`
8. Po uspešnom pokretanju front-end dela, biće dostupan na adresi http://localhost:3000
