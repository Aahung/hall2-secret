var secretItemTemplate = `
<div>{{=it.content}}</div>
<div>{{=it.time}}</div>
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
            fetch();
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