const apiURL = "http://localhost:3000/api/";

const errorBlock = document.getElementById("error-unauthorized");
const writeArticleBlock = document.getElementById("write-article");

const user = JSON.parse(localStorage.getItem("user"));

if (user != null) {
  if (user.roleId == 0) {
    writeArticleBlock.remove();
  } else {
    errorBlock.remove();
  }
} else {
  writeArticleBlock.remove();
}

const articleContentContainer = document.getElementById("article-content");

const submitArticle = async (e) => {
  e.preventDefault();

  const articleTitle = document.getElementById("article-title");
  const articleCover = document.getElementById("article-cover");
  const articleContent = document.getElementById("article-content");

  const title = articleTitle.value;
  const cover = articleCover.value;
  const content = articleContent.innerHTML;

  const newArticle = {
    userId: user.userId,
    articleTitle: title,
    articleCover: cover,
    articleContent: content,
  };
  console.log(newArticle);
  try {
    const response = await fetch(apiURL + "articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newArticle),
    });

    if (response.status === 201) {
      const res = await response.json();
      console.log(res);
      setTimeout(() => {
        window.location.href = "./index.html";
      });
    } else {
      let errorMessage = response;
      console.log(errorMessage);
    }
  } catch (err) {
    console.log(err);
    let errorMessage = error.res.data.error; // Si une erreur se produit, on la retourne
    console.log("erreur: " + error + " test " + error.response.data.error);
  }
};

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
