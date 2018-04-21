$(document).foundation()
jQuery(document).ready(function(){
    // This button will increment the value
    $('[data-quantity="plus"]').click(function(e){ // Stop acting like a button
        e.preventDefault(); // Get the field name
        fieldName = $(this).attr('data-field'); // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val()); // If is not undefined
        if (!isNaN(currentVal)) { // Increment
            $('input[name='+fieldName+']').val(currentVal + 1);
        } else { // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
        }
    });
    // This button will decrement the value till 0
    $('[data-quantity="minus"]').click(function(e) { // Stop acting like a button
        e.preventDefault(); // Get the field name
        fieldName = $(this).attr('data-field'); // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val()); // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 0) { // Decrement one
            $('input[name='+fieldName+']').val(currentVal - 1);
        } else {  // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
        }
    });
});

function on_bad_bid() {
    document.getElementById("bad-bid").style.display = "block";
}

function off_bad_bid() {
    document.getElementById("bad-bid").style.display = "none";
}

function on_attempt_login() {
    document.getElementById("i-am-root").style.display = "block";
}

function off_attempt_login() {
    document.getElementById("i-am-root").style.display = "none";
}

function attempt_logout() {
    // return to main page, end session somehow
}

function make_bid() {
    on_bad_bid();
    // add bid and iz number (if applicable) to database
}

function show_bids() {
    // require IZN, otherwise VERBOTEN
    on_bad_bid();
    document.getElementById("dispBala").style.display = "initial";
    document.getElementById("dispBids").style.display = "initial";
    // display all bids for a particular IZN
}

function reset_view() {
    document.getElementById("dispBala").style.display = "none";
    document.getElementById("dispBids").style.display = "none";
    // show no bid info
}

function change_bid() {
    // change bid
}

function delete_bid() {
    // delete bid
}

function update_roots() {
    // add and/or delete root
}