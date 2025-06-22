// Définitions des gages par catégorie
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

// Éléments DOM
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

// Sauvegarde localStorage (gages + currentType)
function sauvegarder() {
  localStorage.setItem("gages", JSON.stringify(gages));
  localStorage.setItem("type", currentType);
}

// Charge les gages sauvegardés et type
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
    } catch {
      // ignore erreur JSON
    }
  }
}

// Affiche les gages dans la grille principale
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
      if (gagePopup.classList.contains("hidden")) {
        ouvrirPopupGage(i);
      }
    });
    gagesContainer.appendChild(div);
  });
}

// Ouvre la popup détaillée d’un gage avec options
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

  // Gestion boutons dans popup
  const photoInput = document.getElementById("photo-input");
  const validerBtn = document.getElementById("valider-btn");
  const resetBtn = document.getElementById("reset-btn");

  validerBtn.disabled = gage.fait;

  validerBtn.onclick = () => {
    if (gage.fait) return; // déjà validé

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

// Gestion bouton retour dans popup
backBtn.onclick = () => {
  fermerPopupGage();
};

// Gestion bouton code secret
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

  // Initialiser les gages à partir de la catégorie
  gages = gagesData[currentType].map(g => ({ ...g, fait: false, photo: null }));

  // Charger les faits déjà enregistrés (si localStorage correspond)
  const saved = localStorage.getItem("gages");
  if (saved) {
    try {
      const savedGages = JSON.parse(saved);
      if (Array.isArray(savedGages) && savedGages.length === gages.length) {
        // On garde les faits/photo des gages sauvegardés
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

// Au chargement, si on a une session active, on affiche direct
window.onload = () => {
  charger();
  if (currentType) {
    loginScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
    afficherGages();
  }
};
