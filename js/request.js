
window.onload = function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    if (logged_user == null) {
        window.location.assign("index.html");}
    

    $("#nav-placeholder").load("./navbar/citizenNavbar.html");
    $("#footer-placeholder").load("footer.html");

    const categoryElement = $("#inputCategory");
    const productElement = $("#inputProduct");
    const peopleElement = document.getElementById("inputPeople");
    const quantityElement = document.getElementById("inputProductQuantity");
    const forms = document.getElementsByClassName("needs-validation");

    productElement.prop('disabled', true);
    productElement.selectpicker('refresh');

    $.post("./php/getCategories.php").done(function (data) {
        
        getCategories(JSON.parse(data));
    }, "json");


    function getCategories(result) {

        result.map((category) => {
            categoryElement.append(new Option(category.category_name, category.category_id));
        });
        categoryElement.selectpicker("refresh");

        categoryElement.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
            

            $.post("./php/getProducts.php", {
                category: categoryElement.val(),
            }).done(function (data) {
                getProducts(JSON.parse(data));
            });

            function getProducts(result) {
                productElement.prop('disabled', false);

                productElement.empty();
                result.map((product) => {
                    productElement.append(new Option(product.product_name, product.product_id));
                });
                productElement.selectpicker("refresh");
            }
        });
    }
    

    const validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
            "submit",
            function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.preventDefault();
                    upload();
                    form.classList.add("was-validated");
                }
            },
            false
        );
    });

    function upload() {
        $.post("./php/uploadRequest.php", {
            people: peopleElement.value,
            product: productElement.val(),
            quantity: quantityElement.value ,
            user_id: logged_user[0].user_id
        }).done(function (data) {
            
            location.reload(true);
        });
        console.log("success");
    }
}

function empty(element) {
    element.options.length = 0;
}
