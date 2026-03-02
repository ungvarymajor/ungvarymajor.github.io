// evaluation.js
// Kiértékelés: 7 lehetséges eredmény a szabályok szerint

function auspraegungLabel(score) {
  if (score < 5) return "Egyáltalán nem jellemző";
  if (score <= 10) return "Alacsony szinten jellemző";
  if (score <= 13) return "Közepes szinten jellemző";
  if (score <= 17) return "Jelentősen jellemző";
  return "Nagyon erősen jelenlévő, erősen jellemző.";
}

function auspraegungKey(score) {
  if (score < 5) return "none";
  if (score <= 10) return "low";
  if (score <= 13) return "mid";
  if (score <= 17) return "high";
  return "veryHigh";
}

function evaluateByMatrixRule(result) {
  const colors = ["red", "green", "blue"];

  const data = colors.map((c) => ({
    color: c,
    score: result[c],
    key: auspraegungKey(result[c]),
    label: auspraegungLabel(result[c]),
  }));

  // 1) Kiegyenlített: mindhárom egyenlő arányban van jelen //11–13 pont között
  const allEqual = result.red === result.green && result.green === result.blue;
  const allMid = result.red >= 11 && result.red <= 13;

  if (allEqual && allMid) {
    return {
      kind: "balanced_rgb",
      title: "Kiegyensúlyozott, egyenlő piros–zöld–kék arány",
      primary: null,
      secondary: null,
      details: data,
    };
  }

  // 2) rendezés pont szerint
  data.sort((a, b) => b.score - a.score);
  const top1 = data[0];
  const top2 = data[1];
  const top3 = data[2];

  // 3) Dupladominancia: a két legerősebb ugyanabba a kategóriába esik
  // + top2 > top3 (különben inkább “szoros”/nem egyértelmű)
  const sameCategoryTop2 = top1.key === top2.key;
  const clearlyAboveThird = top2.score > top3.score;

  if (sameCategoryTop2 && clearlyAboveThird) {
    const pair = [top1.color, top2.color].sort().join("-"); // pl. "green-red"

    if (pair === "green-red") {
      return {
        kind: "dual_rg",
        title: "Dupla dominancia: Piros–Zöld (A két komponens ugyanolyan erős)",
        primary: "red",
        secondary: "green",
        details: data,
      };
    }
    if (pair === "blue-green") {
      return {
        kind: "dual_gb",
        title: "Dupla dominancia: Zöld–Kék (A két komponens ugyanolyan erős)",
        primary: "green",
        secondary: "blue",
        details: data,
      };
    }
    return {
      kind: "dual_rb",
      title: "Dupla dominancia: Piros–Kék (A két komponens ugyanolyan erős)",
      primary: "red",
      secondary: "blue",
      details: data,
    };
  }

  // 4) Egyszín dominancia + finomítás (második legerősebb)
  const primary = top1.color;
  const secondary = top2.color;

  const primaryHu =
    primary === "red" ? "Piros" : primary === "green" ? "Zöld" : "Kék";
  const secondaryHu =
    secondary === "red" ? "Piros" : secondary === "green" ? "Zöld" : "Kék";

  return {
    kind:
      primary === "green"
        ? "green_dom"
        : primary === "red"
        ? "red_dom"
        : "blue_dom",
    title: `${primaryHu} dominál (finomítás: ${secondaryHu} a második legerősebb)`,
    primary,
    secondary,
    details: data,
  };
}

// --- SZÍNKEVERÉS PIROS–ZÖLD–KÉK ARÁNY ALAPJÁN ---
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function mixPersonalityColor(result) {
  const r = Math.max(0, result.red);
  const g = Math.max(0, result.green);
  const b = Math.max(0, result.blue);

  const sum = r + g + b;

  // védelem: ha minden 0
  if (sum === 0) {
    return { r: 128, g: 128, b: 128, hex: "#808080" };
  }

  const red255 = Math.round((r / sum) * 255);
  const green255 = Math.round((g / sum) * 255);
  const blue255 = Math.round((b / sum) * 255);

  return {
    r: red255,
    g: green255,
    b: blue255,
    hex: rgbToHex(red255, green255, blue255),
  };
}

// --- Kördiagram adatok (arányok + kevert szín) ---
function getColorShare(result) {
  const r = Math.max(0, result.red);
  const g = Math.max(0, result.green);
  const b = Math.max(0, result.blue);
  const sum = r + g + b;

  if (sum === 0) {
    return {
      sum: 0,
      redPct: 0,
      greenPct: 0,
      bluePct: 0,
      mix: { r: 128, g: 128, b: 128, hex: "#808080" },
    };
  }

  const redPct = (r / sum) * 100;
  const greenPct = (g / sum) * 100;
  const bluePct = (b / sum) * 100;

  return {
    sum,
    redPct,
    greenPct,
    bluePct,
    mix: mixPersonalityColor({ red: r, green: g, blue: b }),
  };
}

// --- SVG donut kördiagram (3 szín szeletekkel) ---
function buildDonutSvg(result, size = 200, strokeWidth = 34) {
  const share = getColorShare(result);

  const cx = size / 2;
  const cy = size / 2;

  const r = (size - strokeWidth) / 2;
  const C = 2 * Math.PI * r;

  const redLen = (share.redPct / 100) * C;
  const greenLen = (share.greenPct / 100) * C;
  const blueLen = (share.bluePct / 100) * C;

  const redDash = `${redLen} ${C}`;
  const greenDash = `${greenLen} ${C}`;
  const blueDash = `${blueLen} ${C}`;

  const redOffset = 0;
  const greenOffset = -redLen;
  const blueOffset = -(redLen + greenLen);

  // -90°: 12 órától induljon
  const rotate = `rotate(-90 ${cx} ${cy})`;

  // középső kitöltés sugara
  const innerR = r - strokeWidth / 2 - 2;

  // --- feliratok a szeletekben ---
  function polarToXY(deg, radius) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * radius, y: cy + Math.sin(rad) * radius };
  }

  // szeletszögek (fokban)
  const redAngle = share.redPct * 3.6;
  const greenAngle = share.greenPct * 3.6;
  const blueAngle = share.bluePct * 3.6;

  // kezdőszög 12 óránál: -90°
  const start = -90;

  const redMid = start + redAngle / 2;
  const greenMid = start + redAngle + greenAngle / 2;
  const blueMid = start + redAngle + greenAngle + blueAngle / 2;

  // felirat a szeletek "közepébe"
  const labelR = r;

  const redPos = polarToXY(redMid, labelR);
  const greenPos = polarToXY(greenMid, labelR);
  const bluePos = polarToXY(blueMid, labelR);

  // a tortra szeletekbe megjelenő százalékok
  const redTxt = `${share.redPct.toFixed(0)}%`;
  const greenTxt = `${share.greenPct.toFixed(0)}%`;
  const blueTxt = `${share.bluePct.toFixed(0)}%`;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="RGB kördiagram">
    <defs>
      <filter id="blendBlur">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    <!-- háttér gyűrű -->
    <circle cx="${cx}" cy="${cy}" r="${r}"
            fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="${strokeWidth}" />
  
    <!-- PIROS -->
<circle class="slice slice-red" style="--dash:${redDash};"
        cx="${cx}" cy="${cy}" r="${r}"
        fill="none" stroke="rgb(255,0,0)" stroke-width="${strokeWidth}"
        stroke-linecap="butt"
        stroke-dashoffset="${redOffset}"
        transform="${rotate}" />

<!-- ZÖLD -->
<circle class="slice slice-green" style="--dash:${greenDash};"
        cx="${cx}" cy="${cy}" r="${r}"
        fill="none" stroke="rgb(0,180,0)" stroke-width="${strokeWidth}"
        stroke-linecap="butt"
        stroke-dashoffset="${greenOffset}"
        transform="${rotate}" />

<!-- KÉK -->
<circle class="slice slice-blue" style="--dash:${blueDash};"
        cx="${cx}" cy="${cy}" r="${r}"
        fill="none" stroke="rgb(0,100,255)" stroke-width="${strokeWidth}"
        stroke-linecap="butt"
        stroke-dashoffset="${blueOffset}"
        transform="${rotate}" />
  
    <!-- Középső kitöltés: egyedi szín -->
    <circle class="center-fill" cx="${cx}" cy="${cy}" r="${innerR}" fill="${share.mix.hex}" />
    <!-- „Festőpaletta” összemosódás: finom, elmosott réteg -->
    <circle class="blend-overlay" cx="${cx}" cy="${cy}" r="${innerR}" fill="${share.mix.hex}" filter="url(#blendBlur)" />
    <!-- Százalékok a szeletekben -->
    <text x="${redPos.x}" y="${
    redPos.y
  }" text-anchor="middle" dominant-baseline="middle"
          font-size="12" font-weight="900" fill="rgba(0,0,0,0.75)">${redTxt}</text>
  
    <text x="${greenPos.x}" y="${
    greenPos.y
  }" text-anchor="middle" dominant-baseline="middle"
          font-size="12" font-weight="900" fill="rgba(0,0,0,0.75)">${greenTxt}</text>
  
    <text x="${bluePos.x}" y="${
    bluePos.y
  }" text-anchor="middle" dominant-baseline="middle"
          font-size="12" font-weight="900" fill="rgba(0,0,0,0.75)">${blueTxt}</text>
  </svg>
  `;
}

//Kiértékelés -- 7 lehetőség szerint:
//PIROS dominancia
//ZÖLD dominancia
//KÉK dominancia
//PIROS-ZÖLD Kettősdominancia
//ZÖLD-KÉK Kettősdominancia
//PIROS-KÉK Kettősdominencia
//PIROS-ZÖLD-KÉK Egyensúly


function buildPersonalityDescriptionHtml(evalRes, scores) {
   if (!evalRes) return "";

  // --- 1. PIROS dominencia ---
  if (evalRes.kind === "red_dom") {
    const secondary = evalRes.secondary;

    const secondaryBlock =
      secondary === "green" // második legerősebb a zöld
        ? `
            <h3>Domináns PIROS jellemvonások, másodlagos ZÖLD komponenssel</h3>
            <p>
              A domináns PIROS komponens erős érvényesülési hajlamát a ZÖLD komponens jelentősen kiegyensúlyozza:
              együttműködőbbé és kompromisszumkészebbé teszi.
            </p>
  
            <h4>Legnagyobb esélyei</h4>
            <p>
              Rendelkezik a PIROS dinamizmusával, ugyanakkor képes arra is, hogy megnyerje az embereket maga körül,
              ahelyett hogy fölöslegesen maga ellen fordítaná őket. Képes győztesként kikerülni a versenyhelyzetekből
              anélkül, hogy mások lelkébe gázolna. Így követheti céljait: bájos makacssággal.
            </p>
  
            <h4>Legnagyobb kockázatai</h4>
            <p>
              Az impulzív PIROS komponens ebben a kombinációban általában mérséklődik a ZÖLD által.
              Bizonyos kivételes helyzetekben – például heves felinduláskor – azonban a PIROS könnyen átveheti az irányítást,
              és háttérbe szoríthatja a ZÖLD békülékenységét. Ilyenkor könnyen mondhat vagy tehet olyasmit,
              amit később nehéz jóvátenni. Mindig törekedjen a higgadtság megőrzésére.
            </p>
          `
        : secondary === "blue" // második legerősebb a kék
        ? `
              <h3>Domináns PIROS jellemvonások, másodlagos KÉK komponenssel</h3>
              <p>
                A domináns PIROS impulzív cselekvési hajlamát a KÉK komponens kontrolláltabbá és átgondoltabbá teszi.

        <h4>Legnagyobb esélyei</h4>
            <p>
            Az impulzivitás és az erős hajtóerő itt összekapcsolódik azzal a képességgel, hogy előrelátóan 
            határozza meg a célokat, majd kitartóan és következetesen kövesse azokat. Ugyanakkor számol a lehetséges 
            következményekkel és alaposabban tervez, átgondol, mint KÉK komponens nélkül tenné. 
            A domináns PIROS gondoskodik arról, hogy a túl sok mérlegelés ne vegye el a lendületet és a kezdeményezőkészséget.
            </p>

        <h4>Legnagyobb kockázatai</h4>
         <p>
            A PIROS dominanciára jellemző érvényesülési törekvés, a KÉK hűvös racionalitásával párosulva, 
            kemény döntésekhez vezethet, amelyeket impulzívan, akár elhamarkodottan hajt végre. Véleményéhez, 
            elméleteihez vagy ideológiáihoz makacsul, akár fanatikusan ragaszkodhat. Kompromisszumkészsége alacsony; 
            érdemes az ellentétes álláspontokat is komolyan átgondolnia és megvizsgálnia.
        </p>
            `
        : "";

    return `
        <div class="eval-text">
          <h2>A PIROS komponens</h2>
          <ol>
            <li>
              <b>Kapcsolat az emberekkel: Dominancia</b>
              <h4>Törekvés a fölényre</h4>
              <p>
                Minél erősebben jellemző a PIROS komponens, annál nagyobb jelentősége van a 'hierarchiának',
                és annál egyértelműbb a felfelé törekvés. Erős az igény arra, hogy valaki a csoport vezetője legyen,
                és általában „kimondja a végső szót”. A státuszszimbólumok is fontos szerepet játszanak.
              </p>
  
              <h4>Természetes tekintély</h4>
              <p>
                Minél erősebb a PIROS komponens, annál inkább megmutatkozik egy olyan tekintély,
                amelyet mások maguktól elismernek és tisztelnek – még akkor is, ha azt nem tudatosan gyakorolják.
                Az ilyen emberektől kezdeményezőkészséget várnak el, különösen kritikus helyzetekben.
              </p>
  
              <h4>Hajlam a versengésre</h4>
              <p>
                Minél erősebb a PIROS komponens, annál inkább nemcsak partnerként tekint másokra,
                hanem egyben mérceként és ösztönzőként is. A verseny komoly kihívás, amelyet szívesen vállalnak
                vagy akár tudatosan keresnek is, hogy önmaguknak vagy másoknak „bizonyítsanak valamit”.
              </p>
            </li>
  
            <li>
              <b>Időbeli orientáció: Jelen</b>
              <h4>A pillanat megragadása</h4>
              <p>
                Minél erősebb a PIROS komponens, annál nagyobb a képesség arra, hogy a pillanat lehetőségeit kihasználja
                – úgymond „megragadja a szerencse üstökét”. Hosszú hezitálásnak és tétovázásnak itt nincs helye.
              </p>
  
              <h4>Impulzív cselekvés</h4>
              <p>
                Minél erősebb a PIROS komponens, annál közvetlenebbek a reakciók: a PIROS dominanciával rendelkezők impulzívak
                és ritkán fékezi őket alapos megfontolás. "Nem kerülgetik a forró kását".
                A diplomácia nem tartozik az erősségeik közé. A „itt és most”-ra való koncentráció magyarázza
                a gyors döntések iránti hajlamot.
              </p>
  
              <h4>Aktivitás és dinamika</h4>
              <p>
                Minél erősebb a PIROS komponens, annál nagyobb az aktivitás iránti igény.
                A türelem és a várakozás nem erősségük; mindennek lehetőleg „azonnal” kell történnie.
                Ez a dinamika másokra is átragad. Ahol erős PIROS komponens határozza meg a hangnemet,
                ott mindig van „pörgés”, mindig történik valami.
              </p>
            </li>
  
            <li>
              <b>Gondolkodás- és munkamód: Nekifogni, cselekedni</b>
              <h4>Konkrét, gyakorlatias gondolkodás</h4>
              <p>
                Minél erősebb a PIROS komponens, annál közvetlenebb és gyakorlatiasabb a gondolkodás.
                Az elméleti és absztrakt dolgok akkor érthetők, ha „kézzelfoghatóvá” válnak,
                például konkrét, szemléletes gondolati modellek segítségével. Fantáziálás és álmodozás alig játszik szerepet;
                minden szilárdan a valóság talaján marad.
              </p>
  
              <h4>A megvalósíthatóság gyors felismerése</h4>
              <p>
                Minél erősebb a PIROS komponens, annál gyorsabban ismeri fel valaki, mi az,
                ami ténylegesen megvalósítható. Az ilyen ember nem kertel, nem habozik, hanem nekifog és megvalósít.
                A törekvés sokkal inkább arra irányul, hogy a dolgokat olyannak fogja fel, amilyenek és cselekedjen,
                nem pedig arra, hogy hosszasan mérlegeljen, vagy átgondolja az alternatívákat.
              </p>
  
              <h4>Hajlam az improvizálásra</h4>
              <p>
                Minél erősebb a PIROS komponens, annál inkább jellemző az az alapbeállítódás, hogy:
                „A kipróbálás többet ér, mint a tanulmányozás.” Az experimentálás és az improvizálás iránti hajlam erősen jelen van.
                Jelmondat: „Az embernek mindig tudnia kell segíteni magán.”
              </p>
            </li>
  
            <li>
              <b>Esélyek és kockázatok</b>
              <h4>A siker fő oka</h4>
              <p>
                Minél erősebb a PIROS komponens, annál inkább a sikerek forrása az, hogy az illető másokat lelkesít és magával ragad.
              </p>
  
              <h4>A legnagyobb esélyek</h4>
              <p>
                Minél erősebb a PIROS komponens, annál erősebben hat másokra is a dinamizmusa, a döntéskészség és az optimizmus
                – szuggesztív és ragadós. A természetes tekintély megkönnyíti az érvényesülést sok helyzetben,
                anélkül hogy autoriter módon kellene fellépni.
              </p>
  
              <h4>A legnagyobb kockázatok</h4>
              <p>
                Minél erősebb a PIROS komponens, annál nagyobb és veszélyesebb a hajlam az elhamarkodott döntésekre és cselekvésre.
                Fontos az indulatok kordában tartása, hogy a célirányos dinamika és határozottság ne üres kapkodássá és meggondolatlansággá váljon.
                Különösen izgatottság vagy düh esetén könnyen meggondolatlan reakciók születhetnek, amelyeket később szívesen visszacsinálna az ember.
              </p>
            </li>
          </ol>
  
          ${secondaryBlock}
        </div>
      `;
  }

  // --- 2. ZÖLD dominancia ---
  if (evalRes.kind === "green_dom") {
    const secondary = evalRes.secondary;

    const secondaryBlock =
      secondary === "blue" // második legerősebb a kék
        ? `
          <h3>Domináns ZÖLD jellemvonások, másodlagos KÉK komponenssel</h3>
          <p>
            A domináns ZÖLD komponens, amely az érzelmek szabad megélésére hajlamos, a KÉK komponens által kap határokat,
            ami a viselkedést jóval megfontoltabbá teszi.
          </p>

          <h4>Legnagyobb lehetőségei</h4>
          <p>
            Az érzelmi–intuitív reagálás révén a ZÖLD megmutatja Önnek a helyes utat. A KÉK előrelátó racionalitása közben
            kontrollálja és fékezi Önt. Ez megóvja az érzelmi túlzásoktól és a túlzott bizalmaskodástól.
          </p>
          <p>
            Ezzel a kontrollal sokkal átgondoltabban és egyben produktívabban bánik mind az idejével, mind a pénzével,
            mint e hatékony KÉK kontroll nélkül.
          </p>

          <h4>Legnagyobb kockázatai</h4>
          <p>
            A lelkesedéssel indított, előrelátóan megtervezett elképzelések következetes végigvitele nem tartozik az erősségei közé.
            A nehézségek könnyen elbátortalanítják. Ne adja fel minden akadálynál.
          </p>
          <p>
            A döntéshozatal gyakran nehéz Önnek. Szereti halogatni a dolgokat, ami azonban nem oldja meg a problémákat.
            Nem tud mindenkinek megfelelni!
          </p>
        `
        : secondary === "red" // második legerősebb a piros
          ? `
            <h3>Domináns ZÖLD jellemvonások, másodlagos PIROS komponenssel</h3>
            <p>
              A domináns ZÖLD komponens, amely alapvetően kompromisszumkész, a PIROS komponens hozzáadásával nagyobb hajtóerőt
              és dinamizmust kap.
            </p>

            <h4>Legnagyobb lehetőségei</h4>
            <p>
              Nyugodtan engedje, hogy az Ön „másodlagos” PIROS komponense időnként erősebben is beavatkozzon.
              Így a ZÖLD komponens előnyeit még hatékonyabban tudja kihasználni.
            </p>
            <p>
              Ebben a kombinációban ugyanis újra és újra képes „jó kapcsolatokat” kialakítani, amelyeket saját javára is fordíthat.
              Ne maradjon mindig csak „együttműködő fél”, hanem a megfelelő pillanatban vállalja fel Ön is a vezető szerepet.
            </p>

            <h4>Legnagyobb kockázatai</h4>
            <p>
              A szükséges önkontroll nélkül ez az egyébként hasznos kombináció – kapcsolatteremtési készség és nagy dinamika –
              könnyen tolakodónak, sőt akár túlzottan rámenősnek is tűnhet.
            </p>
            <p>
              Ezért ne közeledjen másokhoz túl rámenősen, hacsak nem érzi egyértelműen, hogy a közeledése valóban kívánatos.
            </p>
            <p>
              Ha ugyanis visszautasítás éri, a PIROS része ezt könnyen rosszul viseli. Ilyenkor nagy önfegyelemre van szüksége.
            </p>
          `
          : "";

    return `
      <div class="eval-text">
        <h2>A ZÖLD komponens</h2>

        <ol>
          <li>
            <b>Kapcsolat az emberekkel: Kapcsolódás</b>

            <h4>Törekvés az emberi kapcsolódásra</h4>
            <p>
              Minél erősebben van jelen a ZÖLD komponens, annál elviselhetetlenebb mindenfajta elszigeteltség.
              Az igazi megéléshez feltétlenül szükség van társakra, akikkel minden élményt meg lehet osztani:
            </p>
            <p>
              „A társ az örömöt megkettőzi, a bánatot megfelezi.”
            </p>

            <h4>Emberek iránti érzék</h4>
            <p>
              Minél erősebben van jelen a ZÖLD komponens, annál élénkebb az érdeklődés más emberek,
              életkörülményeik és sorsuk iránt. Az emberek itt szinte magát az életelemet jelentik.
              A kapcsolatok szinte maguktól alakulnak ki. Önnek nem nehéz megérteni az embereket.
            </p>

            <h4>Általános kedveltség</h4>
            <p>
              Minél erősebb a ZÖLD komponens, annál könnyebben alakít ki kapcsolatot másokkal, mert a többiek nyitnak Ön fele.
              A társas természet, valamint az emberek iránti érdeklődés és a szívélyesség kisugárzása
              ennek a komponensnek az erős hatására szinte kihívja a környezet szimpátiáját.
            </p>
          </li>

          <li>
            <b>Időbeli orientáció: múlt</b>

            <h4>Az 'emlékekre' építés</h4>
            <p>
              Minél erősebb a ZÖLD komponens, annál nagyobb szerepet játszik a múlt.
              Az alapbeállítódás konzervatív. Az eligazodást az szolgálja, ami „szokásos”.
              Az emlékek nagy jelentőséggel bírnak, a búcsúzás az „emlékektől” gyakran nehéz.
            </p>

            <h4>Cselekvés tapasztalat alapján</h4>
            <p>
              Minél erősebben van jelen a ZÖLD komponens, annál inkább hasznosul az élettapasztalatok
              hatalmas, tudattalanul eltárolt készlete. Ez a potenciál, amely magától rendelkezésre áll a tudatalattiban,
              biztosabb, érzelmileg megalapozott ítéleteket eredményez.
            </p>

            <h4>Radikális változások kerülése</h4>
            <p>
              Minél erősebb a ZÖLD komponens, annál könnyebben alakulnak ki berögzült szokások.
              A „nem kísérletezünk” tipikus hozzáállás; a radikális változásokat kerülik.
              A távoli országokba kivándorlók, pályát váltók és egy-egy terület „úttörői”
              ritkán rendelkeznek erős ZÖLD komponenssel.
            </p>
          </li>

          <li>
            <b>Gondolkodás- és munkamód: megérzés</b>

            <h4>Intuitív gondolkodás, jó megérzés</h4>
            <p>
              Minél erősebb a ZÖLD komponens, annál könnyebb hozzáférni a tudatalattihoz és az ott tárolt tapasztalatokhoz.
              E tapasztalatok „intuitív” értékelése gyakran jobb útmutatást ad, mint a hosszas töprengés.
              A kifinomult megérzés („ráérzés”) tipikus jellemzője a ZÖLD dominanciával rendelkező embereknek.
            </p>

            <h4>Megbízható első benyomások</h4>
            <p>
              Minél erősebb a ZÖLD komponens, annál finomabban érzékeli és helyesen értelmezi a külső jeleket,
              amelyek folyamatosan más emberektől érkeznek. Ennek eredménye többnyire egy nagyon megbízható „első benyomás”
              az emberekről, és jó „szimat” a lehetőségek iránt.
            </p>

            <h4>Fantázia</h4>
            <p>
              Minél erősebb a ZÖLD komponens, annál fantáziadúsabbá válik a gondolkodás.
              A fékezetlen fantázia azonban – a többi komponens kontrollja nélkül – könnyen légvárak építéséhez vezet.
              Ilyenkor az ember elveszítheti a realitás talaját.
            </p>
          </li>

          <li>
            <b>Lehetőségek és kockázatok</b>

            <h4>A siker fő oka</h4>
            <p>
              Minél erősebb a ZÖLD komponens, annál inkább élvezi az előnyét annak,
              hogy szimpátiát sugároz, egyúttal szimpátiát ébreszt másokban.
            </p>

            <h4>A legnagyobb lehetőségek</h4>
            <p>
              Minél erősebb a ZÖLD komponens, annál inkább szeretne mások kedvében járni.
              Az érzelmek alapján történő cselekvés többet ér, mint a kapkodó sikerhajszolás.
              Az erőssége inkább a kapcsolódásban, kapcsolatépítésben rejlik, nem pedig a hosszadalmas, küzdelmes vitákban és alkudozásban.
              Erős ellenállás esetén jobb kivárni: lehet, hogy a lehetőség később magától érkezik.
            </p>

            <h4>A legnagyobb kockázatok</h4>
            <p>
              Minél erősebb a ZÖLD komponens, annál fontosabb észben tartani, hogy nem mindenki vágyik ekkora figyelemre,
              és nem mindenki viseli el a túl szoros kapcsolatokat. Szükséges tiszteletben tartani mások zónáit,
              amelyekre egyes embereknek szükségük van, és amelyekbe senki sem hatolhat be kéretlenül,
              anélkül hogy védekező reakciót váltana ki.
            </p>
          </li>
        </ol>

        ${secondaryBlock}
      </div>
    `;
  }

  // --- 3. KÉK dominancia ---
  if (evalRes.kind === "blue_dom") {
    const secondary = evalRes.secondary;

    const secondaryBlock =
      secondary === "green" // második legerősebb a zöld
        ? `
          <h3>Domináns KÉK jellemvonások, másodlagos ZÖLD komponenssel</h3>
          <p>
            A domináns KÉK komponens hűvös és távolságtartó alaphangját a ZÖLD komponens
            kiegészíti nagyobb empátiával és fantáziával.
          </p>

          <h4>Legnagyobb lehetőségei</h4>
          <p>
            Használja ki gondolkodásának eredetiségét és kapcsolja össze az ötletek
            szemléletes közvetítésének különleges képességével.
            Az erős rend- és rendszerszemlélet nem válik pedánssá,
            hanem magas esztétikai igényhez vezet.
          </p>
          <p>
            A ZÖLD komponens segít abban, hogy a KÉK komponensre jellemző
            elszigeteltséget oldva könnyebben találjon barátokat és támogatókat
            tervei megvalósításához.
          </p>

          <h4>Legnagyobb kockázatai</h4>
          <p>
            Saját érdekeinek érvényesítése nem tartozik az erősségei közé.
            Szívesebben hagyja ezt másokra, különösen azokra,
            akiknél erősebb a PIROS komponens.
          </p>
          <p>
            Párválasztásnál legyen különösen óvatos, mert könnyen kihasználható.
            Döntéseket nehezen hoz, főként akkor,
            amikor határozottságra lenne szükség –
            a túl sok "mérlegelés" néha csak súlyosbítja a problémákat.
          </p>
        `
        : secondary === "red" // második legerősebb a piros
          ? `
            <h3>Domináns KÉK jellemvonások, másodlagos PIROS komponenssel</h3>
            <p>
              A domináns KÉK komponens a PIROS komponens hozzáadódásával
              nagyobb önbizalmat és határozottságot kap a célok megvalósításában.
            </p>

            <h4>Legnagyobb lehetőségei</h4>
            <p>
              A logikai kényszere és az energikus, személyes elköteleződés,
              erőteljes, meggyőző hatást eredményez.
              Az ötletek gyakran annyira meggyőzőek már a kezdetektől,
              hogy könnyen maga mellé tud állítani másokat.
            </p>
            <p>
              A PIROS komponens érvényesítő ereje segít abban,
              hogy terveit keresztülvigye, ellenállással és akadályokkal szemben is.
            </p>

            <h4>Legnagyobb kockázatai</h4>
            <p>
              A szükséges visszafogottság hiányában ez a kombináció könnyen 'okoskodónak' vagy fölényesnek tűnhet,
              ami ellenszenvet válthat ki.
            </p>
            <p>
              Könnyebb szakmai elismerést szereznie, mint valódi emberi szimpátiát.
              Ne építsen pusztán a „jó barátokra”.
              Bár sok mindent tud adni a partnereinek, embertársainak, a környezete néha kissé „nyugtalanítónak” érezheti.
            </p>
          `
          : "";

    return `
      <div class="eval-text">
        <h2>A KÉK komponens</h2>

        <ol>
          <li>
            <b>Kapcsolat az emberekkel: távolságtartás</b>

            <h4>Biztonságos távolságra való törekvés</h4>
            <p>
              Minél erősebben jelen van a KÉK komponens,
              annál nagyobb az igény a „biztonságos távolság”-ra az embertársakkal szemben.
              Óvakodik attól, hogy mások „túl közel kerüljenek hozzá”,
              és ő maga sem enged senkit túl közel magához –
              különösen nem, az első találkozás alkalmával.
            </p>

            <h4>Tartózkodás</h4>
            <p>
              Minél erősebb a KÉK komponens,
              annál hosszabb időt igényel a 'felengedés'.
              Nem megfelelő emberi környezet esetén ez akár teljesen el is maradhat.
              Gyakran nem kelt különösebb hatást az első benyomáskor,
              hanem csak közelebbi megismerés során válik igazán érdekessé másoknak.
            </p>

            <h4>Zárkózottságra való hajlam</h4>
            <p>
              Minél erősebb a KÉK komponens,
              annál nehezebb felismerni az érzelmeiket.
              Ezek az emberek nagyon érzékenyek és sebezhetőek,
              mély érzelmeik vannak, de ezeket nem könnyen mutatják ki.
              Ezért gyakran hűvösnek vagy akár arrogánsnak tűnnek.
            </p>
          </li>

          <li>
            <b>Időbeli orientáció: jövő</b>

            <h4>A következmények mérlegelése</h4>
            <p>
              Minél erősebb a KÉK komponens,
              annál erősebb a késztetés arra,
              hogy az ember intenzíven foglalkozzon a jövővel.
              A gondolkodás mindig megelőzi a jelent.
              A lehetőségek és következmények alapos vizsgálata
              megnehezíti a döntéshozatalt.
            </p>

            <h4>Tervezett cselekvés</h4>
            <p>
              Minél erősebb a KÉK komponens,
              annál kevesebb dolog történik terv nélkül.
              Az idő kezelése is a tervezés alá van rendelve:
              a rendelkezésre álló idő pontosan be van osztva.
              A pontosság a legfőbb elv.
            </p>

            <h4>Fejlődésre való törekvés</h4>
            <p>
              Minél erősebb a KÉK komponens,
              annál erősebb a fejlődés iránti törekvés.
              A „fejlődést” gyakran az életkörülmények javulásával azonosítják.
            </p>
          </li>

          <li>
            <b>Gondolkodás- és munkamód: rend</b>

            <h4>Rendszerszemléletű, elemző gondolkodás</h4>
            <p>
              Minél erősebb a KÉK komponens,
              annál fejlettebb az a képesség,
              hogy látszólag össze nem függő adatok között is
              összefüggéseket és rendszereket fedezzen fel.
            </p>

            <h4>Magas absztrakciós képesség</h4>
            <p>
              Az absztrakt kódolások – például a matematika vagy a programozási nyelvek –
              különösebb nehézség nélkül elsajátíthatók.
            </p>

            <h4>Perfekcionizmusra való hajlam</h4>
            <p>
              Minél erősebb a KÉK komponens,
              annál erősebb a perfekcionizmus.
              Nem elég „nagyjából” pontosan fogalmazni –
              a legmegfelelőbb szó megtalálása a cél.
            </p>
          </li>

          <li>
            <b>Lehetőségek és kockázatok</b>

            <h4>A siker fő oka</h4>
            <p>
              Minél erősebb a KÉK komponens,
              annál inkább az a siker forrása,
              hogy az ember érvekkel tudja meggyőzni a többieket.
            </p>

            <h4>A legnagyobb lehetőségek</h4>
            <p>
              A pontosan megtervezett, türelmes haladás
              nem gyors, hanem biztos sikereket hoz.
              Az idő mindig a KÉK dominanciával rendelkező embernek dolgozik.
            </p>

            <h4>A legnagyobb kockázatok</h4>
            <p>
              A perfekcionizmus késleltetheti a feladatok lezárását.
              A túlzott távolságtartás elszigetelődéshez vezethet.
            </p>
          </li>
        </ol>

        ${secondaryBlock}
      </div>
    `;
  }

  // --- 4. KETTŐS DOMINANCIA: ZÖLD / PIROS ---
  if (evalRes.kind === "dual_rg") {
    return `
      <div class="eval-text">
        <h2>Kettős dominancia: ZÖLD / PIROS</h2>

        <h3>Lényeges szempontok</h3>
        <p>
          A kettős dominancia feszültségmezőt hoz létre két, egyformán erős komponens között.
          Ezek a komponensek összekapcsolódnak, ugyanakkor – a körülményektől vagy a partnertől függően –
          eltérő módon is működésbe léphetnek.
        </p>

        <ol>
          <li>
            <b>Kapcsolat az emberekkel</b>

            <h4>🟩 Kapcsolatigény</h4>
            <p>
              A ZÖLD komponens jellemzője az emberek, az életkörülményeik és sorsuk iránti erős érdeklődés.
              A párkapcsolati megélés fontos. Könnyen teremt kapcsolatokat.
            </p>

            <h4>🟥 Dominanciára törekvés</h4>
            <p>
              A 'hierarchia' és a „felfelé törekvés” a PIROS komponens számára nagy jelentőséggel bír.
              A tekintélyt „természetesnek” fogadják el, és tudatosan vagy tudattalanul is gyakorolják.
            </p>

            <h4>🟩🟥 A ZÖLD és PIROS kapcsolata</h4>
            <p>
              A versengés iránti hajlam és a kihívások keresése összekapcsolódik a "kapcsolódási" beállítottsággal
              és a párkapcsolati igénnyel.
            </p>
          </li>

          <li>
            <b>Időbeli orientáció</b>

            <h4>🟩 Múltorientáció</h4>
            <p>
              A múlt a ZÖLD komponensnél nagy szerepet játszik. Az élettapasztalatok tudatalatt is rendelkezésre állnak,
              és biztos érzelmi ítéletekhez vezetnek.
            </p>

            <h4>🟥 Jelenorientáció</h4>
            <p>
              Az „itt és most”-ra való koncentráció magyarázza a gyors döntések és az impulzív, spontán cselekvés iránti hajlamot.
              A PIROS komponensre nem jellemző a hosszú tétovázás vagy halogatás.
            </p>

            <h4>🟩🟥 A ZÖLD és PIROS kapcsolata</h4>
            <p>
              A konzervatív alapbeállítottság összekapcsolódik a jelen dinamizmusával.
              Az élet állandó feszültségben zajlik: a megszokott rutinok és az aktivitás iránti igény között.
            </p>
          </li>

          <li>
            <b>Gondolkodás- és munkamód</b>

            <h4>🟩 Érzékelés, ráérzés</h4>
            <p>
              A tapasztalatok intuitív értékelése a ZÖLD komponens jellemzője.
              Ennek következménye a „jó szimat” a lehetőségek felismerésére.
              Az emberekkel való bánásmódban kifinomult „megérzés” jellemző.
            </p>

            <h4>🟥 Megértés, megragadás</h4>
            <p>
              Mindenben a valóság talaján marad. A PIROS komponens az elmélet és az absztrakció gyakorlati alkalmazását részesíti előnyben.
              A dolgokat olyannak fogadják el, amilyenek, ahelyett hogy hosszasan alternatívákon rágódnának.
            </p>

            <h4>🟩🟥 A ZÖLD és PIROS kapcsolata</h4>
            <p>
              A „kipróbálni többet ér, mint az áttanulmányozni” szemlélet kísérletező és improvizatív hajlamot mutat.
              Az emberek és helyzetek iránti érzéke gyakran megakadályozza az elhamarkodott cselekvésben.
            </p>
          </li>

          <li>
            <b>Lehetőségek és kockázatok</b>

            <p>
              A jellemzően „lágyabb” ZÖLD komponens ebben a kettős dominanciában a „keményebb” PIROS komponenssel kapcsolódik össze.
              Ez nagyobb kiegyensúlyozottsághoz vezet.
            </p>

            <h4>Legnagyobb lehetőségei</h4>
            <p>
              Az emberek állnak érdeklődése középpontjában – és egyben ők jelentik a legnagyobb lehetőséget is.
              Használja ki egyszerre erős kapcsolatteremtő képességét és természetes tekintélyét,
              hogy másokat a saját céljai felé irányítson. Meg tudja nyerni az embereket maga mellé.
              Legyen tárgyalások során kompromisszumkész, ugyanakkor következetes tervei és vágyai megvalósításában.
            </p>

            <h4>Legnagyobb kockázatai</h4>
            <p>
              A ZÖLD komponens kedveltsége gyakran magas pozíciókhoz juttatja.
              Ugyanakkor fennáll a veszély, hogy a PIROS komponens túlzott fölényre törekvése miatt
              a „szimpátia-bónusz” meggyengül vagy akár teljesen elvész.
              Ez konfrontációkhoz vezethet, ami a ZÖLD komponens számára különösen idegen.
            </p>
          </li>
        </ol>
      </div>
    `;
  }

  // --- 5. KETTŐS DOMINANCIA: ZÖLD / KÉK ---
  if (evalRes.kind === "dual_gb") {
    return `
      <div class="eval-text">
        <h2>Kettős dominancia: ZÖLD / KÉK</h2>

        <h3>Lényeges szempontok</h3>
        <p>
          A kettős dominancia feszültségmezőt hoz létre két, egyformán erős komponens között.
          A komponensek összekapcsolódnak, de a helyzettől vagy a partnertől függően eltérően működhetnek.
        </p>

        <ol>
          <li>
            <b>Kapcsolat az emberekkel</b>

            <h4>🟩 Kapcsolatigény</h4>
            <p>
              Erős érdeklődés az emberek, életkörülményeik és sorsuk iránt. A kapcsolatok könnyen kialakulnak.
            </p>

            <h4>🟦 Távolságtartás iránti igény</h4>
            <p>
              A KÉK komponens „biztonságos távolságot” igényel az emberekkel való érintkezésben.
              Óvatosság jellemző, különösen az első kapcsolatfelvételnél.
            </p>

            <h4>🟩🟦 A ZÖLD és KÉK kapcsolata</h4>
            <p>
              A ZÖLD kapcsolatkészsége összekapcsolódik a KÉK távolságtartásával.
              Ennek eredménye az emberek és helyzetek tárgyilagosabb megítélése.
            </p>
          </li>

          <li>
            <b>Időbeli orientáció</b>

            <h4>🟩 Múltorientáció</h4>
            <p>
              Az élettapasztalatok érzelmileg biztos alapot adnak a döntésekhez.
            </p>

            <h4>🟦 Jövőorientáció</h4>
            <p>
              A KÉK komponens erősen a jövővel foglalkozik. Ritkán történik bármi részletes tervezés nélkül.
              A lehetőségek és következmények elemzése a kockázatok minimalizálását szolgálja.
            </p>

            <h4>🟩🟦 A ZÖLD és KÉK kapcsolata</h4>
            <p>
              A múlt tapasztalatai alapot adnak a jövő tervezéséhez.
              Az érzelmi biztonság és a precíz időtervezés összekapcsolódik a megszokások stabilitásával.
            </p>
          </li>

          <li>
            <b>Gondolkodás- és munkamód</b>

            <h4>🟩 Ráérzés</h4>
            <p>
              Intuitív tapasztalatfeldolgozás, erős emberismeret.
            </p>

            <h4>🟦 Rendszerezés</h4>
            <p>
              A KÉK komponens magas absztrakciós képessége segít törvényszerűségeket felismerni az adatok és részletek mögött.
              A számok és tények kerülnek előtérbe.
            </p>

            <h4>🟩🟦 A ZÖLD és KÉK kapcsolata</h4>
            <p>
              A ZÖLD kreatív gondolkodását a KÉK logikája és racionalitása szabályozza.
              A nyelvi pontosság segít az intuitív érzések racionális megfogalmazásában.
            </p>
          </li>

          <li>
            <b>Lehetőségek és kockázatok</b>

            <p>
              A ZÖLD érzelmessége és a KÉK hűvös racionalitása jól kiegészítik egymást.
            </p>

            <h4>Legnagyobb lehetőségei</h4>
            <p>
              A fantázia és a rend egyensúlya különleges kreativitást eredményez:
              élénk, ötletgazdag, mégis világos és strukturált.
              Az intuíció és az érzékenység kiváló alapot teremt az empatikus emberismerethez.
            </p>

            <h4>Legnagyobb kockázatai</h4>
            <p>
              Ha a ZÖLD és KÉK egyformán erősen dominál, a PIROS komponens háttérbe szorulhat.
              Ez kezdeményezőkészség hiányához vezethet, vagyis az ötletek megvalósítása elmaradhat.
              A lehetőségek elszalasztásával, a döntések késleltetésével előfordulhat, hogy mások aratják le a "babérokat".
            </p>
          </li>
        </ol>
      </div>
    `;
  }

  // --- 6. KETTŐS DOMINANCIA: PIROS / KÉK ---
  if (evalRes.kind === "dual_rb") {
    return `
      <div class="eval-text">
        <h2>Kettős dominancia: PIROS/KÉK</h2>

        <p>
          A kettős dominancia feszültségmezőt hoz létre két azonosan erős komponens között.
          A két komponens összekapcsolódik, ugyanakkor – a körülményektől vagy a partnertől függően –
          eltérő módon is megjelenik.
        </p>

        <ol>
          <li>
            <b>Kapcsolat az emberekkel</b>

            <h4>🟥 Dominanciára való törekvés</h4>
            <p>
              A "hierarchia" és a „felfelé törekvés” a PIROS komponens számára nagy jelentőséggel bír.
              A tekintélyt „természetesnek” veszi és tudatosan vagy tudat alatt egyaránt gyakorolja.
            </p>

            <h4>🟦 Távolságtartásra való hajlam</h4>
            <p>
              A KÉK komponensnek szüksége van egyfajta „biztonságos távolságra” az emberekkel való érintkezésben.
              Óvakodik attól, hogy másokhoz „túl közel” kerüljön, különösen az első kapcsolatfelvételkor.
            </p>

            <h4>🟥🟦 A PIROS és a KÉK kapcsolódása</h4>
            <p>
              A PIROS komponens kihívása – hogy „helytálljon a versenyben” – összekapcsolódik a KÉK komponens igényével,
              hogy ezt „bizonyítani” is tudja.
            </p>
          </li>

          <li>
            <b>Időbeli orientáció</b>

            <h4>🟥 Jelenorientáció</h4>
            <p>
              A „itt és most”-ra való összpontosítás magyarázza a gyors döntésekre és az impulzív,
              spontán cselekvésre való hajlamot.
              A hosszas tétovázás és halogatás nem jellemző a PIROS komponensre.
            </p>

            <h4>🟦 Jövőorientáció</h4>
            <p>
              A KÉK komponens erős igényt érez arra, hogy a jövővel foglalkozzon.
              Ritkán történik bármi részletes tervezés nélkül.
              A lehetőségek és következmények vizsgálata arra szolgál, hogy minden elképzelhető kockázatot kizárjon.
            </p>

            <h4>🟥🟦 A PIROS és a KÉK kapcsolódása</h4>
            <p>
              A rövid távú lehetőségek kihasználása összekapcsolódik azzal a képességgel,
              hogy a lehetséges következményeket és további nézőpontokat is figyelembe vegye.
              Az ellenőrzés és mérlegelés egy „realisztikus” szintre csökken.
            </p>
          </li>

          <li>
            <b>Gondolkodás- és munkamód</b>

            <h4>🟥 Megértés</h4>
            <p>
              Minden szilárdan a valóság talaján marad.
              A PIROS komponens a gyakorlati alkalmazást részesíti előnyben az elmélettel és az absztrakcióval szemben.
              A dolgokat úgy fogja meg, ahogyan azok ténylegesen vannak,
              ahelyett hogy hosszan töprengene alternatívákon.
            </p>

            <h4>🟦 Rendszerezés</h4>
            <p>
              A KÉK komponens magas absztrakciós képessége segít a látszólag összefüggéstelen részletek mögötti
              szabályszerűségeket felismerni. A számok és adatok kerülnek előtérbe.
            </p>

            <h4>🟥🟦 A PIROS és a KÉK kapcsolódása</h4>
            <p>
              A PIROS/KÉK kettős dominancia képessé tesz arra,
              hogy az absztrakt gondolkodást és az elméleti tudást „gyakorlati valósággá” alakítsa.
              Az összefüggések nem pusztán „a rendszer kedvéért” kerülnek rendszerezésre.
            </p>
          </li>

          <li>
            <b>Lehetőségek és kockázatok</b>

            <p>
              A PIROS komponens önmagában inkább „dinamikus”, ebben a kettős dominanciában azonban
              összekapcsolódik a „fölényesebb” KÉK komponenssel, amely fékezi a túlzottan elhamarkodott aktivitást.
            </p>

            <h4>Legnagyobb lehetőségei</h4>
            <p>
              A PIROS komponens kockázatvállalási hajlandósága, a KÉK komponensre jellemző jó önkontrollal párosulva,
              taktikus, okos tárgyalóvá teszi Önt.
              Nem enged betekintést a lapjaiba, ugyanakkor céljait következetesen és engesztelhetetlenül követi.
              Felismeri a pillanat lehetőségeit, de hosszabb távú következményekben is gondolkodik.
              Amit egyszer alaposan átgondolt és megtervezett, azt határozottan végre is hajtja.
            </p>

            <h4>Legnagyobb kockázatai</h4>
            <p>
              Az impulzívan reagáló PIROS komponenst általában a KÉK fékezi.
              Ha azonban az önkontroll megszűnik – például heves felindultság állapotában –,
              az "impulzív" PIROS kerülhet fölénybe és elhamarkodott cselekvésre késztetheti.
              Ilyenkor a KÉK csak utólag „kapcsol be”, hogy igazolja a saját viselkedését.
              A saját álláspontok gyakran nagyon merevek, a kompromisszumkészség gyakran alacsony.
            </p>
          </li>
        </ol>
      </div>
    `;
  }

  // --- 7. EGYENLETES PIROS–ZÖLD–KÉK ---
  if (evalRes.kind === "balanced_rgb") {
    return `
      <div class="eval-text">
        <h2>Egyenletes PIROS / ZÖLD / KÉK eloszlás</h2>

        <p>
          A három komponens egyenletes eloszlása nem eredményez feltűnő dominanciát.
          Ez a kiegyensúlyozottság lehetővé teszi,
          hogy rugalmasan alkalmazkodjon különböző helyzetekhez és emberekhez, partnerekhez.
          Ugyanakkor az egyes komponensek hatása részben ki is olthatja egymást.
        </p>

        <ol>
          <li>
            <b>Kapcsolat az emberekkel</b>

            <h4>🟩 Kapcsolatigény (ZÖLD)</h4>
            <p>
              Érdeklődés az emberek, élethelyzeteik és sorsuk iránt.
              A párkapcsolat fontos. Az emberi kapcsolatok könnyen kialakulnak.
            </p>

            <h4>🟥 Dominanciára törekvés (PIROS)</h4>
            <p>
              A hierarchia és az „előrejutás” fontos.
              A tekintélyt természetesnek veszi,
              és tudatosan vagy tudat alatt gyakorolja is.
            </p>

            <h4>🟦 Távolságtartás (KÉK)</h4>
            <p>
              Biztonságos távolságra van szüksége az emberekkel szemben.
              Óvatosság jellemi, különösen az első találkozáskor.
            </p>
          </li>

          <li>
            <b>Időbeli orientáció</b>

            <h4>🟩 Múltorientáció (ZÖLD)</h4>
            <p>
              A múlt fontos szerepet játszik.
              Az élettapasztalatok tudat alatt is
              biztos érzelmi ítéletekhez vezetnek.
            </p>

            <h4>🟥 Jelenorientáció (PIROS)</h4>
            <p>
              A „itt és most”-ra való fókusz
              gyors döntésekhez és impulzív cselekvéshez vezet.
              Hosszú hezitálás nem jellemzi.
            </p>

            <h4>🟦 Jövőorientáció (KÉK)</h4>
            <p>
              Erős igény a jövővel való foglalkozásra.
              Részletes tervezés nélkül ritkán történik bármi.
              A lehetőségek és következmények mérlegelése
              a kockázatok minimalizálását szolgálja.
            </p>
          </li>

          <li>
            <b>Gondolkodás- és munkamód</b>

            <h4>🟩 Érzékelés / intuíció (ZÖLD)</h4>
            <p>
              Tapasztalatok intuitív feldolgozása.
              „Jó szimat” a lehetőségekhez, jó emberismeret.
            </p>

            <h4>🟥 Megértés / gyakorlatiasság (PIROS)</h4>
            <p>
              A realitás talaján marad.
              Az elméletet a gyakorlatba ülteti át.
              Nem elmélkedik sokáig alternatívákon.
            </p>

            <h4>🟦 Rendszerezés (KÉK)</h4>
            <p>
              Magas absztrakciós képesség.
              Összefüggések felismerése,
              számok és adatok előtérbe helyezése.
            </p>
          </li>

          <li>
            <b>Kettős dominancia: PIROS / KÉK – esélyek és kockázatok</b>

            <h4>Esélyek</h4>
            <p>
              A PIROS kockázatvállalása és a KÉK önkontrollja
              taktikusan okos tárgyalóvá tesz.
              A pillanat lehetőségeinek felismerése
              és a hosszú távú következmények mérlegelése egyszerre jelenik meg.
              A jól átgondolt terveket következetesen végrehajtja.
            </p>

            <h4>Kockázatok</h4>
            <p>
              Erős érzelmi állapotban a PIROS felülkerekedhet a KÉKen,
              ami elhamarkodott cselekvésekhez vezethet.
              A KÉK ilyenkor utólag „bekapcsol”,
              hogy igazolja a történteket.
              Az álláspontok merevek lehetnek,
              a kompromisszumkészség alacsony.
            </p>
          </li>
        </ol>
      </div>
    `;
  }

  return "";
}