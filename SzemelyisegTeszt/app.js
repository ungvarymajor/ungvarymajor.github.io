// Személyiségteszt - piros-kék-zöld jegyek alapján
// Megjegyzés: a részletes szöveges kiértékelést az evaluation.js adja (evaluateByMatrixRule + buildPersonalityDescriptionHtml).

const appEl = document.getElementById("app");

// --- ÁLLAPOT ---
let state = {
  step: "start",
  index: 0,
  scores: { red: 0, green: 0, blue: 0 },

  // Kérdésenként mentjük a választ:
  // - rank mód: { mode:"rank", most, neutral, least } (indexek)
  // - top3 mód: { mode:"top3", picks:[...] } (indexek)
  responses: [],
};

// --- Egyszerű eredmény típus ---

function allowDrop(e) {
  e.preventDefault();
}

function setOver(el, on) {
  if (!el) return;
  el.classList.toggle("over", !!on);
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
  );
}

// --- RENDER: START ---
function renderStart() {
  // 1) Alap váz: csak a "helyek" vannak benne
  appEl.innerHTML = `
    <section class="card">
      <h1 id="startTitle"></h1>
      <h2 id="startSubtitle"></h2>
      <h3 id="startLead"></h3>
      <div id="startText"></div>
      <button class="btn" id="startBtn" type="button">Kezdés</button>
    </section>
  `;

  // 2) Biztonságos kitöltés (textContent)
  document.getElementById("startTitle").textContent = "Az én színem";
  document.getElementById("startSubtitle").textContent =
    '"RGB-Személyiségteszt"';
  document.getElementById("startLead").textContent =
    "avagy a 3 meghatározó komponensből (piros-zöld-kék) melyik milyen arányban jellemző rám?";

  // 3) A hosszú leíró szöveg: bekezdésekre bontva, DOM-mal felépítve
  const paragraphs = [
    "Az emberek különbözőek, azaz különbözőképpen gondolkodnak, döntenek és reagálnak a mindennapi helyzetekben. Ez a rövid, 10 kérdésből álló felmérés abban segít, hogy képet kapjon arról, mely alapvető viselkedési minták jellemzőek Önre leginkább.",
    "A kérdések egy egyszerű, gyors önértékelésre épülnek. Az eredmény nem minősítés és nem „jó” vagy „rossz” kategóriákba sorol, hanem egy rövid jellemzést ad arról, hogy a három színnel / komponenssel jelölt alapstruktúrák milyen arányban vannak jelen Önnél.",
    "A kitöltés mindössze néhány percet vesz igénybe, de segíthet abban, hogy jobban megértse saját működését, erősségeit és preferenciáit a kommunikáció, az együttműködés vagy a döntéshozatal területén.",
    "A teszt 10 kérdésből áll. Az első 7 kérdésnél rendezze sorba a válaszokat:",
  ];

  const bullets = [
    "Legfelülre az Önre leginkább jellemző válasz kerüljön,",
    "majd a második Önre jellemző (neutrális),",
    "végül a legkevésbé jellemző választ húzza legalulra.",
  ];

  const tailParagraphs = [
    "Az utolsó 3 kérdésnél 6 válasz közül kell kiválasztani azt a 3-at, amelyik Önre a leginkább jellemző.",
    "Nincs „jó” vagy „rossz” eredmény. Ha készen áll, nyomja meg a „Kezdés” gombot!",
  ];

  const textHost = document.getElementById("startText");

  // bekezdések
  paragraphs.forEach((txt) => {
    const p = document.createElement("p");
    p.textContent = txt;
    textHost.appendChild(p);
  });

  // felsorolás
  const ul = document.createElement("ul");
  bullets.forEach((txt) => {
    const li = document.createElement("li");
    li.textContent = txt;
    ul.appendChild(li);
  });
  textHost.appendChild(ul);

  // záró bekezdések
  tailParagraphs.forEach((txt) => {
    const p = document.createElement("p");
    p.textContent = txt;
    textHost.appendChild(p);
  });

  // 4) Start gomb eseménykezelő (változatlan logika)
  document.getElementById("startBtn").addEventListener("click", () => {
    state.step = "test";
    state.index = 0;
    state.scores = { red: 0, green: 0, blue: 0 };
    state.responses = Array(QUESTIONS.length).fill(null);

    // Új kitöltésnél jelenjen meg ismét a finomhangolás modal
    try {
      window.sessionStorage?.removeItem("fineTuningModalShown");
    } catch (_) { }

    render();
  });
}

function addScoreByChoiceIndex(q, choiceIndex) {
  // Szándék: ha nincs lefedve a kombináció, akkor 0,0 pont jár.
  if (choiceIndex == null || choiceIndex < 0) return;

  if (choiceIndex >= q.evaluationRed.length) return;

  state.scores.red += q.evaluationRed[choiceIndex] ?? 0;
  state.scores.green += q.evaluationGreen[choiceIndex] ?? 0;
}

function getChoiceIndexFromResponse(q, response) {
  if (!response) return -1;

  // TOP3 mód
  if (response.mode === "top3") {
    const picks = response.picks || [];
    if (picks.length !== 3) return -1;

    let mask = 0;
    for (const idx of picks) mask |= 1 << idx;

    return mask in evaluationIndexRecap_multiSelect
      ? evaluationIndexRecap_multiSelect[mask]
      : -1; // szándék: nincs lefedve => 0,0 pont
  }

  // RANK mód (most/neutral/least)
  if (response.mode === "rank") {
    const { most, neutral, least } = response;
    if (most == null || neutral == null || least == null) return -1;

    if (q.answers.length === 3) {
      const key = most * 100 + neutral * 10 + least;
      return evaluationIndexRecap_3choice[key] ?? -1;
    } else {
      const mask = (1 << most) + (1 << neutral) + (1 << least);
      return mask in evaluationIndexRecap_multiSelect
        ? evaluationIndexRecap_multiSelect[mask]
        : -1;
    }
  }

  return -1;
}

function deltaFromChoiceIndex(q, choiceIndex) {
  // Szándék: ha nincs lefedve => 0,0 pont
  if (choiceIndex == null || choiceIndex < 0) return { red: 0, green: 0 };
  if (choiceIndex >= q.evaluationRed.length) return { red: 0, green: 0 };

  return {
    red: q.evaluationRed[choiceIndex] ?? 0,
    green: q.evaluationGreen[choiceIndex] ?? 0,
  };
}

function recomputeScoresFromResponses() {
  // Újraszámoljuk a nyers (teszt közbeni) red/green értékeket
  let red = 0;
  let green = 0;

  for (let i = 0; i < state.responses.length; i++) {
    const response = state.responses[i];
    if (!response) continue;

    const q = QUESTIONS[i];
    const idx = getChoiceIndexFromResponse(q, response);
    const d = deltaFromChoiceIndex(q, idx);

    red += d.red;
    green += d.green;
  }

  state.scores.red = red;
  state.scores.green = green;
  state.scores.blue = 0; // blue-t továbbra is az eredményben vezeted le
}

// --- RENDER: KÉRDÉS ---
function renderQuestion() {
  console.log("NEW renderQuestion fut ✅");
  const q = QUESTIONS[state.index];

  // 8-9-10. kérdés (1-based): index 7,8,9 (0-based)
  const isTop3Mode = state.index >= 7 && state.index <= 9;

  // --- UI váz (NINCS nyers szöveg injection: címet textContent-tel töltjük) ---
  appEl.innerHTML = `
    <section class="card">
      <h2 id="qTitle"></h2>

      <p id="qHint"></p>

      <div class="dnd-area">
        <div class="pool" data-zone="pool">
          <div class="zone-title"><span>Válaszok</span></div>
          <div class="zone-row" id="poolRow"></div>
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
                <div class="zone-title"><span>Leginkább jellemző</span></div>
                <div class="zone-row" id="mostRow"><p class="drop-hint">Húzza ide a válaszát.</p></div>
              </div>

              <div class="zone" data-zone="neutral">
                <div class="zone-title"><span>Neutrális</span></div>
                <div class="zone-row" id="neutralRow"><p class="drop-hint">Húzza ide a válaszát.</p></div>
              </div>

              <div class="zone" data-zone="least">
                <div class="zone-title"><span>Legkevésbé jellemző</span></div>
                <div class="zone-row" id="leastRow"><p class="drop-hint">Húzza ide a válaszát.</p></div>
              </div>
            `
        }

        <p id="hint" style="color:#b00020; display:none; margin:0;"></p>

        <div class="row" style="margin-top:4px; display:flex; gap:10px;">
          <button class="btn" id="backBtn" type="button">Vissza</button>
          <button class="btn" id="nextBtn" type="button" disabled>Következő</button>
        </div>
      </div>
    </section>
  `;

  // --- statikus szövegek biztonságosan ---
  const qTitleEl = document.getElementById("qTitle");
  if (qTitleEl) qTitleEl.textContent = q.text;

  const qHintEl = document.getElementById("qHint");
  if (qHintEl) {
    qHintEl.textContent = isTop3Mode
      ? "Válassza ki a 3 leginkább jellemző választ (húzza a Top 3 mezőbe):"
      : "Húzza a válaszokat a megfelelő helyre:";
  }

  const poolRow = document.getElementById("poolRow");
  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");
  const hint = document.getElementById("hint");

  backBtn.disabled = state.index === 0;

  const mostRow = !isTop3Mode ? document.getElementById("mostRow") : null;
  const neutralRow = !isTop3Mode ? document.getElementById("neutralRow") : null;
  const leastRow = !isTop3Mode ? document.getElementById("leastRow") : null;
  const top3Row = isTop3Mode ? document.getElementById("top3Row") : null;

  // --- Kártyák létrehozása DOM-mal (XSS-safe) ---
  q.answers.forEach((a, i) => {
    const item = document.createElement("div");
    item.className = "item";
    item.draggable = true;
    item.dataset.ans = String(i);
    item.textContent = a.text;
    poolRow.appendChild(item);
  });

  // drag state
  let draggingEl = null;

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

  const getRowByZone = (zone) => {
    if (zone === "pool") return poolRow;
    if (zone === "top3") return top3Row;
    if (zone === "most") return mostRow;
    if (zone === "neutral") return neutralRow;
    return leastRow;
  };

  const updateZoneStyles = () => {
    if (!isTop3Mode) {
      [mostRow, neutralRow, leastRow].forEach((r) => {
        const zoneEl = r?.closest?.(".zone");
        if (!zoneEl) return;
        zoneEl.classList.toggle("filled", !!r.querySelector(".item"));
      });
      return;
    }
    const topZone = top3Row?.closest?.(".zone");
    if (!topZone) return;
    topZone.classList.toggle(
      "complete",
      top3Row.querySelectorAll(".item").length === 3
    );
  };

  const moveItemToZone = (zone, itemEl) => {
    const row = getRowByZone(zone);
    if (!row || !itemEl) return;

    // Top3 mód: max 3 elem
    if (isTop3Mode && zone === "top3") {
      const currentItems = row.querySelectorAll(".item");
      if (currentItems.length >= 3) {
        hint.textContent = "A Top 3 mezőbe maximum 3 választ tehet.";
        hint.style.display = "block";
        poolRow.appendChild(itemEl);
        validate();
        return;
      }
    }

    // Normál mód: zónánként max 1 elem (csere a pool-ba)
    if (!isTop3Mode && zone !== "pool") {
      const existing = row.querySelector(".item");
      if (existing) poolRow.appendChild(existing);
    }

    row.querySelector(".drop-hint")?.remove();
    row.appendChild(itemEl);
    updateZoneStyles();
    validate();
  };

  // --- Mentett válasz visszatöltése (hogy visszalépésnél látszódjon) ---
  const saved = state.responses?.[state.index];
  if (saved) {
    if (saved.mode === "top3" && isTop3Mode) {
      (saved.picks || []).forEach((ansIdx) => {
        const el = poolRow.querySelector(`.item[data-ans="${ansIdx}"]`);
        if (el) moveItemToZone("top3", el);
      });
    }

    if (saved.mode === "rank" && !isTop3Mode) {
      const zones = [
        ["most", saved.most],
        ["neutral", saved.neutral],
        ["least", saved.least],
      ];

      zones.forEach(([zone, ansIdx]) => {
        if (ansIdx == null) return;
        const el = poolRow.querySelector(`.item[data-ans="${ansIdx}"]`);
        if (el) moveItemToZone(zone, el);
      });
    }
  }

  // --- EGÉR: HTML5 Drag&Drop ---
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

  dropTargets.forEach((target) => {
    target.addEventListener("dragover", allowDrop);
    target.addEventListener("dragenter", () => setOver(target, true));
    target.addEventListener("dragleave", () => setOver(target, false));
    target.addEventListener("drop", (e) => {
      e.preventDefault();
      setOver(target, false);
      if (!draggingEl) return;
      moveItemToZone(target.dataset.zone, draggingEl);
    });
  });

  // --- TOUCH: fallback ---
  if (isTouchDevice()) {
    appEl.querySelectorAll(".item").forEach((el) => (el.draggable = false));

    let touchDragEl = null;
    let offsetX = 0;
    let offsetY = 0;

    const clearOver = () => dropTargets.forEach((t) => setOver(t, false));

    const onTouchStart = (e) => {
      const el = e.currentTarget;
      touchDragEl = el;

      const t = e.touches[0];
      const rect = el.getBoundingClientRect();
      offsetX = t.clientX - rect.left;
      offsetY = t.clientY - rect.top;

      el.classList.add("dragging");
      el.style.position = "fixed";
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.top}px`;
      el.style.width = `${rect.width}px`;
      el.style.zIndex = "9999";
      el.style.pointerEvents = "none";

      e.preventDefault();
    };

    const onTouchMove = (e) => {
      if (!touchDragEl) return;
      const t = e.touches[0];

      touchDragEl.style.left = `${t.clientX - offsetX}px`;
      touchDragEl.style.top = `${t.clientY - offsetY}px`;

      clearOver();
      const under = document.elementFromPoint(t.clientX, t.clientY);
      const zoneEl = under?.closest?.("[data-zone]");
      if (zoneEl) setOver(zoneEl, true);

      e.preventDefault();
    };

    const onTouchEnd = (e) => {
      if (!touchDragEl) return;

      clearOver();

      const t = e.changedTouches[0];
      const under = document.elementFromPoint(t.clientX, t.clientY);
      const zoneEl = under?.closest?.("[data-zone]");
      const zone = zoneEl?.dataset?.zone || "pool";

      touchDragEl.classList.remove("dragging");
      touchDragEl.style.position = "";
      touchDragEl.style.left = "";
      touchDragEl.style.top = "";
      touchDragEl.style.width = "";
      touchDragEl.style.zIndex = "";
      touchDragEl.style.pointerEvents = "";

      moveItemToZone(zone, touchDragEl);

      touchDragEl = null;
      e.preventDefault();
    };

    appEl.querySelectorAll(".item").forEach((el) => {
      el.addEventListener("touchstart", onTouchStart, { passive: false });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd, { passive: false });
      el.addEventListener("touchcancel", onTouchEnd, { passive: false });
    });
  }

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
    updateZoneStyles();

    if (isTop3Mode) {
      const picks = getChosenIndexesMulti(top3Row);
      nextBtn.disabled = picks.length !== 3;
      return;
    }

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

  function saveCurrentResponse() {
    if (!state.responses || !Array.isArray(state.responses)) {
      state.responses = Array(QUESTIONS.length).fill(null);
    }

    if (isTop3Mode) {
      const picks = getChosenIndexesMulti(top3Row);
      state.responses[state.index] = { mode: "top3", picks };
      return;
    }

    const most = getChosenIndexSingle(mostRow);
    const neutral = getChosenIndexSingle(neutralRow);
    const least = getChosenIndexSingle(leastRow);

    state.responses[state.index] = { mode: "rank", most, neutral, least };
  }

  // --- Vissza ---
  backBtn.addEventListener("click", () => {
    saveCurrentResponse();
    recomputeScoresFromResponses();

    if (state.index > 0) {
      state.index -= 1;
      render();
    }
  });

  // --- Következő ---
  nextBtn.addEventListener("click", async () => {
    // a validate() miatt elvileg csak kész választással lehet kattintani
    saveCurrentResponse();
    recomputeScoresFromResponses();

    if (state.index < QUESTIONS.length - 1) {
      state.index += 1;

      // Finomhangolás modal a 8. kérdés (index 7) előtt
      if (typeof maybeShowFineTuningModalByIndex === "function") {
        await maybeShowFineTuningModalByIndex(state.index);
      }

      render();
    } else {
      state.step = "result";
      render();
    }
  });

  validate();
}

    if (state.index < QUESTIONS.length - 1) {
      state.index += 1;
      // Finomhangolás modal a 8. kérdés (index 7) előtt
      if (typeof maybeShowFineTuningModalByIndex === "function") {
        await maybeShowFineTuningModalByIndex(state.index);
      }

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
  // 1) pontszám-logika (megtartva)
  const finalScores = {
    green: 12 + state.scores.green,
    red: 24 + state.scores.red - (12 + state.scores.green),
    blue: 12 - state.scores.red,
  };

  state.scores = finalScores;

  // 2) váz HTML: csak "slotok" és elemek
  appEl.innerHTML = `
    <section class="card">
      <h2 id="resultTitle"></h2>

      <div class="result-wrap">
        <div id="donutWrap" style="display:flex; justify-content:center; align-items:center;">
          <div id="donutSlot"></div>
        </div>

        <div class="result-side">
          <div id="colorSwatch" class="swatch"></div>

          <p style="margin:10px 0 6px;">
            <b id="uniqueColorLabel"></b> <span id="hexLabel"></span>
          </p>

          <p style="margin:0; color:#555;">
            <span id="redLine"></span><br/>
            <span id="greenLine"></span><br/>
            <span id="blueLine"></span>
          </p>
        </div>
      </div>

      <div class="row">
        <button class="btn" id="restartBtn" type="button"></button>
      </div>

      <div id="descSlot"></div>
    </section>
  `;

  // 3) statikus feliratok (textContent)
  document.getElementById("resultTitle").textContent = "Eredmény";
  document.getElementById("uniqueColorLabel").textContent = "Egyedi szín:";
  document.getElementById("restartBtn").textContent = "Újraindítás";

  // 4) Donut + százalékok
  const share = getColorShare(state.scores);

  // Donut SVG -> markup string, marad innerHTML
  document.getElementById("donutSlot").innerHTML = buildDonutSvg(
    state.scores,
    220,
    36
  );

  // animáció (megtartva)
  const donutWrap = document.getElementById("donutWrap");
  if (donutWrap?.animate) {
    donutWrap.animate(
      [
        { transform: "rotate(0deg) scale(0.98)" },
        { transform: "rotate(720deg) scale(1.02)" },
        { transform: "rotate(1440deg) scale(1)" },
      ],
      { duration: 2800, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
    );
  }

  // 5) Színminta + szövegek (textContent)
  const swatchEl = document.getElementById("colorSwatch");
  const hexLabelEl = document.getElementById("hexLabel");

  swatchEl.style.background = share.mix.hex;
  hexLabelEl.textContent = share.mix.hex;

  // százalék sorok (textContent, így nincs HTML-inject)
  document.getElementById(
    "redLine"
  ).textContent = `Piros: ${share.redPct.toFixed(1)}%`;
  document.getElementById(
    "greenLine"
  ).textContent = `Zöld: ${share.greenPct.toFixed(1)}%`;
  document.getElementById(
    "blueLine"
  ).textContent = `Kék: ${share.bluePct.toFixed(1)}%`;

  // 6) Szöveges kiértékelés
  // Ez HTML stringet ad vissza, ezért marad innerHTML
  const evalRes = evaluateByMatrixRule(state.scores);
  document.getElementById("descSlot").innerHTML =
    buildPersonalityDescriptionHtml(evalRes, state.scores);

  // 7) Újraindítás
  document.getElementById("restartBtn").addEventListener("click", () => {
    state.step = "start";
    state.index = 0;
    state.scores = { red: 0, green: 0, blue: 0 };
    state.responses = Array(QUESTIONS.length).fill(null);

    // Új kitöltésnél jelenjen meg ismét a finomhangolás modal
    try {
      window.sessionStorage?.removeItem("fineTuningModalShown");
    } catch (_) { }

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

render();
