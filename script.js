/* ==========================================================================
   1. CONFIGURATION DES CODES & PROGRESSION (LOCALSTORAGE)
   ========================================================================== */
const STORAGE_KEY = "shiraz_riddles_progress_v1";

const CODES = {
  gate: "151017",
  1: "101010",
  2: "802455",
  3: "303030"
};

const REACTION_IMAGES = {
  oui: ["Oui1.png", "Oui2.png", "Oui3.png"],
  non: ["Non1.png", "Non2.png", "Non3.png"]
};

const FUNNY_ERRORS = [
  "Oups, pas tout à fait ! Essaie encore 🙈",
  "Presque... mais le cadenas reste fermé ! 💭",
  "Regarde les indices ou teste un autre ordre 👀",
  "Toujours pas ! Tu vas y arriver Shiraz 💖"
];

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object") {
      return {
        gateUnlocked: Boolean(saved.gateUnlocked),
        solved: {
          1: Boolean(saved.solved && saved.solved[1]),
          2: Boolean(saved.solved && saved.solved[2]),
          3: Boolean(saved.solved && saved.solved[3])
        }
      };
    }
  } catch (e) {
    // Fallback silencieux si localStorage est bloqué
  }
  return {
    gateUnlocked: false,
    solved: { 1: false, 2: false, 3: false }
  };
}

function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Fallback silencieux
  }
}

/* ==========================================================================
   2. CŒURS FLOTTANTS EN DIAGONALE EN ARRIÈRE-PLAN
   ========================================================================== */
function initFloatingHearts() {
  const layer = document.getElementById("hearts-layer");
  if (!layer) return;

  const palette = ["#f9a8d4", "#fda4af", "#f472b6", "#fbcfe8", "#e9d5ff", "#fecdd3"];
  const heartCount = 28;
  const svgTemplate = `
    <svg viewBox="0 0 32 32" fill="currentColor" width="100%" height="100%">
      <path d="M16 28.5C16 28.5 3.5 20.2 3.5 11.4C3.5 7.4 6.6 4.3 10.5 4.3C12.8 4.3 14.9 5.4 16 7.2C17.1 5.4 19.2 4.3 21.5 4.3C25.4 4.3 28.5 7.4 28.5 11.4C28.5 20.2 16 28.5 16 28.5Z"/>
    </svg>
  `;

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = svgTemplate;

    const size = Math.round(14 + Math.random() * 24);
    const startX = (-25 + Math.random() * 120).toFixed(1) + "vw";
    const driftX = (32 + Math.random() * 30).toFixed(1) + "vw";
    const sway = (Math.random() > 0.5 ? 1 : -1) * Math.round(10 + Math.random() * 18) + "px";
    const duration = (12 + Math.random() * 11).toFixed(1) + "s";
    const delay = (-Math.random() * 22).toFixed(1) + "s";
    const maxOpacity = (0.28 + Math.random() * 0.34).toFixed(2);
    const color = palette[i % palette.length];

    heart.style.setProperty("--size", `${size}px`);
    heart.style.setProperty("--start-x", startX);
    heart.style.setProperty("--drift-x", driftX);
    heart.style.setProperty("--sway", sway);
    heart.style.setProperty("--duration", duration);
    heart.style.setProperty("--delay", delay);
    heart.style.setProperty("--max-opacity", maxOpacity);
    heart.style.setProperty("--heart-color", color);
    heart.style.setProperty("--rot-start", `${Math.round(-18 + Math.random() * 12)}deg`);
    heart.style.setProperty("--rot-mid", `${Math.round(6 + Math.random() * 14)}deg`);
    heart.style.setProperty("--rot-end", `${Math.round(-14 + Math.random() * 16)}deg`);

    layer.appendChild(heart);
  }
}

/* ==========================================================================
   3. ANIMATIONS : RÉACTION PNG EN BAS DE L'ÉCRAN & CÉLÉBRATION EMOJIS
   ========================================================================== */
let reactionTimer = null;

function showReaction(type) {
  const reactionPop = document.getElementById("reaction-pop");
  const reactionImg = document.getElementById("reaction-img");
  const list = REACTION_IMAGES[type];

  if (!list || !list.length || !reactionPop || !reactionImg) return;

  const chosen = list[Math.floor(Math.random() * list.length)];
  reactionImg.src = chosen;
  reactionImg.alt = chosen;

  reactionImg.onerror = () => {
    const bg = type === "oui" ? "fce7f3" : "ffe4e6";
    const fg = type === "oui" ? "be185d" : "e11d48";
    reactionImg.onerror = null;
    reactionImg.src = `https://placehold.co/220x250/${bg}/${fg}?text=${encodeURIComponent(chosen)}`;
  };

  reactionPop.classList.remove("show");
  void reactionPop.offsetWidth;
  reactionPop.classList.add("show");

  clearTimeout(reactionTimer);
  reactionTimer = setTimeout(() => {
    reactionPop.classList.remove("show");
  }, 2100);
}

function spawnCelebration() {
  const emojis = ["💖", "✨", "🌸", "💫", "💕"];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement("span");
    el.className = "confetti-piece";
    el.textContent = emojis[i % emojis.length];
    el.style.left = "50%";
    el.style.top = "45%";

    const angle = (Math.PI * 2 * i) / 24;
    const distance = 90 + Math.random() * 140;
    const tx = Math.cos(angle) * distance + "px";
    const ty = Math.sin(angle) * distance - 40 + "px";
    const rot = (Math.random() * 360 - 180) + "deg";

    el.style.setProperty("--tx", tx);
    el.style.setProperty("--ty", ty);
    el.style.setProperty("--rot", rot);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1650);
  }
}

function spawnHeartExplosion() {
  const hearts = ["💖", "❤️", "💕", "💗", "💓", "💘"];
  for (let i = 0; i < 36; i++) {
    const el = document.createElement("span");
    el.className = "confetti-piece";
    el.textContent = hearts[i % hearts.length];
    el.style.left = "50%";
    el.style.top = "50%";
    el.style.fontSize = `${(1.1 + Math.random() * 0.9).toFixed(2)}rem`;

    const angle = (Math.PI * 2 * i) / 36 + (Math.random() * 0.2 - 0.1);
    const distance = 70 + Math.random() * 190;
    const tx = Math.cos(angle) * distance + "px";
    const ty = Math.sin(angle) * distance - 30 + "px";
    const rot = (Math.random() * 360 - 180) + "deg";

    el.style.setProperty("--tx", tx);
    el.style.setProperty("--ty", ty);
    el.style.setProperty("--rot", rot);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1650);
  }
}

/* ==========================================================================
   4. CONTRÔLEUR DU DIGICODE (UTILISÉ SUR INDEX.HTML ET ENIGME2/3.HTML)
   ========================================================================== */
function setupDigicode({ expectedCode, onSuccess, customErrorFn }) {
  const inputsContainer = document.getElementById("code-inputs");
  const digitBoxes = Array.from(document.querySelectorAll(".digit-box"));
  const feedbackMsg = document.getElementById("feedback-msg");
  const unlockBtn = document.getElementById("unlock-btn");
  const clearBtn = document.getElementById("clear-btn");
  const backBtn = document.getElementById("back-btn");
  const numButtons = document.querySelectorAll(".num-btn[data-num]");

  if (!inputsContainer || digitBoxes.length === 0) return;

  let errorCount = 0;

  function getEnteredCode() {
    return digitBoxes.map((b) => b.value).join("");
  }

  function updateFilledStyles() {
    digitBoxes.forEach((b) => {
      b.classList.toggle("filled", b.value !== "");
    });
  }

  function resetInputs(shouldFocus = true) {
    digitBoxes.forEach((b) => {
      b.value = "";
      b.classList.remove("filled");
    });
    if (shouldFocus && digitBoxes[0]) {
      digitBoxes[0].focus();
    }
  }

  function triggerShake() {
    inputsContainer.classList.remove("shake");
    void inputsContainer.offsetWidth;
    inputsContainer.classList.add("shake");
  }

  function checkCode() {
    const code = getEnteredCode();

    if (code.length < 6) {
      feedbackMsg.style.color = "#e11d48";
      feedbackMsg.textContent = "Il manque encore quelques chiffres ! ✨";
      triggerShake();
      return;
    }

    if (code === expectedCode) {
      feedbackMsg.style.color = "#059669";
      feedbackMsg.textContent = "Code valide ! ✨";
      showReaction("oui");
      spawnCelebration();
      onSuccess();
    } else {
      feedbackMsg.style.color = "#e11d48";
      feedbackMsg.textContent = customErrorFn
        ? customErrorFn(code, errorCount)
        : FUNNY_ERRORS[errorCount % FUNNY_ERRORS.length];
      errorCount++;
      showReaction("non");
      triggerShake();
      setTimeout(() => resetInputs(true), 550);
    }
  }

  digitBoxes.forEach((box, idx) => {
    box.addEventListener("input", (e) => {
      const cleanVal = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = cleanVal.slice(0, 1);
      updateFilledStyles();
      feedbackMsg.textContent = "";

      if (e.target.value && idx < digitBoxes.length - 1) {
        digitBoxes[idx + 1].focus();
      }
      if (getEnteredCode().length === 6) {
        checkCode();
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && idx > 0) {
        digitBoxes[idx - 1].focus();
        digitBoxes[idx - 1].value = "";
        updateFilledStyles();
      } else if (e.key === "ArrowLeft" && idx > 0) {
        digitBoxes[idx - 1].focus();
      } else if (e.key === "ArrowRight" && idx < digitBoxes.length - 1) {
        digitBoxes[idx + 1].focus();
      } else if (e.key === "Enter") {
        checkCode();
      }
    });

    box.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/[^0-9]/g, "")
        .slice(0, 6);

      pasted.split("").forEach((char, i) => {
        if (digitBoxes[i]) digitBoxes[i].value = char;
      });

      updateFilledStyles();
      const nextEmpty = digitBoxes.findIndex((b) => !b.value);
      if (nextEmpty !== -1) {
        digitBoxes[nextEmpty].focus();
      } else {
        digitBoxes[5].focus();
        checkCode();
      }
    });
  });

  numButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const num = btn.getAttribute("data-num");
      const emptyBox = digitBoxes.find((b) => !b.value);
      if (emptyBox) {
        emptyBox.value = num;
        updateFilledStyles();
        feedbackMsg.textContent = "";

        const nextEmpty = digitBoxes.find((b) => !b.value);
        if (nextEmpty) {
          nextEmpty.focus();
        } else {
          checkCode();
        }
      }
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      resetInputs(true);
      feedbackMsg.textContent = "";
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      for (let i = digitBoxes.length - 1; i >= 0; i--) {
        if (digitBoxes[i].value) {
          digitBoxes[i].value = "";
          digitBoxes[i].focus();
          break;
        }
      }
      updateFilledStyles();
      feedbackMsg.textContent = "";
    });
  }

  if (unlockBtn) {
    unlockBtn.addEventListener("click", checkCode);
  }

  return { resetInputs };
}

/* ==========================================================================
   4B. CONTRÔLEUR DU QUIZ ÉNIGME 1 (3 QUESTIONS)
   ========================================================================== */
function setupRiddle1Quiz({ onComplete }) {
  const stepBadge = document.getElementById("quiz-step-badge");
  const photoFrame = document.getElementById("quiz-photo-frame");
  const photoEl = document.getElementById("quiz-photo");
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const feedbackEl = document.getElementById("quiz-feedback");

  if (!optionsEl || !questionEl) return;

  let currentStep = 0;
  let isTransitioning = false;

  const questions = [
    {
      photo: "kiss.jpg",
      question: "C'était quand ce moment ? 💋",
      options: [
        { label: "4 août 2024", correct: false },
        { label: "7 août 2024", correct: true },
        { label: "11 août 2024", correct: false },
        { label: "15 août 2024", correct: false }
      ],
      onSelect: (btn, opt, allBtns) => {
        if (opt.correct) {
          isTransitioning = true;
          allBtns.forEach((b) => (b.disabled = true));
          btn.classList.add("correct");
          feedbackEl.style.color = "#059669";
          feedbackEl.textContent = "Ouiii ! Le 7 août 2024 💖";
          showReaction("oui");
          setTimeout(() => {
            currentStep++;
            isTransitioning = false;
            renderStep();
          }, 1350);
        } else {
          btn.classList.add("wrong");
          btn.classList.remove("shake");
          void btn.offsetWidth;
          btn.classList.add("shake");
          feedbackEl.style.color = "#e11d48";
          feedbackEl.textContent = "Oups non, essaie une autre date ! 🙈";
          showReaction("non");
        }
      }
    },
    {
      photo: null,
      question: "Qu'est-ce que j'aime le plus chez toi ? 🥰",
      options: [
        { label: "Ton corps", correct: true },
        { label: "Ton mental", correct: true },
        { label: "Ton âme", correct: true }
      ],
      onSelect: (btn, _opt, allBtns) => {
        isTransitioning = true;
        allBtns.forEach((b) => (b.disabled = true));
        btn.classList.add("correct");
        feedbackEl.style.color = "#059669";
        feedbackEl.textContent = "Tout est juste, j'aime tout chez toi ! 💖";
        spawnHeartExplosion();
        showReaction("oui");
        setTimeout(() => {
          currentStep++;
          isTransitioning = false;
          renderStep();
        }, 1600);
      }
    },
    {
      photo: "Shiscream.jpg",
      question: "Qu'est-ce qui fait le plus peur à Shiraz ? 😱",
      options: [
        { id: "tsunami", label: "Tsunami" },
        { id: "noir", label: "Le noir" },
        { id: "serpents", label: "Les serpents" }
      ],
      onSelect: (btn, opt, allBtns) => {
        if (opt.id === "tsunami") {
          isTransitioning = true;
          allBtns.forEach((b) => (b.disabled = true));

          photoEl.src = "Oui2.jpg";
          photoEl.onerror = () => {
            photoEl.onerror = null;
            photoEl.src = "https://placehold.co/400x240/fce7f3/be185d?text=Oui2.jpg";
          };
          photoFrame.classList.remove("pop-photo");
          void photoFrame.offsetWidth;
          photoFrame.classList.add("pop-photo");

          btn.textContent = "Léo 😌";
          btn.classList.add("troll-leo");

          const noirBtn = allBtns.find((b) => b.dataset.optId === "noir");
          if (noirBtn) {
            noirBtn.textContent = "Tsunami";
          }

          feedbackEl.style.color = "#059669";
          feedbackEl.textContent = "Haha bien avoué, c'est Léo ! 😂💖";
          spawnHeartExplosion();
          showReaction("oui");

          setTimeout(() => {
            onComplete();
          }, 1900);
        } else {
          btn.classList.add("wrong");
          btn.classList.remove("shake");
          void btn.offsetWidth;
          btn.classList.add("shake");
          feedbackEl.style.color = "#e11d48";
          feedbackEl.textContent = "Même pas vrai ! Cherche encore 👀";
          showReaction("non");
        }
      }
    }
  ];

  function renderStep() {
    const q = questions[currentStep];
    if (!q) return;

    stepBadge.textContent = `Question ${currentStep + 1} / ${questions.length}`;
    questionEl.textContent = q.question;
    feedbackEl.textContent = "";

    if (q.photo) {
      photoFrame.classList.remove("hidden");
      photoEl.src = q.photo;
      photoEl.onerror = () => {
        photoEl.onerror = null;
        photoEl.src = `https://placehold.co/400x240/fce7f3/be185d?text=${encodeURIComponent(q.photo)}`;
      };
      photoFrame.classList.remove("pop-photo");
      void photoFrame.offsetWidth;
      photoFrame.classList.add("pop-photo");
    } else {
      photoFrame.classList.add("hidden");
    }

    optionsEl.innerHTML = "";
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option-btn";
      btn.textContent = opt.label;
      if (opt.id) btn.dataset.optId = opt.id;

      btn.addEventListener("click", () => {
        if (isTransitioning) return;
        const allBtns = Array.from(optionsEl.querySelectorAll(".quiz-option-btn"));
        q.onSelect(btn, opt, allBtns);
      });

      optionsEl.appendChild(btn);
    });
  }

  renderStep();
}

/* ==========================================================================
   4C. CONTRÔLEUR DES INDICES ÉNIGME 2 (6 INDICES, 1 TOUTES LES 60 SECONDES)
   ========================================================================== */
function setupRiddle2Hints() {
  const hintBtn = document.getElementById("hint-reveal-btn");
  const hintsList = document.getElementById("hints-list");
  if (!hintBtn || !hintsList) return;

  const hints = [
    { paper: "Papier 1 • Indice 1", text: "Électricité ⚡" },
    { paper: "Papier 2 • Indice 1", text: "Placard sucré 🍬" },
    { paper: "Papier 3 • Indice 1", text: "Tu l'avais perdu 🔍" },
    { paper: "Papier 1 • Indice 2", text: "Porte d'entrée 🚪" },
    { paper: "Papier 2 • Indice 2", text: "Plafond ⬆️" },
    { paper: "Papier 3 • Indice 2", text: "Saison 3 Été 2025 Prime 🎬" }
  ];

  let revealedCount = 0;
  let cooldownRemaining = 0;
  let intervalId = null;

  function updateButtonLabel() {
    if (revealedCount >= hints.length) {
      hintBtn.disabled = true;
      hintBtn.textContent = "✅ Tous les indices débloqués (6 / 6)";
      return;
    }

    if (cooldownRemaining > 0) {
      hintBtn.disabled = true;
      hintBtn.textContent = `⏳ Prochain indice dans ${cooldownRemaining}s (${revealedCount} / 6)`;
    } else {
      hintBtn.disabled = false;
      hintBtn.textContent = `💡 Débloquer l'indice ${revealedCount + 1} / 6`;
    }
  }

  function startCooldown() {
    cooldownRemaining = 60;
    updateButtonLabel();

    clearInterval(intervalId);
    intervalId = setInterval(() => {
      cooldownRemaining--;
      if (cooldownRemaining <= 0) {
        cooldownRemaining = 0;
        clearInterval(intervalId);
      }
      updateButtonLabel();
    }, 1000);
  }

  hintBtn.addEventListener("click", () => {
    if (cooldownRemaining > 0 || revealedCount >= hints.length) return;

    const currentHint = hints[revealedCount];
    const item = document.createElement("div");
    item.className = "hint-card-item";
    item.innerHTML = `
      <span class="hint-paper-tag">${currentHint.paper}</span>
      <span class="hint-text-val">${currentHint.text}</span>
    `;
    hintsList.appendChild(item);

    revealedCount++;

    if (revealedCount < hints.length) {
      startCooldown();
    } else {
      updateButtonLabel();
    }
  });

  updateButtonLabel();
}

/* ==========================================================================
   5. INITIALISATION SPÉCIFIQUE À CHAQUE PAGE HTML
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initFloatingHearts();

  const page = document.body.getAttribute("data-page");
  const state = loadProgress();

  // --- PAGE 1 : INDEX.HTML (Menu d'accueil + Digicode d'entrée) ---
  if (page === "index") {
    const mainMenu = document.getElementById("main-menu");
    const lockScreen = document.getElementById("lock-screen");
    const startBtn = document.getElementById("start-btn");
    const backToWelcomeBtn = document.getElementById("back-to-welcome-btn");

    const digicode = setupDigicode({
      expectedCode: CODES.gate,
      onSuccess: () => {
        state.gateUnlocked = true;
        saveProgress(state);
        setTimeout(() => {
          window.location.href = "menu.html";
        }, 1250);
      }
    });

    startBtn.addEventListener("click", () => {
      if (state.gateUnlocked) {
        window.location.href = "menu.html";
        return;
      }
      mainMenu.classList.add("hidden");
      lockScreen.classList.remove("hidden");
      lockScreen.classList.add("card-enter");
      if (digicode) digicode.resetInputs(true);
    });

    backToWelcomeBtn.addEventListener("click", () => {
      lockScreen.classList.add("hidden");
      mainMenu.classList.remove("hidden");
      mainMenu.classList.add("card-enter");
    });
  }

  // --- PAGE 2 : MENU.HTML (Menu des 3 énigmes + 4ème bouton verrouillé) ---
  if (page === "hub") {
    if (!state.gateUnlocked) {
      window.location.href = "index.html";
      return;
    }

    const progressPill = document.getElementById("progress-pill");
    const progressText = document.getElementById("progress-text");
    const finalBtn = document.getElementById("final-btn");
    const finalBtnTitle = document.getElementById("final-btn-title");
    const finalBtnSub = document.getElementById("final-btn-sub");
    const resetProgressBtn = document.getElementById("reset-progress-btn");

    let solvedCount = 0;

    [1, 2, 3].forEach((id) => {
      const isSolved = Boolean(state.solved[id]);
      if (isSolved) solvedCount++;

      const btn = document.getElementById(`riddle-btn-${id}`);
      const badge = document.getElementById(`riddle-badge-${id}`);
      const desc = document.getElementById(`riddle-desc-${id}`);

      if (btn) btn.classList.toggle("solved", isSolved);
      if (badge) badge.textContent = isSolved ? "✅ Résolue" : "🔒 À résoudre";
      if (desc) {
        if (isSolved) {
          desc.textContent = "Énigme validée !";
        } else if (id === 1) {
          desc.textContent = "Quiz sur nous 💕";
        } else if (id === 2) {
          desc.textContent = "Chasse aux papiers 🏠";
        } else {
          desc.textContent = "Code à 6 chiffres";
        }
      }
    });

    progressText.textContent = `${solvedCount} / 3 énigmes résolues`;
    progressPill.classList.toggle("complete", solvedCount === 3);

    if (solvedCount === 3) {
      finalBtn.classList.remove("locked");
      finalBtn.classList.add("unlocked");
      finalBtn.setAttribute("aria-disabled", "false");
      finalBtnTitle.textContent = "✨ Ouvrir la surprise finale ✨";
      finalBtnSub.textContent = "Toutes les énigmes sont réussies ! Clique ici 💖";
    }

    finalBtn.addEventListener("click", () => {
      if (solvedCount < 3) {
        finalBtn.classList.remove("shake");
        void finalBtn.offsetWidth;
        finalBtn.classList.add("shake");
        return;
      }
      window.location.href = "page_finale.html";
    });

    resetProgressBtn.addEventListener("click", () => {
      const emptyState = {
        gateUnlocked: false,
        solved: { 1: false, 2: false, 3: false }
      };
      saveProgress(emptyState);
      window.location.href = "index.html";
    });
  }

  // --- PAGES 3, 4, 5 : ENIGME1.HTML, ENIGME2.HTML, ENIGME3.HTML ---
  if (page === "riddle") {
    if (!state.gateUnlocked) {
      window.location.href = "index.html";
      return;
    }

    const riddleId = document.body.getAttribute("data-riddle-id");

    // Énigme 1 : Quiz en 3 questions
    if (riddleId === "1") {
      setupRiddle1Quiz({
        onComplete: () => {
          state.solved[1] = true;
          saveProgress(state);
          window.location.href = "menu.html";
        }
      });
      return;
    }

    // Énigme 2 : Chasse aux 3 papiers + indices toutes les 60s
    if (riddleId === "2") {
      setupRiddle2Hints();
    }

    // Énigmes 2 et 3 : Digicode à 6 chiffres
    const digicode = setupDigicode({
      expectedCode: CODES[riddleId],
      customErrorFn:
        riddleId === "2"
          ? (enteredCode) => {
              const pairs = ["80", "24", "55"];
              const enteredPairs = [
                enteredCode.slice(0, 2),
                enteredCode.slice(2, 4),
                enteredCode.slice(4, 6)
              ];
              const sameDigitsDifferentOrder =
                pairs.every((p) => enteredPairs.includes(p)) &&
                enteredPairs.every((p) => pairs.includes(p));

              if (sameDigitsDifferentOrder) {
                return "Tu as les bons papiers, mais pas dans le bon ordre ! 🔄";
              }
              return "Ce n'est pas le bon code ou le bon ordre des papiers ! 🔍";
            }
          : null,
      onSuccess: () => {
        state.solved[riddleId] = true;
        saveProgress(state);
        setTimeout(() => {
          window.location.href = "menu.html";
        }, 1250);
      }
    });

    if (digicode) digicode.resetInputs(true);
  }

  // --- PAGE 6 : PAGE_FINALE.HTML ---
  if (page === "finale") {
    const allSolved = state.gateUnlocked && state.solved[1] && state.solved[2] && state.solved[3];
    if (!allSolved) {
      window.location.href = "menu.html";
      return;
    }
    spawnCelebration();
  }
});