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
  const code = document.getElementById("codeInput").value.trim();
  codeActuel = code;

  if (gages[code]) {
    if (gages[code].reset) {
      alert("Gages réinitialisés !");
      localStorage.clear();
      location.reload();
      return;
    }

    document.getElementById("gageText").innerText = gages[code].texte;
    document.getElementById("code-entry").style.display = "none";
    document.getElementById("gages").style.display = "block";

    const gageKey = `gage-${code}`;

    const photoData = localStorage.getItem(`${gageKey}-photo`);
    if (photoData) {
      document.getElementById("preview").src = photoData;
      document.getElementById("preview").style.display = "block";
    } else {
      document.getElementById("preview").style.display = "none";
    }

  } else {
    alert(gages["amour"].indice);
  }
}

function retourAccueil() {
  document.getElementById("gages").style.display = "none";
  document.getElementById("code-entry").style.display = "block";
  document.getElementById("codeInput").value = "";
}

function validerGage() {
  const photo = document.getElementById("photoInput").files[0];
  const gageKey = `gage-${codeActuel}`;

  if (!photo) {
    const confirmer = confirm("Tu n'as pas ajouté de photo, veux-tu quand même valider le gage ?");
    if (!confirmer) return;
  }

  localStorage.setItem(`${gageKey}-valide`, "true");

  if (photo) {
    const reader = new FileReader();
    reader.onload = function () {
      localStorage.setItem(`${gageKey}-photo`, reader.result);
      document.getElementById("preview").src = reader.result;
      document.getElementById("preview").style.display = "block";
      alert("Gage validé avec la photo ! 💕");
    };
    reader.readAsDataURL(photo);
  } else {
    alert("Gage validé sans photo 💙");
  }
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
  <link rel="icon" href="data:,">
}
