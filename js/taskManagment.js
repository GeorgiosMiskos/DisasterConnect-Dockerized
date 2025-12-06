
const logged_user = JSON.parse(localStorage.getItem("logged_user"));
if (logged_user == null) {
    window.location.assign("index.html");}

$("#nav-placeholder").load("./navbar/rescuerNavbar.html");
$("#footer-placeholder").load("footer.html");



let $table = $('#table')
function operateFormatter(value, row, index) {
    return [
        '<button class="selectTask btn btn-secondary">Select</button>'
    ].join('')
}

window.operateEvents = {
    'click .selectTask': async function (e, value, row, index) {
        $.post("./php/getNumberOfTasks.php", { }, function (totalTasks) {
            console.log(totalTasks)
            if (totalTasks >= 4) {
                Swal.fire({
                    title: 'Error',
                    text: 'You have reached the maximum number of tasks',
                    icon: 'error'
                })
            } else {
                Swal.fire({
                    title: "Are you sure?",
                    icon: 'question',
                    text: 'You will take on this task!',
                    showCancelButton: true,
                    confirmButtonText: "Sure!",
                }).then((totalTasks) => {
                    if (totalTasks.isConfirmed) {
                        $.post("./php/updateTask.php", { type: row.type, id: row.id, }, function (totalTasks) {
                            console.log(totalTasks)
                            if (totalTasks == "1") {
                                $table.bootstrapTable('refresh')
                                Swal.fire("Thank you!", "", "success");
                            }
                        });
                    }
                });
            }
        });
    }
}

function initTable() {
    $table.bootstrapTable('destroy').bootstrapTable({
        height: 770,
        columns: [
            {
                title: 'Task Type',
                field: 'type',
                align: 'center',
                valign: 'middle',
                sortable: true,
            },
            {
                title: 'Task ID',
                field: 'id',
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
                title: 'Number of people',
                field: 'number_of_people',
                align: 'center',
                valign: 'middle',
                sortable: true,
            },
            {
                title: 'First Name',
                field: 'first_name',
                align: 'center',
                valign: 'middle',
                sortable: true,
            },
            {
                title: 'Last Name',
                field: 'last_name',
                align: 'center',
                valign: 'middle',
                sortable: true,
            },
            {
                title: 'Phone number',
                field: 'phone',
                align: 'center',
                valign: 'middle',
                sortable: true,
            },
            {
                title: 'Date of Registration',
                field: 'initial_date',
                align: 'center',
                valign: 'middle',
                sortable: true,
            },
            {
                field: 'operate',
                title: 'Select Task',
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