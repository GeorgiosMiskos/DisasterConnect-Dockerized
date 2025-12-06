window.onload = function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    if (logged_user == null) {
        window.location.assign("index.html");}
    $("#nav-placeholder").load("./navbar/adminNavbar.html");
    $("#footer-placeholder").load("footer.html");
}
const rescueRegisterForm = document.getElementById("rescueRegisterForm");


function validateEmail(mail) {
    const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
    return !isValid;
}

function validatePhoneNumber(phoneNumber) {
    
    const isValid = /^69\d{8}$/.test(phoneNumber);
    return !isValid;
}

function validateStrongPass(pass) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return !strongRegex.test(pass);
}

rescueRegisterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const first_name = document.getElementById("FName").value;
    const last_name = document.getElementById("LName").value;
    const email = document.getElementById("emaill").value;
    const phone = document.getElementById("phoneNum").value;
    const password = document.getElementById("password1").value;
    const passwordC = document.getElementById("password2").value;


    if (email === '') {
        Swal.fire({
            icon: "error",
            title: "Please enter your email!",
        });
    } else if (validateEmail(email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid email!",
        });
    } else if (first_name === '') {
        Swal.fire({
            icon: "error",
            title: "Please enter your first name!",
        });
    } else if (last_name === '') {
        Swal.fire({
            icon: "error",
            title: "Please enter your last name!",
        });
    } else if (phone === '') {
        Swal.fire({
            icon: "error",
            title: "Please enter your phone number!",
        });
    } else if (validatePhoneNumber(phone)) {
        alert2('Invalid phone number', 'danger');
        Swal.fire({
            icon: "error",
            title: "Invalid phone number!",
        });
    } else if (password === '') {
        Swal.fire({
            icon: "error",
            title: "Please enter password!",
        });
    } else if (validateStrongPass(password)) {
        Swal.fire({
            icon: "error",
            title: "Upper case, Lower case, Special character and Numeric letter are required in Password!",
        });
    } else if (password != passwordC) {
        Swal.fire({
            icon: "error",
            title: "Passwords do not match!",
        });
    } else {
        console.log("ole");
        const upload = $.ajax({
            url: './php/register.php',
            method: 'POST',
            
            data: { first_name: first_name, last_name: last_name, phone: phone, password: password, email: email, lat: null, lon: null, admin: 1 },
            success: function (data) {
                console.log(data)
            }
        });
        upload.done(success);
    }

    function success(result) {
        if (result == 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "This email is used, try another one!",
            });
        } else if (result == 1) {
            let randomLat = "38.2" + Math.floor(Math.random() * 900) + 100; 
            let randomLon = "21.7" + Math.floor(Math.random() * 900) + 100;

            console.log(randomLat, randomLon);

            const createVehicle = $.ajax({
                url: './php/createRescueVehicle.php',
                method: 'POST',
                
                data: { lat: randomLat, lon: randomLon },
                success: function (data) {
                    console.log(data)
                    if (data == 1){
                        Swal.fire({
                            title: "Registration complete",
                            text: "The rescuer account has been created successfully!",
                            icon: "success",
                        });
                    }
                }
            });
        } else if (result == 2) {
            Swal.fire({
                icon: "error",
                title: "An unexpected error has occurred!",
            });
        }
    }
})