$(document).foundation()

// https://foundation.zurb.com/building-blocks/blocks/plus-minus-input.html
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

// https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function getCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++)
    {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


var ws = new WebSocket("ws://localhost:8000"); //wss for secure

ws.onopen = function()
{
    ws.send("socket open");
};

ws.onclose = function(evt)
{
    console.log("socket closed: ", evt); // socket is closed
};

ws.onmessage = function(evt)
{
    var roots = JSON.parse(evt.data);

    roots.sort(function(a, b)
    {
        return a.root > b.root;
    });

    mark_rooted = `
        ${roots.map(roo => `
            <option value="${roo.root}">${roo.root}</option>
        `).join('')} 
    `;

    document.getElementById('rooted').innerHTML = mark_rooted;
};


var wsa = new WebSocket("ws://localhost:8000/admin"); //wss for secure

wsa.onopen = function()
{
    wsa.send("socket open");
};

wsa.onclose = function(evt)
{
    console.log("socket closed: ", evt); // socket is closed
};


wsa.onmessage = function(evt)
{
    var bid_info = JSON.parse(evt.data);
    
    bid_info.bid.sort(function(a, b)
    {
        return b.bid_amt > a.bid_amt;
    });

    bid_info.bid.sort(function(a, b)
    {
        return a.root > b.root;
    });

    const mark_irb = `
        ${bid_info.bid.map(bid => `
        <div class="grid-x grid-padding-x">
            <div id="hide" class="large-3 medium-3 small-3 cell2 gridit bid-data">
                <button type="button" class="button square" data-quantity="accept" data-field="take_bid" onclick="take_bid(this)" id="take_bid">
                    <b class="fas fa-user-check"></b>
                </button>
                <button type="button" class="button square" data-quantity="reject" data-field="del_bid" onclick="del_bid(this)" id="del_bid">
                    <b class="fas fa-trash-alt"></b>
                </button>
            </div>
            <div id="hide" class="large-3 medium-3 small-3 cell2 gridit bid-data">${bid.izn}</div>
            <div id="hide" class="large-3 medium-3 small-3 cell2 gridit bid-data">${bid.root}</div>
            <div id="hide" class="large-3 medium-3 small-3 cell2 gridit bid-data">${bid.bid_amt} izhk</div>
        </div>
        `).join('')} 
    `;

    bid_info.roots.sort(function(a, b)
    {
        return a.root > b.root;
    });

    mark_rooted = `
        ${bid_info.roots.map(roo => `
            <option value="${roo.root}">${roo.root}</option>
        `).join('')} 
    `;

    document.getElementById('irbdata').innerHTML = mark_irb;
    document.getElementById('rooteda').innerHTML = "<option selected></option>" + mark_rooted;
};


function on_bad_bid()
{
    document.getElementById("bad-bid").style.display = "block";
    setTimeout(function(){
        $('#bad-bid').fadeOut('slow');
    }, 750);
}

function off_bad_bid()
{
    document.getElementById("bad-bid").style.display = "none";
}

function on_good_bid()
{
    document.getElementById("good-bid").style.display = "block";
    setTimeout(function(){
        $('#good-bid').fadeOut('slow');
    }, 750);
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

function authPM()
{
    var log_form = document.forms["pass"].elements;
    var password = log_form["word"].value;

    if(password == "")
    {
        on_bad_bid();
    }
    else
    {
        var seek = {'purpose': 'authPM', 'password': password};

        var req = new XMLHttpRequest();

        req.open('POST', '/', true);
        
        req.onreadystatechange = function()
        {
            if(req.readyState == 4 && req.status == 200)
            {   
                if(getCookie('auth') == 'False')
                {
                    on_bad_bid();
                    document.getElementById("form_auth").reset();
                }
                else
                {
                    window.location.href = "/admin";
                }
            }
        }

        req.send(JSON.stringify(seek));
    }
}

function make_bid()
{
    var bid_form = document.forms["create_bid"].elements;

    var bid = {'purpose': 'make_bid',
                'izn': bid_form["iz-number"].value,
                'root': bid_form["root"].value,
                'bid_amt': bid_form["bid-amt"].value};

    if(bid.bid_amt > 100 || bid.bid_amt < 0 || bid.izn == "" || bid.izn.length < 6)
    {
        on_bad_bid();
    }
    else
    {
        var req = new XMLHttpRequest();

        req.open('POST', '/', true);

        req.onreadystatechange = function()
        {
            if(req.readyState == 4 && req.status == 200)
            {
                var bid_info = JSON.parse(req.responseText);

                document.getElementById('izn').innerHTML = bid_info.izn;
                document.getElementById('iz-amt').innerHTML = bid_info.nbal;

                bid_info.bid.sort(function(a, b)
                {
                    return b.bid_amt > a.bid_amt;
                });

                bid_info.bid.sort(function(a, b)
                {
                    return a.root > b.root;
                });

                const mark_root = `
                    ${bid_info.bid.map(bid => `
                        <div id="hide">${bid.root}</div>
                    `).join('')} 
                `;

                const mark_bid = `
                    ${bid_info.bid.map(bid => `
                        <div id="hide">${bid.bid_amt} izhk</div>
                    `).join('')} 
                `;

                document.getElementById('rdat').innerHTML = mark_root;
                document.getElementById('bdat').innerHTML = mark_bid;

                if(bid_info.success == 'true')
                {
                    on_good_bid();
                }
                else
                {
                    on_bad_bid();
                }
            }
        }

        req.send(JSON.stringify(bid));
        
        document.getElementById("dispBids").style.display = "initial";
    }

    document.getElementById("form_bid").reset();
}

function reset_view()
{
    document.getElementById("dispBids").style.display = "none";
    
    document.getElementById("izn").innerHTML = "";
    document.getElementById("iz-amt").innerHTML = "";
    document.getElementById("rdat").innerHTML = "";
    document.getElementById("bdat").innerHTML = "";
}

// ADMIN USE ONLY BELOW //

function update_roots()
{
    var updates = document.forms["updater"].elements;

    var add = updates["add-root"].value;
    var del = updates["del-root"].value;

    if(add == "" && del == "")
    {
        on_bad_bid();
    }
    else
    {
        var updt = {'purpose': 'update_roots', 'add': add, 'del': del};

        var req = new XMLHttpRequest();

        req.open("POST", "/admin", true);

        req.onreadystatechange = function()
        {
            if(req.readyState == 4 && req.status == 200)
            {
                var roots = JSON.parse(req.responseText);

                roots.sort(function(a, b)
                {
                    return a.root > b.root;
                });

                mark_rooted = `
                    ${roots.map(roo => `
                        <option value="${roo.root}">${roo.root}</option>
                    `).join('')} 
                `;

                document.getElementById('rooteda').innerHTML = "<option selected></option>" + mark_rooted;
            }
        }

        req.send(JSON.stringify(updt));

        on_good_bid();
    }
    
    document.getElementById("form_updt").reset();
}

function take_bid(obj)
{
    var izn = obj.offsetParent.nextSibling.nextSibling.innerText;
    var root = obj.offsetParent.nextSibling.nextSibling.nextSibling.nextSibling.innerText;
    var amt = obj.offsetParent.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.replace(' izhk','');
    var bid_amt = parseInt(amt, 10);

    var ask = confirm("Accept bid on '" + root + "'\nby Citizen " + izn + " for " + amt + " izhk?");
    if(ask)
    {
        var seek = {'purpose': 'del_bid_from_db', 'the_bid': {'izn': izn, 'root': root, 'bid_amt': bid_amt}};

        var req = new XMLHttpRequest();

        req.open('POST', '/admin', true);

        req.send(JSON.stringify(seek));
        on_good_bid();
    }
}

function del_bid(obj)
{
    var izn = obj.offsetParent.nextSibling.nextSibling.innerText;
    var root = obj.offsetParent.nextSibling.nextSibling.nextSibling.nextSibling.innerText;
    var amt = obj.offsetParent.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.replace(' izhk','');
    var bid_amt = parseInt(amt, 10);

    var ask = confirm("Delete bid on '" + root + "'\nby Citizen " + izn + " for " + amt + " izhk?");
    if(ask)
    {
        var seek = {'purpose': 'del_bid_from_db', 'the_bid': {'izn': izn, 'root': root, 'bid_amt': bid_amt}};

        var req = new XMLHttpRequest();

        req.open('POST', '/admin', true);

        req.send(JSON.stringify(seek));
        on_good_bid();
    }
}

function attempt_logout()
{
    var req = new XMLHttpRequest();

    req.open("GET", "/", true);
        
    req.onreadystatechange = function()
    {
        if(req.readyState == 4 && req.status == 200)
        {
            window.location.href = "/";
        }
    }

    req.send();
}