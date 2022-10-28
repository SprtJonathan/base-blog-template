const apiURL = "http://localhost:3000/api/";

let articles;

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
