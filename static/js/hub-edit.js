$("#right-section").css('width', $(window).width() - 310 + "px");

$(document).ready(function() {
    $.ajaxSetup({
        data: {hubname: $(".social-getter").attr("data-hubname") },
    });

    var compileTemplate = function(html, context){
        var template = Handlebars.compile(html);
        var html = template(context);
        return html;
    }


    var social_edit_entry_template = '<div data-account-name="{{social_name}}" class="edit-content-account dropShadow">'+
      '<div class="edit-content-account-info">'+
          '<img src="http://www.google.com/s2/favicons?domain={{social_name}}.com" height="16" width="16" class="favicon" alt="{{social_name}}">'+
          '<span class="social-span">{{account_name}}</span>' +
      '</div>' + 
      '<a href="#" class="btn btn-primary btn-sm">Remove</a>' +
  '</div>';

    var social_edit_entry_template = Handlebars.compile(social_edit_entry_template);

    $(".tab-pane .input-group button").on('click', function(){
        var data = {};
        data['social_name'] = $(this).attr("data-social-name");
        data['account_name'] = $("input", $(this).parent().parent()).val();
        sendRequest('/add-social-account', data, function(responce){
            if(responce['msg'] != 'fail'){
                $("#"+ data['social_name'] +"-modal").modal("hide");
                var social_span = $(".edit-content-account[data-account-name="+ data['social_name'] +"] .social-span");
                if(social_span != undefined && social_span.length > 0){
                    social_span.html(data['account_name']);
                }else{
                    var social_edit_entry = social_edit_entry_template({social_name : data['social_name'], account_name: data['account_name'] });
                    $(".accordion-inner").append(social_edit_entry);
                }
            }
        });
    });

    $(".edit-content-account .btn").on('click', function(){
        var data = {};
        data['social_name'] = $(this).parent().attr("data-account-name");
        var self = this;
        sendRequest('/remove-social-account', data, function(responce){
            if(responce['msg'] != 'fail'){
                $(self).parent().remove();
            }
        });
    });

});