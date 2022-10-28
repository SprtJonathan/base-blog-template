const userConnected = document.getElementById("user-connected");
const userNotConnected = document.getElementById("user-not-connected");

const token = localStorage.getItem("token");
const userInfos = JSON.parse(localStorage.getItem("user"));

if (token) {
  userNotConnected.style.display = "none";
  userConnected.style.display = "flex";

  const userName = document.getElementById("menu-username");
  userName.textContent = "Bonjour " + userInfos.username;

  const userProfilePicture = document.getElementById(
    "menu-user-profile-picture"
  );
  userProfilePicture.setAttribute("src", userInfos.profilePictureUrl);
} else {
  userNotConnected.style.display = "flex";
  userConnected.style.display = "none";
}

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  if (token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  window.location.reload();
});

const newArticleButton = document.getElementById("new-article-page");

if (userInfos == null) {
  newArticleButton.style.display = "none";
} else if (userInfos.roleId == 0) {
  newArticleButton.style.display = "none";
}
