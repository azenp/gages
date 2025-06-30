const codes = {
  soft: ["amour", "rose", "calin"],
  hot: ["passion", "desir", "feu"]
};

const gagesList = {
  soft: [
    { texte: "Un massage de 10 minutes" },
    { texte: "Un bisou sur la joue" },
    { texte: "Préparer un chocolat chaud ensemble" }
  ],
  hot: [
    { texte: "Un baiser langoureux" },
    { texte: "Danse sensuelle pendant 1 minute" },
    { texte: "Un câlin très rapproché" }
  ]
};

let gages = [];
let currentType = "";

const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const gagesContainer = document.getElementById("gages");
const gagePopup = document.getElementById("gage-popup");
const gageContent = document.getElementById("gage-content");

const codeInput = document.getElementById("code-input");
const codeBtn = document.getElementById("code-btn");
const codeError = document.getElementById("code-error");
const backBtn = document.getElementById("back-btn");

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

  loginScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");

  gages = gagesList[currentType].map(g => ({ ...g }));

  const saved = JSON.parse(localStorage.getItem(`gages-${currentType}`));
  if (saved) {
    gages.forEach((g, i) => {
      if (saved[i]?.fait) {
        g.fait = true;
        g.photo = saved[i].photo;
      }
    });
  }

  afficherGages();
};

backBtn.onclick = () => {
  gagePopup.classList.add("hidden");
  mainScreen.classList.remove("hidden");
};

function afficherGages() {
  gagesContainer.innerHTML = "";
  gages.forEach((gage, index) => {
    const gageDiv = document.createElement("div");
    gageDiv.className = "gage" + (gage.fait ? " grise" : "");
    gageDiv.innerHTML = `
      <p>${gage.texte}</p>
      ${gage.photo ? `<img src="${gage.photo}" alt="Photo" />` : ""}
    `;
    gageDiv.onclick = () => ouvrirPopup(index);
    gagesContainer.appendChild(gageDiv);
  });
}

function ouvrirPopup(index) {
  const gage = gages[index];
  mainScreen.classList.add("hidden");
  gagePopup.classList.remove("hidden");

  gageContent.innerHTML = `
    <h2>${gage.texte}</h2>
    <input type="file" accept="image/*" id="photo-${index}" />
    <div>
      <button onclick="validerGage(${index})">Valider</button>
      <button onclick="reinitialiserGage(${index})">Réinitialiser</button>
    </div>
    ${gage.photo ? `<img src="${gage.photo}" alt="Photo" />` : ""}
  `;
}

function validerGage(index) {
  const gage = gages[index];
  const input = document.getElementById(`photo-${index}`);
  const file = input.files[0];

  if (!file) {
    if (!confirm("Aucune photo ajoutée. Valider quand même ?")) return;
    gage.fait = true;
    sauvegarderEtRetour();
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    gage.fait = true;
    gage.photo = evt.target.result;
    sauvegarderEtRetour();
  };
  reader.readAsDataURL(file);
}

function reinitialiserGage(index) {
  const code = prompt("Code pour réinitialiser ?");
  if (code === "josephine") {
    gages[index].fait = false;
    gages[index].photo = null;
    sauvegarderEtRetour();
  } else {
    alert("Code incorrect");
  }
}

function sauvegarderEtRetour() {
  localStorage.setItem(`gages-${currentType}`, JSON.stringify(gages));
  afficherGages();
  gagePopup.classList.add("hidden");
  mainScreen.classList.remove("hidden");
}
