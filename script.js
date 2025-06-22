/********************  LISTES DES GAGES  *********************/
const LISTES = {
  tranquilles: [
    { id: 1,  text: "Un massage de 20 min 👐",                   done: false, photo: null },
    { id: 2,  text: "Préparer le petit-déj au lit ☕",            done: false, photo: null },
    { id: 3,  text: "Dire 10 choses que j'aime chez toi 💖",     done: false, photo: null },
    { id: 4,  text: "Une promenade main dans la main 🌸",        done: false, photo: null }
  ],
  hot: [
    { id: 101, text: "Baiser fougueux sous la douche 💦",        done: false, photo: null },
    { id: 102, text: "Tenue sexy toute la soirée 🔥",            done: false, photo: null },
    { id: 103, text: "Massage sensuel à l'huile 😈",            done: false, photo: null },
    { id: 104, text: "Jeu de rôle surprise 🙈",                 done: false, photo: null }
  ]
};

const TITRES = { tranquilles: "Gages doux 🥰", hot: "Gages hot 🔥" };
const LS_PREFIX = "gagesLoveApp-";

/********************  VARIABLES GLOBALES  ********************/
let gages     = [];     // la liste courante
let listeKey  = "";     // 'tranquilles' ou 'hot'

/********************  CONNEXION  *****************************/
function login() {
  const code = document.getElementById("password").value.trim().toLowerCase();

  if (code === "amour")      listeKey = "tranquilles";
  else if (code === "passion") listeKey = "hot";
  else { alert("Mot de passe incorrect 😢\n(pense à « la ville ou on eu notre first kiss » ou « la musique qui nous a marquer pour notres premier fois »)"); return; }

  // on fait une copie propre pour ne pas toucher aux listes originales
  gages = LISTES[listeKey].map(g => ({ ...g }));

  charger();                                      // restaure l’état si déjà sauvegardé
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display   = "block";
  document.getElementById("titreListe").textContent = TITRES[listeKey];
  displayGages();
}

/********************  AFFICHAGE LISTE  ***********************/
function displayGages() {
  const ul = document.getElementById("gageList");
  ul.innerHTML = "";

  gages.forEach(g => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p class="${g.done ? "done" : ""}" onclick="showGage(${g.id})">${g.text}</p>
      ${g.photo ? `<img src="${g.photo}" alt="Photo du gage">` : ""}
      ${!g.done ? `
        <input type="file" accept="image/*" onchange="savePhoto(event, ${g.id})">
        <button onclick="validerGage(${g.id}); event.stopPropagation()">Valider</button>
      ` : ""}
    `;
    ul.appendChild(li);
  });
}

/********************  POP-UP DÉTAIL  *************************/
function showGage(id) {
  const g = gages.find(x => x.id === id);
  const box = document.getElementById("modalContent");

  box.innerHTML = `
    <button class="back" onclick="closeModal()">←</button>
    <h2>${g.text}</h2>
    ${g.photo ? `<img src="${g.photo}" alt="Photo">` : ""}
    ${!g.done ? `
      <input type="file" accept="image/*" onchange="savePhoto(event, ${g.id})"><br>
      <button onclick="validerGage(${g.id})">Valider</button>
    ` : ""}
    <button onclick="resetGage(${g.id})">Réinitialiser</button>
  `;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/********************  VALIDER LE GAGE  ***********************/
function validerGage(id) {
  const g = gages.find(x => x.id === id);

  if (!g.photo) {
    const ok = confirm("Tu n'as pas ajouté de photo 😢\nValider quand même ?");
    if (!ok) return;
  }
  g.done = true;
  sauvegarder();
  closeModal();
  displayGages();
}

/********************  UPLOAD PHOTO  **************************/
function savePhoto(e, id) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const g = gages.find(x => x.id === id);
    g.photo = reader.result;
    sauvegarder();
    displayGages();
  };
  reader.readAsDataURL(file);
}

/********************  RÉINITIALISER  ************************/
function resetGage(id) {
  const code = prompt("Code pour réinitialiser ?");
  if (code && code.toLowerCase() === "josephine") {
    const g = gages.find(x => x.id === id);
    g.done  = false;
    g.photo = null;
    sauvegarder();
    closeModal();
    displayGages();
  } else alert("Code incorrect !");
}

/********************  PERSISTENCE  **************************/
function sauvegarder() {
  if (listeKey) localStorage.setItem(LS_PREFIX + listeKey, JSON.stringify(gages));
}

function charger() {
  if (!listeKey) return;
  const data = localStorage.getItem(LS_PREFIX + listeKey);
  if (data) {
    const saved = JSON.parse(data);
    saved.forEach(s => {
      const g = gages.find(x => x.id === s.id);
      if (g) Object.assign(g, s);
    });
  }
}
