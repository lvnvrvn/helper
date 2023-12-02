document.querySelectorAll(".question__list__item__img").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.target.children[2].classList.add("hide");
  });
});

if (localStorage.length === 0) {
  document.querySelector(".question__list").innerHTML =
    "У вас ещё нет вопросов";
  document.querySelector(".question__list").classList.add("no-questions");
} else {
  controlFooter();
}

function controlFooter() {
  if (window.innerHeight > 840) {
    document.querySelector(".footer").style.position = "absolute";
    document.querySelector(".footer").style.left = "0";
    document.querySelector(".footer").style.bottom = "0";
  } else {
    document.querySelector(".footer").style.position = "static";
  }
}

Array.from(questionListItems).forEach((item) => {
  item.style.display = "none";
});
if (localStorage.length) {
  if (localStorage.length === 1 && localStorage.getItem("helper__wasSeen")) {
    document.querySelector(".question__list").innerHTML =
      "У вас ещё нет вопросов";
    document.querySelector(".question__list").classList.add("no-questions");
  } else {
    const arrFromLocalStorage = [];
    for (let key of Object.keys(localStorage).filter((item) =>
      item.startsWith("choice-hepler")
    )) {
      arrFromLocalStorage.push(JSON.parse(localStorage.getItem(key)));
    }
    questionsAdding(arrFromLocalStorage);
  }
} else {
  questionListNotfound.innerHTML = "У вас ещё нет вопросов";
}
Array.from(document.querySelectorAll(".question__list__item")).forEach(
  (item) => {
    item.classList.add("mine");
  }
);

const questionImgs = document.querySelectorAll(".question__list__item__img");

questionImgs.forEach((item) => {
  Array.from(item.parentElement.children).forEach((item) => {
    item.classList.add("not-selected");
    item.classList.add("mine");
    item.children[1].classList.add("not-selected");
  });
  item.closest(".question__list__item__images").classList.add("mine");
  const mostRated = Math.max(
    ...Array.from(item.parentElement.children).map((item) => item.dataset.rate)
  );

  item.children[1].innerHTML = item.dataset.rate;

  Array.from(item.parentElement.children).forEach((item) => {
    if (Number(item.dataset.rate) === mostRated) {
      item.classList.remove("not-selected");
      item.classList.add("selected");
      item.classList.add("mine");
      item.children[1].classList.remove("not-selected");
      item.children[1].classList.add("selected");
      item.children[3].style.display = "block";
    } else {
    }
  });
});
