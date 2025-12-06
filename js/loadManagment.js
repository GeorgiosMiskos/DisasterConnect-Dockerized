
const logged_user = JSON.parse(localStorage.getItem("logged_user"));
if (logged_user == null) {
    window.location.assign("index.html");}

$("#nav-placeholder").load("./navbar/rescuerNavbar.html");
$("#footer-placeholder").load("footer.html");

let params = new URLSearchParams(window.location.search),
    vehicle_id = params.get("vehicle_id");


let $table = $('#table')


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
        '<button class="selectProduct btn btn-secondary">Select</button>'
    ].join('')
}

window.operateEvents = {
    'click .selectProduct': async function (e, value, row, index) {
        const maxValue = row.quantity;

        const { value: amount } = await Swal.fire({ 
            title: 'Load Product',
            text: 'Input an amount of \'' + row.product_name + '\' to load to the vehicle. Max amount: ' + row.quantity,
            input: 'number',
            inputValidator: (value) => {
                const isValid = /^[0-9]*$/.test(value);
                if (!value || value == 0) {
                    return "You need to input a number!";
                } else if (!isValid) {
                    return "Please input an integer!";
                } else if (parseInt(value) > parseInt(maxValue)) {
                    return "Please Enter a lower amount. Max amount in base: " + maxValue;
                }
            }
        })
        if (amount) {
            $.post("./php/uploadVehicleProduct.php", { product_id: row.product_id, product_name: row.product_name, vehicle_id: vehicle_id, old_ammount: row.quantity, new_amount: amount }, function (result) { //καλω ajax
                console.log(result)
                if (result == "11") {
                    $table.bootstrapTable('refresh') 
                }
            });
        }
    }
}

function initTable() {
    $table.bootstrapTable('destroy').bootstrapTable({
        height: 770,
        columns: [
            {
                title: 'Product ID',
                field: 'product_id',
                align: 'center',
                valign: 'middle',
                sortable: true,
            },
            {
                title: 'Product Name',
                field: 'product_name',
                align: 'center',
                valign: 'middle',
                sortable: true,
            },
            {
                field: 'category_name',
                title: 'Category',
                sortable: true,
                align: 'center'
            },
            {
                field: 'quantity',
                title: 'Amount',
                sortable: true,
                align: 'center'
            },
            {
                field: 'operate',
                title: 'Select Product',
                align: 'center',
                clickToSelect: false,
                events: window.operateEvents,
                formatter: operateFormatter
            }
        ]
    })
}

$(function () { 
    initTable()
})