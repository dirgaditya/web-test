// ===== Default class list =====
const DEFAULT_CLASSES = [
  "X.A", "X.B", "X.C", "X.D", "X.E", "X.F",
  "XI.A", "XI.B", "XI.C", "XI.D", "XI.E", "XI.F",
  "XII.A", "XII.B", "XII.C", "XII.D", "XII.E", "XII.F", "XII.G"
];

const STORAGE_KEY = "osis_lomba_classes";

// ===== Elements =====
const classInput = document.getElementById("classInput");
const classCount = document.getElementById("classCount");
const setupPanel = document.getElementById("setupPanel");
const toggleSetupBtn = document.getElementById("toggleSetup");
const saveClassesBtn = document.getElementById("saveClasses");
const resetDefaultBtn = document.getElementById("resetDefault");

const tabs = document.querySelectorAll(".tab");
const panels = {
  urutan: document.getElementById("panel-urutan"),
  pairing: document.getElementById("panel-pairing"),
};

const drawUrutanBtn = document.getElementById("drawUrutan");
const urutanResult = document.getElementById("urutanResult");
const urutanEmpty = document.getElementById("urutanEmpty");

const drawPairingBtn = document.getElementById("drawPairing");
const pairingResult = document.getElementById("pairingResult");
const pairingEmpty = document.getElementById("pairingEmpty");

// ===== Class list persistence =====
function loadClasses() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) { /* fall through to default */ }
  }
  return DEFAULT_CLASSES.slice();
}

function getClasses() {
  return classInput.value
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
}

function updateCount() {
  const n = getClasses().length;
  classCount.textContent = `${n} kelas`;
}

function initClassInput() {
  const classes = loadClasses();
  classInput.value = classes.join("\n");
  updateCount();
}

saveClassesBtn.addEventListener("click", () => {
  const classes = getClasses();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  updateCount();
  saveClassesBtn.textContent = "Tersimpan ✓";
  setTimeout(() => { saveClassesBtn.textContent = "Simpan"; }, 1400);
});

resetDefaultBtn.addEventListener("click", () => {
  classInput.value = DEFAULT_CLASSES.join("\n");
  updateCount();
});

classInput.addEventListener("input", updateCount);

// ===== Setup panel toggle =====
toggleSetupBtn.addEventListener("click", () => {
  const isOpen = setupPanel.classList.toggle("open");
  setupPanel.hidden = false;
  toggleSetupBtn.setAttribute("aria-expanded", String(isOpen));
  if (!isOpen) {
    setTimeout(() => { setupPanel.hidden = true; }, 380);
  }
});

// ===== Tabs =====
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    Object.values(panels).forEach(p => { p.classList.remove("active"); p.hidden = true; });
    const target = panels[tab.dataset.tab];
    target.hidden = false;
    target.classList.add("active");
  });
});

// ===== Fisher-Yates shuffle =====
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== Urutan Tampil =====
function drawUrutan() {
  const classes = getClasses();
  if (classes.length === 0) return;

  drawUrutanBtn.disabled = true;
  urutanEmpty.style.display = "none";
  urutanResult.innerHTML = "";

  const order = shuffle(classes);

  order.forEach((cls, i) => {
    const li = document.createElement("li");
    li.className = "order-row";
    li.style.animationDelay = `${i * 55}ms`;
    li.innerHTML = `
      <span class="order-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="order-class">${escapeHtml(cls)}</span>
    `;
    urutanResult.appendChild(li);
  });

  const totalDelay = order.length * 55 + 450;
  setTimeout(() => { drawUrutanBtn.disabled = false; }, totalDelay);
}

drawUrutanBtn.addEventListener("click", drawUrutan);

// ===== Pairing =====
function drawPairing() {
  const classes = getClasses();
  if (classes.length === 0) return;

  drawPairingBtn.disabled = true;
  pairingEmpty.style.display = "none";
  pairingResult.innerHTML = "";

  const shuffled = shuffle(classes);
  const pairs = [];
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    pairs.push([shuffled[i], shuffled[i + 1]]);
  }
  const hasBye = shuffled.length % 2 === 1;
  const byeClass = hasBye ? shuffled[shuffled.length - 1] : null;

  pairs.forEach(([a, b], i) => {
    const card = document.createElement("div");
    card.className = "pair-card";
    card.style.animationDelay = `${i * 90}ms`;
    card.innerHTML = `
      <span class="pair-side">${escapeHtml(a)}</span>
      <span class="pair-vs">VS</span>
      <span class="pair-side">${escapeHtml(b)}</span>
    `;
    pairingResult.appendChild(card);
  });

  if (hasBye) {
    const card = document.createElement("div");
    card.className = "pair-card bye";
    card.style.animationDelay = `${pairs.length * 90}ms`;
    card.innerHTML = `<span class="pair-bye-label">${escapeHtml(byeClass)} — tidak mendapat lawan (bye)</span>`;
    pairingResult.appendChild(card);
  }

  const totalDelay = (pairs.length + (hasBye ? 1 : 0)) * 90 + 460;
  setTimeout(() => { drawPairingBtn.disabled = false; }, totalDelay);
}

drawPairingBtn.addEventListener("click", drawPairing);

// ===== Utility =====
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ===== Init =====
initClassInput();
                                                       
