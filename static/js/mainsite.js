$("#right-section").css('width', $(window).width() - 310 + "px");

var sendRequest = function(url, data, callback){
    var jqxhr = $.ajax({
        url: url,
        dataType:"json",
        data: data,
        method: 'post'
    })
    .done(function(data) {
        callback(data);
    })
    .fail(function(data) {
        callback("fail");
    })
    .always(function(data) {
    });
};

$(document).ready(function() {
    $.ajaxSetup({
        data: {hubname: $(".social-getter").attr("data-hubname") },
    });

    $(".tab-pane .input-group button").on('click', function(){
        var data = {};
        data['social_name'] = $(this).attr("data-social-name");
        data['account_name'] = $("input", $(this).parent().parent()).val();
        sendRequest('/add-social-account', data, function(responce){
            if(responce['msg'] != 'fail')
                $("#"+ data['social_name'] +"-modal").modal("hide");
        });
    });

});