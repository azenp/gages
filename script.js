console.log("script chargé");
const gages = {
  "amour": {
    texte: "Un câlin de 30 secondes 💞",
    indice: "C'est ton petit mot pour moi 💌"
  },
  "coquin": {
    texte: "Un massage sensuel pendant 10 minutes 💋",
    indice: "Un mot un peu plus hot que 'amour'..."
  },
  "reset123": {
    reset: true
  }
};

let codeActuel = "";

function verifierCode() {
  const code = document.getElementById("codeInput").value;
  codeActuel = code;
  if (gages[code]) {
    if (gages[code].reset) {
      alert("Gages réinitialisés !");
      location.reload();
    } else {
      document.getElementById("gageText").innerText = gages[code].texte;
      document.getElementById("code-entry").style.display = "none";
      document.getElementById("gages").style.display = "block";
    }
  } else {
    let indice = gages["amour"].indice;
    alert(indice);
  }
}

function retourAccueil() {
  document.getElementById("gages").style.display = "none";
  document.getElementById("code-entry").style.display = "block";
  document.getElementById("codeInput").value = "";
  document.getElementById("photoInput").value = null;
  document.getElementById("preview").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("photoInput").addEventListener("change", function (e) {
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById("preview").src = reader.result;
      document.getElementById("preview").style.display = "block";
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  });
});

function validerGage() {
  const photo = document.getElementById("photoInput").files[0];
  if (!photo) {
    const confirmer = confirm("Tu n'as pas ajouté de photo, veux-tu quand même valider le gage ?");
    if (confirmer) alert("Gage validé ! Merci mon amour 💙");
  } else {
    alert("Gage validé avec la photo ! 💕");
  }
  retourAccueil();
}
