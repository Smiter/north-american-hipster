$(document).ready(function() {
    $("#create_new_hub_btn").on("click", function(){
        var data = {};
        data['hubname'] = $("input", $(this).parent().parent()).val();
        sendRequest('/add-hub', data, function(responce){
            if(responce['msg'] == 'exists'){
                $("#alertDiv").append('<div class="alert alert-danger"><button class="close" data-dismiss="alert" style="right:25px" onclick="">×</button>Hub name has already been taken</div>');
            }else if(responce['msg'] == 'success'){
                window.location.href = data['hubname'] + "/edit"
            }
        });
    });

    $(".remove-hub-btn").on("click", function(){
        var data = {};
        data['hubname'] = $(this).attr("data-hubname");
        var self = this;
        var ans = confirm("Do you really want to remove that hub? ");
        if (ans == true){
            sendRequest('/remove-hub', data, function(responce){
                if(responce['msg'] != 'fail'){
                    $(self).parent().parent().remove();
                }
            });
        }
    });

    

});