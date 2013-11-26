sendRequest = function(url, data, callback){
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

compileTemplate = function(html, context){
    var template = Handlebars.compile(html);
    var html = template(context);
    return html;
};
