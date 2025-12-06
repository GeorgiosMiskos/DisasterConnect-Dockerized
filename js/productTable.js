
window.onload = function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    if (logged_user == null) {
        window.location.assign("index.html");}
    $("#nav-placeholder").load("./navbar/adminNavbar.html");
    $("#footer-placeholder").load("footer.html");
}

let $table = $('#table')
let $remove = $('#remove')
let $announce = $('#announce')
let selections = []

function getIdSelections() {  
    return $.map($table.bootstrapTable('getSelections'), function (row) { 
        return row.product_id
    })
}

function responseHandler(res) {
    $.each(res.rows, function (i, row) {     
        row.state = $.inArray(row.product_id, selections) !== -1 
    })
    return res
}

function vehicleResponseHandler(res) {
    let rows = []; 
    
    if (res.rows && res.rows.length > 0) {
        
        res.rows.forEach(function(row) {
            
            let rowData = {
                product_id: row.product_id,
                product_name: row.product_name,
                category_name: row.category_name,
                quantity: row.quantity,
                vehicle_id: row.vehicle_id
            };
           
            rows.push(rowData);
        });
    }

    
    return {
        total: rows.length, 
        rows: rows 
    };
}

function detailFormatter(index, row) {
    let html = []; 
    $.each(row, function (key, value) { 
        if (key === 'details') { 
            html.push('<p><b>' + key + ':</b> '); 
           
            $.each(value, function (detailKey, detailObj) {
                html.push('<br>&nbsp;&nbsp;&nbsp;&nbsp;<b>' + detailObj.detail_name + ':</b> ' + detailObj.detail_value);
            });
            html.push('</p>');
        } else {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        }
    });
    return html.join('');
}

function operateFormatter(value, row, index) {
    return [
        '<button class="changeAmount btn btn-secondary">Change Amount</button>'
    ].join('')
}

window.operateEvents = {
    'click .changeAmount': async function (e, value, row, index) { 
        const { value: amount } = await Swal.fire({
            title: "Enter product amount in base",
            text: row.product_name,
            input: "number",
            inputPlaceholder: "Enter amount",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to input a number!";
                }
            }
        });
        if (amount) {
            console.log(amount, row.product_id);
            $.post("./php/updateAmount.php", { product: row.product_id, amount: amount }, function (result) { 
                console.log(result)
                if (result == "Updated successfully") {
                    $table.bootstrapTable('refresh')
                }
            });
        }
    }
}

function initTable() {
    $('#table').bootstrapTable('destroy').bootstrapTable({ 
        height: 770,
        columns: [ 
            [{
                field: 'state',
                checkbox: true,
                rowspan: 2,
                align: 'center',
                valign: 'middle'
            }, {
                title: 'Product ID',
                field: 'product_id',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                sortable: true,
            }, {
                title: 'Product Name',
                field: 'product_name',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                sortable: true,
            }, {
                title: 'Product Details',
                colspan: 3,
                align: 'center'
            }],
            [{
                field: 'category_name',
                title: 'Category',
                sortable: true,
                align: 'center'
            }, {
                field: 'quantity',
                title: 'Amount',
                sortable: true,
                align: 'center'
            }, {
                field: 'operate',
                title: 'Change Amount',
                align: 'center',
                clickToSelect: false,
                events: window.operateEvents,
                formatter: operateFormatter
            }]
        ]
    })

    $('#vehicle-products-table').bootstrapTable('destroy').bootstrapTable({
        height: 770,
        columns: [
            [{
                title: 'Product ID',
                field: 'product_id',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                sortable: true,
            }, {
                title: 'Product Name',
                field: 'product_name',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                sortable: true,
            }, {
                title: 'Product Details',
                colspan: 3,
                align: 'center'
            }],
            [{
                field: 'category_name',
                title: 'Category',
                sortable: true,
                align: 'center'
            }, {
                field: 'quantity',
                title: 'Amount',
                sortable: true,
                align: 'center'
            }, {
                field: 'vehicle_id',
                title: 'Vehicle ID',
                sortable: true,
                align: 'center'
            }]
        ],

    })

    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {  
            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length) 
            $announce.prop('disabled', !$table.bootstrapTable('getSelections').length)

           
            selections = getIdSelections()
            
        })
    $remove.click(function () {
        let ids = getIdSelections()
        Swal.fire({
            title: "Are you sure?",
            text: "The products will be removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.post("./php/deleteProduct.php", { products: ids }, function (result) {
                    console.log(result)
                    if (result == 1) {
                        $table.bootstrapTable('remove', {   
                            field: 'product_id',
                            values: ids
                        })
                        $remove.prop('disabled', true)
                        Swal.fire({
                            title: "Deleted!",
                            text: "The products have been deleted.",
                            icon: "info"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: result,
                            icon: "error"
                        });
                    }
                });

            }
        });
    })
    $announce.click(function () {
        let ids = getIdSelections()
        console.log(ids);
        Swal.fire({
            title: "Are you sure?",
            text: "You will create announcements for the selected products!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.post("./php/uploadAnnouncement.php", { products: ids }, function (result) {
                    console.log(result)
                    if (result == 1) {
                        
                        $table.bootstrapTable('uncheckAll')
                        Swal.fire({
                            title: "Success!",
                            text: "The announcement has been created.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: result,
                            icon: "error"
                        });
                    }
                });

            }
        });
    })
}


$(function() {
    
    $('#addProductBtn').click(function() {
        $('#addProductModal').modal('show');
    });

    
    $('#addProductForm').on('submit', function(e) {
        e.preventDefault();

        console.log('mphka');
        const productName = document.getElementById("productName").value; 
        const categoryName = document.getElementById("categoryName").value;
        const quantity = document.getElementById("quantity").value;
       
       const detailNames = document.querySelectorAll('input[name="detail_name[]"]');
       const detailValues = document.querySelectorAll('input[name="detail_value[]"]');
       
       let details = [];
       detailNames.forEach((detailName, index) => {
           details.push({
               detail_name: detailName.value,
               detail_value: detailValues[index].value
           });
       });

       
       let formData = {
           productName: productName,
           categoryName: categoryName,
           quantity: quantity,
           details: JSON.stringify(details)
       };

       console.log(formData);

        $.post('./php/addProduct.php', formData, function(response) {
            console.log(response);
            if (response === 'Product added successfully') {
                $('#addProductModal').modal('hide');
                $('#table').bootstrapTable('refresh'); 
                Swal.fire({
                    title: 'Success!',
                    text: 'Product added successfully.',
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response,
                    icon: 'error'
                });
            }
        });
    });

    
    $('#addDetailBtn').click(function() {
        let detailRow = '<div class="row g-3 detailRow">' +
            '<div class="col-md-5"><input type="text" class="form-control" name="detail_name[]" placeholder="Detail Name" required></div>' +
            '<div class="col-md-5"><input type="text" class="form-control" name="detail_value[]" placeholder="Detail Value" required></div>' +
            '<div class="col-md-2"><button type="button" class="btn btn-danger removeDetail"><i class="fa fa-trash"></i></button></div>' +
            '</div>';

        $('#detailsContainer').append(detailRow);
    });

    
    $('#detailsContainer').on('click', '.removeDetail', function() {
        $(this).closest('.detailRow').remove();
    });
});



$(function () {
    initTable()
})
