window.onload = function () {  
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    if (logged_user == null) {
        window.location.assign("index.html");}
    
    if (logged_user[0].admin === "2") { 
        $("#nav-placeholder").load("./navbar/adminNavbar.html"); 
    } else if (logged_user[0].admin === "1") { 
        $("#nav-placeholder").load("./navbar/rescuerNavbar.html");
    } else if (logged_user[0].admin === "0") { 
        $("#nav-placeholder").load("./navbar/citizenNavbar.html");
    }
    $("#footer-placeholder").load("footer.html"); 
}