function setMenu(_menu) {
  let menus = document.querySelectorAll("nav li");
  console.log(menus);
  menus.forEach(function (menu) {
    menu.classList.remove("on");
  });
  document.querySelector("nav li." + _menu).classList.add("on");

  document.querySelector("main").className = _menu;
}

function setDescLength() {
  let descLengthSpan = document.querySelector("span.descLength");
  descLengthSpan.innerHTML =
    document.querySelector("input.description").value.length + "/20";
}

function showMyInfo() {
  document.querySelector("#myInfoId").innerHTML = my_info.id;
  document.querySelector("#myInfoUserName ").innerHTML = my_info.user_name;
  document.querySelector("#ip-intro ").value = my_info.introduction;
  document.querySelector("#sp-intro ").innerHTML = my_info.introduction;
  document.querySelector(
    "#myinfo input[type=radio][value=" + my_info.as + "]"
  ).checked = true;

  document
    .querySelectorAll("#myinfo input[type=checkbox]")
    .forEach(function (checkbox) {
      checkbox.checked = false;
    });
  my_info.interest.forEach(function (interest) {
    document.querySelector(
      "#myinfo input[type=checkbox][value=" + interest + "]"
    ).checked = true;
  });
}

function init() {
  showMyInfo();
}
