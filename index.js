const articleContentContainer = document.getElementById("article-content");

if (!localStorage.getItem("articles")) {
  let array = [];
  localStorage.setItem("articles", JSON.stringify(array));
}

let articles;

if (Array.isArray(JSON.parse(localStorage.getItem("articles")))) {
  articles = JSON.parse(localStorage.getItem("articles"));
} else {
  articles = localStorage.getItem("articles");
}

function submitArticle(e) {
  e.preventDefault();

  const articleTitle = document.getElementById("article-title");
  const articleCover = document.getElementById("article-cover");
  const articleContent = document.getElementById("article-content");

  const title = articleTitle.value;
  const cover = articleCover.value;
  const content = articleContent.innerHTML;

  const articleId = title.replace(/\s+/g, "").toLowerCase() + "_" + Date.now();

  console.log(title);

  const newArticle = {
    articleId: articleId,
    articleTitle: title,
    articleCover: cover,
    articleContent: content,
  };

  if (!Array.isArray(articles)) {
    console.log("no articles yet");
    let newArray = [newArticle];
    articles = newArray;
  } else {
    articles = JSON.parse(localStorage.getItem("articles"));
    articles.push(newArticle);
  }

  console.log(articles);
  localStorage.setItem("articles", JSON.stringify(articles));
}

function displayArticles() {
  console.log(articles);
  if (Array.isArray(articles)) {
    articles = JSON.parse(localStorage.getItem("articles"));

    const articlesSection = document.getElementById("artilces-list");
    articles.forEach((article) => {
      const articleContainer = document.createElement("article");
      articleContainer.setAttribute("id", article.articleId + "-card");
      articleContainer.setAttribute("class", "article-card");

      const articleTitleImage = document.createElement("div");
      articleTitleImage.setAttribute("class", "article-title-image");

      const articleTitle = document.createElement("p");
      articleTitle.innerHTML = article.articleTitle;

      const articleImage = document.createElement("img");
      articleImage.setAttribute("class", "article-cover");
      articleImage.setAttribute("src", article.articleCover);

      articleContainer.appendChild(articleTitleImage);
      articleTitleImage.appendChild(articleImage);
      articleTitleImage.appendChild(articleTitle);
      articlesSection.appendChild(articleContainer);
    });
  }
}

displayArticles();

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
