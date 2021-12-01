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
  updateMyInfoOnDB();
}

function showPhotos() {
  let existingNodes = document.querySelectorAll("article:not(.hidden)");
  existingNodes.forEach(function (existingNode) {
    existingNode.remove();
  });
  let gallery = document.querySelector("#gallery");

  photos.forEach(function (photo) {
    let photoNode = document.querySelector("article.hidden").cloneNode(true);
    photoNode.classList.remove("hidden");

    photoNode.querySelector(".author").innerText = photo.user_name;
    photoNode.querySelector(".desc").innerText = photo.description;
    photoNode.querySelector(".like").innerText = photo.likes;

    if (my_info.like.indexOf(photo.idx) > -1) {
      photoNode.querySelector(".like").classList.add("on");
    }

    if (my_info.follow.indexOf(photo.user_id) > -1) {
      var followSpan = document.createElement("span");
      followSpan.innerHTML = "FOLLOW";
      photoNode.querySelector(".author").append(followSpan);
    }

    photoNode.querySelector(".author").addEventListener("click", function () {
      toggleFollow(photo.user_id);
    });

    photoNode.querySelector(
      ".photo"
    ).style.backgroundImage = `url('${photo.url}')`;
    photoNode.querySelector(".like").addEventListener("click", function () {
      toggleLike(photo.idx);
    });

    gallery.append(photoNode);
  });
}

function toggleFollow(user_id) {
  console.log("follow");
  if (my_info.follow.indexOf(user_id) === -1) {
    my_info.follow.push(user_id);
  } else {
    my_info.follow = my_info.follow.filter(function (it) {
      return it !== user_id;
    });
  }

  db.collection("my_info")
    .doc(my_info.docId)
    .update({
      follow: my_info.follow,
    })
    .then(function () {
      loadPhotos();
    });
}

function toggleLike(idx) {
  if (my_info.like.indexOf(idx) === -1) {
    //좋아요 하려고 누른것
    my_info.like.push(idx);
    for (var i = 0; i < photos.length; i++) {
      if (photos[i].idx === idx) {
        photos[i].likes++;
        toggleLikeOnDB(photos[i]);
        break;
      }
    }
  } else {
    my_info.like = my_info.like.filter(function (it) {
      return it !== idx;
    });
    for (var i = 0; i < photos.length; i++) {
      if (photos[i].idx === idx) {
        photos[i].likes--;
        toggleLikeOnDB(photosc[i]);
        break;
      }
    }
  }
}

function toggleLikeOnDB(photo) {
  db.collection("my_info")
    .doc(my_info.docId)
    .update({
      like: my_info.like,
    })
    .then(function () {
      db.collection("photos")
        .doc(String(photo.idx))
        .update({
          likes: photo.likes,
        })
        .then(function () {
          loadPhotos();
        });
    });
}

function init() {
  loadMyInfo();
  loadPhotos();
}

function loadMyInfo() {
  db.collection("my_info")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        my_info = doc.data();
        console.log(doc.id);
        my_info.docId = doc.id;

        showMyInfo();
        // console.log(`${d oc.id} => ${doc.data()}`);
      });
    });
}

function updateMyInfoOnDB() {
  db.collection("my_info")
    .doc(my_info.docId)
    .update({
      introduction: my_info.introduction,
      as: my_info.as,
      interest: my_info.interest,
    })
    .then(function () {
      loadMyInfo();
    });
}

function uploadFile() {
  let file = document.querySelector("input[type=file]").files[0];

  //올릴 파일의 단위
  var ref = storage.ref().child(file.name);
  ref.put(file).then(function (snapshot) {
    snapshot.ref.getDownloadURL().then(function (url) {
      console.log(url);
      uploadPhotoInfo(url);
    });
  });
}

function uploadPhotoInfo(url) {
  let photoInfo = {
    idx: Date.now(),
    url: url,
    user_id: my_info.id,
    user_name: my_info.user_name,
    description: document.querySelector("input.description").value,
    likes: Math.round(Math.random() * 10),
  };
  db.collection("photos")
    .doc(String(photoInfo.idx))
    .set(photoInfo)
    .then(function () {
      console.log("Success!");
      setMenu("gallery");
      loadPhotos();
    })
    .catch(function (error) {
      console.error("Error!", error);
    });
}

function loadPhotos() {
  db.collection("photos")
    .get()
    .then(function (querySnapshot) {
      let photosArray = [];
      querySnapshot.forEach(function (doc) {
        photosArray.push(doc.data());
      });
      photos = photosArray;
      showPhotos();
    });
}
