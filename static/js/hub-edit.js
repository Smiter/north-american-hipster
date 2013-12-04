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

    $(document).on("socialGetterNewPostsLoaded", function(){
        var posts = $(".post");
        posts.each(function(i, p){
            var post_edit_div = $(".post-edit", this);
            if(post_edit_div.length == 0 || typeof post_edit_div == 'undefined'){
                $(this).append('<div class="post-edit">' +
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

                $(this).append('<div class="post-moderate-label">' +
                    '<div class="post-moderate-label-approved"><i class="icon-ok-sign"></i> approved</div>' +
                        '<div class="post-moderate-label-pending"><i class="icon-remove-sign"></i> pending approval</div>' +
                        '<div class="post-moderate-label-display"><i class="icon-desktop" style="font-size:12px;"></i> currently displayed </div>' +
                    '</div>');
                var accepted = $(this).attr('data-visible');
                if (accepted != "" && accepted == 0) {
                    $('.post-edit-button-delete', this).css("display", "none");
                    $('.post-edit-button-approve', this).css("display", "block");
                    $('.post-moderate-label-approved', this).css("display", "none");
                    $('.post-moderate-label-pending', this).css("display", "block");
                } //another situation is handled by default (if accepted is 1 or "")
            }
        }); //end posts each

        posts.hover(
            function() {
               $(".post-edit", this).css("opacity", 1);
            },
            function() {
                $(".post-edit", this).css("opacity", 0);
            }
        );
        $(".post-edit-button-delete").on('click', function() {
                var data = {};
                data["post_id"] = $(this).closest(".post").attr("id");
                var that = this;
                sendRequest('/reject-post', data, function(responce){
                    if(responce['msg'] == 'fail'){
                        $("#alertDiv").append('<div class="alert alert-danger">' +
                            '<button class="close" data-dismiss="alert" style="right:25px" onclick="">×</button>' +
                            '<span style="color:black">Cannot reject this post.</span>' +
                            '</div>');
                    } else {
                        $(that).css("display", "none");
                        $(that).parent().find(".post-edit-button-approve").css("display", "block");
                        $(that).closest(".post").find(".post-moderate-label-approved").css("display", "none");
                        $(that).closest(".post").find(".post-moderate-label-pending").css("display", "block");
                    }
                });
            }
        );
        $(".post-edit-button-approve").on('click', function() {
                var data = {};
                data["post_id"] = $(this).closest(".post").attr("id");
                var that = this;
                sendRequest('/accept-post', data, function(responce){
                    if(responce['msg'] == 'fail'){
                        $("#alertDiv").append('<div class="alert alert-danger">' +
                            '<button class="close" data-dismiss="alert" style="right:25px" onclick="">×</button>' +
                            '<span style="color:black">Cannot accept this post.</span>' +
                            '</div>');
                    } else {
                        $(that).css("display", "none");
                        $(that).parent().find(".post-edit-button-delete").css("display", "block");
                        $(that).closest(".post").find(".post-moderate-label-pending").css("display", "none");
                        $(that).closest(".post").find(".post-moderate-label-approved").css("display", "block");
                    }
                });
            }
        );
    });

});