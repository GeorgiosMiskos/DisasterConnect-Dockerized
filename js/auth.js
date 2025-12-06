function checkLogin() {
  const logged_user = JSON.parse(localStorage.getItem("logged_user"));
  if (logged_user == null) {
      window.location.assign("index.html");
  }
}

checkLogin();