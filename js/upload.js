
window.onload = function () { 
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    if (logged_user == null) {
        window.location.assign("index.html");}
    $("#nav-placeholder-admin").load("./navbar/adminNavbar.html");
    $("#footer-placeholder").load("footer.html");
}


const productsUpload = (input) => {
    
    const file = new FileReader(); 
    file.readAsText(input.files[0]); 

    file.onload = function (e) { 
        const data = JSON.parse(e.currentTarget.result); 
        console.log(data.items); 
        let products = [];
        data.items.map((item) => { 
            stuff = {}; 
            if (item.name !== undefined && item.name !== "") { 
                stuff.id = item.id;
                stuff.name = item.name;
                stuff.category = item.category;
                stuff.quantity = 0
                products.push(stuff);
            }
        });
        console.log(products);

        let categories = [];
        data.categories.map((category) => { 
            stuff = {};
            if (category.category_name !== undefined && category.category_name !== "") {
                stuff.id = category.id;
                stuff.name = category.category_name;
                categories.push(stuff);
            }
        });
        console.log(categories);

        let details = [];
        data.items.map((item) => { 
            if (item.name !== undefined && item.name !== "") {
                item.details.map((detail) => {
                    stuff = {};
                    if (detail.detail_name !== undefined && detail.detail_name !== "" && detail.detail_value !== "") {
                        stuff.product_id = item.id;
                        stuff.detail_name = detail.detail_name;
                        stuff.detail_value = detail.detail_value;
                        details.push(stuff);
                    }
                })
            }
        });
        console.log(details);

        document
            .getElementById("productsUploadButton")
            .addEventListener("click", function () { 
                Swal.fire({
                    title: "File uploading...",
                    showConfirmButton: false,
                });
                $.ajax({
                    url: "./php/uploadCategoriesProducts.php", 
                    type: "POST",
                    
                    data: { products: JSON.stringify(products), categories: JSON.stringify(categories), details: JSON.stringify(details), },
                    success: function (data) {
                        console.log(data);
                        if (data == 1) {
                            Swal.close();
                            Swal.fire({
                                icon: "success",
                                title: "File uploaded",
                                showConfirmButton: false,
                                timer: 2500,
                            });
                        }
                    },
                });
            });
    };

    file.onerror = function () {
        console.log(reader.error);
    };
};

document
    .getElementById("productsDownload")
    .addEventListener("click", function () {

        $.ajax({
            url: "http://usidas.ceid.upatras.gr/web/2023/export.php",
            type: "POST",
            dataType: 'json',
            success: function (data) {
                console.log(data);
                
            },
        });
    });


