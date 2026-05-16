import type { Locale } from "./types";

const hu = {
  meta: {
    title: "Vámos Vill Kft. — Teljes körű építőipari megoldás egy kézből",
    description:
      "Vámos-Vill Építőipari Generálkivitelező és Keresdelelmi cég. Több mint 20 éves tapasztalattal vállalunk generálkivitelezést, teljes vagy részleges felújítást, villanyszerelést, kőműves és ácsmunkákat továbbá a teljes körű építőanyag beszerzését is saját tüzépünkön keresztül.",
  },
  a11y: {
    home: "Vámos Vill Kft. – főoldal",
    openMenu: "Menü megnyitása",
    closeMenu: "Menü bezárása",
    themeLight: "Világos mód",
    themeDark: "Sötét mód",
    language: "Nyelv",
    map: "Térkép",
    phone: "Telefon",
    email: "E-mail",
  },
  nav: {
    about: "Rólunk",
    profile: "Profilunk",
    references: "Referenciák",
    contact: "Kapcsolat",
  },
  location: {
    city: "Nemesvámos",
    street: "Dózsa György út 2/B",
  },
  hero: {
    title: "Teljes körű megoldás egy kézből",
    body:
      "Vállalatunk több mint 20 éves tapasztalattal nyújt átfogó és megbízható építőanyag kereskedelmi, generálkivitelezési, felújítási, villanyszerelési és egyéb építőipari szolgáltatásokat.",
    ctaContact: "Kapcsolat",
    ctaReferences: "Referenciák",
  },
  profile: {
    title: "Profilunk",
    flipHint: "Kattintson a kártyára",
    flipBack: "Kattintson a kártyára a visszafordításhoz",
    items: [
      {
        title: "Építőanyag kereskedelem",
        body: "Nemesvámoson található saját Tüzépünkön minőségi építőipari alapanyagok és kiegészítők beszerzésében és értékesítésében állunk ügyfeleink rendelkezésére. Segítünk a megfelelő anyagok kiválasztásában, biztosítjuk a kedvező ár-érték arányt, valamint a helyszínre szállítást is.",
        backBody:
          "2007 óta működő nemesvámosi építőanyag kereskedésünkben (több ezer m2-en) kínálunk széles választékban építőanyagokat magánszemélyek és cégek számára. Saját gépparkunknak köszönhetően a rakodás és kiszállítás gyorsan és rugalmasan történik. Kiemelt kínálatunk: ömlesztett anyagok (sóder, kavics, dolomit, homok), valamint MAKITA szerszámgépek hivatalos kereskedéseként kedvező ajánlatokkal várjuk vásárlóinkat.",
      },
      {
        title: "Generál kivitelezés",
        body: "Teljes körű kivitelezési szolgáltatást nyújtunk az alapoktól a kulcsrakész átadásig. Koordináljuk a munkafolyamatokat, biztosítjuk a megbízható szakembereket és felügyeljük a projekt minden részletét.",
        backBody:
          "Összeszokott, évek óta állandó, nagy szaktudású csapatunk a tervezéstől a kivitelezésen át, egészen az átadásig megbízható és szakszerű munkát végez. Munkatársaink folyamatos szakmai képzéseken vesznek részt, nyitottak vagyunk a korszerű technológiai megoldások alkalmazására, miközben gép- és eszközparkunkat is folyamatosan fejlesztjük. Az elmúlt években számos sikeres közbeszerzési projektet valósítottunk meg.",
      },
      {
        title: "Felújítás, átalakítás",
        body: "Lakások, családi házak és nyaralók teljes vagy részleges felújítását vállaljuk modern megoldásokkal, igényes kivitelezéssel.",
        backBody:
          "Felújítási és átalakítási munkáink során a kisebb korszerűsítésektől a komplex átépítésekig vállalunk kivitelezést. Több éve együtt dolgozó, tapasztalt csapatunk a minőségi munkavégzésre, a határidők betartására és az ügyfelek igényeinek rugalmas kiszolgálására helyezi a hangsúlyt. Korszerű megoldásokkal és folyamatosan fejlesztett eszközparkkal biztosítjuk a megbízható kivitelezést.",
      },
      {
        title: "Villanyszerelés",
        body: "Biztonságos és korszerű villanyszerelési munkákat végzünk új építésű és meglévő ingatlanokban egyaránt.",
        backBody:
          "Hálózatépítés, bővítés, javítás és világítástechnikai megoldások szakszerű kivitelezéssel. Villanyszerelési munkáink során lakossági és ipari kivitelezést, felújítást és hálózatkorszerűsítést is vállalunk. Több éve együtt dolgozó, tapasztalt szakembereink megbízhatóan, a biztonsági és műszaki előírásoknak megfelelően végzik munkájukat.",
      },
    ],
  },
  references: {
    title: "Referenciáink",
    open: (n: number) => `Referencia megnyitása ${n}`,
    zoomIn: "Nagyítás",
    zoomOut: "Kicsinyítés",
    reset: "Reset",
    close: "Bezárás",
  },
  about: {
    title: "Rólunk",
    cta: "Rólunk tovább",
    blocks: [
      {
        title: "Vállalkozásunk célja",
        body: "Ügyfeleink számára megbízható, magas színvonalú és TELJES KÖRŰ építőipari szolgáltatást kívánunk nyújtani. A Vámos-Vill Kft 1989-ben indult egyéni vállalkozásként, majd 2003-ban alakult át Kft.-vé. Több mint 20 éves szakmai tapasztalattal nyújtunk megbízható és magas színvonalú építőipari szolgáltatásokat. Fő tevékenységeink közé tartozik a generálkivitelezés, a teljes körű lakás-, nyaraló- és házfelújítás, a villanyszerelés és villámvédelem kiépítése, valamint az építőanyag-kereskedelem.",
      },
      {
        title: "Számunkra fontos",
        body: "Munkánkat összehangoltan, saját szakembereinkkel, kiemelt figyelemmel a minőségre és a határidők betartására végezzük. Több éve együtt dolgozó, stabil csapatunkkal a tervezéstől a kivitelezésen át egészen az átadásig rugalmasan és ügyfélközpontúan dolgozunk. Célunk, hogy megrendelőink elképzeléseit korszerű megoldásokkal, magas színvonalon és reális áron valósítsuk meg.",
      },
      {
        title: "Egy kézből",
        body: "Komplett megoldást biztosítunk az építőanyagok beszerzésétől a kivitelezésig. Saját gép- és eszközparkkal rendelkezünk. Vállalunk burkolási, festési, kőműves, ács- és tetőjavítási munkákat, villanyszerelést, valamint építkezés utáni takarítást is.",
      },
    ],
  },
  moreServices: {
    title: "További szolgáltatásaink",
    prev: "Előző",
    next: "Következő",
    items: [
      { title: "Burkolás", body: "Precíz hideg- és melegburkolási munkák nagy szakmai múlttal rendelkező szakembereink kivitelezésében." },
      { title: "Festés, mázolás", body: "Beltéri és kültéri festési munkák igényes kivitelezéssel, tiszta és megbízható munkavégzéssel." },
      { title: "Ács munkák, tetőjavítás", body: "Tetőszerkezetek javítása, kisebb ácsmunkák, tetőkarbantartás és beázások megszüntetése." },
      { title: "Kőműves munkák, javítások", body: "Bontás, falazás, javítás, vakolás, betonozás és egyéb kőműves feladatok (pl. térkövezés, támfal készítés) kivitelezése." },
      { title: "Takarítás", body: "Építkezés utáni alkalmi vagy rendszeres takarítási szolgáltatás megbízható csapattal." },
    ],
  },
  contact: {
    title: "Kapcsolat",
    name: "Név",
    email: "E-mail cím",
    message: "Rövid leírás",
    namePh: "Pl. Kovács Péter",
    emailPh: "pelda@email.hu",
    messagePh: "Írja le röviden, miben segíthetünk.",
    send: "Küldés",
    sending: "Küldés...",
    success: "Köszönjük! Hamarosan jelentkezünk.",
    errors: {
      name: "Adja meg a nevét",
      email: "Érvényes e-mail címet adjon meg",
      message: "Rövid leírás szükséges",
    },
  },
  footer: {
    contactsTitle: "ELÉRHETŐSÉGEINK",
    managerLine: "CSÖGÖR IMRE – ügyvezető",
    addressLine1: "8248 Nemesvámos",
    addressLine2: "Dózsa György út 2/B",
    constructionDept: "Kivitelezés, Építés, Villanyszerelés",
    tradeDept: "Kereskedelem",
    telLabel: "Tel",
    emailLabel: "Email",
    rights: (year: number) => `© ${year} Vámos Vill Kft. Minden jog fenntartva.`,
  },
  euBanner: {
    label: "Széchenyi 2020 és Európai Unió projektkommunikáció",
    alt: "Széchenyi 2020, Magyarország Kormánya, Európai Unió kommunikációs tábla",
    openLightbox: "EU támogatási táblák megtekintése",
    close: "Bezárás",
    slide: (n: number) => `EU támogatási tábla ${n}`,
    slideAlt: (n: number) =>
      `Európai Unió és Széchenyi 2020 támogatási kommunikációs tábla ${n}`,
  },
} as const;

const en = {
  meta: {
    title: "Vámos Vill Ltd. — Comprehensive construction solutions from a single source",
    description:
      "Vámos-Vill construction general contracting and trading company. With more than 20 years of experience we undertake general contracting, full or partial renovation, electrical installation, masonry and carpentry work, as well as full-scope building materials procurement through our own building supplies depot.",
  },
  a11y: {
    home: "Vámos Vill Ltd. – home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    themeLight: "Light mode",
    themeDark: "Dark mode",
    language: "Language",
    map: "Map",
    phone: "Phone",
    email: "Email",
  },
  nav: { about: "About us", profile: "Our profile", references: "References", contact: "Contact" },
  location: { city: "Nemesvámos", street: "Dózsa György út 2/B" },
  hero: {
    title: "Comprehensive solutions from a single source",
    body:
      "With more than 20 years of experience, our company provides comprehensive and reliable building materials trade, general contracting, renovation, electrical installation and other construction services.",
    ctaContact: "Contact",
    ctaReferences: "References",
  },
  profile: {
    title: "Our profile",
    flipHint: "Click the card",
    flipBack: "Click the card to flip back",
    items: [
      {
        title: "Building materials trade",
        body: "At our own building supplies depot in Nemesvámos we assist clients with sourcing and selling quality construction materials and accessories. We help you choose the right materials, ensure favourable value for money, and provide delivery to site.",
        backBody:
          "Since 2007 our Nemesvámos building materials business (spanning several thousand square metres) has offered a wide range of construction materials for private individuals and companies. Thanks to our own fleet, loading and delivery are fast and flexible. Highlights include bulk materials (gravel, crushed stone, dolomite, sand), and as an official MAKITA power tool dealer we welcome customers with attractive offers.",
      },
      {
        title: "General contracting",
        body: "We provide full construction services from foundations to turnkey handover. We coordinate workflows, provide reliable professionals and supervise every detail of the project.",
        backBody:
          "Our well-established team of highly skilled professionals has worked together for years, delivering reliable, expert work from planning through construction to handover. Our staff regularly attend professional training; we are open to modern technological solutions while continuously upgrading our machinery and equipment. In recent years we have successfully completed numerous public procurement projects.",
      },
      {
        title: "Renovation & conversion",
        body: "We undertake complete or partial renovation of apartments, family houses and holiday homes with modern solutions and high-quality execution.",
        backBody:
          "In renovation and conversion projects we undertake everything from minor upgrades to complex rebuilds. Our experienced team, working together for years, emphasises quality workmanship, meeting deadlines and flexibly serving clients' needs. We ensure reliable execution with modern solutions and a continuously improved toolkit.",
      },
      {
        title: "Electrical installation",
        body: "We carry out safe, modern electrical installation work in both new-build and existing properties.",
        backBody:
          "Network installation, expansion, repairs and lighting solutions with professional execution. Our electrical services include residential and industrial construction, renovation and network upgrades. Our experienced specialists, working together for years, carry out their work reliably in compliance with safety and technical regulations.",
      },
    ],
  },
  references: {
    title: "Our references",
    open: (n: number) => `Open reference ${n}`,
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reset: "Reset",
    close: "Close",
  },
  about: {
    title: "About us",
    cta: "Learn more about us",
    blocks: [
      {
        title: "Our company's goal",
        body: "We aim to provide our clients with reliable, high-quality and COMPREHENSIVE construction services. Vámos-Vill Ltd. started as a sole proprietorship in 1989 and became a limited company in 2003. With more than 20 years of professional experience we deliver reliable, high-quality construction services. Our main activities include general contracting, full renovation of apartments, holiday homes and houses, electrical installation and lightning protection, as well as building materials trade.",
      },
      {
        title: "What matters to us",
        body: "We carry out our work in a coordinated manner with our own specialists, with particular emphasis on quality and meeting deadlines. With our stable team, working together for years, we work flexibly and customer-focused from planning through construction to handover. Our goal is to realise our clients' vision with modern solutions, at a high standard and at a fair price.",
      },
      {
        title: "From a single source",
        body: "We provide complete solutions from building materials procurement to execution. We have our own machinery and equipment fleet. We undertake tiling, painting, masonry, carpentry and roof repair work, electrical installation, as well as post-construction cleaning.",
      },
    ],
  },
  moreServices: {
    title: "Additional services",
    prev: "Previous",
    next: "Next",
    items: [
      { title: "Tiling", body: "Precise ceramic and natural stone tiling (floor and wall) by specialists with many years of experience." },
      { title: "Painting & decorating", body: "Interior and exterior painting with high-quality execution, clean and reliable workmanship." },
      { title: "Carpentry & roof repair", body: "Roof structure repair, minor carpentry work, roof maintenance and leak remediation." },
      { title: "Masonry & repairs", body: "Demolition, brickwork, repairs, plastering, concreting and other masonry tasks (e.g. paving, retaining walls)." },
      { title: "Cleaning", body: "Post-construction occasional or regular cleaning services with a reliable team." },
    ],
  },
  contact: {
    title: "Contact",
    name: "Name",
    email: "Email address",
    message: "Short description",
    namePh: "e.g. John Smith",
    emailPh: "example@email.com",
    messagePh: "Briefly describe how we can help.",
    send: "Send",
    sending: "Sending...",
    success: "Thank you! We will be in touch shortly.",
    errors: {
      name: "Please enter your name",
      email: "Please enter a valid email address",
      message: "A short description is required",
    },
  },
  footer: {
    contactsTitle: "HOW TO REACH US",
    managerLine: "CSÖGÖR IMRE – Managing Director",
    addressLine1: "8248 Nemesvámos",
    addressLine2: "Dózsa György út 2/B",
    constructionDept: "Construction, Building & Electrical",
    tradeDept: "Trade",
    telLabel: "Tel",
    emailLabel: "Email",
    rights: (year: number) => `© ${year} Vámos Vill Ltd. All rights reserved.`,
  },
  euBanner: {
    label: "Széchenyi 2020 and European Union project communication",
    alt: "Széchenyi 2020, Government of Hungary, European Union communication board",
    openLightbox: "View EU funding boards",
    close: "Close",
    slide: (n: number) => `EU funding board ${n}`,
    slideAlt: (n: number) =>
      `European Union and Széchenyi 2020 funding communication board ${n}`,
  },
};

const de = {
  meta: {
    title: "Vámos Vill Kft. — Umfassende Baulösungen aus einer Hand",
    description:
      "Vámos-Vill Baugeneralunternehmer- und Handelsunternehmen. Mit über 20 Jahren Erfahrung übernehmen wir Generalunternehmerleistungen, vollständige oder teilweise Renovierung, Elektroinstallation, Maurer- und Zimmereiarbeiten sowie die umfassende Baustoffbeschaffung über unser eigenes Baustofflager.",
  },
  a11y: {
    home: "Vámos Vill Kft. – Startseite",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    themeLight: "Heller Modus",
    themeDark: "Dunkler Modus",
    language: "Sprache",
    map: "Karte",
    phone: "Telefon",
    email: "E-Mail",
  },
  nav: { about: "Über uns", profile: "Unser Profil", references: "Referenzen", contact: "Kontakt" },
  location: { city: "Nemesvámos", street: "Dózsa György út 2/B" },
  hero: {
    title: "Umfassende Lösungen aus einer Hand",
    body:
      "Mit über 20 Jahren Erfahrung bietet unser Unternehmen umfassende und zuverlässige Leistungen im Baustoffhandel, als Generalunternehmer, bei Renovierung und Elektroinstallation sowie weitere Bauleistungen.",
    ctaContact: "Kontakt",
    ctaReferences: "Referenzen",
  },
  profile: {
    title: "Unser Profil",
    flipHint: "Karte anklicken",
    flipBack: "Zum Zurückdrehen die Karte anklicken",
    items: [
      {
        title: "Baustoffhandel",
        body: "In unserem eigenen Baustofflager in Nemesvámos unterstützen wir Kunden bei der Beschaffung und dem Verkauf hochwertiger Baustoffe und Zubehör. Wir helfen bei der Materialauswahl, sorgen für ein günstiges Preis-Leistungs-Verhältnis und liefern zur Baustelle.",
        backBody:
          "Seit 2007 bieten wir in unserem Nemesvámoser Baustoffhandel (auf mehreren tausend Quadratmetern) ein breites Sortiment an Baustoffen für Privatpersonen und Unternehmen. Dank unseres eigenen Fuhrparks erfolgen Be- und Entladung sowie Lieferung schnell und flexibel. Schwerpunkte: Schüttgüter (Kies, Schotter, Dolomit, Sand); als offizieller MAKITA-Fachhändler begrüßen wir Kunden mit attraktiven Angeboten.",
      },
      {
        title: "Generalunternehmerleistungen",
        body: "Wir bieten umfassende Bauleistungen vom Fundament bis zur schlüsselfertigen Übergabe. Wir koordinieren die Abläufe, stellen zuverlässige Fachkräfte und überwachen jedes Detail des Projekts.",
        backBody:
          "Unser eingespieltes Team hochqualifizierter Fachkräfte arbeitet seit Jahren zusammen und leistet von der Planung über die Ausführung bis zur Übergabe zuverlässige, fachgerechte Arbeit. Unsere Mitarbeiter nehmen regelmäßig an Fortbildungen teil; wir setzen moderne technische Lösungen ein und erweitern unseren Maschinen- und Gerätepark kontinuierlich. In den letzten Jahren haben wir zahlreiche öffentliche Ausschreibungsprojekte erfolgreich umgesetzt.",
      },
      {
        title: "Renovierung & Umbau",
        body: "Wir übernehmen die vollständige oder teilweise Renovierung von Wohnungen, Einfamilienhäusern und Ferienhäusern mit modernen Lösungen und hochwertiger Ausführung.",
        backBody:
          "Bei Renovierungs- und Umbauarbeiten übernehmen wir alles von kleineren Modernisierungen bis zu komplexen Umgestaltungen. Unser erfahrenes Team legt Wert auf Qualität, Termintreue und flexible Kundenbetreuung. Mit modernen Lösungen und einem ständig erweiterten Gerätepark sichern wir eine zuverlässige Ausführung.",
      },
      {
        title: "Elektroinstallation",
        body: "Wir führen sichere, moderne Elektroinstallationsarbeiten sowohl in Neubauten als auch in Bestandsgebäuden aus.",
        backBody:
          "Netzinstallation, Erweiterung, Reparatur und Beleuchtungslösungen in fachgerechter Ausführung. Zu unseren Elektroleistungen gehören Wohn- und Industriebau, Renovierung und Netzmodernisierung. Unsere erfahrenen Fachkräfte arbeiten zuverlässig und entsprechend den Sicherheits- und technischen Vorschriften.",
      },
    ],
  },
  references: {
    title: "Unsere Referenzen",
    open: (n: number) => `Referenz ${n} öffnen`,
    zoomIn: "Vergrößern",
    zoomOut: "Verkleinern",
    reset: "Zurücksetzen",
    close: "Schließen",
  },
  about: {
    title: "Über uns",
    cta: "Mehr über uns",
    blocks: [
      {
        title: "Ziel unseres Unternehmens",
        body: "Wir möchten unseren Kunden zuverlässige, hochwertige und UMFASSENDE Bauleistungen bieten. Die Vámos-Vill Kft. wurde 1989 als Einzelunternehmen gegründet und 2003 in eine GmbH umgewandelt. Mit über 20 Jahren Berufserfahrung liefern wir zuverlässige, hochwertige Bauleistungen. Zu unseren Haupttätigkeiten gehören Generalunternehmerleistungen, vollständige Renovierung von Wohnungen, Ferienhäusern und Häusern, Elektroinstallation und Blitzschutz sowie Baustoffhandel.",
      },
      {
        title: "Was uns wichtig ist",
        body: "Wir führen unsere Arbeit abgestimmt mit eigenen Fachkräften aus und legen besonderen Wert auf Qualität und Termintreue. Mit unserem seit Jahren zusammenarbeitenden, stabilen Team arbeiten wir von der Planung über die Ausführung bis zur Übergabe flexibel und kundenorientiert. Unser Ziel ist es, die Vorstellungen unserer Auftraggeber mit modernen Lösungen, auf hohem Niveau und zu realistischen Preisen umzusetzen.",
      },
      {
        title: "Aus einer Hand",
        body: "Wir bieten Komplettlösungen von der Baustoffbeschaffung bis zur Ausführung. Wir verfügen über einen eigenen Maschinen- und Gerätepark. Wir übernehmen Fliesen-, Maler-, Maurer-, Zimmerei- und Dachreparaturarbeiten, Elektroinstallation sowie Bauendreinigung.",
      },
    ],
  },
  moreServices: {
    title: "Weitere Leistungen",
    prev: "Zurück",
    next: "Weiter",
    items: [
      { title: "Fliesenlegen", body: "Präzise Boden- und Wandfliesenarbeiten (kalt und warm) durch Fachkräfte mit langjähriger Erfahrung." },
      { title: "Malerarbeiten", body: "Innen- und Außenanstrich mit hochwertiger Ausführung, sauberer und zuverlässiger Arbeitsweise." },
      { title: "Zimmerei & Dachreparatur", body: "Dachkonstruktionsreparatur, kleinere Zimmereiarbeiten, Dachwartung und Behebung von Undichtigkeiten." },
      { title: "Maurerarbeiten & Reparaturen", body: "Abbruch, Mauerwerk, Reparatur, Putz, Betonieren und weitere Maurerleistungen (z. B. Pflasterung, Stützmauern)." },
      { title: "Reinigung", body: "Bauendreinigung als Einzelauftrag oder regelmäßiger Service mit zuverlässigem Team." },
    ],
  },
  contact: {
    title: "Kontakt",
    name: "Name",
    email: "E-Mail-Adresse",
    message: "Kurze Beschreibung",
    namePh: "z. B. Max Mustermann",
    emailPh: "beispiel@email.de",
    messagePh: "Beschreiben Sie kurz, wobei wir Ihnen helfen können.",
    send: "Senden",
    sending: "Wird gesendet...",
    success: "Vielen Dank! Wir melden uns in Kürze.",
    errors: {
      name: "Bitte geben Sie Ihren Namen ein",
      email: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      message: "Eine kurze Beschreibung ist erforderlich",
    },
  },
  footer: {
    contactsTitle: "SO ERREICHEN SIE UNS",
    managerLine: "CSÖGÖR IMRE – Geschäftsführer",
    addressLine1: "8248 Nemesvámos",
    addressLine2: "Dózsa György út 2/B",
    constructionDept: "Bauausführung, Bau & Elektroinstallation",
    tradeDept: "Handel",
    telLabel: "Tel",
    emailLabel: "E-Mail",
    rights: (year: number) => `© ${year} Vámos Vill Kft. Alle Rechte vorbehalten.`,
  },
  euBanner: {
    label: "Széchenyi 2020 und Europäische Union Projektkommunikation",
    alt: "Széchenyi 2020, Regierung Ungarns, Europäische Union Kommunikationstafel",
    openLightbox: "EU-Förderungstafeln anzeigen",
    close: "Schließen",
    slide: (n: number) => `EU-Förderungstafel ${n}`,
    slideAlt: (n: number) =>
      `Kommunikationstafel zur Förderung durch die Europäische Union und Széchenyi 2020 – ${n}`,
  },
};

export const translations = { hu, en, de };
export type Translation = (typeof translations)[Locale];