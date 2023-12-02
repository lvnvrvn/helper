document
  .querySelector(".create__add__option")
  .addEventListener("click", controlFooter);

function controlFooter() {
  setTimeout(() => {
    if (document.querySelector(".create__options__row").clientHeight > 0) {
      document.querySelector(".footer").style.position = "static";
    } else if (
      document.querySelector(".create__options__row").clientHeight === 0 &&
      window.innerHeight > 840
    ) {
      document.querySelector(".footer").style.position = "absolute";
    }
  }, 10);
}

// Create
const textHelper = document.querySelector(".create__text__helper");
const createFormInput = document.querySelector(".create__form__input");
const createFormLabel = document.querySelector(".create__form__label");

const createFormInputs = document.querySelectorAll(
  ".create__form__input__item"
);

createFormInputs.forEach((input) => {
  input.addEventListener("focusout", function () {
    if (this.value !== "") {
      this.nextElementSibling.classList.add("focused");
    } else {
      this.nextElementSibling.classList.remove("focused");
    }
  });
});

textHelper.addEventListener("click", function () {
  createFormInput.focus();
  createFormInput.value = "";
  createFormInput.value = textHelper.textContent + " ";
  textHelper.classList.add("active");
});

// Option Adding
const createOptionsRow = document.querySelector(".create__options__row");
const createAddOption = document.querySelector(".create__add__option");
const choosePhotoSpans = document.querySelectorAll(".choose__photo");
const createFileInputs = document.querySelectorAll(".create__file__input");
const createImgList = document.querySelector(".create__img__list");

let imgUrls = [];

createAddOption.addEventListener("click", function (e) {
  e.preventDefault();

  if (createOptionsRow.children.length > 5) {
    createAddOption.innerHTML = "Лимит превышен";
    createAddOption.style.opacity = "0.6";
    return;
  }

  const divOption = document.createElement("div");
  divOption.classList.add("create__option");
  const deleteOption = document.createElement("div");
  deleteOption.innerHTML = "&times;";
  deleteOption.classList.add("create__option__delete");
  deleteOption.addEventListener("click", function () {
    divOption.remove();
    if (createOptionsRow.children.length <= 5) {
      createAddOption.innerHTML = "Добавить вариант";
      createAddOption.style.opacity = "1";
    }
    Array.from(createOptionsRow.children).forEach(
      (item, index) =>
        (item.children[1].children[0].innerHTML = index + 1 + ".")
    );
    controlFooter();
  });
  divOption.append(deleteOption);
  const titleOption = document.createElement("div");
  titleOption.classList.add("create__option__title");
  const optionNum = document.createElement("span");
  optionNum.innerHTML = `${createOptionsRow.childElementCount + 1}.`;
  const inputTitleOption = document.createElement("input");
  inputTitleOption.classList.add("create__option__input");
  inputTitleOption.setAttribute("placeholder", "Введите вариант");
  const inputDoneOption = document.createElement("div");
  inputDoneOption.classList.add("option__done");
  inputDoneOption.innerHTML = "&#10004;";
  inputTitleOption.addEventListener("focusout", () => {
    inputDoneOption.classList.add("done");
  });
  inputTitleOption.addEventListener("focus", () => {
    inputDoneOption.classList.remove("done");
  });
  titleOption.append(optionNum);
  titleOption.append(inputTitleOption);
  titleOption.append(inputDoneOption);
  divOption.append(titleOption);
  const labelOption = document.createElement("label");
  labelOption.classList.add("create__file__label");
  labelOption.setAttribute(
    "for",
    "create__file__input" + createOptionsRow.childElementCount + 1
  );
  const inputFileOtion = document.createElement("input");
  inputFileOtion.setAttribute(
    "id",
    "create__file__input" + createOptionsRow.childElementCount + 1
  );
  inputFileOtion.setAttribute("type", "file");
  inputFileOtion.setAttribute("accept", "image/*");
  inputFileOtion.classList.add("create__file__input");
  const choosePhotoSpan = document.createElement("span");
  choosePhotoSpan.classList.add("choose__photo");
  choosePhotoSpan.innerHTML = "Выберите фото";
  labelOption.append(inputFileOtion);
  labelOption.append(choosePhotoSpan);
  divOption.append(labelOption);
  const divPhotoOption = document.createElement("div");
  divPhotoOption.classList.add("create__img__list");
  divOption.append(divPhotoOption);
  createOptionsRow.append(divOption);

  // File Reader
  divOption.children[2].children[1].addEventListener("click", function () {
    if (this.parentNode.nextElementSibling.children.length === 1) {
      return;
    }

    this.previousElementSibling.addEventListener("input", function () {
      this.nextElementSibling.style.opacity = "0.5";
      this.nextElementSibling.innerHTML = "Только одно";
    });

    this.previousElementSibling.addEventListener("change", function () {
      if (this.value) {
        this.setAttribute("disabled", true);
      } else {
        this.removeAttribute("disabled");
      }
      const divListPhoto = this.parentNode.nextElementSibling;
      if (divListPhoto.childElementCount >= 1) {
        return;
      }
      let file = this.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", function () {
        let img = document.createElement("div");
        img.classList.add("create__img");
        divListPhoto.innerHTML = "";
        divListPhoto.append(img);
        img.style.background = `url(${reader.result}) no-repeat center`;
        img.style.backgroundSize = "cover";
        if (imgUrls.includes(reader.result)) {
          return;
        } else {
          imgUrls.push(reader.result);
        }
        img.addEventListener("click", function (e) {
          img.classList.add("deleted");
          img.parentNode.previousElementSibling.children[1].style.opacity = "1";
          img.parentNode.previousElementSibling.children[1].innerHTML =
            "Выберите фото";
          setTimeout(() => {
            img.remove();
          }, 600);
          img.parentNode.previousElementSibling.children[0].value = "";
          let filtered = imgUrls.filter((item) => item !== reader.result);
          imgUrls = filtered;
        });
      });
    });

    this.previousElementSibling.dispatchEvent(new Event("change"));
  });
});

const createInputTextarea = document.querySelector(".create__input__text");
const createImgs = document.querySelectorAll(".create__img");
const createBtn = document.querySelector(".create__btn");
const id = "choice-helper" + Math.random().toString(16).slice(2);

createBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const imagesNames = document.querySelectorAll(".create__option__input");
  const namesValues = [];
  imagesNames.forEach((item) => {
    namesValues.push(item.value);
  });

  const id = "choice-hepler" + Math.random().toString(16).slice(2);
  const newObj = {};
  newObj.title = createFormInput.value;
  newObj.comment = createInputTextarea.value;
  newObj.optionNames = [...namesValues];
  newObj.urls = [...imgUrls];
  newObj.rate = new Array(6);
  for (let i = 0; i < newObj.rate.length; i++) {
    newObj.rate[i] = Math.floor(Math.random() * 30);
  }
  localStorage.setItem(id, JSON.stringify(newObj));
  window.location.href = "index.html";
});
