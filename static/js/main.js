function showForm() {
    $('#secret-form').fadeIn();
    $('#fail-submit').fadeOut();
    $('#success-submit').fadeOut();
}

function showSuccess() {
    $('#secret-form').fadeOut();
    $('#fail-submit').fadeOut();
    $('#success-submit').fadeIn();
}

function showFail(error) {
    $('#secret-form').fadeIn();
    $('#fail-submit span').text(error)
    $('#fail-submit').fadeIn();
    $('#success-submit').fadeOut();
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
        if (data.success == 1)
            showSuccess();
        else
            showFail(data.error);
    }).fail(function(e) {
        showFail("Unknown");
    });
}