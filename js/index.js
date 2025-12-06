const signInAlert = document.getElementById('signInAlert')
const signUpAlert = document.getElementById('signUpAlert')
const loginForm = document.getElementById("loginForm");  
const registerForm = document.getElementById("registerForm"); 

let latitude, longitude

function alert1(message, type) { 
    const wrapper = document.createElement('div')
    wrapper.id = 'loginAlert';
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible"role="alert">' + message + '<button type="button" class="btn-close"data-bs-dismiss="alert" aria-label="Close"></button></div>'

    signInAlert.append(wrapper)
}

function alert2(message, type) { 
    const wrapper = document.createElement('div')
    wrapper.id = 'regAlert';
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible"role="alert">' + message + '<button type="button" class="btn-close"data-bs-dismiss="alert" aria-label="Close"></button></div>'

    signUpAlert.append(wrapper)
}

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => { 
    const dismissAlert = document.getElementById("loginAlert")
    container.classList.add("right-panel-active"); 
    if (dismissAlert !== null) { 
        dismissAlert.remove()
    }
});

signInButton.addEventListener('click', () => { 
    const dismissAlert = document.getElementById("regAlert") 
    container.classList.remove("right-panel-active"); 
    if (dismissAlert !== null) { 
        dismissAlert.remove()
    }
});

loginForm.addEventListener("submit", (e) => { 
    e.preventDefault(); 
    const dismissAlert = document.getElementById("loginAlert") 
    if (dismissAlert !== null) {
        dismissAlert.remove()
    }
    const email = document.getElementById("Lemail").value;
    const password = document.getElementById("Lpassword").value;

    if (email === '') { 
        alert1('Please enter your email!', 'danger');
        Lemail.focus();
    } else if (password === '') {
        alert1('Please enter Password', 'danger');
        Lpassword.focus();
    } else {
        const upload = $.ajax({ 
            url: './php/login.php',
            method: 'POST',
            dataType: 'json',
            data: { email: email, password: password },
            success: function (data) {
                console.log(data)
                if (typeof data === "object") {
                    localStorage.setItem("logged_user", JSON.stringify(data)); 
                    window.location.assign("home.html"); 
                } else if (data == "2") {
                    alert1('Incorrect username or password', 'danger') 
                } else {
                    alert1('An unexpected error has occurred', 'danger')  
                }
            }
        });
    }
});


function validateEmail(mail) {
    const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);

    return !isValid; 
}

function validatePhoneNumber(phoneNumber) {
    
    const isValid = /^69\d{8}$/.test(phoneNumber);

    return !isValid; 
}

registerForm.addEventListener("submit", (e) => { 
    e.preventDefault();
    const dismissAlert = document.getElementById("regAlert")
    if (dismissAlert !== null) {
        dismissAlert.remove() 
    }
    const first_name = document.getElementById("RFirstName").value; 
    const last_name = document.getElementById("RLastName").value;
    const email = document.getElementById("Remail").value;
    const phone = document.getElementById("Rphone").value;
    const password = document.getElementById("Rpassword").value;
    const passwordC = document.getElementById("RpasswordC").value;


    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


    if (email === '') {
        alert2('Please enter your email', 'danger');
        Remail.focus();
    } else if (validateEmail(email)) {
        alert2('Invalid email', 'danger');
        Remail.focus();
    } else if (first_name === '') {
        alert2('Please enter your first name.', 'danger');
        RFirstName.focus();
    } else if (last_name === '') {
        alert2('Please enter your last name.', 'danger');
        RLastName.focus();
    } else if (phone === '') {
        alert2('Please enter your phone number.', 'danger');
        Rphone.focus();
    } else if (validatePhoneNumber(phone)) {
        alert2('Invalid phone number', 'danger');
        Rphone.focus();
    } else if (password === '') {
        alert2('Please enter password', 'danger');
        Rpassword.focus();
    } else if (!strongRegex.test(password)) {
        alert2('Upper case, Lower case, Special character and Numeric letter are required in Password', 'danger');
        Rpassword.focus();
    } else if (password != passwordC) {
        alert2('Passwords do not match', 'danger');
        Rpassword.focus();
    } else { 
        const upload = $.ajax({ 
            url: './php/register.php',
            method: 'POST',
            dataType: 'json',
            data: { first_name: first_name, last_name: last_name, phone: phone, password: password, email: email, lat: latitude, lon: longitude, admin: 0 },
            success: function (data) {
                console.log(data)
            }
        });
        upload.done(success); 
    }

    function success(result) {
        if (result === 0) { 
            alert2('This email is used, try another one', 'danger')
        } else if (result === 1) { 
            container.classList.remove("right-panel-active");
            alert1('Account has been created successfully', 'success')
        } else if (result === 2) { 
            alert2('An unexpected error has occurred', 'danger')
        }
    }
});


if (navigator.geolocation) {  
    navigator.geolocation.getCurrentPosition(getCoordinates, showError); 
} else {
    Swal.fire({ 
        icon: "error",
        title: "Geolocation is not supported by this browser!",
    });
}

function showError(error) { 
    switch (error.code) {
        case error.PERMISSION_DENIED:  
            Swal.fire({
                icon: "error",
                title: "Geolocation is not supported by this browser!",
            });
            break;
        case error.POSITION_UNAVAILABLE:  
            Swal.fire({
                icon: "error",
                title: "Location information is unavailable.",
            });
            break;
        case error.TIMEOUT:  
            Swal.fire({
                icon: "error",
                title: "The request to get user location timed out.",
            });
            break;
        case error.UNKNOWN_ERROR: 
            Swal.fire({
                icon: "error",
                title: "An unknown error occurred.",
            });
            break;
    }
}

function getCoordinates(position) { //position automata apo to geolocation api 
    // console.log(position.coords.latitude,
    //     position.coords.longitude)
    latitude = position.coords.latitude
    longitude = position.coords.longitude
}