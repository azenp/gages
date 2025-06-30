const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const codeInput = document.getElementById("code-input");
const codeSubmit = document.getElementById("code-submit");
const codeError = document.getElementById("code-error");
const gagesContainer = document.getElementById("gages");
const changeCodeBtn = document.getElementById("change-code-btn");

const gagesByCode = {
  rose: [
    { texte: "Un massage de 10 minutes", type: "soft" },
    { texte: "Un bisou dans le cou", type: "soft" },
  ],
  rouge: [
    { texte: "Danser collés serrés 2 minutes", type: "hot" },
    { texte: "Lécher la joue pendant 10 secondes", type: "hot" },
  ]
};

let currentType = "";
let gages = [];

codeSubmit.onclick = () => {
  const code = codeInput.value.trim().toLowerCase();
  if (gagesByCode[code]) {
    currentType = code;
    gages = JSON.parse(JSON.stringify(gagesByCode[code])); // clone
    chargerPhotos();
    afficherGages();
    loginScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
    codeError.classList.add("hidden");
  } else {
    codeError.classList.remove("hidden");
  }
};

function sauvegarder() {
  localStorage.setItem("gages-" + currentType, JSON.stringify(gages));
}

function chargerPhotos() {
  const data = localStorage.getItem("gages-" + currentType);
  if (data) {
    const anciens = JSON.parse(data);
    anciens.forEach((old, i) => {
      if (old.fait) {
        gages[i].fait = true;
        gages[i].photo = old.photo;
      }
    });
  }
}

function afficherGages() {
  gagesContainer.innerHTML = "";
  gages.forEach((gage, index) => {
    const gageDiv = document.createElement("div");
    gageDiv.className = "gage" + (gage.fait ? " grise" : "");
    gageDiv.innerHTML = `
      <p>${gage.texte}</p>
      <input type="file" accept="image/*" class="photo-input" data-index="${index}" />
      <button data-index="${index}" class="valider">Valider</button>
      <button data-index="${index}" class="reset">Réinitialiser</button>
      ${gage.photo ? `<img src="${gage.photo}" alt="Photo" />` : ""}
    `;

    gagesContainer.appendChild(gageDiv);
  });
}

gagesContainer.addEventListener("click", (e) => {
  const index = parseInt(e.target.getAttribute("data-index"));
  if (isNaN(index)) return;
  const gage = gages[index];

  if (e.target.classList.contains("valider")) {
    const input = document.querySelector(`.photo-input[data-index='${index}']`);
    const file = input.files[0];

    if (!file) {
      if (!confirm("Aucune photo ajoutée. Es-tu sûr(e) de vouloir valider ?")) return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        gage.fait = true;
        gage.photo = evt.target.result;
        sauvegarder();
        afficherGages();
      };
      reader.readAsDataURL(file);
    } else {
      gage.fait = true;
      gage.photo = null;
      sauvegarder();
      afficherGages();
    }
  }

  if (e.target.classList.contains("reset")) {
    const code = prompt("Code pour réinitialiser ?");
    if (code === "josephine") {
      gage.fait = false;
      gage.photo = null;
      sauvegarder();
      afficherGages();
    } else {
      alert("Code incorrect");
    }
  }
});

changeCodeBtn.onclick = () => {
  codeInput.value = "";
  currentType = "";
  gages = [];
  gagesContainer.innerHTML = "";
  mainScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  codeError.classList.add("hidden");
};
