const QUESTIONS = [
  {
    text: "1. Képzelje el, hogy egy olyan konferenciára érkezik, ahol mindenki idegen az Ön számára. Hogyan érzi magát?",
    answers: [
      {
        text: "Idegen emberek között gyakran kényelmetlenül érzem magamat, eleinte inkább a háttérben maradok.", },
      {
        text: "Idegen társaságban azonnal feloldódom. Nagyon jól érzem magamat, gyorsan kapcsolatot tudok teremteni idegenekkel.", },
      {
        text: "Egy csoportban gyakran én vagyok az, akinek 'szava van', a csoport prezentációknál szívesen vállalom a vezető szerepet.", },
    ],
    evaluationGreen: [-1, 0, 1, 1, -1, 0],
    evaluationRed: [-1, -1, 0, 1, 0, 1]
  },
  {
    text: "2. Nem mindig megy minden zökkenőmentesen, illetve úgy, ahogyan azt szeretnénk. Néha előfordul bosszúság és izgatottság. Mi az Önre jellemző reakció a munkában vagy a magánéletben, amikor bosszúság vagy feszültség éri?",
    answers: [
      {
        text: "Ha felbosszantanak, könnyen 'felkapom a vizet'. Legszívesebben ilyenkor fizikailag is levezetném a feszültséget.",

      },
      {
        text: "Ha valami bosszant, ki kell adnom magamból. Legszívesebben mindent kibeszélek magamból, ami a lelkemet nyomja.",
   
      },
      {
        text: "Igyekszem a bosszúságot és az izgatottságot egyáltalán nem kimutatni, egyedül kell megbirkóznom vele. Legszívesebben teljesen visszahúzódom.",

      },
    ],
    evaluationGreen: [-1, 0, 1, 1, -1, 0],
    evaluationRed: [0, 1, 1, 0, -1, -1]
  },
  {
    text: "3. A gyerekkor, az ifjúkor, és végül a felnőttkor évei, ezek bizony meglehetősen különböző életszakaszok. Ezek közül melyik időszakot tartja a legszebbnek?",
    answers: [
      {
        text: "A gyerekkor igazán szép időszak volt, a biztonságérzetével és gondtalanságával együtt. Felnőttként általában jól kijövök a gyerekekkel, általában ők is azonnal megkedvelnek.",
    
      },
      {
        text: "Leginkább az ifjúkort szerettem, amikor az ember 'meghódítja' a világot, ezekben az években mindent igazán intenzíven él meg az ember.",
 
      },
      {
        text: "Minél idősebb leszek, annál inkább képes vagyok távolságot tartani, és ezáltal jobban eligazodom önmagamban és a világban is.",
  
      },
    ],
    evaluationGreen: [1, 1, 0, -1, -1, 0],
    evaluationRed: [0, 1, 1, 0, -1, -1]
  },
  {
    text: "4. Az emberek különböznek abban, hogyan viselkednek és milyen benyomást keltenek. Ezeket a környezet első benyomásként érzékeli. Ön szerint hogyan látja Önt a környezete?",
    answers: [
      { text: "Nyugodt, barátságos és társaságkedvelő benyomást keltek.", },
      { text: "Élénknek és impulzívnak tűnök.", },
      { text: "Csendesnek és visszafogottnak látszom.", },
    ],
    evaluationGreen: [1, 1, 0, -1, -1, 0],
    evaluationRed: [0, 1, 1, 0, -1, -1]
  },
  {
    text: "5. Minden embernek megvan a maga sajátos módja, ahogyan beosztja az idejét. Önnél ez hogyan működik?",
    answers: [
      {
        text: "Gyakran teljesen megfeledkezem az időről, és emiatt gyakran elkések a találkozókról és az időpontokról.",

      },
      {
        text: "Az időpontokat gyakran éppen csak az utolsó pillanatban érem el, a találkozókra sokszor én érkezem utoljára.",
    
      },
      {
        text: "Találkozók és időpontok esetén félek az elkéséstől, ezért elővigyázatosságból gyakran túl korán érkezem.",

      },
    ],
    evaluationGreen: [1, 1, 0, -1, -1, 0],
    evaluationRed: [0, 1, 1, 0, -1, -1]
  },
  {
    text: "6. Hogyan tölti a szabadidejét, vagyis azt az időt, amikor valóban mentes minden kötelezettségtől, és azt teheti, amit szeretne?",
    answers: [
      {
        text: "Legszívesebben zavartalanul a saját érdeklődési köreimnek hódolok.", },
      {
        text: "Szeretek kényelmesen és kellemesen pihenni, a barátaim, családom társaságban ütöm el az időt", },
      {
        text: "Mindig csinálnom kell valamit, nem tudok sokáig egy helyben ülni.", },
    ],
    evaluationGreen: [-1, 0, 1, 1, -1, 0],
    evaluationRed: [-1, -1, 0, 1, 0, 1]
  },
  {
    text: "7. Az alábbi három helyzet közül melyik tűnik Önnek létfontosságúnak?",
    answers: [
      {
        text: "Számomra a legelviselhetetlenebb helyzet szűk helyiségekbe bezárva lenni, megkötözve vagy akár lebénítva. A mozgásszabadság számomra létfontosságú.",
      },
      {
        text: "Számomra a legelviselhetetlenebb helyzet elszigetelve lenni a külvilágtól, magamra hagyva, teljesen egyedül. Az emberi kapcsolatok számomra létfontosságúak.",
  
      },
      {
        text: "Számomra a legelviselhetetlenebb helyzet állandóan emberek között lenni, ha nem lenne lehetőségem visszavonulni. A 'magánszférám' számomra létfontosságú.",
 
      },
    ],
    evaluationGreen: [-1, 0, 1, 1, -1, 0],
    evaluationRed: [0, 1, 1, 0, -1, -1]
  },
  {
    text: "8. Az alábbiakban hat állítást talál. Válassza ki közülük azt a három állítást, amely a leginkább igaz Önre:",

    answers: [
      {
        text: "Nem 'kertelek', nem kerülgetem a forró kását. Szókimondó vagyok és általában nem vagyok túl diplomatikus.",
      },
      { text: "Nem tudom jól kimutatni az érzéseimet, ezért gyakran helytelenül ítélnek meg az emberek.", 
        },
      { text: "Nagyon érdekelnek az emberek, az életük és az életkörülményeik.", 
        },
    { text: "Gyakran szükségtelenül megnehezítem a dolgomat, hajlamos vagyok a túlgondolkodásra és a kételkedésre.'", 
        },
    { text: "Nagyon érzékeny vagyok a zajokra, én magam is többnyire csendesen viselkedem.", 
        },
    { text: "Alapvetően ínyenc vagyok, szeretem a jó konyhát.", 
        },
    ],
    evaluationGreen: [-1, -1, -1, 2, -1, -1, -1, 2, -1, -1, 2, 2, 0],
    evaluationRed: [1, -2, 1, 1, 1, 1, -2, 1, -2, -2, 1, 1, 0]
  },

{
text: "9. Az alábbiakban hat állítást talál. Válassza ki közülük azt a három állítást, amely a leginkább igaz Önre:",

  answers: [
    {
      text: "Nem szeretem a viszályt, megértő és kiegyensúlyozott vagyok.",
    },
    { text: "Gyorsan döntök, a hosszas habozás nem az én világom.", 
      },
    { text: "Rendkívül lelkiismeretes vagyok, gyakran még az apróságokban is.", 
      },
  { text: "Szeretem a kockázatot és a kalandot. A mottóm: 'Aki mer, az nyer!'", 
      },
  { text: "Könnyen hízom, akkor is, ha nem eszem sokat.", 
      },
  { text: "Sok mozgásra van szükségem ahhoz, hogy igazán jól érezzem magam.",  
      },
  ],
  evaluationGreen: [2,-1,-1,2,2,2,-1,-1,-1,-1,-1,-1, 0],
  evaluationRed: [1, 1, -2, 1, 1, 1, -2, 1, 1, 1, -2, -2, 0]
},

{
    text: "10. Az alábbiakban ismét hat állítást talál. Válassza ki közülük azt a három állítást, amely a leginkább igaz Önre.",
    
      answers: [
        {
          text: "A legtöbb helyzetben inkább csak figyelek, mintsem aktívan részt vegyek.",
        },
        { text: "Igazán dühös leszek, ha várakoznom kell valakire vagy valamire.", 
          },
        { text: "Ha betámadva érzem magam, gyakran hevesen és agresszíven reagálok.", 
          },
      { text: "Szívesen részt veszek mindenben, nem akarok 'ünneprontó' lenni.'", 
          },
      { text: "Megvan a saját véleményem, de többnyire megtartom magamnak.", 
          },
      { text: "Döntések során szívesen igazodom mások véleményéhez.", 
          },
      ],
      evaluationGreen: [-1, -1, -1, -1, 2, -1, -1, -1, -1, 2, 2, 2, 0],
      evaluationRed: [1, -2, -2, -2, 1, -2, 1, 1, 1, 1, 1, 1, 0]
      },
];

// Felugró ablak - Finomhangolás, OK gombra csukódik

const FINE_TUNING_MODAL_TEXT =
  "Ez volt az első hét feladat, amelyek elsősorban az Ön személyiségének alapirányát voltak hivatottak meghatározni.\n\n" +
  "Most következik a finomhangolás. Három állítást kell kiválasztania. Egyet vagy kettőt biztosan könnyen talál majd, amelyek igazak Önre.\n\n" +
  "A fennmaradókból válassza ki azt, amely még leginkább jellemző Önre, amíg összesen három állítást be nem jelölt.\n\n" +
  "Néha könnyebb fordítva eljárni: először zárja ki azokat az állításokat, amelyek legkevésbé jellemzőek Önre, így végül három marad megjelölve.";

const FINE_TUNING_TRIGGER_INDEX_0_BASED = 7; // 8. kérdés előtt
const FINE_TUNING_SESSION_KEY = "fineTuningModalShown";

function ensureFineTuningModalInDom() {
  if (typeof document === "undefined") return;
  if (document.getElementById("fineTuningModalOverlay")) return;

  const style = document.createElement("style");
  style.id = "fineTuningModalStyles";

  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.className = "ftm-overlay";
  overlay.id = "fineTuningModalOverlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-hidden", "true");
  overlay.setAttribute("aria-labelledby", "fineTuningModalTitle");

  overlay.innerHTML = `
    <div class="ftm-modal" role="document">
      <div class="ftm-header">
        <h2 class="ftm-title" id="fineTuningModalTitle">Finomhangolás</h2>
      </div>
      <div class="ftm-body" id="fineTuningModalBody"></div>
      <div class="ftm-footer">
        <button class="ftm-btn ftm-btn-primary" id="fineTuningModalOk" type="button">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function openFineTuningModal() {
  ensureFineTuningModalInDom();
  if (typeof document === "undefined") return Promise.resolve();

  const overlay = document.getElementById("fineTuningModalOverlay");
  const body = document.getElementById("fineTuningModalBody");
  const okBtn = document.getElementById("fineTuningModalOk");
  if (!overlay || !body || !okBtn) return Promise.resolve();

  body.textContent = FINE_TUNING_MODAL_TEXT;

  let previouslyFocused = document.activeElement;
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  okBtn.focus();

  return new Promise((resolve) => {
    const close = () => {
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      cleanup();
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
      resolve();
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        e.preventDefault();
        okBtn.focus();
      }
    };

    const onOverlayClick = (e) => {
      if (e.target === overlay) close();
    };

    const cleanup = () => {
      okBtn.removeEventListener("click", close);
      overlay.removeEventListener("click", onOverlayClick);
      document.removeEventListener("keydown", onKeyDown);
    };

    okBtn.addEventListener("click", close);
    overlay.addEventListener("click", onOverlayClick);
    document.addEventListener("keydown", onKeyDown);
  });
}


async function maybeShowFineTuningModalByIndex(questionIndex0Based) {
  if (typeof window === "undefined") return;
  if (questionIndex0Based !== FINE_TUNING_TRIGGER_INDEX_0_BASED) return;

  try {
    if (window.sessionStorage?.getItem(FINE_TUNING_SESSION_KEY) === "1") return;
    window.sessionStorage?.setItem(FINE_TUNING_SESSION_KEY, "1");
  } catch (_) {
    if (maybeShowFineTuningModalByIndex.__shownOnce) return;
    maybeShowFineTuningModalByIndex.__shownOnce = true;
  }

  await openFineTuningModal();
}

const evaluationIndexRecap_3choice = {
    21: 0, 12: 1, 102:2, 120:3, 201:4, 210:5
};
const evaluationIndexRecap_multiSelect = {
    11: 0, 19:1, 13:2, 37:3, 25:4, 41:5, 22:6, 38:7, 26:8, 50:9, 44:10, 52:11
};
