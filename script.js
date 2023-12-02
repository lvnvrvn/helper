// Modal closing
const closeModal = document.querySelectorAll(".close");
const modal = document.querySelector(".modal");
const greetingModal = document.querySelector(".greeting__modal");

if (!localStorage.getItem("helper__wasSeen")) {
  modal.style.display = "flex";
}

closeModal.forEach((close) => {
  close.addEventListener("click", function () {
    greetingModal.classList.add("closing");
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
    }, 600);
  });
  localStorage.setItem("helper__wasSeen", true);
});

// Questions Displaying
const questionList = document.querySelector(".question__list__content");

function questionsAdding(storage) {
  storage.forEach((item) => {
    const questionCard = document.createElement("div");
    questionCard.classList.add("question__list__item");
    const questionImages = document.createElement("div");
    questionImages.classList.add("question__list__item__images");
    item.urls.forEach((url, index) => {
      const questionImg = document.createElement("div");
      questionImg.classList.add("question__list__item__img");
      questionImg.style.background = `url(${url}) no-repeat center`;
      questionImg.style.backgroundSize = "cover";
      questionImg.dataset.rate = item.rate[index];

      let isVoted = false;

      questionImg.addEventListener("click", function () {
        if (isVoted) {
          return;
        }
        questionImg
          .closest(".question__list__item__images")
          .classList.add("voted");
        const rateValues = Array.from(
          questionImg.closest(".question__list__item__images").children
        )
          .map((item) => +item.dataset.rate)
          .sort((a, b) => a - b)
          .reverse();
        Array.from(
          questionImg.closest(".question__list__item__images").children
        ).forEach(
          (item) =>
            (item.style.order = `${rateValues.indexOf(+item.dataset.rate)}`)
        );

        isVoted = true;

        Array.from(questionImg.parentNode.children).forEach(
          (item) => (item.children[2].style.display = "none")
        );

        questionImg.children[2].style.display = "block";

        Array.from(
          questionImg.closest(".question__list__item__images").children
        ).forEach((item) => {
          item.classList.add("not-selected");
          item.children[1].classList.add("not-selected");
          item.children[1].innerHTML = item.dataset.rate;
        });
        const mostRated = Math.max(
          ...Array.from(this.parentElement.children).map(
            (item) => item.dataset.rate
          )
        );
        Array.from(this.parentElement.children).forEach((item) => {
          if (Number(item.dataset.rate) === mostRated) {
            item.classList.remove("not-selected");
            item.classList.add("selected");
            item.children[3].style.display = "block";
            item.children[1].classList.remove("not-selected");
            item.children[1].classList.add("selected");
          } else {
          }
        });
      });
      const questionImgName = document.createElement("div");
      questionImgName.classList.add("question__list__item__name");
      questionImgName.innerHTML = item.optionNames[index];
      questionImg.append(questionImgName);
      const questionItemPercent = document.createElement("div");
      questionItemPercent.classList.add("question__list__item__percent");

      const questionItemClue = document.createElement("div");
      questionItemClue.classList.add("question__list__item__clue");
      questionItemClue.innerHTML = "Ваш выбор";
      const questionItemClueLeft = document.createElement("div");
      questionItemClueLeft.classList.add("question__list__item__clue");
      questionItemClueLeft.classList.add("clue--left");
      questionItemClueLeft.innerHTML = "Больше голосов";

      questionImg.append(questionItemPercent);
      questionImg.append(questionItemClue);
      questionImg.append(questionItemClueLeft);
      questionImages.append(questionImg);
    });
    questionCard.append(questionImages);
    const questionTitle = document.createElement("h3");
    questionTitle.classList.add("question__list__item__title");
    questionTitle.innerHTML = item.title;
    const questionIcon = document.createElement("img");
    questionIcon.classList.add("question__list__item__icon");
    questionIcon.setAttribute("src", "./images/thinking.png");
    questionTitle.append(questionIcon);
    questionCard.append(questionTitle);
    const questionComment = document.createElement("p");
    questionComment.classList.add("question__list__item__text");
    questionComment.innerHTML = item.comment;
    questionCard.append(questionComment);
    questionList.append(questionCard);
  });
}

if (localStorage.length) {
  if (localStorage.length === 1 && localStorage.getItem("helper__wasSeen")) {
    questionsAdding(QUESTIONS);
  } else {
    const arrFromLocalStorage = [];
    for (let key of Object.keys(localStorage).filter(item => item.startsWith('choice-hepler'))) {
      arrFromLocalStorage.push(JSON.parse(localStorage.getItem(key)));
    }
    questionsAdding(arrFromLocalStorage);
    questionsAdding(QUESTIONS);
  }
} else {
  questionsAdding(QUESTIONS);
}

const questionImgNames = document.querySelectorAll(
  ".question__list__item__name"
);

questionImgNames.forEach((item) => {
  if (item.textContent.length > 25) {
    item.dataset.fullText = item.textContent;
    item.textContent = item.textContent.slice(0, 25) + "...";
    item.addEventListener("mouseover", function () {
      item.textContent = item.dataset.fullText;
    });
    item.addEventListener("mouseleave", function () {
      item.textContent = item.textContent.slice(0, 25) + "...";
    });
  }
});

// Search
const questionListSearch = document.querySelector(".question__list__search");
const questionListItems = document.querySelectorAll(".question__list__item");
const questionListNotfound = document.querySelector(
  ".question__list__notfound"
);
const questionListTitle = document.querySelector(".question__list__title");
const questionListResults = document.querySelector(".question__list__results");

questionListSearch.addEventListener("focusout", function () {
  if (this.value !== "") {
    this.nextElementSibling.classList.add("focused");
  } else {
    this.nextElementSibling.classList.remove("focused");
  }
});

questionListSearch.addEventListener("input", function (e) {
  const filteredList = Array.from(questionListItems).filter((item) => {
    return item.children[1].textContent
      .toLowerCase()
      .includes(e.target.value.toLowerCase().trim());
  });
  if (e.target.value.trim() === "") {
    questionListResults.style.display = "none";
    Array.from(questionListItems).forEach((item) => {
      item.style.display = "block";
    });
  } else {
    questionListResults.style.display = "block";
    questionListResults.innerHTML = `Результатов: ${filteredList.length}`;
  }
  Array.from(questionListItems).forEach((item) => {
    item.style.display = "none";
  });
  if (filteredList.length === 0) {
    questionListNotfound.style.display = "block";
    questionListTitle.style.display = "none";
  } else {
    questionListNotfound.style.display = "none";
    questionListTitle.style.display = "block";
  }
  filteredList.forEach((item) => {
    item.style.display = "block";
  });
});

// Input value clear
const questionListSearchClear = document.querySelector(
  ".question__list__search__clear"
);
questionListSearchClear.addEventListener("click", function () {
  questionListSearch.value = "";
  questionListSearch.focus();
  Array.from(questionListItems).forEach((item) => {
    item.style.display = "block";
  });
  questionListNotfound.style.display = "none";
  questionListResults.style.display = "none";
  questionListTitle.style.display = "block";
});
