window.onload = function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    if (logged_user == null) {
        window.location.assign("index.html");}
    $("#nav-placeholder").load("./navbar/citizenNavbar.html");
    $("#footer-placeholder").load("footer.html");

    const productAjax = $.ajax({
        url: './php/getProducts.php',
        method: 'POST',
        dataType: 'json',
        data: { category: 0 },
        success: function (data) {
            productsData = data;
            getAnnouncements()
        }
    });

    let productsData = {};
    const productElement = $("#productDropdown");

    function getAnnouncements() {
        const announcementsAjax = $.ajax({
            url: './php/getAnnouncements.php',
            method: 'POST',
            dataType: 'json',
            data: { category: 0 },
            success: function (data) {
            }
        });
        announcementsAjax.done(populateAnnouncements);
    }

    function populateAnnouncements(announcementsData) {

        
        const dynamicAnnouncements = document.getElementById("dynamicAnnouncements");

        let i = 1;
        announcementsData.forEach(announcement => {
            const listItem = document.createElement("a");
            listItem.setAttribute("href", "#");
            listItem.classList.add("list-group-item", "list-group-item-action", "mb-3", "border", "rounded-1");

            const daysAgoText = `${announcement.days_created_ago} days ago`;

            const announcementText = generateAnnouncementText(announcement.product_ids);
            listItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">Announcement ${i}</h5>
                <small class="text-muted">${daysAgoText}</small>
            </div>
            <p class="mb-1">${announcementText}</p>
            `;
          
            listItem.addEventListener('click', () => {

                populateProductDropdown(announcement.product_ids);

                new bootstrap.Modal(document.getElementById('modal')).show();
            });

            dynamicAnnouncements.appendChild(listItem);
            i++;
        });

    }

    
    function generateAnnouncementText(productIds) {
        const productNames = productIds.map(productId => getProductById(productId).product_name);
        return `Looking for ${productNames.join(', ')}. Contact us if you have them.`;
    }

   
    function hideModal() {
        new bootstrap.Modal(document.getElementById('modal')).hide();
    }

    function populateProductDropdown(productIds) {
        productElement.empty();
        productIds.map((productId) => {
            let product = getProductById(productId);
            productElement.append(new Option(product.product_name, productId));
        });
        productElement.selectpicker("refresh");
        updateSelectedProducts();
        
        productElement.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
            updateSelectedProducts();
        });
    }

    function updateSelectedProducts() {
        const selectedProductsContainer = $("#selectedProductsContainer");
        selectedProductsContainer.empty();
        
        productElement.find('option:selected').each(function () {
            const productId = $(this).val();
            const productName = $(this).text();
            
            const productInput = $(`
                <div class="mb-3">
                    <label for="product_${productId}" class="form-label">${productName} Quantity:</label>
                    <input type="number" class="form-control" id="product_${productId}" name="product_${productId}" placeholder="Enter quantity">
                </div>
            `);
            
            selectedProductsContainer.append(productInput);
        });
    }

    function getProductById(productId) {
        return productsData.find(product => product.product_id === productId);
    }


    document.getElementById('modal').addEventListener('submit', function (event) {
        event.preventDefault();

       
        const selectedProducts = [];
        $("#selectedProductsContainer .mb-3").each(function () {
            const input = $(this).find("input");
            const productId = input.attr("id").split("_")[1];
            const quantity = input.val();
            console.log(quantity);
            selectedProducts.push({ product_id: productId, quantity: quantity });
        });
       
        $.ajax({
            url: "./php/uploadOffer.php",
            type: "POST",
            data: { products: JSON.stringify(selectedProducts) },
            success: function (data) {
                console.log(data);
                if (data == 1) {
                    hideModal();
                    Swal.fire({
                        icon: "success",
                        text: 'Your offer has been received',
                        title: "Thank you",
                        showConfirmButton: true,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong",
                        showConfirmButton: true,
                        timer: 2500,
                    });
                }
            },
        });
    });
}
