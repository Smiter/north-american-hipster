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

    // Timer for making sure that post have been loaded...
    // It's a hack, but the quick solution at this moment. Needs to be refactored later.
    
    setTimeout(function(){
        $(".post").append('<div class="post-edit">' +
            '<div class="post-edit-button btn btn-white post-edit-button-edit">' +
                '<i class="icon-pencil"></i><br>edit</div>' +
            '<div class="post-edit-button btn btn-white post-edit-button-delete">' +
                '<i class="icon-remove"></i><br>reject</div>' +
            '<div class="post-edit-button btn btn-white post-edit-button-approve">' +
                '<i class="icon-ok"></i><br>approve</div>' +
            '<div class="post-edit-button btn btn-white post-edit-button-display">' +
                '<i style="font-size:13px;" class="icon-desktop"></i><br>display</div>' +
            '<div class="post-edit-button btn btn-white post-edit-button-deletepermanently">' +
                '<i class="icon-remove-sign"></i><br>delete</div>' +
            '<div class="post-edit-button btn btn-white post-edit-button-stick">' +
                '<i class="icon-pushpin"></i><br>pin to top</div>' +
            '<div class="post-edit-button btn btn-white post-edit-button-unstick">' +
                '<i class="icon-pushpin"></i><br>unpin</div>' +
            '</div>');
        $(".post").hover(
            function() {
               $(".post-edit", this).css("opacity", 1);
            },
            function() {
                $(".post-edit", this).css("opacity", 0);
            }
        );
    }, 1000);

});