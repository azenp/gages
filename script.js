const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const codeInput = document.getElementById("code-input");
const codeSubmit = document.getElementById("code-submit");
const codeError = document.getElementById("code-error");
const gagesContainer = document.getElementById("gages");
const changeCodeBtn = document.getElementById("change-code-btn");

const gagesByCode = {boulogne: [
    { texte: "A ton service pendant 2H", type: "soft" },
    { texte: "A ton service pendant 2H", type: "soft" },
    { texte: "A ton service pendant 2H", type: "soft" },
    { texte: "A ton service pendant 2H", type: "soft" },
    { texte: "A ton service pendant 6H", type: "soft" },
    { texte: "A ton service pendant 6H", type: "soft" },
    { texte: "A ton service pendant 24H", type: "soft" },
    { texte: "Une question au choix", type: "soft" },
    { texte: "Une question au choix", type: "soft" },
    { texte: "Une question au choix", type: "soft" },
    { texte: "Une question au choix", type: "soft" },
    { texte: "Un repas au choix", type: "soft" },
    { texte: "Un repas au choix", type: "soft" },
    { texte: "Un repas au choix", type: "soft" },
    { texte: "Un repas au choix", type: "soft" },
    { texte: "Un repas au choix", type: "soft" },
    { texte: "Un gage au choix", type: "soft" },
    { texte: "Un gage au choix", type: "soft" },
    { texte: "Un gage au choix", type: "soft" },
    { texte: "24H menotter à toi", type: "soft" },
    { texte: "24H menotter seul", type: "soft" },
    { texte: "Joker", type: "soft" },
    { texte: "tu choisi le film", type: "soft" },
    { texte: "tu choisi le film", type: "soft" },
    { texte: "tu choisi le film", type: "soft" },
    { texte: "tu choisi le film", type: "soft" },
    { texte: "tu choisi le film", type: "soft" },
    { texte: "tu choisi le film", type: "soft" },
    { texte: "date au choix", type: "soft" },
    { texte: "date au choix", type: "soft" },
    { texte: "date au choix", type: "soft" },
    { texte: "Une activiter au choix", type: "soft" },
    { texte: "Une activiter au choix", type: "soft" },
    { texte: "Une activiter au choix", type: "soft" },
    { texte: "Une activiter au choix", type: "soft" },
    { texte: "Tu me relook et je dit rien", type: "soft" },
    { texte: "je chante la chançon que tu veux", type: "soft" },
    { texte: "je t'écris un poème", type: "soft" },
    { texte: "je te masse pendant 20 min", type: "soft" },
    { texte: "tu me coupe les cheveux😢", type: "soft" },
    { texte: "je te traite comme une pricesse 24H👑", type: "soft" },
    { texte: "je fais les tâches ménagaires", type: "soft" },
    { texte: "je regarde 10 films de ton choix🎬", type: "soft" },
    
  ],
  apt: [
    { texte: "Une nuit torride 🔞", type: "hot" },
    { texte: "Une féssée👋🍑", type: "hot" },
      { texte: "je suis menotter", type: "hot" },
      { texte: "on se déguise", type: "hot" },
      { texte: "je me déguise", type: "hot" },
      { texte: "J'ai les yeux bandés🎭", type: "hot" },
      { texte: "je t'envoi un message sexy dans la jourée🔞", type: "hot" },
      { texte: "Je pose pour une photo hot dans la position de ton choix", type: "hot" },
      { texte: "Je réalise un fantasme de ton choix", type: "hot" },
      { texte: "Je te fais un striptease", type: "hot" },
      { texte: "Je fais ce que tu veux au lit", type: "hot" },
      
    
  ],
  poeme: [
      { texte: "À toi la fleur des pré que l’on ne vois pas à l’horizon.À toi la fleur à qui on ne fait pas attention.À toi la fleur qui pourrait nous remplir de passion mais que l’on ne prend pas le temps d’attacher notre protection.À toi la fleur qui subit notre pollution.À toi la fleur qui navigue au gré des saisons.À toi la fleur que l’on offre à la fille à qui on a décidé d’avoué notre passion.", type: "poeme" },
      
  
  ],
  calin: [
      { texte: "si tu vois ce message c'est que tu es tomber sur un ister egg bravoooooo!!!!!! J'ai créé cet ister egg dans la peur que tu ne le trouve jamais, mais c'est pas grave, car même sans ça, je te le dis ou non ça n'a aucun changement sur le fais que je t'aime comme un fou❤️.", type: "isteregg" },

  ],
17: [
    { texte: "joyeux anniversaire mon coeur ❤️", type: "17ans" }, 
 
  ],
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
