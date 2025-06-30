const gagesData = {
  soft: [
    { texte: "Un massage de 10 minutes" },
    { texte: "Un bisou dans le cou" },
    { texte: "Préparer un café" },
    { texte: "Faire un compliment sincère" },
  ],
  hot: [
    { texte: "Danser collés serrés 2 minutes" },
    { texte: "Lécher la joue pendant 10 secondes" },
    { texte: "Un baiser passionné" },
    { texte: "Faire un câlin langoureux" },
  ],
};

const codes = {
  soft: ["amour", "rose", "calin"],
  hot: ["passion", "desir", "feu"],
};

const loginScreen = document.getElementById("login-screen");
const codeInput = document.getElementById("code-input");
const codeBtn = document.getElementById("code-btn");
const codeError = document.getElementById("code-error");

const mainScreen = document.getElementById("main-screen");
const gagesContainer = document.getElementById("gages");

const gagePopup = document.getElementById("gage-popup");
const gageContent = document.getElementById("gage-content");
const backBtn = document.getElementById("back-btn");

let currentType = null;
let gages = [];
let currentGageIndex = null;

function sauvegarder() {
  localStorage.setItem("gages", JSON.stringify(gages));
  localStorage.setItem("type", currentType);
}

function charger() {
  const savedType = localStorage.getItem("type");
  if (savedType && (savedType === "soft" || savedType === "hot")) {
    currentType = savedType;
  }
  const savedGages = localStorage.getItem("gages");
  if (savedGages) {
    try {
      const savedArray = JSON.parse(savedGages);
      if (Array.isArray(savedArray) && savedArray.length) {
        gages = savedArray;
      }
    } catch {}
  }
}

function afficherGages() {
  gagesContainer.innerHTML = "";
  gages.forEach((gage, i) => {
    const div = document.createElement("div");
    div.className = "gage" + (gage.fait ? " grise" : "");
    div.innerHTML = `
      <p>${gage.texte}</p>
      ${gage.photo ? `<img src="${gage.photo}" alt="Photo du gage" />` : ""}
    `;
    div.addEventListener("click", () => {
      if (!gage.fait) ouvrirPopupGage(i);
    });
    gagesContainer.appendChild(div);
  });
}

function ouvrirPopupGage(index) {
  currentGageIndex = index;
  const gage = gages[index];
  gageContent.innerHTML = `
    <p><strong>${gage.texte}</strong></p>
    ${gage.photo ? `<img src="${gage.photo}" alt="Photo du gage" />` : ""}
    <div class="options">
      <input type="file" accept="image/*" id="photo-input" />
      <button id="valider-btn">${gage.fait ? "Fait ✅" : "Valider"}</button>
      <button id="reset-btn">Réinitialiser</button>
    </div>
  `;
  gagePopup.classList.remove("hidden");
  mainScreen.classList.add("hidden");

  const photoInput = document.getElementById("photo-input");
  const validerBtn = document.getElementById("valider-btn");
  const resetBtn = document.getElementById("reset-btn");

  validerBtn.disabled = gage.fait;

  validerBtn.onclick = () => {
    if (gage.fait) return;

    if (photoInput.files.length === 0) {
      if (!confirm("Aucune photo ajoutée. Es-tu sûr(e) de vouloir valider ?")) return;
      gage.fait = true;
      gage.photo = null;
      sauvegarder();
      fermerPopupGage();
      afficherGages();
      return;
    }
    const file = photoInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      gage.fait = true;
      gage.photo = e.target.result;
      sauvegarder();
      fermerPopupGage();
      afficherGages();
    };
    reader.readAsDataURL(file);
  };

  resetBtn.onclick = () => {
    const code = prompt("Code pour réinitialiser ce gage ?");
    if (code && code.toLowerCase() === "josephine") {
      gage.fait = false;
      gage.photo = null;
      sauvegarder();
      fermerPopupGage();
      afficherGages();
    } else {
      alert("Code incorrect.");
    }
  };
}

function fermerPopupGage() {
  gagePopup.classList.add("hidden");
  mainScreen.classList.remove("hidden");
  currentGageIndex = null;
}

backBtn.onclick = () => {
  fermerPopupGage();
};

codeBtn.onclick = () => {
  const code = codeInput.value.trim().toLowerCase();
  if (codes.soft.includes(code)) {
    currentType = "soft";
  } else if (codes.hot.includes(code)) {
    currentType = "hot";
  } else {
    codeError.classList.remove("hidden");
    return;
  }

  codeError.classList.add("hidden");
  loginScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");

  gages = gagesData[currentType].map(g => ({ ...g, fait: false, photo: null }));

  const saved = localStorage.getItem("gages");
  if (saved) {
    try {
      const savedGages = JSON.parse(saved);
      if (Array.isArray(savedGages) && savedGages.length === gages.length) {
        savedGages.forEach((sg, i) => {
          if (sg.fait) {
            gages[i].fait = true;
            gages[i].photo = sg.photo;
          }
        });
      }
    } catch {}
  }

  sauvegarder();
  afficherGages();
  codeInput.value = "";
};

window.onload = () => {
  charger();
  if (currentType) {
    loginScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
    afficherGages();
  }
};
