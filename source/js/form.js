var form = document.querySelector(".form");
var catName = form.querySelector("[name=cat-name]");
var catWeight = form.querySelector("[name=cat-weight]");
var contactEmail = form.querySelector("[name=email]");
var contactTel = form.querySelector("[name=tel]");

form.addEventListener("submit", function(evt) {
  if (!catName.value || !catWeight.value || !contactEmail.value || !contactTel.value) {
    evt.preventDefault();
    catName.classList.remove("form__input--invalid");
    catWeight.classList.remove("form__input--invalid");
    contactEmail.classList.remove("form__input--invalid");
    contactTel.classList.remove("form__input--invalid");
    if (!catName.value) {
      catName.classList.add("form__input--invalid");
    } else if (!catWeight.value) {
      catWeight.classList.add("form__input--invalid");
    } else if (!contactEmail.value) {
      contactEmail.classList.add("form__input--invalid");
    } else if (!contactTel.value) {
      contactTel.classList.add("form__input--invalid");
    }
  }
})
