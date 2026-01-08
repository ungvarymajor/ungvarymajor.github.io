// Személyiségteszt - piros-kék-zöld jegyek alapján
// Megjegyzés: a részletes szöveges kiértékelést az evaluation.js adja (evaluateByMatrixRule + buildPersonalityDescriptionHtml).

const appEl = document.getElementById("app");

// --- ÁLLAPOT ---
let state = {
  step: "start", // "start" | "test" | "result"
  index: 0,
  scores: { red: 0, green: 0, blue: 0 },
};

// --- (opcionális) egyszerű eredmény típus (jelenleg nincs használatban) ---
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
  appEl.innerHTML = ` 
    <section class="card">
      <h1>Az én színem</h1> 
      <h2>"RGB-Személyiségteszt"</h2>
      <h3>avagy a 3 meghatározó komponensből (piros-zöld-kék) melyik milyen arányban jellemző rám?</h3><br>
      <p>Az emberek különbözőek, azaz különbözőképpen gondolkodnak, döntenek és reagálnak a mindennapi helyzetekben. 
      Ez a rövid, 10 kérdésből álló felmérés abban segít, hogy képet kapjon arról, mely alapvető viselkedési minták 
      jellemzőek Önre leginkább.<br>
      A kérdések egy egyszerű, gyors önértékelésre épülnek. Az eredmény nem minősítés és nem „jó” vagy „rossz” 
      kategóriákba sorol, hanem egy rövid jellemzést ad arról, hogy a három színnel / komponenssel 
      jelölt alapstruktúrák milyen arányban vannak jelen Önnél.<br>
      <br>
      A kitöltés mindössze néhány percet vesz igénybe, de segíthet abban, hogy jobban megértse saját működését, 
      erősségeit és preferenciáit a kommunikáció, az együttműködés vagy a döntéshozatal területén.<br>
      <br>
      A teszt 10 kérdésből áll.<br> Az első 7 kérdésnél rendezze sorba a válaszokat!
      <br> - Legfelülre az Önre leginkább jellemző válasz kerüljön, 
      <br> - majd a második Önre jellemző (neutrális), 
      <br>-  végül a legkevésbé jellemző választ húzza legalulra.<br>
      <br>Az utolsó 3 kérdésnél 6 válasz közül kell kiválasztani azt a 3-at, amelyik Önre a leginkább jellemző.<br>
      <br>
      Nincs 'jó' vagy 'rossz' eredmény. Ha készen áll nyomja meg a 'Kezdés' gombot!
      </p>
      <button class="btn" id="startBtn">Kezdés</button>
    </section>
  `;

  document.getElementById("startBtn").addEventListener("click", () => {
    state.step = "test";
    state.index = 0;
    state.scores = { red: 0, green: 0, blue: 0 };
    // Új kitöltésnél jelenjen meg ismét a finomhangolás modal
    try { window.sessionStorage?.removeItem("fineTuningModalShown"); } catch (_) {}
    render();
  });
}

async function loadQuestion() {

  // 8. kérdés előtt (0-index → 7)
  if (currentQuestionIndex === 7 && !fineTuningModalShown) {
    fineTuningModalShown = true;
    await showFineTuningModal();
  }

  // meglévő logika
  renderQuestion(currentQuestionIndex);
}

// --- RENDER: KÉRDÉS ---
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

  appEl.innerHTML = `
    <section class="card">
      <h2>${q.text}</h2>

      <p>${
        isTop3Mode
          ? "Válassza ki a 3 leginkább jellemző választ (húzza a Top 3 mezőbe):"
          : "Húzza a válaszokat a megfelelő helyre:"
      }</p>

      <div class="dnd-area">
        <div class="pool" data-zone="pool">
          <div class="zone-title"><span>Válaszok</span></div>
          <div class="zone-row" id="poolRow">${cardsHtml}</div>
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

        <div class="row" style="margin-top:4px;">
          <button class="btn" id="nextBtn" disabled>Következő</button>
        </div>
      </div>
    </section>
  `;

  const poolRow = document.getElementById("poolRow");
  const nextBtn = document.getElementById("nextBtn");
  const hint = document.getElementById("hint");

  const mostRow = !isTop3Mode ? document.getElementById("mostRow") : null;
  const neutralRow = !isTop3Mode ? document.getElementById("neutralRow") : null;
  const leastRow = !isTop3Mode ? document.getElementById("leastRow") : null;
  const top3Row = isTop3Mode ? document.getElementById("top3Row") : null;

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

  const updateZoneStyles = () => {
    // normál mód: a drop zónák sötétedjenek, ha van bennük elem
    if (!isTop3Mode) {
      [mostRow, neutralRow, leastRow].forEach((r) => {
        const zoneEl = r?.closest?.(".zone");
        if (!zoneEl) return;
        zoneEl.classList.toggle("filled", !!r.querySelector(".item"));
      });
      return;
    }

    // Top3: csak akkor sötétedjen, ha mind a 3 válasz bent van
    const topZone = top3Row?.closest?.(".zone");
    if (!topZone) return;
    topZone.classList.toggle("complete", top3Row.querySelectorAll(".item").length === 3);
  };

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

  // --- TOUCH: fallback (touchstart / touchmove / touchend) ---
  if (isTouchDevice()) {
    // touch eszközön a native draggable sokszor nem indul el, ezért kikapcsoljuk
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

      // "floating" elem: ujj alatt mozgatható
      el.classList.add("dragging");
      el.style.position = "fixed";
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.top}px`;
      el.style.width = `${rect.width}px`;
      el.style.zIndex = "9999";
      el.style.pointerEvents = "none";

      // mobilon különben scroll lesz belőle
      e.preventDefault();
    };

    const onTouchMove = (e) => {
      if (!touchDragEl) return;
      const t = e.touches[0];

      touchDragEl.style.left = `${t.clientX - offsetX}px`;
      touchDragEl.style.top = `${t.clientY - offsetY}px`;

      // melyik zóna alatt van az ujj?
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

      // vissza normál állapotba
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

  nextBtn.addEventListener("click", async () => {
    let choiceIndex = -1;

    if (isTop3Mode) {
      const picks = getChosenIndexesMulti(top3Row);
      if (picks.length !== 3) return;

      // bitmask
      let mask = 0;
      for (const idx of picks) mask |= 1 << idx;

      choiceIndex =
        mask in evaluationIndexRecap_multiSelect
          ? evaluationIndexRecap_multiSelect[mask]
          : -1;
    } else {
      const mostIndex = getChosenIndexSingle(mostRow);
      const neutralIndex = getChosenIndexSingle(neutralRow);
      const leastIndex = getChosenIndexSingle(leastRow);

      if (mostIndex === null || neutralIndex === null || leastIndex === null)
        return;

      if (q.answers.length === 3) {
        const key = mostIndex * 100 + neutralIndex * 10 + leastIndex;
        choiceIndex = evaluationIndexRecap_3choice[key];
      } else {
        const mask =
          (1 << mostIndex) + (1 << neutralIndex) + (1 << leastIndex);
        choiceIndex =
          mask in evaluationIndexRecap_multiSelect
            ? evaluationIndexRecap_multiSelect[mask]
            : -1;
      }
    }

    if (choiceIndex >= 0 && choiceIndex < q.evaluationRed.length) {
      state.scores.red += q.evaluationRed[choiceIndex];
      state.scores.green += q.evaluationGreen[choiceIndex];
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
  // a meglévő pontszám-logika (megtartva)
  const finalScores = {
    green: 12 + state.scores.green,
    red: 24 + state.scores.red - (12 + state.scores.green),
    blue: 12 - state.scores.red,
  };

  state.scores = finalScores;

  appEl.innerHTML = `
    <section class="card">
      <h2>Eredmény</h2>

      <div class="result-wrap">
        <div id="donutWrap" style="display:flex; justify-content:center; align-items:center;">
          <div id="donutSlot"></div>
        </div>

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

      <div class="row">
        <button class="btn" id="restartBtn">Újraindítás</button>
      </div>

      <div id="descSlot"></div>
    </section>
  `;

  // Donut + százalékok
  const share = getColorShare(state.scores);
  document.getElementById("donutSlot").innerHTML = buildDonutSvg(
    state.scores,
    220,
    36
  );

  // DONUT + FORGÁS animáció (látható, nem "villanós")
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

  // színminta + feliratok
  document.getElementById("colorSwatch").style.background = share.mix.hex;
  document.getElementById("hexLabel").textContent = share.mix.hex;

  document.getElementById("redPct").textContent = share.redPct.toFixed(1);
  document.getElementById("greenPct").textContent = share.greenPct.toFixed(1);
  document.getElementById("bluePct").textContent = share.bluePct.toFixed(1);

  // Szöveges kiértékelés
  const evalRes = evaluateByMatrixRule(state.scores);
  document.getElementById("descSlot").innerHTML =
    buildPersonalityDescriptionHtml(evalRes, state.scores);

  document.getElementById("restartBtn").addEventListener("click", () => {
    state.step = "start";
    state.index = 0;
    state.scores = { red: 0, green: 0, blue: 0 };
    // Új kitöltésnél jelenjen meg ismét a finomhangolás modal
    try { window.sessionStorage?.removeItem("fineTuningModalShown"); } catch (_) {}
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
