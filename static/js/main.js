var secretItemTemplate = `
<div class="callout {{?it.type == 'confession'}}primary{{?? it.type == 'thanks'}}success{{?? it.type == 'complain'}}warning{{??}}secondary{{?}}">
    <span 
        class="label {{?it.type == 'confession'}}primary{{?? it.type == 'thanks'}}success{{?? it.type == 'complain'}}warning{{??}}secondary{{?}}"
        style="position: absolute; top: 0; right: 0"
        >
        {{=it.type}}
    </span>
    <p>{{=it.content}}</p>
    <div class="text-right">
        <small>{{?it.name}}from <i>{{=it.name}}</i> - {{?}}{{=it.time}}</small>
    </div>
</div>
`;

var renderSecretItem = doT.compile(secretItemTemplate);

var slideDuration = 500;

function showForm() {
    $('#secret-form').slideDown(slideDuration);
    $('#fail-submit').slideUp(slideDuration);
    $('#success-submit').slideUp(slideDuration);
}

function showSuccess() {
    $('#secret-form').slideUp(slideDuration);
    $('#fail-submit').slideUp(slideDuration);
    $('#success-submit').slideDown(slideDuration);
}

function showFail(error) {
    $('#secret-form').slideDown(slideDuration);
    $('#fail-submit span').text(error)
    $('#fail-submit').slideDown(slideDuration);
    $('#success-submit').slideUp(slideDuration);
}

function submit() {
    var formData = {
        'name'              : $('input[name=name]').val(),
        'content'           : $('textarea[name=content]').val(),
        'type'              : $('input[name=type]:checked').val(),
        'show_name'         : $('input[name=show_name]')[0].checked
    };

    if (formData['content'].length == 0) {
        alert('Say something please.');
        return;
    }

    if (formData.show_name && !formData.name) {
        alert('Leave your name here.');
        return;
    }

    if (formData.type == undefined) {
        alert('Specify the secret type, confession or thanks or..');
        return;
    }

    // process the form
    $.ajax({
        type        : 'POST',
        url         : '/post/',
        data        : formData,
        dataType    : 'json',
        encode      : true
    }).done(function(data) {
        if (data.success == 1) {
            showSuccess();
        }
        else
            showFail(data.error);
    }).fail(function(e) {
        showFail("Unknown");
    });
}

function fetch() {
    $('#loading-spinner').show();
    $('#secret-block').empty();
    $.get('/all/?random=' + Math.random()).done(function(data) {
        for (var i = data.secret_items.length - 1; i >= 0; --i) {
            var secretItem = data.secret_items[i];
            secretItem.content = secretItem.content.replace(/(?:\r\n|\r|\n)/g, '<br />');
            secretItem.time = timestampToDateString(secretItem.time);
            var element = renderSecretItem(secretItem);
            $('#secret-block').append($(element));
        }
        $('#loading-spinner').hide();
    }).fail(function() {
        $('#loading-spinner').hide();
    });
}

$(function() {
    fetch();
});



/*
    Utilities
*/

function timestampToDateString(UNIX_timestamp) {
    // took from http://stackoverflow.com/a/6078873
    // did some modifications

    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + a.format('h:i:s');
    return time;
}