window.onload = function () {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    if (logged_user == null) {
        window.location.assign("index.html");}

    $("#nav-placeholder").load("./navbar/citizenNavbar.html");
    $("#footer-placeholder").load("footer.html");
}

let $table = $('#table')

function operateFormatter(value, row, index) {
    return [
        `<button id="remove" class="btn text-dark btn-danger ${row.completion_date !== null ? "disabled" : "enabled"}">Cancel</button>`,
    ].join('')
}

window.operateEvents = {
    'click #remove': function (e, value, row, index) {
        Swal.fire({
            title: "Are you sure?",
            text: "Your offer will be canceled!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.post("./php/deleteOffer.php", { offer: row.offer_id }, function (result) {
                    console.log(result)
                    if (result == 1) {
                        $table.bootstrapTable('remove', {
                            field: 'offer_id',
                            values: [row.offer_id]
                        })
                        Swal.fire({
                            title: "Canceled!",
                            text: "Your offer has been canceled.",
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
    }
}