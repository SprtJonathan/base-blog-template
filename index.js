const apiURL = "http://localhost:3000/api/";

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

const articleContentContainer = document.getElementById("article-content");

let articles;

function submitArticle(e) {
  e.preventDefault();

  const date = new Date();

  const formattedDate = date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const articleTitle = document.getElementById("article-title");
  const articleCover = document.getElementById("article-cover");
  const articleContent = document.getElementById("article-content");

  const title = articleTitle.value;
  const cover = articleCover.value;
  const content = articleContent.innerHTML;

  const articleId = title.replace(/\s+/g, "_").toLowerCase() + "_" + Date.now();

  const newArticle = {
    articleId: articleId,
    userId: userId,
    articleTitle: title,
    articleCover: cover,
    articleContent: content,
    creationDate: formattedDate,
    modificationDate: formattedDate,
  };
}

async function fetchArticles() {
  let fetchedData;

  const res = await fetch(apiURL + "articles");

  fetchedData = await res.json();

  console.log(fetchedData);
  displayArticles(fetchedData);
}

function displayArticles(fetchedData) {
  articles = fetchedData;
  console.log(articles);

  if (articles.length > 0) {
    const articlesSection = document.getElementById("artilces-list");
    articles.forEach((article) => {
      const articleContainer = document.createElement("a");
      articleContainer.setAttribute("id", article.articleId + "-card");
      articleContainer.setAttribute("class", "article-card");
      articleContainer.setAttribute(
        "href",
        "./article.html?id=" + article.articleId
      );

      const articleTitleImage = document.createElement("div");
      articleTitleImage.setAttribute("class", "article-title-image");

      const articleTitle = document.createElement("p");
      articleTitle.setAttribute("class", "article-title");
      articleTitle.innerText = article.articleTitle;

      const articleImageContainer = document.createElement("div");
      articleImageContainer.setAttribute("class", "article-cover-container");

      const articleImage = document.createElement("img");
      articleImage.setAttribute("class", "article-cover");
      articleImage.setAttribute("src", article.articleCover);

      articleContainer.appendChild(articleTitleImage);
      articleTitleImage.appendChild(articleImageContainer);
      articleImageContainer.appendChild(articleImage);
      articleTitleImage.appendChild(articleTitle);
      articlesSection.appendChild(articleContainer);
    });
  }
}

fetchArticles();

const editorOptions = {
  debug: "info",
  modules: {
    container: "#toolbar", // Selector for toolbar container
  },
  placeholder: "Compose an epic article...",
  readOnly: true,
  theme: "snow",
};

const editor = new Quill(articleContentContainer, editorOptions);
