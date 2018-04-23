$(document).foundation()

jQuery(document).ready(function()
{
    $('[data-quantity="plus"]').click(function(e)
    {
        e.preventDefault();
        fieldName = $(this).attr('data-field');
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        if (!isNaN(currentVal) && currentVal >= 1)
        {
            $('input[name='+fieldName+']').val(currentVal + 1);
        }
        else
        {
            $('input[name='+fieldName+']').val(1);
        }
    });

    $('[data-quantity="minus"]').click(function(e)
    {
        e.preventDefault();
        fieldName = $(this).attr('data-field');
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        if (!isNaN(currentVal) && currentVal > 1)
        {
            $('input[name='+fieldName+']').val(currentVal - 1);
        }
        else
        {
            $('input[name='+fieldName+']').val(1);
        }
    });
});

function on_bad_bid()
{
    document.getElementById("bad-bid").style.display = "block";
}

function off_bad_bid()
{
    document.getElementById("bad-bid").style.display = "none";
}

function on_good_bid()
{
    document.getElementById("good-bid").style.display = "block";
}

function off_good_bid()
{
    document.getElementById("good-bid").style.display = "none";
}

function on_attempt_login()
{
    document.getElementById("i-am-root").style.display = "block";
}

function off_attempt_login()
{
    document.getElementById("i-am-root").style.display = "none";
}

function login()
{
    var log_form = document.forms["pass"].elements;

    var password = log_form["word"].value
    
    if(password = "")
    {
        on_bad_bid();
    }
    else
    {
        // send to server for verification!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // get something back from server to say password was wrong
        if(false) // something other than false
        {
            on_bad_bid();
        }
    }
}

function attempt_logout()
{
    // return to main page, end session somehow!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

function make_bid()
{
    var bid_form = document.forms["create_bid"].elements;

    var iz_number = bid_form["iz-number"].value;
    var root = bid_form["root"].value;
    var bid_amt = bid_form["bid-amt"].value;

    if(bid_amt > 100 || bid_amt < 0 || iz_number == "" || iz_number.length < 6)
    {
        on_bad_bid();
    }
    else
    {
        // send to server!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        on_good_bid();
    }
}

function show_bids()
{
    var disp_bids = document.forms["iz-man"].elements;

    var iz_number = disp_bids["iz-number"].value

    if(iz_number == "" || iz_number.length < 6)
    {
        on_bad_bid();
    }
    else
    {
        // retrieve info from server for display, somehow display
        // display all bids for a particular IZN!!!!!!!!!!!!!!!!!!!!!!!!!!
        document.getElementById("dispBala").style.display = "initial";
        document.getElementById("dispBids").style.display = "initial";
    }
}

function reset_view()
{
    // show no bid info
    // somehow actually clear the data
    document.getElementById("dispBala").style.display = "none";
    document.getElementById("dispBids").style.display = "none";
}

function update_roots()
{
    var updates = document.forms["updater"].elements;

    var add = updates["add-root"].value;
    var del = updates["del-root"].value;

    if(add != "" && del != "")
    {
        // send add & del to server
        on_good_bid();
    }
    else if(add != "" && del == "")
    {
        // send add to server
        on_good_bid();
    }
    else if(add == "" && del != "")
    {
        // send del to server
        on_good_bid();
    }
    else
    {
        on_bad_bid();
    }
    // add and/or delete root
    show_roots();
}

function show_roots()
{
    // get roots from server & display!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

function show_root_bids()
{
    show_roots();
    // get bid data from server & display!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}