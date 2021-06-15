# Projektni zahtev - Veb aplikacija za privatnu kliniku

**Student:** Luka Gajić, IR, 201720046
**Predmetni profesor:** prof. dr Vladislav Miškovic
**Predmetni asistent:** Milan Tair, master

## 1. Uvod

_Veb aplikacija za privatnu kliniku_ kao cilj ima da stručnom i administrativnom osoblju jedne privatne klinike pruži mogućnost elektronskog upravljanja kartonima svojih prijavljenih pacijenata. Ideja je da se sistem realizuje kao Veb aplikacija [1], kojoj se može pristupiti preko Veb čitača [2], koja će skladištiti sve neophodne podatke u relacionoj bazi podataka [3] koja će takođe biti aktivna na serveru. Ono što će aplikacija omogućiti osoblju klinike jeste upravljanje svim podacima vezanim za kateogorije usluga i same usluge koja klinika pruža svojim pacijentima, jasan i kompletan prikaz informacija svakog pacijenta i svih njegovih poseta klinici sa popisom usluga koje su mu tada pružene i izračunatom cenom usluga, zavisno od toga kom starosnom dobu pripada pacijent.

### 1.1. Cilj razvoja

Aplikacija prvenstveno treba da olakša svakodnevne aktivnosti rada sa kartonima pacijenata kroz Veb bazirani, grafički korisnički interfejs [4]. Prednost ovakvog korisničkog interfejsa je ta što je dovoljno da računari na klinici imaju instaliran samo Veb čitač kako bi pristupili sistemu. Time se eliminiše potreba ručnog ažuriranja i instalacije aplikacije na svakom od računara pojedinačno. Aplikacija može biti hostovana [5] na zatvorenoj, Intranet [6] mreži i biti dostupna samo unutar klinike, ili može biti hostovana na Internetu [7]. U svakom slučaju, neophodno je adekvatno zaštiti aplikaciju od napada malicioznih korisnika.

### 1.2. Obim sistema

Dve osnovne stvari koje su neophodne da bi aplikacija uspešno funkcionisala su **Veb server** i **server baze podataka**. U zavisnosti od potreba i mogućnosti, Veb server i server baze podataka se mogu nalaziti na istoj ili na dve različite fizičke mašine, ali se u oba slučaja mora obezbediti bezbedna i stalna veza između njih. Veb server omogućava izvršavanje celokupne poslovne logike aplikacije, a oslanja se na server baze podataka kako bi omogućio perzistenciju [8] podataka.

### 1.3. Prikaz proizvoda

U ovom potpoglavlju će biti detaljnije prikazani i opisani funkcionalni i nefunkcionalni zahtevi aplikacije:

##### Funkcionalni zahtevi

- Aplikacija treba da omogući autentifikaciju [9] i autorizaciju [10] dva tipa korisnika: **doktora** i **administratora**. Dodatno, aplikacija treba da vodi evidenciju o svim uspešnim i neuspešnim prijavama doktora na sistem, u cilju naknadne bezbezdnosne analize [11] u slučaju hakerskog [12] napada.
- Aplikacija treba da omogući doktorima pregled, dodavanje, izmenu i brisanje kategorija usluga klinike.
- Aplikacija treba da omogući doktorima pregled, dodavanje, izmenu i brisanje dostupnih usluga koje klinika obavlja.
- Aplikacija treba da omogući doktoru prikaz svojih pacijentata, dodavanje novog pacijenta, izmenu podataka o pacijentu i odjavljivanje pacijenta sa spiska svojih pacijenata.
- Za svakog svog pacijenta, unutar kartona tog pacijenta, doktoru treba omogućiti prikaz svih poseta pacijenta klinici. Jedna poseta sadrži pregled svih pruženih usluga pacijentu uz proračunatu cenu zavisno od toga da li je pacijent dete, lice od 15 do 65 godina ili penzioner. Doktoru takođe treba omogućiti izmenu, dodavanje i brisanje usluga unutar postojeće posete, dodavanje nove posete, kao i brisanje postojeće posete.
- Administratoru treba omogućiti kompletan spisak svih poseta, za sve pacijente.

##### Nefunkcionalni zahtevi

- Aplikacija treba da se izvršava na Veb serveru sa optimalnim performansama i visokim vremenom izvršavanja (engl. _uptime_) [13].
- Aplikacija treba da očuva integritet svih podataka [14] u bazi podataka, posebnim mehanizmom koji neće izričito uklanjati podatke, već će se podaci na poseban način u bazi podataka označavati kao "uklonjeni" što će uzrokovati da ne budu prikazani na strani aplikacije. Ukoliko ipak neke stvari mogu i trebaju da budu uklonjene, omogućiti transakcioni [15] mehanizam brisanja kako ne bi došlo do situacije da se u bazi nalaze polovično uklonjeni podaci, čime se takođe narušava integritet.
  Obezbediti validaciju podataka i sprečavanje pogrešnog ili malicioznog unosa na sledećim nivoima: - Nivo korisničkog interfejsa - Nivo poslovne logike - Nivo baze podataka

#### 1.3.1. Perspektiva proizvoda

Kao što je već napomenuto, ideja je da se aplikacija izvršava u Veb baziranom okruženju. Samim tim je neophodno obratiti posebnu pažnju na bezbednosne karakteristike aplikacije, kao što su kontrola prava pristupa [16] i autorizacija pomoću tokena [17].

#### 1.3.2. Funkcije proizvoda

Sve funkcije aplikacije su prikazane opštim dijagramom slučajeva korišćenja (engl. _use case_). Što se tiče uloga, postoje dve eksplicitne uloge, vezane za rad unutar aplikacije - **administrator** i **doktor**, kao i jedna implicitna, pre nego što se korisnik prijavi i autorizuje - **posetilac**. I administrator i korisnik koriste svoje _pristupne parametre_ kako bi se prijavili na sistem. U slučaju administratora, to su **korisničko ime** i **lozinka**, dok su kod doktora **adresa elektronske pošte** i **lozinka**. Posetilac nema pristup ničemu od aplikacije osim glavnog ekrana za unos pristupnih parametara.

Administrator može da pregleda sve evidentirane posete u sistemu.
Doktor može da:

- Uređuje kategorije usluga
- Uređuje usluge
- Uređuje svoje pacijente i njihove kartone

![Opšti dijagram slučajeva korišćenja](https://i.ibb.co/JKtY1KD/opsti-use-case.png, "Opšti dijagram slučajeva korišćenja")
_Slika 1 - Opšti dijagram slučajeva korišćenja_

#### 1.3.3. Karakteristike korisnika

**Korisnik** (doktor ili adninistrator) aplikacije je neophodno da poseduje iskustvo u osnovama korišćenja računara, da se dobro snalazi u Veb čitaču, kao i da poseduje radno iskustvo i adekvatno obrazovanje za poziciju koju obavlja.

#### 1.3.4. Ograničenja

- Aplikacija mora da bude realizovana na Node.js platformi korišćenjem Express biblioteke. Aplikacija mora da bude podeljena u dve nezavisne celine: back-end veb servis (API) i front-end (GUI aplikacija). Sav kôd aplikacije treba da bude organizovan u jednom Git spremištu u okviru korisničkog naloga za ovaj projekat, sa podelom kao u primeru zadatka sa vežbi.
- Baza podataka mora da bude relaciona i treba koristiti MySQL ili MariaDB sistem za upravljanje bazama podataka (RDBMS) i u spremištu back-end dela aplikacije mora da bude dostupan SQL dump strukture baze podataka, eventualno sa inicijalnim podacima, potrebnim za demonstraciju rada projekta.
- Back-end i front-end delovi projekta moraju da budi pisani na TypeScript jeziku, prevedeni TypeScript prevodiocem na adekvatan JavaScript. Back-end deo aplikacije, preveden na JavaScript iz izvornog TypeScript koda se pokreće kao Node.js aplikacija, a front-end deo se statički servira sa rute statičkih resursa back-end dela aplikacije i izvršava se na strani klijenta. Za postupak provere identiteta korisnika koji upućuje zahteve back-end delu aplikacije može da se koristi mehanizam sesija ili JWT (JSON Web Tokena), po slobodnom izboru.
- Sav generisani HTML kôd koji proizvodi front-end deo aplikacije mora da bude 100% validan, tj. da prođe proveru W3C Validatorom (dopuštena su upozorenja - Warning, ali ne i greške - Error). Grafički korisnički interfejs se generiše na strani klijenta (client side rendering), korišćenjem React biblioteke, dok podatke doprema asinhrono iz back-end dela aplikacije (iz API-ja). Nije neophodno baviti se izradom posebnog dizajna grafičkog interfejsa aplikacije, već je moguće koristiti CSS biblioteke kao što je Bootstrap CSS biblioteka. Front-end deo aplikacije treba da bude realizovan tako da se prilagođava različitim veličinama ekrana (responsive design).
- Potrebno je obezbediti proveru podataka koji se od korisnika iz front-end dela upućuju back-end delu aplikacije. Moguća su tri sloja zaštite i to: (1) JavaScript validacija vrednosti na front-end-u; (2) Provera korišćenjem adekvatnih testova ili regularnih izraza na strani servera u back-end-u (moguće je i korišćenjem izričitih šema - Schema za validaciju ili drugim pristupima) i (3) provera na nivou baze podataka korišćenjem okidača nad samim tabelama baze podataka.
- Neophodno je napisati prateću projektnu dokumentaciju o izradi aplikacije koja sadrži (1) model baze podataka sa detaljnim opisom svih tabela, njihovih polja i relacija; (2) dijagram baze podataka; (3) dijagram organizacije delova sistema, gde se vidi veza između baze, back-end, front-end i korisnika sa opisom smera kretanja informacija; (4) popis svih aktivnosti koje su podržane kroz aplikaciju za sve uloge korisnika aplikacije prikazane u obliku Use-Case dijagrama; kao i (5) sve ostale elemente dokumentacije predviđene uputstvom za izradu dokumentacije po ISO standardu.
- Izrada oba dela aplikacije (projekata) i promene kodova datoteka tih projekata moraju da bude praćene korišćenjem alata za verziranje koda Git, a kompletan kôd aplikacije bude dostupan na javnom Git spremištu, npr. na besplatnim GitHub ili Bitbucket servisima, jedno spremište za back-end projekat i jedno za front-end projekat. Ne može ceo projekat da bude otpremljen u samo nekoliko masovnih Git commit-a, već mora da bude pokazano da je projekat realizovan u kontinuitetu, da su korišćene grane (branching), da je bilo paralelnog rada u više grana koje su spojene (merging) sa ili bez konflikata (conflict resolution).

### 1.4. Definicije

[1] Veb aplikacija - softverski proizvod koji se izvršava na mreži i kome korisnik pristupa preko softvera posebne namene - Veb pregledača / čitača.
[2] Veb čitač - softver posebne namene koji omogućava korisniku da pregleda različite multimedijalne sadržaje na Internetu.
[3] Relaciona baza podataka - tip skladišta podataka u kome se podaci organizuju skupom relacija, vezama između entiteta.
[4] Grafički korisnički interfejs - softversko okruženje koje omogućava odnos korisnika i funkcija računara iscrtavanjem grafičkih elemenata na ekranu računara.
[5] Hostovanje - proces instalacije i pokretanje Veb aplikacije na fizičkoj ili virtualizovanoj mašini, tako da bude dostupna preko mreže (lokalne ili globalne).
[6] Intranet - zatvorena, privatna poslovna mreža koja ni u kom slučaju ne sme biti povezana na Internet, zbog poverljivosti podataka koji se razmenjuju unutar nje.
[7] Internet - globalna mreža međusobno povezanih računara.
[8] Perzistencija podataka - osobina / sposobnost sistema da čuva podatke i nakon prestanka rada aplikacije.
[9] Autentifikacija - Proces potvrde identiteta korisnika pre pristupa aplikaciji, potvrda da li smo mi zaista oni za koje se predstavljamo.
[10] Autorizacija - Proces koji sledi nakon autentifikacije, određivanje šta je dozvoljeno, a šta zabranjeno autentifikovanom korisniku unutar aplikacije.
[11] Bezbednosna analiza - proces utvrđivanja stepena zaštite neke aplikacije.
[12] Haker - Osoba koja poseduje odlično informatičko znanje i to znanje upotrebljava u maliciozne svrhe.
[13] Uptime - Mera pouzdanosti jednog sistema, koliko sistem (procentualno) može da radi bez prekida.
[14] Integritet podataka - Osiguravanje da su podaci u skladištu tačni i dosledni tokom celokupnog postojanja aplikacije.
[15] Transakcije - mehanizam očuvanja integriteta podataka u bazi, pouzdano izvršavanje izmena nad podacima u bazi čak i u slučaju grešaka.
[16] Pravila pristupa - Skup procedura koje jasno definišu ko i pod kojim uslovima može imati pristup kojim delovima aplikacije.
[17] Autorizacija pomoću tokena - Poseban tip autorizacije gde se pri svakom zahtevu dodaje i šalje šifrovan i tekstualno kodovan token, koji server dešifruje i proverava njegovu validnost.
[18] HTTP - protokol za prenos hipertekstualnog sadržaja preko Interneta.
[19] DML - (engl. _Data Manipulation Language_) Jezik za manipulaciju podataka u relacionim bazama podataka
[20] HTTPS - Bezbedan HTTP protokol, šifrovan pomoću TLS/SSL mehanizma.

## 2. Reference

- [1] "Веб прегледач", [Online], https://sr.wikipedia.org/sr/%D0%92%D0%B5%D0%B1-%D0%BF%D1%80%D0%B5%D0%B3%D0%BB%D0%B5%D0%B4%D0%B0%D1%87
  -- [2] "Access Control", [Online], https://en.wikipedia.org/wiki/Access_control#Computer_security
- [3] "Express documentation", [Online], https://expressjs.com/
- [4] "TypeScript documentation", [Online], https://www.typescriptlang.org/
- [5] "React documentation", [Online], https://reactjs.org/

## 3. Specifikacija zahteva

- Aplikacija će biti povezana na relacionu bazu podataka kako bi vršila dopremanje i manipulaciju podacima.
- Kao komunikacioni protokol se koristi HTTP [18]. Svi korisnici aplikacije treba da imaju veb čitač kompatibilan sa HTTP 1.0 / 1.1 protokolom.
- Sve funkcionalnosti treba da budu implementirane tako da korisniku omogućavaju jasan prikaz, lak unos i izmenu podataka, kao i provere i validacije pre izvršavanja kritičnih radnji (brisanje podataka).
- Dijagramima slučajeva korišćenja će biti prikazani slučajevi korišćenja svih korisnika aplikacije.
- Dijagramom entiteti-veze (ER) će biti prikazan model podataka aplikacije.

### 3.1. Spoljašnji interfejs

#### 3.1.1. Korisnički interfejs za ulogu doktora

Po samom pokretanju aplikacije, ukoliko nije prethodno ulogovan, posetilac biva preusmeren na stranicu za logovanje doktora.
![Prijava doktora](https://i.ibb.co/qDpSx7y/1-prijava-doktor.png "Prijava doktora")
_Slika 2 - Stranica za prijavljivanje doktora_

##### 3.1.1.1. Kategorije usluga

Ukoliko je uneo pogrešne parametre, posetiocu će biti prikazana odgovarajuća poruka sa greškom i može pokušati ponovo da se uloguje. Po uspešnom prijavljivanju u ulozi doktora, otvara mu se prikaz stranice sa kategorijama usluga klinike, gde se u vidu kartica prikazuju aktivne kategorije i njihove usluge.

![Kategorije usluga](https://i.ibb.co/KL8CPFD/2-kategorije-usluga.png, "Kategorije usluga")
_Slika 3 - Pregled kategorija usluga klinike_

Klikom na dugme "Nova kategorija", doktoru se otvara mali podmeni gde može izvršiti dodavanje nove kategorije unosom njenog naziva.

![Nova kategorija](https://i.ibb.co/FJfcLT8/3-nova-kategorija.png, "Nova kategorija")
_Slika 4 - Dodavanje nove kategorije_

Ako je došlo do greške, doktoru će se prikazati odgovarajuća poruka. Ako je uspešno dodao kategoriju, ona će biti prikazana u listi kao nova kartica. U bilo kom slučaju, panel za dodavanje će se zatvoriti.
Klikom na dugme "Izmeni" u nekoj od kartica, doktor dobija mogućnost da izmeni datu kategoriju. Tekstualno polje sa nazivom kategorije se pretvara u _input_ polje sa tekstom trenutnog naziva kategorije. Sada doktor može da unese novo ime kategorije, po izboru.

![Izmena kategorije](https://i.ibb.co/k1gqCvt/4-izmena-kategorije.png, "Izmena kategorije")
_Slika 5 - Izmena postojeće kategorije_

Ono što se takođe primećuje je da su se dugmići "Izmeni" i "Obriši", u ovom modu zamenili sa "Potvrdi" i "Odustani". Klikom na dugme "Odustani", doktoru se zatvara mod za editovanje i kategorija se prikazuje normalno. Ukoliko klikne na "Potvrdi", takođe se zatvara mod izmene, ali se sada kategorija u kartici prikazuje sa novim imenom.

Na kraju, klikom na dugme obriši, doktoru se prikazuje preko celog ekrana poruka koja ga pita da li je siguran da želi da obriše tu kategoriju i opcije "Da" i "Ne". Klikom na dugme "Da", meni se zatvara i obrisane kategorije više nema kao kartice u listi. Klikom na dugme "Ne" sve se vraća u prethodno stanje.

![Brisanje kategorije](https://i.ibb.co/w6KY5CG/5-brisanje-kategorije.png, "Brisanje kategorije")
_Slika 6 - Meni (dijalog) za potvrdu brisanja kategorije_

##### 3.1.1.2. Usluge klinike

Dok je ulogovan, doktor može klikom na stavku glavnog menija "Usluge" da vidi prikaz svih usluga koje klinika nudi u tom trenutku. Spisak se prikazuje tabelarno, i navedene su sledeće kolone:

- Naziv usluge
- Kataloški broj usluge
- Cena usluge
- Cena usluge za decu
- Cena usluge za penzionere
- Naziv kategorije kojoj usluga pripada
- Opcije za manipulaciju uslugom

![Spisak usluga - Desktop](https://i.ibb.co/mqfjtjg/6-usluge-desktop.png, "Spisak usluga - Desktop")
_Slika 7.1. - Prikaz usluga klinike - Desktop verzija_

![Spisak usluga - Mobile](https://i.ibb.co/m9QZpPQ/6-usluge-mobile.png, "Spisak usluga - Mobile")
_Slika 7.2. - Prikaz usluga klinike - Mobilna verzija_

Klikom na dugme "Nova usluga", doktoru se otvara nova stranica gde može izvršiti dodavanje nove usluge u bazu podataka. Tu doktor može da unese sve neophodne podatke da bi se uspešno dodala nova usluga:

- Naziv
- Opis
- Kataloški broj
- Cena
- Cena za decu
- Cena za penzionere
- Kategorija (iz liste dostupnih)

![Nova usluga](https://i.ibb.co/NCnjzNx/7-nova-usluga.png, "Nova usluga")
_Slika 8 - Dodavanje nove usluge_

Klikom na dugme "Dodajte novu kategoriju" doktor započinje proces slanja unetih podataka na server. Ukoliko podaci iz nekog razloga nisu ispravni, doktoru će se prikazati poruka o grešci. Ako su podaci ispravni doktor će biti vraćen nazad na spisak usluga. Ukoliko se odluči da ipak ne želi da doda novu uslugu, klikom na dugme "Nazad" takođe će biti vraćen nazad na spisak usluga.

Sledeća stvar koju doktor može da uradi dok je na stranici koja prikazuje spisak svih usluga (Slike 6.1 i 6.2) jeste da klikom na dugme "Izmeni" određene kategorije bude preusmeren na stranicu sa formom za izmenu usluge. Svi podaci o usluzi će biti unapred popunjeni u odgovarajuća polja forme.

![Izmena usluge](https://i.ibb.co/xfVX6t6/8-izmena-usluge.png, "Izmena usluge")
_Slika 9 - Izmena postojeće usluge_

Kao i na stranici za dodavanje usluge, klikom na dugme nazad, doktor može odustati od izmene usluge i shodno tome biće vraćen nazad na spisak usluga. Ukoliko je izmenio podatke, ali oni nisu ispravni, klikom na dugme "Izmenite uslugu" biće mu ispisana informacija greške, a u slučaju da su izmenjeni podaci ispravni, biće preusmeren nazad na spisak usluga.

Poslednja stvar koju doktor može da uradi na stranici sa spiskom usluga jeste da obriše neku od usluga, klikom na dugme "Obriši" odgovarajuće kategorije (Slike 6.1 i 6.2). Standardno, prvo će mu se prikazati dijalog preko celog ekrana koji će doktora pitati da li je siguran da želi da obriše uslugu. Klikom na dugme "Ne", dijalog se zatvara i stanje ostaje kao pre pojave dijaloga. U slučaju izbora opcije "Da" dijalog se takođe zatvara ali se obrisana usluga više ne pojavljuje u tabeli.

![Brisanje usluge](https://i.ibb.co/4WyxDLh/9-brisanje-usluge.png, "Brisanje usluge")
_Slika 10 - Dijalog za brisanje konkretne usluge_

##### 3.1.1.3. Pacijenti

Dok je ulogovan, doktor može da klikom na stavku glavnog menija "Moji pacijenti" vidi spisak svih pacijenta koji su mu dodeljeni. Spisak se prikazuje tabelarno i sadrži sledeće kolone:

- Ime
- Prezime
- Datum rođenja
- Pol (M za muški, Ž za ženski)
- E-mail
- JMBG
- Adresa
- Opcije za manipulaciju pacijentima

![Spisak pacijenata - Desktop verzija](https://i.ibb.co/4jS74B5/10-pacijenti-desktop.png, "Spisak pacijenata - Desktop verzija")
_Slika 11.1 - Spisak pacijentata za doktora - Desktop verzija_

![Spisak pacijenata - Mobilna verzija](https://i.ibb.co/r0ktmDr/10-pacijenti-mobile.png, "Spisak pacijenata - Mobilna verzija")
_Slika 11.2 - Spisak pacijentata za doktora - Mobilna verzija_

Dok je na ekranu sa spiskom pacijenata doktor može da klikom na dugme "Dodaj novog pacijenta" otvori stranicu gde će mu se prikazati forma za dodavanje novog pacijenta. Forma sadrži sve osnovne informacije o pacijentu, koje se nalaze u tabeli.

![Dodavanje pacijenta - Desktop verzija](https://i.ibb.co/kMGxDY2/11-dodavanje-pacijenta-desktop.png, "Dodavanje korisnika - Desktop verzija")
_Slika 12.1 - Dodavanje korisnika - Desktop verzija_

![Dodavanje pacijenta - Mobilna verzija](https://i.ibb.co/G9KsjKN/11-dodavanje-pacijenta-mobile.png, "Dodavanje korisnika - Mobilna verzija")
_Slika 12.2 - Dodavanje korisnika - Mobilna verzija_

Ukoliko se predomisli u vezi dodavanja novog pacijenta, doktor uvek može klikom na dugme "Nazad" da se vrati na spisak pacijenata. Ako je ipak uneo podatke i želi da doda novog pacijenta, to može učiniti klikom na dugme "Dodavanje novog pacijenta". Kao i uvek, ukoliko ima grešaka biće prikazane, a ako je sve prošlo kako treba, doktor će biti vraćen na spisak pacijenata, gde može videti i podatke o novom pacijentu.

Sledeća stvar koju doktor može da uradi dok je na stranici sa spiskom svojih pacijenata (Slike 10.1 i 10.2) je izmena podataka o postojećem pacijentu, klikom na opciju "Izmeni" za konkretnog pacijenta. Nakon, toga otvara mu se nova stranica sa formom za dodavanje novog pacijenta, sa već popunjenim podacima konkretnog pacijenta.

![Izmena pacijenta - Desktop](https://i.ibb.co/LNXyT04/12-izmena-pacijenta-desktop.png, "Izmena pacijenta - Desktop")
_Slika 13.1 - Izmena pacijenta - Desktop verzija_

![Izmena pacijenta - Mobile](https://i.ibb.co/n8Lvws5/pacijent-Izmena.png, "Izmena pacijenta - Mobile")
_Slika 13.1 - Izmena pacijenta - Mobilna verzija_

Klikom na dugme "Nazad" doktor se standardno vraća na spisak pacijenata, a klikom na dugme "Izmeni pacijenta" u slučaju greške dobija neophodne informacije, a u slučaju uspešne izmene, vraća se na spisak pacijenata, gde sada može videti i nove podatke o pacijentu.

Na stranici za prikaz pacijenata (Slike 10.1 i 10.2) brisanje se vrši klikom na dugme "Obriši" za konkretnog pacijenta. Pojavljuje se standardni dijalog za brisanje unutar aplikacije, sa opcijama "Da" i "Ne", od kojih "Ne" samo zatvara dijalog, a opcija "Da" zatvara dijalog i prikazuje listu pacijenata bez onog koji je obrisan.
![Brisanje pacijenta](https://i.ibb.co/zhqgXXB/brisanje-pacijenta.png, "Brisanje pacijenta")
_Slika 14 - Dijalog za brisanje pacijenta_

Ono što poslednje doktor može da uradi dok se nalazi na stranici sa spiskom svojih pacijenata jeste pregled kartona određenog pacijenta, klikom na dugme "Karton pacijenta". Otvara mu se nova stranica sa kartonom pacijenta gde može videti spisak svih poseta pacijenta (svi pregledi, intervencije, analize izvršene u jednoj poseti pacijenta klinici).

##### 3.1.1.3. Karton pacijenta / Upravljanje posetama i pruženim uslugama

Dakle, kada je doktor kliknuo na dugme "Karton pacijenta" za određenog pacijenta iz spiska svih pacijenata, otvara mu se nova stranica gde može da vidi sve podatke o posetama tog pacijenta klinici, koje su prikazane tabelarno i koje sadrže:

- Datum
- Koji je doktor dodao podatke
- Koji je doktor poslednji uredio podatke
- Broj izvršenih usluga (pregleda, intervencija, analiza...) tokom te posete
- Ukupnu cenu
- Opcije za manipulaciju posetama.

![Karton pacijenta - Desktop](https://i.ibb.co/bXS9HSv/karton-desktop.png, "Karton pacijenta - Desktop")
_Slika 15.1 - Karton pacijenta - Desktop verzija_

![Karton pacijenta - Mobile](https://i.ibb.co/fVJzvnN/karton-mobile.png, "Karton pacijenta - Mobile")
_Slika 15.2 - Karton pacijenta - Mobilna verzija_

Klikom na dugme "Nova poseta", doktoru se otvara nova stranica u kojoj može izvršiti dodavanje nove posete. Ono što se tom prilikom traži od njega jeste da obavezno unese datum posete, a zatim klikom na dugme "Dodaj uslugu" mu se kreira nova mala forma u koju može uneti jednu izvršenu uslugu i njene detalje.
Doktor može otvoriti proizvoljan broj tih formi, a klikom na dugme "Obriši" može neku od unetih usluga i obrisati ukoliko se predomislio ili je pogrešio pri unosu. Klikom na dugme "Potvrdi", započinje se dodavanje nove posete. Ukoliko greške postoje, one će biti prikazane, a ako je sve prošlo kako treba, doktor će biti vraćen nazad na spisak poseta za izabranog pacijenta (slike 14.1 i 14.2).

![Nova poseta](https://i.ibb.co/vxBXSJd/Nova-poseta.png, "Nova poseta")
_Slika 16 - Nova poseta za pacijenta_

Na stranici sa kartonom pacijenta (slike 14.1 i 14.2) doktor može i da izmeni određenu posetu za pacijenta, odnosno može da doda određenu uslugu ako je zaboravio da unese ili da izmeni ili obriše neku od već unetih, po potrebi. Interfejs je sličan kao i kod dodavanja nove posete, samo su podaci unapred popunjeni. Takođe, ako se pri izmeni desi problem, biće prikazana odgovarajuća greška, a suprotno, doktor se vraća na karton pacijenta.

![Izmena posete](https://i.ibb.co/1s30hvJ/Izmena-posete.png, "Izmena posete")
_Slika 17 - Izmena posete_

Takođe na stranici sa kartonom pacijenta (slike 14.1 i 14.2) doktor može da ukloni posetu klikom na dugme "Obriši" za izabranu posetu u tabeli. Prikazaće se standardan dijalog koji pita doktora da li je siguran da želi da obriše posetu. Ako doktor izabere opciju "Da" dijalog će se zatvoriti i poseta će biti obrisana, a u suprotnom će se samo zatvoriti dijalog, bez brisanja posete.

![Brisanje posete](https://i.ibb.co/2cDRqbs/Brisanje-Posete.png, "Brisanje posete")
_Slika 18 - Dijalog za brisanje posete_

Poslednja stvar koju doktor može da uradi na stranici sa kartonom pacijenta (slike 14.1 i 14.2) jeste da pogleda detalje o određenoj poseti, klikom na dugme "Detalji" za izabranu posetu. Otvoriće mu se ekran sa prikazom osnovnih podataka o poseti kao i tabelom izvršenih usluga, praćenih opisom svake usluge.

![Detalji posete](https://i.ibb.co/QkMzbHN/Detalji-Posete.png, "Detalji posete")
_Slika 19 - Detalji posete_

Konačno, po obavljenom poslu, doktor može da se odjavi klikom na stavku iz glavnog menija "Odjavite se". Tom prilikom biće preusmeren na stranicu za prijavljivanje.

#### 3.1.2. Korisnički interfejs za ulogu administratora

#### 3.1.2.1. Prijava na sistem

Po samom pokretanju aplikacije, ukoliko nije prethodno ulogovan, posetilac biva preusmeren na stranicu za logovanje doktora. Ukoliko želi da se prijavi kao administrator, to može učiniti klikom na stavku glavnog menija "Prijavite se kao administrator". Nakon toga biće mu otvorena forma za unos korisničkog imena i lozinke.

![Prijava administratora na sistem](https://i.ibb.co/K2qXs72/2021-06-15-10-55-34-Presentation1-Power-Point.png, "Prijava administratora na sistem")
_Slika 20 - Prijava administratora na sistem_

##### 3.1.1.1. Pregled svih obavljenih poseta

Nakon uspešnog prijavljivanja na sistem, administrator će biti preusmeren na stranicu sa prikazom svih obavljenih poseta, što je ujedno i jedina funkcionalnost koja je trenutno predviđena za ovu ulogu. Posete su prikazane u vidu kartica (1 poseta - 1 kartica) i sadrže osnovne informacije o poseti, pacijentu, pruženim uslugama i tome koji je status posete ("Aktivna" ili "Obrisana").

![Sve posete](https://i.ibb.co/5880qRL/Sve-Posete-Admin.png, "Sve posete")
_Slika 21 - Sve posete (administratorska uloga)_

Kada je administrator završio sa radom, klikom na dugme "Odjava" u glavnom meniju može zatvoriti administrativni panel. Biće preusmeren na stranicu za prijavu administratora na sistem.

### 3.2. Funkcije

U ovkiru aplikacije postoje dve eksplicitne i jedna implicitna uloga:

- Administrator
- Doktor
- Neprijavljeni korisnik (posetilac)

#### 3.2.1. Dijagram slučajeva korišćenja za ulogu posetioca

![Slučaj korišćenja - posetilac](https://i.ibb.co/7VZ4G4p/2021-06-15-13-03-27-Presentation1-Power-Point.png, "Slučaj korišćenja - posetilac")
_Slika 22 - Dijagram slučajeva korišćenja za ulogu posetioca_
Posetilac, odnosno neprijavljeni korisnik može isključivo da se prijavi na sistem sa pristupnim parametrima i ima izbor da se prijavi u jednu od dve uloge: **doktor** ili **administrator**. Ukoliko su pristupni parametri ispravni, u zavisnosti od opcije koje je izabrao dobija pristup aplikaciji u toj ulozi.

### 3.2.2. Dijagram slučajeva korišćenja - Administrator

![Slučaj korišćenja - administrator](https://i.ibb.co/tHqbHBy/2021-06-15-13-10-02-Presentation1-Power-Point.png, "Slučaj korišćenja - administrator")
_Slika 23 - Dijagram slučajeva korišćenja za ulogu administratora_
Ukoliko se posetilac uspešno autentifikovao i autorizovao u ulogu administratora, sada kao administrator ima mogućnost samo da izvrši pregled svih evidentiranih poseta, za sve pacijente u sistemu. Moguće je tokom vremena dodati još mogućnosti administratoru, međutim, ovo je za sada predviđeno projektnim zahtevom.

### 3.2.3. Dijagram slučajeva korišćenja - Doktor

![Slučaj korišćenja - doktor](https://i.ibb.co/C9pNQ6T/Picture1.jpg, "Slučaj korišćenja - doktor")
_Slika 24 - Dijagram slučajeva korišćenja za ulogu doktora_

- Uređivanje kategorija usluga - Pregled, dodavanje, izmena i brisanje kategorija usluga.
- Uređivanje usluga - Pregled, dodavanje, izmena i brisanje usluga.
- Uređivanje svojih pacijenata - Naglašeno je da doktor može da uređuje samo pacijente koji su mu dodeljeni.
  - Pregled, dodavanje, izmena, brisanje svojih pacijenanta
  - Prilikom dodavanja pacijenta, automatski mu se otvara i karton, a prilikom brisanja se zatvara.
  - Uređivanje kartona svog pacijenta podrazumeva:
    - Pregled kartona
      - Pregled svih poseta evidentiranih u kartonu
    - Izmena kartona
      - Izmena poseta
        - Dodavanje novih izvršenih usluga u postojeću posetu
        - Izmena postojećih izvršenih usluga u postojećoj poseti
        - Brisanje postojećih izvršenih usluga u postojećoj poseti
      - Brisanje poseta (sa svim izvršenim uslugama)
    - Dodavanje poseta u karton
      - Dodavanje izvršenih usluga za tu posetu

### 3.3. Pogodnosti za upotrebu

Imajući u vidu da se aplikaciji može pristupiti posredstvom Veb čitača, smanjuje se kompleksnost instalacije softvera na različite računare. Korisnici aplikacije imaju jedinstven, konzistentan intefejs sa bilo kog računara da pristupaju aplikaciji. Najveća pogodnost leži u činjenici da nema potrebe voditi evidenciju rada klinike kroz podatke štampane na papiru (kartoni pacijenata) već se čitava evidencija uvek može naći u elektronskoj formi, lako čitljiva.

### 3.4. Zahtevane performanse

Aplikacija treba da obezbedi korisniku brz odziv i pristup podacima, visoku dostupnost posmatranu kroz metriku vremena rada bez prekida, brz unos podataka i što manje čekanje prilikom zahtevanja određene funkcionalnosti.

Porast korisnika aplikacije se može desiti samo u slučaju zapošljavanja novog osoblja, imajući u vidu da pacijenti i ostali korisnici nemaju pristup aplikaciji.

### 3.5. Zahtevi baze podataka

![Model baze podataka](https://i.ibb.co/QHpgYGd/Database-Model.png, "Model baze podataka")
_Slika 25 - Model baze podataka_

Podaci će se čuvati u trajnom skladištu relacionog tipa. Ovakvi podaci imaju jasnu i čvrstu definiciju, dobru organizaciju i podržavaju međusobnu povezanost entiteta. Takođe primemom DML[19] možemo na relativno jednostavan način pretraživati, dodavati, menjati i uklanjati podatke.

Što set tiče maksimalnog kapaciteta baze, on je određen količinom dostupnih resursa na serveru baze podataka.

Zbog toga što se aplikacija u potpunosti oslanja na bazu podataka za rad sa podacima, neophodno je da i ona, kao i aplikacija ima visok procenat dostupnosti i da funkcioniše bez prekida.

Na sledećim slikama biće prikazane definicije svih tabela i popis njihovih kolona u bazi podataka.

Oznake: **PK** - označava primarni ključ tabele (jedinstveni identifikator zapisa). **NN** - ograničenje da podatak uvek mora imati definisnanu vrednost (NOT NULL). **UN** - Neoznačeni broj, ne može imati negativnu vrednost (UNSIGNED). **UQ** - jedinstvena vrednost, nijedan drugi zapis ne može imati istu takvu vrednost polja (UNIQUE). **AI** - Primarni ključ se automatski uvećava za 1 pri unosu novog podatka u tabelu (AUTO INCREMENT)

Tabela **category**
![Tabela category](https://i.ibb.co/0XVmPWR/category.png, "Tabela category")c
_Slika 26 - Tabela **category**_

Tabela **service**
![Tabela service](https://i.ibb.co/82M6BnL/service.png, "Tabela service")
_Slika 27 - Tabela **service**_

Tabela **doctor**
![Tabela doctor](https://i.ibb.co/g6QzYw5/doctor.png, "Tabela doctor")
_Slika 28 - Tabela **doctor**_

Tabela **patient**
![Tabela patient](https://i.ibb.co/XJJMNJs/patient.png, "Tabela patient")
_Slika 29 - Tabela **patient**_

Tabela **administrator**
![Tabela administrator](https://i.ibb.co/n83T4kp/administrator.png, "Tabela administrator")
_Slika 30 - Tabela **administrator**_

Tabela **login_record**
![Tabela login_record](https://i.ibb.co/qsDLJw9/login-record.png, "Tabela login_record")
_Slika 30 - Tabela **login_record**_

Tabela **visit**
![Tabela visit](https://i.ibb.co/9tfp9J9/visit.png, "Tabela visit")
_Slika 31 - Tabela **visit**_

Tabela **visit_service** (Vezna tabela između tabela visit i service)
![Tabela visit_service](https://i.ibb.co/xDNTLtL/visit-service.png, "Tabela visit_service")
_Slika 32 - Tabela **visit_service**_

### 3.6. Projektna ograničenja

Da bi se aplikacija uspešno izvršavala neophodno je obezbediti, stalnu, brzu i pouzdanu internet konekciju, jake i pouzdane servere, kako za aplikaciju, tako i za server baze podataka.
Aplikacija mora da bude realizovana na Node.js platformi korišćenjem Express biblioteke, podeljena u dve nezavisne celine: **front-end** i **back-end**. Sav kôd aplikacije treba da bude organizovan u jednom **Git** spremištu. Front-end deo aplikacije mora biti napravljen korišćenjem _React_ biblioteke.

### 3.7. Sistemske karakteristike softvera

Posebna pažnja treba da se obrati na bezbednosne karakteristike aplikacije i komunikacije između klijenta i same aplikacije. Obezbediti tokensku autentifikaciju sa mehanizmom osvežavanja tokena kratkog trajanja, a kako bi bili sigurni u validnost tokena, komunikaciju bi trebalo zaštiti HTTPS [20] protokolom.

### 3.8. Dopunske informacije

Sistem zadovoljava potrebe administracije jedne privatne klinike. Predstavlja informacioni sistem za upravljanje podacima u elektronskoj formi, čime su podaci uvek dostupni u jednoj, centralizovanoj bazi, bez potrebe za skladištenjem velike količine papirologije.
