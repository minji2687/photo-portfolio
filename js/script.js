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

function setEditMyInfo(on) {
  document.querySelector("#myinfo > div").classList = on ? "edit" : "non-edit";
  document.querySelectorAll("#myinfo input").forEach(function (input) {
    input.disabled = !on;
  });
  showMyInfo();
}

function updateMyInfo() {
  my_info.introduction = document.querySelector("#ip-intro").value;
  my_info.as = document.querySelector(
    "#myinfo input[type=radio]:checked"
  ).value;
  let interests = [];
  document
    .querySelectorAll("#myinfo input[type=checkbox]:checked")
    .forEach(function (checked) {
      interests.push(checked.value);
    });
  my_info.interest = interests;
  setEditMyInfo(false);
}
function showPhotos() {
  let gallery = document.querySelector("#gallery");

  photos.forEach(function (photo) {
    console.log(photo);
    let photoNode = document.querySelector("article.hidden").cloneNode(true);
    photoNode.classList.remove("hidden");

    photoNode.querySelector(".author").innerText = photo.user_name;
    photoNode.querySelector(".desc").innerText = photo.description;
    photoNode.querySelector(".like").innerText = photo.likes;
    if (my_info.like.indexOf(photo.idx) > -1) {
      photoNode.querySelector(".like").classList.add("on");
    }

    photoNode.querySelector(
      ".photo"
    ).style.backgroundImage = `url('./img/photo/${photo.file_name}')`;

    gallery.append(photoNode);
  });
}
function init() {
  showMyInfo();
  showPhotos();
}
