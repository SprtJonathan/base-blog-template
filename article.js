const apiURL = "http://localhost:3000/api/";

const articleURL = window.location.search;
const urlParams = new URLSearchParams(articleURL);
const articleId = urlParams.get("id");

let currentArticle;

async function fetchArticle(id) {
  let fetchedData;
  console.log(id);
  const res = await fetch(apiURL + "articles/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  fetchedData = await res.json();

  console.log(fetchedData);

  displayArticles(fetchedData);
}

function displayArticles(data) {
  currentArticle = data[0];

  if (!currentArticle) {
    document.getElementById("article-content").remove();
  } else {
    document.getElementById("undefined-article").remove();
  }

  console.log(currentArticle);

  const articleSection = document.getElementById("article-content");

  const articleTitle = document.createElement("h1");
  articleTitle.innerText = currentArticle.articleTitle;

  const articleCoverContainer = document.createElement("div");
  articleCoverContainer.setAttribute("class", "article-cover-container");

  const articleCover = document.createElement("img");
  articleCover.setAttribute("src", currentArticle.articleCover);
  articleCover.setAttribute("class", "article-cover");

  const articleContent = document.createElement("div");
  articleContent.innerHTML = currentArticle.articleContent;

  articleSection.appendChild(articleTitle);
  articleSection.appendChild(articleCoverContainer);
  articleCoverContainer.appendChild(articleCover);
  articleSection.appendChild(articleContent);
}
fetchArticle(articleId);
