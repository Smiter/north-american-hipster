/* dependencies done */

(function($){

    $.fn.socialGetter = function(){
    	if(this.length == 0) return this;

    	// create a namespace to be used throughout the plugin
		var social = {};
		// set a reference to our slider element
		var that = this;

		/**
		 =============================================================================
		 ************************* PRIVATE FUNCTIONS***********************************
		 =============================================================================
		*/


		/**
		 * Initializes namespace settings to be used throughout plugin
		*/
		var init = function(){

			social.settings = {
				hubname: $(that).attr('data-hubname'),
				columns: $(that).attr('data-columns'),
				expand: $(that).attr('data-expand'),
				width: $(that).width(),
				height: $(that).css('height'),
				column_paddings_l_r: 20,
				column_paddings_t_b: 20,
				api_url: 'http://127.0.0.1:3000/api/'
			}
			if($(that).width()<=320){
				social.settings.columns = 1;
			}
			social.settings["column_width"] = $(that).width() / social.settings.columns;

			social.templates = {
				wrapper:
					'<div id="holder">' +
						'<div class="nav_holder">' +
							'<ul class="collections-nav-ul">' +
								'<li class="clickable collections-nav collections-nav-home  active" data-href="{{hubname}}">' +
									'<i class="icon-home" style="position:relative;"></i>' +
									'<div class="collection-triangle"></div>' +
								'</li>' + 
								'<li class="clickable collections-nav collections-nav-facebook " data-href="{{hubname}}/facebook">' +
									'<i class="foundicon-facebook"></i>' +
									'<div class="collection-triangle"></div>' +
								'</li>' +
								'<li class="clickable collections-nav collections-nav-twitter " data-href="{{hubname}}/twitter">' +
									'<i class="foundicon-twitter"></i>' +
									'<div class="collection-triangle"></div>' +
								'</li>' +
								'<li class="clickable collections-nav collections-nav-instagram " data-href="{{hubname}}/instagram">' +
									'<i class="foundicon-instagram"></i>' +
									'<div class="collection-triangle"></div>' +
								'</li>' +
							'</ul>' +
						'</div>' +
						'<div id="loading-holder">' +
						'<img src="http://d36hc0p18k1aoc.cloudfront.net/public/i/loading.gif" />'+
						'</div>' +
						'<div id="posts_holder">' +
						'</div>' +
					'</div>',

					posts:
				 		'{{#each posts}}' +
							'<div class="post {{_id}}" style="width: {{../column_width}}px; left: 0px; top: 0px">' +
								'<div class="post-holder">' +
									'<div class="post-content">' +
										'{{#unless image}}<div class="post-icon">' +
										    '<i class="icon-twitter"></i>' + 
										    '<i class="icon-facebook"></i>' +
										'</div>{{/unless}}' +
										'<a href="{{link}}" target="_blank">' +
											'<div>' +
												  '{{#if image}}<img src="{{image}}" />{{/if}}' +
											'</div>' + 
										'</a>' +
										'<div class="post-text">'+
										    '<div class="post-title">'+
								                '<p>'+
								                    '<a href="{{link}}" target="_blank">{{text}}'+
								                        
								                    '</a>'+
								                '</p>'+
								            '</div>'+
								            '<div class="post-timestamp">{{#get_created_time timestamp}}{{/get_created_time}}' +
								                         
								            '</div>'+
										'</div>'+
									'</div>'+
									'<div class="post-share">'+						       
									'</div>'+
									'<div class="post-accaunt">'+
									        '<img src="{{avatar}}"> <a href="{{author_link}}" target="_blank"><b>{{author}}</b><br>{{#if author_nickname}}@{{author_nickname}}{{/if}}</a>'+
									'</div>'+
								'</div>'+
							'</div>' +
						'{{/each}}'
			}
			var min_by_column = Array();
			for(var j = 0; j < social.settings.columns; j++){
				min_by_column.push(Number.MAX_VALUE);
			}
			social.min_by_column = min_by_column;
			var result = compileTemplate(social.templates.wrapper, {hubname: social.settings.hubname})
			$(that).append(result);
			renderPosts(social.settings.hubname, 0);
			menuClickHandlers();
			social.scrollHandler = addScrollHandler();
		}

		Handlebars.registerHelper('get_created_time', function(timestamp, options) {
		  return getPostedTime(new Date().getTime(), timestamp);
		});

		var menuClickHandlers = function(){
			$(that).on("click touchstart", ".collections-nav-ul li", function(event){
				event.preventDefault();
				$("#loading-holder").show();
				//$("#posts_holder").hide();
				$(".social-getter #posts_holder").css("visibility", 'hidden');
				$("#posts_holder").empty();
				social.scrollHandler.isHandlerOn = true;
				social.scrollHandler.scrollTop = $(window).scrollTop();
				social.scrollHandler.offset = 0;
				social.scrollHandler.url = $(this).attr('data-href'); 
				renderPosts($(this).attr('data-href'), 0);
				$(".collections-nav-ul li").removeClass("active");
				$(this).addClass("active");
			});
		}

		var addScrollHandler = function(){
			this.isHandlerOn = true;
			this.offset = 0;
			this.scrollTop = $(window).scrollTop();
			this.url = social.settings.hubname;
			var scrollElement = window;
			if(social.settings.expand == "false"){
				scrollElement = $("#posts_holder");
				$("#posts_holder").niceScroll({autohidemode:false, cursorwidth: 7});
			}	
			$(scrollElement).on('scroll', function(){
				var documentElementHeight = $(document).height();
				if(social.settings.expand == "false"){
					documentElementHeight = scrollElement[0].scrollHeight;
				}
				if(isHandlerOn && documentElementHeight - $(scrollElement).scrollTop() - 
					$(scrollElement).height() - 650 <= 0 && scrollTop < $(scrollElement).scrollTop()){
					isHandlerOn = false;
					offset = offset + 20;
					renderPosts(url+"?offset=" + offset, offset, function(){
						isHandlerOn = true;
						$("#posts_holder").getNiceScroll().resize();
					});
				}
				scrollTop = $(window).scrollTop();
			});
			return this;
		}

		var hideUnsupportedSocialMedia = function(data){
			if(data["not_avialable_social"] != undefined && data["not_avialable_social"].length > 0){
				data["not_avialable_social"].forEach(function(element, index, array){
					$(".collections-nav-"+element).hide();
				});
			}
		}

		var renderPosts = function(url, offset, callback){

			sendRequest(social.settings.api_url + url, function(data){

				hideUnsupportedSocialMedia(data);

				var result = compileTemplate(social.templates.posts, {posts: data['posts'], column_width: social.settings.column_width - social.settings.column_paddings_l_r})
				$("#posts_holder").append(result);

				var left_array = [];
				for(var i = 0; i < social.settings.columns; i ++){
					left_array[i] = i * (social.settings.column_width);
				}

				function setPostPositions(){
					$("#loading-holder").hide();
					var postElements = $("#posts_holder .post");
					data['posts'].forEach(function(element, index, array){
						var curr_post = $("#posts_holder ." + array[index]._id);
						if(index + offset - social.settings.columns >= 0){
							var min = findMin(social.min_by_column);
							var minIdx = findMinIdx(social.min_by_column);
							curr_post.css("top", min +  social.settings.column_paddings_t_b +"px");
							social.min_by_column[minIdx] = parseInt($(curr_post).css('top'), 10)  +	$(curr_post).height();
							curr_post.css("left", left_array[minIdx]+"px");
						}else{
							social.min_by_column[index] = parseInt($(curr_post).css('top'), 10)  +	$(curr_post).height();
							curr_post.css("left", left_array[index]+"px");
						}
						//$("#posts_holder").show();
						$(".social-getter #posts_holder").css("visibility", 'visible');
					});
					if(callback && typeof callback === 'function')
						callback();
				}

				function makeFirstLineUpperCase(){
					//$("#posts_holder").show();
					$(".social-getter #posts_holder").css("visibility", 'visible');
					var text_height = Number.MAX_VALUE;
					var text_entities = $(".social-getter #posts_holder .post-title a");
					for(var i = offset; i < text_entities.length; i ++){
						var entity = $(text_entities[i]);
						var curr_text = entity.text();
						var text_split = curr_text.split(" ");
						entity.empty();
						for(var j=0; j< text_split.length; j++){
							var txt_temp = entity.text();
							entity.text(txt_temp + " " + text_split[j]);
							if(text_height < entity.height()){
								entity.text(txt_temp);
								entity.append("<br/><span style='font-size: 15px'> " +  curr_text.replace(txt_temp.trim(),"")  +  "</span>");
								break;
							}
							text_height = entity.height();
						}
					}
				}
				$("#posts_holder img").error(function(){
					this.height = 1;
				});
				function checkIfImagesLoaded(callback){
					setTimeout(function(){
						var isHeightZero = true;
						$.each( $("#posts_holder img"), function( index, value ){
							if (value.height == 0){
								isHeightZero = false;
								return;
							}
						});
						if(!isHeightZero){
							checkIfImagesLoaded(function(){
								//$("#posts_holder").show();
								$(".social-getter #posts_holder").css("visibility", 'visible');
								makeFirstLineUpperCase();
								setPostPositions();
							});
						}else{
							callback();
						}
					}, 20);
				}

				checkIfImagesLoaded(function(){
					$(".social-getter #posts_holder").css("visibility", 'visible');
					//$("#posts_holder").show();
					makeFirstLineUpperCase();
					setPostPositions();
				});
				
			});
		}

		var compileTemplate = function(html, context){
			var source   = html;
			var template = Handlebars.compile(source);
			var html    = template(context);
			return html;
		}

		var sendRequest = function(url, callback){
			var jqxhr = $.ajax({
  				url: url,
  				dataType:"json"
			})
		    .done(function(data) {
		    	callback(data);
		    })
		    .fail(function(data) {
		    	callback("fail");
		    })
		    .always(function(data) {
		    });
		}

		function findMin(arr){
			return Math.min.apply(Math, arr);
		}

		function findMinIdx(arr){
			return arr.indexOf(Math.min.apply(this,arr));
		}

		var months = Array('Jan','Feb','Mar','Apr','May', 'June','July','Aug','Sept','Oct','Nov','Dec');

		var getPostedTime = function (stamp1,stamp2) {
		    var date1 = new Date(stamp1);
		    var date2 = new Date(stamp2 * 1000);

		    if(date1.getYear() == date2.getYear()){
		    	if(date1.getMonth() == date2.getMonth() && date1.getDate() - date2.getDate() == 0){
		    		return date1.getHours() - date2.getHours() + " hours ago";
			    }
			    else if(date1.getMonth() == date2.getMonth() && date1.getDate() - date2.getDate() == 1){
			    	if(date1.getHours() + 23 - date2.getHours() > 24)
			    		return date2.getDate() + " " + months[date2.getMonth()];
			    	else
		    			return date1.getHours() + 23 - date2.getHours() - 1 + " hours ago";
			    }
			    else if(date1.getMonth() == date2.getMonth() && date1.getDate() - date2.getDate() == 0){
			    	if(date1.getHours() == date2.getHours()){
			    		return date1.getMinutes() - date2.getMinutes() + " minutes ago";
			    	}else{
			    		return date1.getHours() - date2.getHours() + " hours ago";
			    	}
			    }
			    else{
			    	return date2.getDate() + " " + months[date2.getMonth()];
			    }
		    }
		    else{
		    	return date2.getFullYear() + " " + date2.getDate() +" " + months[date2.getMonth()];
		    }
		};

		/**
		 =============================================================================
		 ************************* PUBLIC FUNCTIONS***********************************
		 =============================================================================
		*/

		that.testPublic = function(){
			console.log("public")
		};

		init();
		return this;
    }

    var social = $(".social-getter").socialGetter();
    
})(jQuery); //end of outer closure