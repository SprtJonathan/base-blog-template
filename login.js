const apiURL = "http://localhost:3000/api/";

if (localStorage.getItem("token")) {
  window.location.href = "./index.html";
}

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
loginButton.addEventListener("click", (e) => {
  login(e);
});

const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", (e) => {
  register(e);
});

// Fonction d'inscription
const register = async (e) => {
  e.preventDefault();

  // Inscription et vérification des champs
  this.formError = "";
  let formBoolean = false;
  // Vérification des caractères via des regex
  let verifyNumbers = /[0-9]/; // Vérification des chiffres uniquement
  let verifyEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // Vérification de l'email
  let verifyCharacters = /[*?":{}|<>]/; // Vérification des caractères spéciaux
  // Création de variables pour l'affichage des erreurs
  let usernameError = false;
  let fnameError = false;
  let lnameError = false;
  let emailError = false;
  let badValue = "Format incorrect:";
  let badValueFigure = " - Chiffres interdits";
  let badValueChar = " - Caractères spéciaux interdits";
  let badValueEmail = " Format d'email non autorisé:";
  // Création des variables des champs
  let usernameId = document.getElementById("username");
  let usernameBlock = document.getElementById("username-block");
  let fnameId = document.getElementById("fname");
  let lnameId = document.getElementById("lname");
  let emailId = document.getElementById("email");
  let passwordId = document.getElementById("password");
  let passwordConfirmationId = document.getElementById("password-confirmation");
  // Récupération des inputs
  let username = usernameId.value;
  let fname = fnameId.value;
  let lname = lnameId.value;
  let email = emailId.value;
  let password = passwordId.value;
  let passwordConfirmation = passwordConfirmationId.value;
  // Fonction permettant de vérifier la validité des différents inputs du formulaire de contact
  function checkFormInput(
    checkedRegex,
    expextedValue,
    inputName,
    inputId,
    errorType
  ) {
    // Variable comptant le nombre d'erreurs
    let errorCount = 0;
    if (checkedRegex == expextedValue) {
      console.log(errorType);
      console.log("Erreur: " + inputName);
      errorCount = 1;
    } else {
      console.log("Champ " + inputId.id + " validé: " + inputName);
    }
    return errorCount;
  }
  // Vérification de la validité des différents inputs
  // Nom d'utilisateur
  let usernameCheck = checkFormInput(
    verifyCharacters.test(username),
    true,
    username,
    usernameBlock,
    badValue + badValueChar
  );
  // Prénom
  let fnameCheck = checkFormInput(
    verifyNumbers.test(fname) | verifyCharacters.test(fname),
    true,
    fname,
    fnameId,
    badValue + badValueFigure + badValueChar
  );
  // Nom de famille
  let lnameCheck = checkFormInput(
    verifyNumbers.test(lname) | verifyCharacters.test(lname),
    true,
    lname,
    lnameId,
    badValue + badValueFigure + badValueChar
  );
  // Email
  let emailCheck = checkFormInput(
    verifyEmail.test(email),
    false,
    email,
    emailId,
    badValueEmail + badValueChar
  );
  // Variable comptant le nombre d'erreurs
  let errorCount = usernameCheck + fnameCheck + lnameCheck + emailCheck;
  function checkError(inputCheck, errorParam) {
    if (inputCheck != 0) {
      errorParam = true;
    }
    console.log("test: " + errorParam);
    return errorParam;
  }
  let errorString = [];
  usernameError = checkError(usernameCheck, usernameError);
  fnameError = checkError(fnameCheck, fnameError);
  lnameError = checkError(lnameCheck, lnameError);
  emailError = checkError(emailCheck, emailError);
  console.log(usernameError);
  console.log(fnameError);
  console.log(lnameError);
  console.log(emailError);
  function errorMessages(testedInput, errorMsg) {
    if (testedInput == true) {
      errorString.push(errorMsg);
    }
  }
  errorMessages(usernameError, "Nom d'utilisateur incorrect " + badValueChar);
  errorMessages(fnameError, "Format du prénom incorrect " + badValueChar);
  errorMessages(
    lnameError,
    "Format du nom de famille incorrect " + badValueChar
  );
  errorMessages(emailError, "Format d'email incorrect " + badValueChar);
  if (errorCount != 0) {
    formBoolean = false; // Si des erreurs sont retournées alors on définit la variable comme fausse pour que le formulaire ne puisse pas être envoyé
    console.log(errorString.toString());
    hasError = true;
  } else {
    // Construction de l'objet contenant les infos utilisateur
    let newUser = {
      username: username,
      fname: fname,
      lname: lname,
      email: email,
      password: password,
    };
    console.log("Formulaire validé");
    formBoolean = true; // Si aucune erreur n'est retournée alors on définit la variable comme vraie pour que le formulaire puisse être envoyé
    if (password == passwordConfirmation && formBoolean == true) {
      // Si les champs de connexion ne sont pas vides, on envoie les informations
      try {
        const response = await fetch(apiURL + "auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        if (response.status === 200) {
          const res = await response.json();
          console.log(res);
          // Si la requête aboutit et donne des résultats, on stocke le token et l'objet user dans le localStorage afin de permettre une authentification rapide de l'utilisateur
          setTimeout(function () {
            location.reload();
          }, 1000);
        } else {
          let errorMessage = response;
          console.log(errorMessage);
        }
      } catch (err) {
        console.log(err);
        let errorMessage = error.res.data.error; // Si une erreur se produit, on la retourne
        console.log("erreur: " + error + " test " + error.response.data.error);
      }
    } else {
      alert("Champs invalides");
    }
  }
};

// Fonction de login
const login = async (e) => {
  e.preventDefault();

  const credentials = document.getElementById("credentials");
  const credentialsValue = credentials.value;
  const password = document.getElementById("login-password");
  const passwordValue = password.value;

  const userCredentials = {
    credentials: credentialsValue,
    password: passwordValue,
  };

  if (credentialsValue !== null || passwordValue !== null) {
    // Si les champs de connexion ne sont pas vides, on envoie les informations
    try {
      const response = await fetch(apiURL + "auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      if (response.status === 200) {
        const res = await response.json();
        //console.log(res);
        // Si la requête aboutit et donne des résultats, on stocke le token et l'objet user dans le localStorage afin de permettre une authentification rapide de l'utilisateur
        console.log(res);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        console.log(localStorage.getItem("token"));
        location.replace(location.origin); // Une fois connecté, on rafraîchit la page.
      } else {
        console.log("Invalid username or password");
        console.log(response.status);

        if (response.status === 401) {
          document.getElementById("errorAlert").textContent =
            "Erreur " + response.status + " : Invalid username or password";
        }
      }
    } catch (err) {
      console.log(err);
      let errorMessage = error.res.data.error; // Si une erreur se produit, on la retourne
      console.log("erreur: " + error + " test " + error.response.data.error);
    }
  }
};
