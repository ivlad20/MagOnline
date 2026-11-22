-- Date demo pentru rularea locală (docker compose).
-- Se încarcă o singură dată, când volumul MySQL e gol (docker compose down -v ca să le reîncarci).
-- Cont demo (are și profil de vânzător): email demo@magonline.local / parolă demo-9337d705
SET NAMES utf8mb4;

INSERT INTO users (id, name, surname, username, email, phone, password) VALUES
  (1, 'Demo', 'MagOnline', 'demo', 'demo@magonline.local', '0700000000', '$2y$10$EB3MNi/26beqTqJDusfRJ.U2gUcedTuHgBPNH6g0JIuAZ6lcWIFj2');

INSERT INTO sellers (user_id, company_name, cui, address, phone, iban) VALUES
  (1, 'MagOnline Demo SRL', 'RO00000000', 'Bucuresti, Romania', '0700000000', 'RO00DEMO0000000000000000');

INSERT INTO products (id, seller_id, brand, category, subcategory, description, price, stock, title) VALUES
  (28, 1, 'AMD', 'Componente PC', 'Placi Video', 'Accelerarea AI cu AMD

Placile grafice din seria Radeon PRO sunt concepute pentru a accelera experientele AI avansate si pentru a functiona pe mai multe cadre de invatare automata, accelerand sarcinile AI locale si procesand seturi mari de date de invatare automata.', 7499.99, 5, 'Placa video SAPPHIRE AMD RADEON™ AI PRO R9700 32GB GDDR6 LITE'),
  (29, 1, 'Rasasi', 'Ingrijire personala & Cosmetice', 'Parfumuri', 'Descoperiti rafinamentul suprem cu Rasasi Hawas Ice Eau de Parfum pentru Barbati, 100 ml. Acest parfum captivant combina armonios note olfactive proaspete si revigorante, creand o esenta care emana eleganta si masculinitate. Note Olfactive: Note de Varf: Mar, Lamaie Italiana, Bergamota Siciliana, Anason Stelat Note de Mijloc: Prune, Floare de Portocal, Cardamom Note de Baza: Muschi, Ambra, Mosc, Lemn Esuat Rasasi Hawas Ice este perfect pentru barbatii care apreciaza un parfum vibrant si dinamic. Notele sale de varf de mar, lamaie italiana si bergamota siciliana ofera o deschidere proaspata si energizanta, in timp ce anasonul stelat adauga o nota unica de mister. Notele de mijloc de prune, floare de portocal si cardamom aduc o complexitate sofisticata si atragatoare. Baza parfumata, compusa din muschi, ambra, mosc si lemn esuat, confera compozitiei o profunzime calda si persistenta. Recomandari de Purtare: Acest parfum este ideal pentru purtarea zilnica, fie la birou, fie in intalniri de afaceri, datorita caracterului sau versatil si atractiv. In serile speciale sau evenimentele deosebite, Rasasi Hawas Ice adauga un plus de rafinament si magnetism personalitatii tale. Este, de asemenea, o alegere excelenta pentru zilele de primavara si vara, datorita notelor sale proaspete si revigorante. Transformati fiecare moment intr-o experienta olfactiva de neuitat cu Rasasi Hawas Ice Eau de Parfum pentru Barbati, 100 ml. Adaugati acest parfum distinctiv in colectia dvs. si bucurati-va de un amestec perfect de modernitate si traditie.', 213.99, 10, 'Apa de parfum Rasasi Hawas Ice de barbat 100 ml'),
  (30, 1, 'Corsair', 'Componente PC', 'Surse PC', 'Cea mai bine vanduta sursa de alimentare a noastra, actualizata. Aceasta sursa de alimentare complet modulara, cu zgomot redus, certificata Cybenetics Gold, este compatibila cu ATX 3.1 si ideala pentru a furniza energie fiabila PC-urilor performante de astazi.', 739.99, 3, 'Sursa Corsair RM850x, Cybenetics Gold, 850W, 12VHPWR, ATX 3.1, Full Modulara, Negru'),
  (31, 1, 'Arctic', 'Componente PC', 'Cooler Procesor', 'Radiator de clasa premium

Radiatorul de 38 mm nu numai ca imbunatateste disiparea caldurii, dar are si o capacitate mai mare de lichid decat radiatoarele conventionale de 27 mm. Acest lucru reduce acumularea de caldura si asigura o gestionare mai eficienta a varfurilor de temperatura.', 517.99, 2, 'Cooler procesor ARCTIC Arctic Liquid Freezer III Pro 420, AIO 420mm, Intel/ AMD, Negru'),
  (32, 1, 'Intel', 'Componente PC', 'Placi Video', 'Intel® Arc™ Pro B50

Intel Arc Pro B50 este o placă grafică profesională bazată pe microarhitectura Xe2, concepută pentru sarcini grafice avansate cu suport pentru ray tracing și accelerare AI. Echipată cu 16 GB de memorie GDDR6 cu o interfață pe 128 de biți și 16 nuclee Xe tactate la 2600 MHz, aceasta oferă o putere de procesare impresionantă de 170 TOPS datorită celor 128 de motoare XMX AI. Unitățile de ray tracing oferă iluminare și reflexii fotorealiste în aplicații compatibile, fiind ideală pentru creatorii și designerii de conținut.

Placa utilizează tehnologii avansate XeSS 2, inclusiv super rezoluție bazată pe inteligență artificială, generare de cadre și reducere a latenței. Aceste caracteristici se combină pentru a oferi rate de cadre de până la 3,9 ori mai rapide decât generația anterioară, asigurând un joc fluid în jocuri AAA solicitante și aplicații profesionale. Tehnologia Xe Low Latency se integrează direct cu motorul jocului, minimizând lag-ul de intrare pentru o reacție îmbunătățită.

Optimizată pentru industria AEC (Arhitectură, Inginerie și Construcții), placa este certificată de furnizori independenți de software (ISV), garantând stabilitatea și performanța. Compatibilitatea cu Windows și Linux (inclusiv o stivă de software containerizată) și suportul pentru drivere profesionale o fac un instrument universal pentru creatorii, inginerii și dezvoltatorii care lucrează la proiecte și implementări avansate de inteligență artificială.', 3702.43, 4, 'Placă grafică Intel Arc Pro B50, 16GB, ray tracing, 128-bit, desktop PC'),
  (33, 1, 'Samsung', 'TV, Audio-Video & Foto', 'Televizoare', 'Vezi fiecare nuanta de culoare in toata gloria sa cu procesorul nostru avansat. In plus, optimizarea puternica 4K te asigura ca obtii o rezolutie de pana la 4K pentru continutul pe care il indragesti.', 1299.99, 9, 'Televizor SAMSUNG LED 43U8092, 108 cm, Smart, 4K Ultra HD, Clasa G'),
  (34, 1, 'Razer', 'Periferice PC', 'Mouse', 'Personalizare totala

Creeaza, controleaza si promoveaza stilul tau de joc cu noul Razer Basilisk V3 — mouse-ul de gaming ergonomic prin excelenta pentru performante personalizate. Cu 10+1 butoane programabile, o rotita inteligenta de defilare si o doza mare de Razer Chroma™ RGB, este timpul sa luminezi concurenta in felul tau.

 

Joaca-te ca niciodata

10+1 Butoane programabile

Atribuiti toate macrocomenzile si functiile secundare prin 11 butoane usor de accesat, inclusiv celebrul sau declansator multifunctional, pentru a executa actiuni esentiale, cum ar fi tasta pentru a vorbi, ping si multe altele.', 209.99, 12, 'Mouse Gaming Razer Basilisk V3 Chorma RGB'),
  (35, 1, 'GIGABYTE', 'Componente PC', 'Placa de baza', 'Modul X3D Turbo

Descopera performante de jocuri de ultima generatie cu o singura activare.

Parametrii unici de optimizare ai modului X3D Turbo permit chiar si procesoarelor Ryzen™ 9000 X3D Gaming Performance Enhance si Ryzen™ 9000 non-X3D sa atinga niveluri de performanta in jocuri similare cu cele ale procesoarelor Ryzen™ X3D. Bucurati-va de o experienta de joc mai fluida, rate de cadre mai mari si latenta redusa cu inovatia BIOS de la GIGABYTE - modul X3D Turbo.', 912.3, 9, 'Placa de baza GIGABYTE B840 EAGLE WIFI 6E, Socket AM5'),
  (36, 1, 'AMD', 'Componente PC', 'Procesoare', 'Cel mai puternic procesor desktop din lume

Bucurati-va de viteza pe care o poate oferi cel mai avansat procesor pentru desktop din lume. Nu conteaza daca lucrati din greu sau jucati din greu, procesorul AMD Ryzen™ 9950X este o putere absoluta. Tehnologia de baza de inalta performanta "Zen 5" de la AMD este cheia ta pentru o performanta care iti schimba jocul si in care poti avea incredere.', 1439.9, 5, 'Procesor AMD Ryzen™ 7 9700X, 3.8/5.5GHz Boost, Socket AM5, Radeon Graphics'),
  (37, 1, 'Corsair', 'Componente PC', 'Memorii RAM', 'FACETI TOTUL SI MAI REPEDE

In era multi-core, viteza de procesare fara precedent a DDR5 asigura faptul ca procesorul dvs. high-end obtine date rapid si cu usurinta. Indiferent daca va jucati, creati continut, deschideti 100 de file sau faceti mai multe sarcini, PC-ul dvs. poate efectua sarcini complexe mai rapid ca niciodata.', 2772.99, 8, 'Memorie Corsair VENGEANCE®, 32GB (2x16GB), DDR5, AMD EXPO, 6000MHz CL36, Dual Channel Kit'),
  (38, 1, 'Camelion', 'TV, Audio-Video & Foto', 'Baterii, acumulatori si incarcatoare', 'Set 10 baterii AG10 LR1130 1.5V Camelion alcaline este solutia practica pentru alimentarea dispozitivelor electronice de mici dimensiuni. Bateriile ofera tensiune stabila si performanta fiabila pentru utilizarea zilnica.
Acest set contine 10 baterii alcaline tip AG10, echivalente cu LR1130, 389 si 189. Sunt recomandate pentru o gama larga de echipamente care utilizeaza acest format de baterie.
Tehnologia alcalina asigura o durata mare de functionare si o buna pastrare a energiei in timpul depozitarii. Bateriile sunt fara mercur, respectand cerintele moderne privind protectia mediului.
Pot fi utilizate in ceasuri, calculatoare de buzunar, jucarii, telecomenzi, aparate medicale, instrumente de masura, lasere, lanterne mini, cantare, chei auto si alte dispozitive compatibile cu bateriile AG10/LR1130.
Ambalajul cu 10 bucati este ideal pentru utilizatori casnici, service-uri sau ateliere care doresc sa aiba mereu baterii de rezerva la indemana.
Caracteristici principale:
Set 10 baterii alcaline Camelion
Model: AG10-BP10
Tip baterie: AG10 / LR1130 / 389 / 189
Tensiune: 1.5V
Tehnologie: Alcalina
Fara mercur (0% Hg)
Ambalaj: 10 bucati
EAN: 4260216454981
Compatibile cu numeroase dispozitive electronice
Energie stabila si durata lunga de utilizare.', 9.92, 23, 'Set 10 baterii buton alkaline 1.5V AG10 LR1130 389 189 Camelion AG10-BP10'),
  (39, 1, 'Nothing', 'TV, Audio-Video & Foto', 'Playere, Boxe & Casti', 'Acum te pot auzi

Incorporat in carcasa de incarcare a Ear (3) se afla un sistem revolutionar cu microfon dual, bazat pe microfoane cu filtrare ambientala. Il numim Super Mic. Acesta se concentreaza pe vocea ta si elimina toate celelalte zgomote (pana la 95 dB) pentru claritate totala in apeluri si mesaje vocale.', 898.99, 8, 'Casti In-Ear Nothing Ear (3), True Wireless, Bluetooth, Adaptive Noice Cancelation, Spatial Audio, White'),
  (40, 1, 'OEM', 'Periferice PC', 'Mousepad', 'Descrierea produsului Suprafață netedă: Fabricat din material moale din fibre, mouse pad-ul are o suprafață netedă și moale, asigurând un control mai precis al mouse-ului și făcându-l ideal pentru munca de birou și jocuri. Bază antiderapantă: Baza din cauciuc îmbunătățește aderența dintre mouse pad și birou, asigurând o senzație mai stabilă și prevenind alunecarea chiar și în timpul mișcărilor rapide ale mouse-ului. Protector de birou: Materialul impermeabil și rezistent la căldură reduce efectul scurgerilor de lichide pe birou. Ușor de curățat: Pur și simplu ștergeți cu o cârpă umedă sau un prosop de hârtie. Material: Cauciuc natural Dimensiuni: 40 × 90 × 0.3 cm Culoare: Ceară închisă la culoare Nr. articol: de6e75ae-e68b-541f-9408-bfcb79a2451f Informații despre siguranța produsului', 243.59, 10, 'Mouse pad extra mare K0255-0810-CDCJ31773, design pictura in cerneala, suprafata fina pentru control precis, baza antiderapanta din cauciuc natural, 40 x 90 x 0.3 cm, negru/gri'),
  (41, 1, 'Sony', 'TV, Audio-Video & Foto', 'Playere, Boxe & Casti', 'Mai presus de liniste. Sunet transcendental.

Sunet premium cu cea mai buna functie de anulare a zgomotului

Lasati sunetul sa va captiveze. Cea mai avansata functie de anulare a zgomotului de pana acum, sustinuta de un cip de urmatoarea generatie si algoritmi inteligenti, blocheaza orice sunet deranjant inainte ca acesta sa ajunga la dumneavoastra. Apeluri deosebit de clare. Experienta pura, neintrerupta.

Desfaceti. Rotiti. Explorati.

Fiecare curba, fiecare linie, create pentru miscare fluida si portabilitate facila.', 1899.99, 2, 'Casti Over the Ear Sony WH-1000XM6B, Wireless, Bluetooth, Hi-Res Audio, Noise cancelling, Autonomie 30 ore, Microfon, Alexa si Google Assistant, Design pliabil, Negru'),
  (42, 1, 'Rasasi', 'Ingrijire personala & Cosmetice', 'Parfumuri', 'Experimentati parfumul dinamic al Rasasi Hawas Fire Eau de Parfum 100 ml, un amestec puternic de prospetime, caldura si eleganta moderna. Aceasta creatie aromatic-acvatica se deschide cu note de varf verzi revigorante, precum salvia, transmitand energie si claritate. In inima, notele marine si iasomia egipteana se combina pentru a crea un caracter vibrant, marin-floral, inainte ca baza de chihlimbar cald, accente minerale si ambra gri sa completeze parfumul cu profunzime, senzualitate si o prezenta de lunga durata. Hawas Fire este perfect pentru barbatii si femeile care cauta un parfum modern, distinctiv, care sa iasa in evidenta atat ziua, cat si noaptea. Hawas Fire este ideal atat pentru barbatii, cat si pentru femeile care cauta un parfum modern, distinctiv, care sa iasa in evidenta in fiecare zi. ???? Caracterul parfumului Familia de parfumuri: Aromatic – Acvatic – Cald Nota de varf: Salvie Nota de mijloc: Iasomie egipteana, Note marine Nota de baza: Chihlimbar, Note minerale, Ambra gri ???? Aplicare Aplicati 1-2 pulverizari de Apa de Parfum pe incheieturi, gat si decolteu. Parfumul echilibrat se desfasoara de-a lungul orelor, insotindu-va cu un amestec unic de prospetime si caldura pe tot parcursul zilei si al serii.', 271.8, 5, 'Rasasi Hawas Fire Eau de Parfum für Herren 100 ml'),
  (43, 1, 'AMD', 'Componente PC', 'Procesoare', 'Procesor AMD Ryzen Threadripper 9960X cu 24 de nuclee și 48 de fire de execuție, pentru stații de lucru profesionale.', 9154.5, 7, 'Procesor AMD RYZEN Threadripper 9960X, 24-Core, 4.2 GHz (5.4GHz Boost), 128MB, sTR5, BOX'),
  (44, 1, 'JESWO', 'Componente PC', 'Rack Hard-Disk', 'Compatibilitate dual-protocol si dimensiune completa, un dispozitiv pentru utilizari multiple pentru a economisi costuri】: Suporta protocoale duale M.2 NVMe si NGFF (SATA), compatibil cu patru dimensiuni comune de unitati SSD: 2230/2242/2260/2280. Nu este nevoie sa achizitionati doua carcase suplimentare pentru hard disk, economisind timp, efort si bani. Echipat cu schema avansata de control principal RTL9210 de 10 Gbps, indeplineste nevoile diferitelor scenarii de utilizare, cum ar fi stocarea zilnica si transmiterea fisierelor mari. 【Transmitere de mare viteza de 10 Gbps, eficienta dublata la citire/scriere】: Interfata externa este USB3.1 GEN2 Type-C. Viteza teoretica de transmisie a protocolului NVMe este de pana la 900+MB/S, iar viteza teoretica a protocolului NGFF (SATA) este de 440+MB/s, ceea ce imbunatateste considerabil eficienta citirii/scrierii si transmiterii fisierelor, satisfacand cu usurinta nevoile de transmisie de mare viteza pentru videoclipuri mari, fisiere de design etc. Adopta un cip principal de ultima generatie pentru a reduce eficient sarcina CPU, echilibrand viteza de transmisie si durabilitatea dispozitivului. 【Design transparent de disipare a caldurii, asigura o functionare stabila】: Fabricat din material transparent + metal auriu, nu blocheaza disiparea caldurii hard disk-ului, poate disipa rapid caldura generata in timpul functionarii, evita reducerea vitezei de transmisie sau deteriorarea hard disk-ului cauzata de temperaturi ridicate, asigura functionarea stabila a hard disk-ului pentru o lunga perioada de timp si prelungeste durata de viata a dispozitivului. 【Instalare fara unelte, Plug and Play pentru mai multa comoditate】: Instalarea hard disk-ului poate fi finalizata fara unelte, cu o simpla conectare si deconectare. Suporta hot-swapping si plug-and-play, nu este nevoie sa instalati drivere suplimentare, chiar si incepatorii pot incepe rapid. Nota: Parttia trebuie formatata la prima utilizare pentru a afisa discul normal. 【Compatibilitate larga cu mai multe sisteme, accesorii complete】: Vine cu un cablu de date 2-in-1 USB-C la USB-C+A, compatibil cu sistemele de operare mainstream precum Windows 11/10/8/7 si Linux, si poate fi conectat la laptopuri, desktop-uri, tablete si alte dispozitive. Pachetul include 1 carcasa pentru hard disk + 1 cablu de date 2-in-1, gata de utilizare imediat, satisfacand nevoile de acasa, birou, calatorii de afaceri si alte scenarii. Pachetul include: Carcasa hard disk*1 Accesorii silicon*2 Cablu de date (C-C + A)*1 Manual de utilizare*1 Folie*2', 108.98, 1, 'Carcasa Rack Externa SSD pentru M.2 NVMe/NGFF, JESWO®, 4 TB, USB 3.2 Gen 2, carcasa transparenta + metalica, 10 Gbps, compatibil NVMe/SATA, plug-and-play'),
  (45, 1, 'KuKirin', 'Auto, Moto & RCA', 'Trotinete Electrice', 'Trotinetă electrică KuKirin G2 (2026), cu autonomie mare și suspensie față-spate, potrivită pentru navetă zilnică.', 2999.99, 4, 'Trotineta electrica KuKirin G2 (2026) , Viteza maxima 45km/h, Autonomie maxima 55Km, Motor 800W, acumulator 48V 15Ah, Roti 10'),
  (46, 1, 'TODIMART', 'Auto, Moto & RCA', 'Trotinete Electrice', 'Trotineta electrica TODIMART T3, putere motor 350 W, autonomie max 30 Km, viteza maxima 25 Km/h, Negru [Performanta remarcabila] Trotineta electrica T3 Echipata cu un motor puternic de 350 W si o baterie de inalta performanta de 36 V/7,8 Ah atinge o viteza maxima de 25 km/h si ofera o autonomie maxima de 25~30 km in anumite conditii, inclusiv pante de pana la 15° Ideala pentru naveta zilnica sau calatorii scurte,acest motor nou si imbunatatit face calatoriile tale mai rapide, mai sigure si mai silentioase. [Ecran LED si 3 moduri de viteza] Puteti vedea clar viteza curenta, modul de viteza si nivelul bateriei. Trotineta electrica pentru adulti T3 este echipata cu un sistem de blocare, moduri multiple de condus, un sistem de iluminare, niveluri de viteza si functionalitate de pilot automat, printre alte caracteristici. O solutie completa cu control deplin pentru un confort sporit. Transmisie cu mai multe viteze: modul E (10 km/h), modul D20 (20 km/h), modul S25 (25 km/h) pentru a satisface nevoile diferitelor scenarii. [Siguranta pe sosea] Datorita triplului grad de impermeabilitate IPX5, se poate adapta la diverse conditii meteorologice. Nu trebuie sa va faceti griji cu privire la mersul in zilele ploioase, deoarece siguranta si stabilitatea la volan sunt garantate. Roata fata are o anvelopa solida de 8,5 inch, iar roata spate are o anvelopa tip fagure de miere de 8,5 inch, care nu numai ca imbunatateste aderenta, dar si absorbtia socurilor Stopurile spate sunt conectate la faruri si clipesc la franare, crescand considerabil siguranta in timpul mersului pe timp de noapte. [Usoara si portabila] Trotineta electrica T3 pentru adulti se pliaza in 3 secunde si, cu o greutate neta de 11,8 kg, poate fi usor depozitata si transportata in mana. Dimensiunile plierii sunt de 108 x 43.5 x 49 cm (0,23 m³). Fie ca este acasa, in aer liber sau in masina, nu ocupa spatiu de depozitare. [Livrare si servicii post-vanzare] - Avem o echipa puternica de servicii post- vanzare, indiferent unde va aflati, va putem rezolva problemele prompt si cu atentie. Avem depozite de trotinete electrice in Europa. Cu livrare rapida si servicii post-vanzare perfecte, puteti fi linistiti atunci cand achizitionati trotinetele noastre electrice. Va rugam sa retineti: Aceasta trotineta electrica nu are certificat ABE si nu poate fi inmatriculata pe drumurile germane.', 1188, 1, 'Trotineta electrica TODIMART T3, putere motor 350W, autonomie max 35 Km, viteza maxima 25 Km/h, Anvelope de 8,5 inch, Transmisie cu trei trepte, pliabila, Echipat cu APP mobil, negru'),
  (100, 1, 'ASUS', 'Laptopuri', 'Laptopuri gaming', 'Laptop de gaming cu ecran 16" 240Hz, răcire avansată și tastatură RGB per-tastă.', 8999.99, 6, 'Laptop Gaming ASUS ROG Strix G16, Intel Core i9, 32GB DDR5, 1TB SSD, RTX 5070'),
  (101, 1, 'Dell', 'Laptopuri', 'Ultrabook-uri', 'Ultrabook premium din aluminiu, cu ecran OLED și autonomie de peste 12 ore.', 7499.99, 6, 'Laptop Dell XPS 14, Intel Core Ultra 7, 16GB, 512GB SSD, OLED 3.2K'),
  (102, 1, 'Apple', 'Smartphone-uri', 'iPhone', 'Cameră triplă de 48MP, cip A19 Pro și carcasă din titan.', 6499.99, 6, 'Telefon Apple iPhone 17 Pro, 256GB, Titan Natural'),
  (103, 1, 'Samsung', 'Smartphone-uri', 'Android', 'Ecran Dynamic AMOLED 2X de 6.9", S Pen integrat și cameră de 200MP.', 6999.99, 6, 'Telefon Samsung Galaxy S26 Ultra, 512GB, 12GB RAM, Titanium Black'),
  (104, 1, 'Samsung', 'Tablete', 'Galaxy Tab', 'Tabletă cu ecran AMOLED, S Pen inclus și rezistență IP68.', 3799.99, 6, 'Tabletă Samsung Galaxy Tab S11, 11", 256GB, Wi-Fi, Graphite'),
  (105, 1, 'Apple', 'Tablete', 'iPad', 'Cip Apple M3, ecran Liquid Retina de 13" și suport pentru Apple Pencil Pro.', 4299.99, 6, 'Tabletă Apple iPad Air 13" M3, 128GB, Wi-Fi, Space Gray'),
  (106, 1, 'Sony', 'Console', 'PlayStation', 'Consolă PS5 Pro cu GPU îmbunătățit, ray tracing avansat și upscaling PSSR.', 3899.99, 6, 'Consolă Sony PlayStation 5 Pro, 2TB'),
  (107, 1, 'Nintendo', 'Console', 'Nintendo', 'Noua generație Nintendo Switch, cu ecran de 7.9" și Joy-Con 2 magnetice.', 2399.99, 6, 'Consolă Nintendo Switch 2 + Mario Kart World');

-- Pozele sunt servite de frontend din client-nextjs/public/mock/products
INSERT INTO product_images (product_id, image_url, is_main) VALUES
  (28, '/mock/products/28_1-imagine.webp', TRUE),
  (29, '/mock/products/29_1-imagine.webp', TRUE),
  (30, '/mock/products/30_1-imagine.webp', TRUE),
  (31, '/mock/products/31_1-imagine.webp', TRUE),
  (32, '/mock/products/32_1-imagine.webp', TRUE),
  (33, '/mock/products/33_1-imagine.webp', TRUE),
  (34, '/mock/products/34_1-imagine.webp', TRUE),
  (35, '/mock/products/35_1-imagine.webp', TRUE),
  (36, '/mock/products/36_1-imagine.webp', TRUE),
  (37, '/mock/products/37_1-imagine.webp', TRUE),
  (38, '/mock/products/38_1-imagine.webp', TRUE),
  (39, '/mock/products/39_1-imagine.webp', TRUE),
  (40, '/mock/products/40_1-imagine.webp', TRUE),
  (41, '/mock/products/41_1-imagine.webp', TRUE),
  (42, '/mock/products/42_1-imagine.webp', TRUE),
  (43, '/mock/products/43_1-imagine.webp', TRUE),
  (44, '/mock/products/44_1-imagine.webp', TRUE),
  (45, '/mock/products/45_1-imagine.webp', TRUE),
  (46, '/mock/products/46_1-imagine.webp', TRUE);
