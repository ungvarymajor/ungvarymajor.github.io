//Személyiségteszt - piros-kék-zöld jegyek alapján

/*
// --- DEBUG: minden hibát kiír a képernyőre ---
window.addEventListener("error", (e) => {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<pre style="white-space:pre-wrap; background:#fee; border:1px solid #f99; padding:12px; border-radius:10px; margin:12px;">
  HIBA: ${e.message}
  FÁJL: ${e.filename}
  SOR: ${e.lineno}:${e.colno}
  </pre>`
    );
  });
  
  window.addEventListener("unhandledrejection", (e) => {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<pre style="white-space:pre-wrap; background:#fee; border:1px solid #f99; padding:12px; border-radius:10px; margin:12px;">
  PROMISE HIBA: ${String(e.reason)}
  </pre>`
    );
  });

document.body.insertAdjacentHTML("afterbegin", "<div style='position:fixed;top:28px;left:0;background:#dfd;padding:6px;z-index:9999'>app.js betöltve</div>");
console.log("app.js betöl
*/

const appEl = document.getElementById("app");

// --- ÁLLAPOT ---
let state = {
  step: "start", // "start" | "test" | "result"
  index: 0,
  scores: { red: 0, green: 0, blue: 0 },
};

// --- EREDMÉNY LOGIKA (maradhat a régi) ---

function computeResult(scores) {
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [c1, s1] = entries[0];
  const [c2, s2] = entries[1];

  const isMixed = s1 - s2 <= 1;
  const type = isMixed ? `${c1}-${c2}` : c1;

  const diff = s1 - s2;
  const dominance = diff >= 6 ? "erős" : diff >= 3 ? "közepes" : "enyhe";

  return { type, dominance };
}

function colorName(c) {
  if (c === "red") return "Piros";
  if (c === "green") return "Zöld";
  return "Kék";
}

function typeLabel(type) {
  if (!type.includes("-")) return colorName(type);
  const [a, b] = type.split("-");
  return `${colorName(a)}–${colorName(b)}`;
}

function typeDescription(type) {
  if (type === "red") return "Határozott, gyors, kezdeményező.";
  if (type === "green") return "Kapcsolatorientált, támogató, együttműködő.";
  if (type === "blue") return "Elemző, átgondolt, rendszerező.";
  if (type === "red-green")
    return "Cselekvő és emberközpontú: lendület + kapcsolódás.";
  if (type === "red-blue") return "Gyors és stratégiai: döntés + átgondoltság.";
  if (type === "green-blue")
    return "Empatikus és megfontolt: figyelem + logika.";
  if (type === "green-red") return typeDescription("red-green");
  if (type === "blue-red") return typeDescription("red-blue");
  if (type === "blue-green") return typeDescription("green-blue");
  return "Egyedi keverék.";
}

// --- RENDER: START ---
function renderStart() {
  appEl.innerHTML = `
    <section class="card">
      <h1>Személyiségteszt 'Piros-Zöld-Kék' jellemzők alapján</h1>
      <p>Rendezze sorba a válaszokat: legfelülre az Önre leginkább jellemző válasz kerüljön, majd a második jellemző, végül a legkevésbé jellemző választ húzza legalulra.</p>
      <button class="btn" id="startBtn">Kezdés</button>
    </section>
  `;

  document.getElementById("startBtn").addEventListener("click", () => {
    state.step = "test";
    state.index = 0;
    state.scores = { red: 0, green: 0, blue: 0 };
    render();
  });
}

// --- Drag & Drop segédfüggvények ---
function allowDrop(e) {
    e.preventDefault(); // NÉLKÜLE NEM LEHET DROPPOLNI
  }
  
  function setOver(el, on) {
    if (!el) return;
    if (on) el.classList.add("over");
    else el.classList.remove("over");
  }
  

// --- ÚJ RENDER: KÉRDÉS (3 select + Következő gomb) ---
function renderQuestion() {
  const q = QUESTIONS[state.index];

  // 8-9-10. kérdés (1-based): index 7,8,9 (0-based)
  const isTop3Mode = state.index >= 7 && state.index <= 9;

  // A válaszok kártyái (pool-ba indulnak)
  const cardsHtml = q.answers
    .map(
      (a, i) => `
        <div class="item" draggable="true" data-ans="${i}">
          ${a.text}
        </div>
      `
    )
    .join("");

  // --- UI: kétféle layout ---
  appEl.innerHTML = `
      <section class="card">
        <div class="progress">${state.index + 1} / ${QUESTIONS.length}</div>
        <h2>${q.text}</h2>
  
        <p>${
          isTop3Mode
            ? "Válassza ki a 3 leginkább jellemző választ a 6 közül (húzza a Top 3 mezőbe):"
            : "Húzza a válaszokat a megfelelő helyre:"
        }
        </p>
  
        <div class="dnd-area">
          <div class="pool" data-zone="pool">
            <div class="zone-title">
              <span>Válaszok</span>
            </div>
            <div class="zone-row" id="poolRow">
              ${cardsHtml}
            </div>
          </div>
  
          ${
            isTop3Mode
              ? `
                <div class="zone" data-zone="top3">
                  <div class="zone-title">
                    <span>Top 3, azaz a leginkább jellemzők rám.</span>
                    <small>(3 választ húzzon ide)</small>
                  </div>
                  <div class="zone-row" id="top3Row">
                    <p class="drop-hint">Húzzon ide pontosan 3 választ.</p>
                  </div>
                </div>
              `
              : `
                <div class="zone" data-zone="most">
                  <div class="zone-title">
                    <span>Leginkább jellemző</span>
                  </div>
                  <div class="zone-row" id="mostRow">
                    <p class="drop-hint">Húzza ide a válaszát.</p>
                  </div>
                </div>
  
                <div class="zone" data-zone="neutral">
                  <div class="zone-title">
                    <span>Neutrális</span>
                  </div>
                  <div class="zone-row" id="neutralRow">
                    <p class="drop-hint">Húzza ide a válaszát.</p>
                  </div>
                </div>
  
                <div class="zone" data-zone="least">
                  <div class="zone-title">
                    <span>Legkevésbé jellemző</span>
                  </div>
                  <div class="zone-row" id="leastRow">
                    <p class="drop-hint">Húzza ide a válaszát.</p>
                  </div>
                </div>
              `
          }
  
          <p id="hint" style="color:#b00020; display:none; margin:0;"></p>
  
          <div class="row" style="margin-top:4px;">
            <button class="btn" id="nextBtn" disabled>Következő</button>
          </div>
  
          <div>
            <div class="progress">red=${state.scores.red} green=${
    state.scores.green
  }</div>
          </div>
        </div>
      </section>
    `;

  console.log(
    "Eddigi pontjaim: red=",
    state.scores.red,
    " green=",
    state.scores.green
  );

  const poolRow = document.getElementById("poolRow");
  const nextBtn = document.getElementById("nextBtn");
  const hint = document.getElementById("hint");

  const mostRow = !isTop3Mode ? document.getElementById("mostRow") : null;
  const neutralRow = !isTop3Mode ? document.getElementById("neutralRow") : null;
  const leastRow = !isTop3Mode ? document.getElementById("leastRow") : null;

  const top3Row = isTop3Mode ? document.getElementById("top3Row") : null;

  // drag state
  let draggingEl = null;

  // Kártyák drag eseményei
  appEl.querySelectorAll(".item").forEach((el) => {
    el.addEventListener("dragstart", () => {
      draggingEl = el;
      setTimeout(() => (el.style.opacity = "0.6"), 0);
    });

    el.addEventListener("dragend", () => {
      el.style.opacity = "1";
      draggingEl = null;
      validate();
    });
  });

  // Drop célpontok
  const dropTargets = [
    poolRow.closest(".pool"),
    ...(isTop3Mode
      ? [top3Row.closest(".zone")]
      : [
          mostRow.closest(".zone"),
          neutralRow.closest(".zone"),
          leastRow.closest(".zone"),
        ]),
  ];

  dropTargets.forEach((target) => {
    target.addEventListener("dragover", allowDrop);
    target.addEventListener("dragenter", () => setOver(target, true));
    target.addEventListener("dragleave", () => setOver(target, false));
    target.addEventListener("drop", (e) => {
      e.preventDefault();
      setOver(target, false);
      if (!draggingEl) return;

      const zone = target.dataset.zone;

      const row =
        zone === "pool"
          ? poolRow
          : zone === "top3"
          ? top3Row
          : zone === "most"
          ? mostRow
          : zone === "neutral"
          ? neutralRow
          : leastRow;

      // --- TOP3 mód: max 3 elem lehet bent ---
      if (isTop3Mode && zone === "top3") {
        const currentItems = row.querySelectorAll(".item");
        if (currentItems.length >= 3) {
          hint.textContent = "A Top 3 mezőbe maximum 3 választ tehet.";
          hint.style.display = "block";
          // visszatesszük a pool-ba
          poolRow.appendChild(draggingEl);
          validate();
          return;
        }
      }

      // --- Normál mód: zónánként max 1 elem (csere a pool-ba) ---
      if (!isTop3Mode && zone !== "pool") {
        const existing = row.querySelector(".item");
        if (existing) poolRow.appendChild(existing);
      }

      // hint törlése, ha kártya kerül a zónába
      const hintP = row.querySelector(".drop-hint");
      if (hintP) hintP.remove();

      row.appendChild(draggingEl);

      // ha TOP3 zónából kivettük az utolsó kártyát később, a hintet nem rakjuk vissza automatikusan (nem kötelező)

      validate();
    });
  });

  function getChosenIndexSingle(row) {
    const el = row.querySelector(".item");
    if (!el) return null;
    return Number(el.dataset.ans);
  }

  function getChosenIndexesMulti(row) {
    return Array.from(row.querySelectorAll(".item")).map((el) =>
      Number(el.dataset.ans)
    );
  }

  function validate() {
    hint.style.display = "none";

    if (isTop3Mode) {
      const picks = getChosenIndexesMulti(top3Row);
      if (picks.length !== 3) {
        nextBtn.disabled = true;
        return;
      }
      // biztonság: egyediség (DOM miatt amúgy is egyedi, de ok)
      const set = new Set(picks);
      if (set.size !== 3) {
        nextBtn.disabled = true;
        hint.textContent = "A 3 választ különböző kártyákból válassza ki.";
        hint.style.display = "block";
        return;
      }

      nextBtn.disabled = false;
      return;
    }

    // normál mód
    const m = getChosenIndexSingle(mostRow);
    const n = getChosenIndexSingle(neutralRow);
    const l = getChosenIndexSingle(leastRow);

    if (m === null || n === null || l === null) {
      nextBtn.disabled = true;
      return;
    }

    const set = new Set([m, n, l]);
    if (set.size !== 3) {
      nextBtn.disabled = true;
      hint.textContent = "Mindhárom zónába különböző választ tegyél.";
      hint.style.display = "block";
      return;
    }

    nextBtn.disabled = false;
  }

  nextBtn.addEventListener("click", () => {
    let choiceIndex = -1;

    if (isTop3Mode) {
      // 3 legjellemzőbb kiválasztása sorrend nélkül
      const picks = getChosenIndexesMulti(top3Row);
      if (picks.length !== 3) return;

      // bitmask (6 válasz esetén tökéletes)
      let choice = 0;
      for (const idx of picks) choice |= 1 << idx;

      if (choice in evalutationIndexRecap_multiSelect) {
        choiceIndex = evalutationIndexRecap_multiSelect[choice];
      } else {
        choiceIndex = -1;
      }
    } else {
      const mostIndex = getChosenIndexSingle(mostRow);
      const neutralIndex = getChosenIndexSingle(neutralRow);
      const leastIndex = getChosenIndexSingle(leastRow);

      if (mostIndex === null || neutralIndex === null || leastIndex === null)
        return;

      if (q.answers.length == 3) {
        // sorrend számít (3 válaszos kérdések)
        const choice = mostIndex * 100 + neutralIndex * 10 + leastIndex;
        choiceIndex = evalutationIndexRecap_3choice[choice];
      } else {
        // több válaszos: sorrend nélkül (régi logikád)
        const choice =
          (1 << mostIndex) + (1 << neutralIndex) + (1 << leastIndex);
        if (choice in evalutationIndexRecap_multiSelect) {
          choiceIndex = evalutationIndexRecap_multiSelect[choice];
        } else {
          choiceIndex = -1;
        }
      }
    }

    console.log("The chosen choice index is ", choiceIndex);

    if (choiceIndex >= 0 && choiceIndex < q.evaluationRed.length) {
      state.scores["red"] += q.evaluationRed[choiceIndex];
      state.scores["green"] += q.evaluationGreen[choiceIndex];
      console.log("Added points for choice index ", choiceIndex);
    } else {
      console.log("Choice index out of range, value = ", choiceIndex);
    }

    if (state.index < QUESTIONS.length - 1) {
      state.index += 1;
      render();
    } else {
      state.step = "result";
      render();
    }
  });

  validate();
}

// --- RENDER: EREDMÉNY ---
function renderResult() {
    // --- a te meglévő pontszám-logikád (megtartva) ---
    const finalScores = {
      green: 12 + state.scores.green,
      red: 24 + state.scores.red - (12 + state.scores.green),
      blue: 12 - state.scores.red,
    };
  
    state.scores.red = finalScores.red;
    state.scores.green = finalScores.green;
    state.scores.blue = finalScores.blue;
  
    // 1) Először: csak HTML (template string) – IDE JS SORT NE ÍRJ!
    appEl.innerHTML = `
      <section class="card">
        <h2>Eredmény</h2>
  
        <div class="result-wrap">
          <div id="donutSlot"></div>
  
          <div class="result-side">
            <div id="colorSwatch" class="swatch"></div>
  
            <p style="margin:10px 0 6px;">
              <b>Egyedi szín:</b> <span id="hexLabel"></span>
            </p>
  
            <p style="margin:0; color:#555;">
              Piros: <span id="redPct"></span>%<br/>
              Zöld: <span id="greenPct"></span>%<br/>
              Kék: <span id="bluePct"></span>%
            </p>
          </div>
        </div>
  
        <p style="margin-top:12px;">
          <b>Pontok:</b> Piros: ${state.scores.red}, Zöld: ${state.scores.green}, Kék: ${state.scores.blue}
        </p>
  
        <div class="row">
          <button class="btn" id="restartBtn">Újraindítás</button>
        </div>
  
        <!-- Ide jön a szöveges kiértékelés -->
        <div id="descSlot"></div>
      </section>
    `; // <-- itt zárul a template string
  
    // 2) Utána: JS (SVG beszúrás + értékek kiírása)
    const share = getColorShare(state.scores);
    const donutSvg = buildDonutSvg(state.scores, 220, 36);
    document.getElementById("donutSlot").innerHTML = donutSvg;
  
    // színminta + feliratok
    document.getElementById("colorSwatch").style.background = share.mix.hex;
    document.getElementById("hexLabel").textContent = share.mix.hex;
  
    document.getElementById("redPct").textContent = share.redPct.toFixed(1);
    document.getElementById("greenPct").textContent = share.greenPct.toFixed(1);
    document.getElementById("bluePct").textContent = share.bluePct.toFixed(1);
  
    // 3) Szöveges kiértékelés (a gomb alatt)
    const evalRes = evaluateByMatrixRule(state.scores);
    document.getElementById("descSlot").innerHTML =
      buildPersonalityDescriptionHtml(evalRes, state.scores);
  
    // (debug - ha már oké, nyugodtan törölheted)
    console.log("evalRes:", evalRes);
    console.log("desc html:", buildPersonalityDescriptionHtml(evalRes, state.scores));
  
    // 4) Event listener is csak itt, a stringen kívül!
    document.getElementById("restartBtn").addEventListener("click", () => {
      state.step = "start";
      state.index = 0;
      state.scores = { red: 0, green: 0, blue: 0 };
      render();
    });
  }
  

// --- FŐ RENDER ---
function render() {
  if (typeof QUESTIONS === "undefined") {
    appEl.innerHTML = `<section class="card"><h2>Hiba</h2><p>A QUESTIONS változó nem érhető el (questions.js).</p></section>`;
    return;
  }

  if (!Array.isArray(QUESTIONS) || QUESTIONS.length < 3) {
    appEl.innerHTML = `<section class="card"><h2>Hiba</h2><p>Adj meg legalább 3 kérdést a questions.js-ben.</p></section>`;
    return;
  }

  if (state.step === "start") renderStart();
  else if (state.step === "test") renderQuestion();
  else renderResult();
}

// Indítás
render();
