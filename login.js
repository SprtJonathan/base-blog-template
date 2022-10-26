const loginBlock = document.getElementById("login-form");
const registerBlock = document.getElementById("register-form");

registerBlock.style.maxHeight = 0;

const loginCategoryButton = document.getElementById("login-form-button");
loginCategoryButton.classList.add("active-auth-category");

const registerCategoryButton = document.getElementById("register-form-button");

loginCategoryButton.addEventListener("click", () => {
  changeAuthType(0);
});

registerCategoryButton.addEventListener("click", () => {
  changeAuthType(1);
});

// Function to change the auth type : 0 = login, 1 = register
function changeAuthType(type) {
  if (type == 0) {
    loginBlock.style.maxHeight = "100%";
    registerBlock.style.maxHeight = 0;

    loginCategoryButton.classList.add("active-auth-category");
    registerCategoryButton.classList.remove("active-auth-category");
  } else {
    loginBlock.style.maxHeight = 0;
    registerBlock.style.maxHeight = "100%";

    registerCategoryButton.classList.add("active-auth-category");
    loginCategoryButton.classList.remove("active-auth-category");
  }
}

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", () => {
  login();
});

// Fonction de login
function login() {
  const credentials = document.getElementById("credentials");
  const credentialsValue = credentials.value;
  const password = document.getElementById("login-password");
  const passwordValue = password.value;
  if (credentialsValue !== null || passwordValue !== null) {
    // Si les champs de connexion ne sont pas vides, on envoie les informations
    axios
      .post($store.state.apiUrl + "auth/login", userCredentials)
      .then((response) => {
        // Si la requête aboutit et donne des résultats, on stocke le token et l'objet user dans le localStorage afin de permettre une authentification rapide de l'utilisateur
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log(localStorage.getItem("token"));
        location.replace(location.origin); // Une fois connecté, on rafraîchit la page.
      })
      .catch((error) => {
        let errorMessage = error.response.data.error; // Si une erreur se produit, on la retourne
        console.log("erreur: " + error + " test " + error.response.data.error);
        if (errorMessage == undefined) {
          $toast.error(
            "Une erreur s'est produite, veuillez réessayer ultérieurement",
            {
              timeout: 2000,
            }
          );
        } else {
          $toast.error(errorMessage, {
            timeout: 2000,
          });
        }
      });
  } else {
    $toast.error("Erreur: Les champs sont vides", {
      timeout: 2000,
    });
  }
}
