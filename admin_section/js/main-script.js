var saswp_meta_list        = [];
var saswp_meta_fields      = [];
var saswp_meta_list_fields = null;

function getParameterByName(name, url) {
    if (!url){
    url = window.location.href;    
    } 
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

    function saswp_schema_datepicker(){
        
            jQuery('.saswp-datepicker-picker').datepicker({
             dateFormat: "yy-mm-dd",
             minDate: 0
          });
          
        }


       function saswp_meta_list_html(response, fields, field_name, id){
                      
                        var re_html = '';   
                            re_html += '<select class="saswp-custom-meta-list" name="saswp_meta_list_val['+field_name+']">';
                          $.each(response, function(key,value){ 

                               re_html += '<optgroup label="'+value['label']+'">';   

                               $.each(value['meta-list'], function(key, value){
                                   re_html += '<option value="'+key+'">'+value+'</option>';
                               });                                                                                  
                               re_html += '</optgroup>';

                           });                                     
                           re_html += '</select>';
                                            
                      if(fields){                                                                                                                    
                                 var html = '<tr>';                                                                                                                            
                                     html += '<td>';                                     
                                     html += '<select class="saswp-custom-fields-name">';
                                     $.each(fields, function(key,value){                                         
                                       html += '<option value="'+key+'">'+value+'</option>';                                       
                                     });                                     
                                    html += '</select>';                                     
                                    html += '</td>';                                                                                                                                                                                                       
                                    html += '<td>';                                                                       
                                    html += re_html;
                                    html += '</td>';                                                                          
                                    html += '</tr>';
                                    $(".saswp-custom-fields-table").append(html);               
                                                                                                                     
                      }else{
                          $(id).html(re_html);
                      }                                                          
           
       } 


       
       
       function saswp_get_meta_list(type, fields, id, fields_name){                           
                            if (!saswp_meta_list[type]) {
                                
                                $.get(ajaxurl, 
                                    { action:"saswp_get_meta_list", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                                     function(response){                                  
                                               saswp_meta_list[type] = response[type];                                                                                                                             
                                               saswp_meta_list_html(saswp_meta_list[type], fields, fields_name, id);
                                          
                                    },'json');
                                
                            }else{
                                saswp_meta_list_html(saswp_meta_list[type], fields, fields_name, id);
                            }
                                                                                     
       }
             
       function saswp_get_post_specific_schema_fields(index, meta_name, div_type, schema_id, fields_type){
                            
                            if (!saswp_meta_fields[fields_type]) {
                                
                                $.get(ajaxurl, 
                                    { action:"saswp_get_schema_dynamic_fields_ajax",meta_name:meta_name, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                                     function(response){                                  
                                         saswp_meta_fields[fields_type] = response;
                                         console.log(saswp_meta_fields);
                                         var html = saswp_fields_html_generator(index, schema_id, fields_type, div_type, response);

                                           if(html){
                                               $('.saswp-'+div_type+'-section[data-id="'+schema_id+'"]').append(html);
                                               saswp_schema_datepicker();
                                           }

                                    },'json');
                                
                            }else{
                                
                              var html = saswp_fields_html_generator(index, schema_id, fields_type, div_type, saswp_meta_fields[fields_type]);

                               if(html){
                                   $('.saswp-'+div_type+'-section[data-id="'+schema_id+'"]').append(html);
                                   saswp_schema_datepicker();
                               }
                                                                
                            }
                            
                             
       }
       
function saswp_fields_html_generator(index, schema_id, fields_type, div_type, schema_fields){
            
            var html = '';
            
            html += '<div class="saswp-'+div_type+'-table-div" data-id="'+index+'">'
                        +  '<a class="saswp-table-close">X</a>'
                        + '<table class="form-table saswp-'+div_type+'-table">' 
                
            $.each(schema_fields, function(eachindex, element){
                                
                var meta_class = "";
                if(element.name == 'saswp_tvseries_season_published_date'){
                    meta_class = "saswp-datepicker-picker";    
                }
                
                switch(element.type) {
                    
                    case "text":
                      
                        html += '<tr>'
                        + '<th>'+element.label+'</th><td><input class="'+meta_class+'" style="width:100%" type="text" id="'+element.name+'_'+index+'_'+schema_id+'" name="'+fields_type+schema_id+'['+index+']['+element.name+']"></td>'
                        + '</tr>';                        
                      
                      break;
                      
                    case "textarea":
                      
                        html += '<tr>'
                        + '<th>'+element.label+'</th><td><textarea style="width: 100%" id="'+element.name+'_'+index+'_'+schema_id+'" name="'+fields_type+schema_id+'['+index+']['+element.name+']" rows="5"></textarea></td>'
                        + '</tr>';                        
                      
                      break;
                     case "select":
                        
                        var options_html = "";                        
                        $.each(element.options, function(opt_index, opt_element){                            
                            options_html += '<option value="'+opt_index+'">'+opt_element+'</option>';
                        });
                        
                         html += '<tr>'
                        + '<th>'+element.label+'</th>'
                        + '<td>'
                        
                        + '<select id="'+element.name+'_'+index+'_'+schema_id+'" name="'+fields_type+schema_id+'['+index+']['+element.name+']">'
                        + options_html
                        + '</select>'
                        
                        + '</td>'
                        + '</tr>';
                         
                     break;
                      
                    case "media":
                        
                        html += '<tr>'
                        + '<th>'+element.label+'</th>'
                        + '<td>'
                        + '<fieldset>'
                        + '<input style="width:80%" type="text" id="'+element.name+'_'+index+'_'+schema_id+'" name="'+element.name+'_'+index+'_'+schema_id+'">'
                        + '<input type="hidden" data-id="'+element.name+'_'+index+'_'+schema_id+'_id" name="'+fields_type+schema_id+'['+index+']['+element.name+'_id]" id="'+element.name+'_'+index+'_'+schema_id+'_id">'
                        + '<input data-id="media" style="width: 19%" class="button" id="'+element.name+'_'+index+'_'+schema_id+'_button" name="'+element.name+'_'+index+'_'+schema_id+'_button" type="button" value="Upload">'
                        + '<div class="saswp_image_div_'+element.name+'_'+index+'_'+schema_id+'">'                                                
                        + '</div>'
                        + '</fieldset>'
                        + '</td>'
                        + '</tr>';
                      
                      break;
                    default:
                      // code block
                  }
                                                                                            
            });                                                             
            html += '</table>'
                    + '</div>';
                     
            return html;
            
        }
        
jQuery(document).ready(function($){   
    
    /* Newletters js starts here */      
        
            if(saswp_localize_data.do_tour){
                
                var content = '<h3>Thanks for using Structured Data!</h3>';
			content += '<p>Do you want the latest on <b>Structured Data update</b> before others and some best resources on monetization in a single email? - Free just for users of Structured Data!</p>';
                        content += '<style type="text/css">';
                        content += '.wp-pointer-buttons{ padding:0; overflow: hidden; }';
                        content += '.wp-pointer-content .button-secondary{  left: -25px;background: transparent;top: 5px; border: 0;position: relative; padding: 0; box-shadow: none;margin: 0;color: #0085ba;} .wp-pointer-content .button-primary{ display:none}	#afw_mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; }';
                        content += '</style>';                        
                        content += '<div id="afw_mc_embed_signup">';
                        content += '<form action="//app.mailerlite.com/webforms/submit/o1s7u3" data-id="258182" data-code="o1s7u3" method="POST" target="_blank">';
                        content += '<div id="afw_mc_embed_signup_scroll">';
                        content += '<div class="afw-mc-field-group" style="    margin-left: 15px;    width: 195px;    float: left;">';
                        content += '<input type="text" name="fields[name]" class="form-control" placeholder="Name" hidden value="'+saswp_localize_data.current_user_name+'" style="display:none">';
                        content += '<input type="text" value="'+saswp_localize_data.current_user_email+'" name="fields[email]" class="form-control" placeholder="Email*"  style="      width: 180px;    padding: 6px 5px;">';
                        content += '<input type="text" name="fields[company]" class="form-control" placeholder="Website" hidden style=" display:none; width: 168px; padding: 6px 5px;" value="'+saswp_localize_data.get_home_url+'">';
                        content += '<input type="hidden" name="ml-submit" value="1" />';
                        content += '</div>';
                        content += '<div id="mce-responses">';
                        content += '<div class="response" id="mce-error-response" style="display:none"></div>';
                        content += '<div class="response" id="mce-success-response" style="display:none"></div>';
                        content += '</div>';
                        content += '<div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_a631df13442f19caede5a5baf_c9a71edce6" tabindex="-1" value=""></div>';
                        content += '<input type="submit" value="Subscribe" name="subscribe" id="pointer-close" class="button mc-newsletter-sent" style=" background: #0085ba; border-color: #006799; padding: 0px 16px; text-shadow: 0 -1px 1px #006799,1px 0 1px #006799,0 1px 1px #006799,-1px 0 1px #006799; height: 30px; margin-top: 1px; color: #fff; box-shadow: 0 1px 0 #006799;">';
                        content += '</div>';
                        content += '</form>';
                        content += '</div>';
                
                var setup;                
                var wp_pointers_tour_opts = {
                    content:content,
                    position:{
                        edge:"top",
                        align:"left"
                    }
                };
                                
                wp_pointers_tour_opts = $.extend (wp_pointers_tour_opts, {
                        buttons: function (event, t) {
                                button= jQuery ('<a id="pointer-close" class="button-secondary">' + saswp_localize_data.button1 + '</a>');
                                button_2= jQuery ('#pointer-close.button');
                                button.bind ('click.pointer', function () {
                                        t.element.pointer ('close');
                                });
                                button_2.on('click', function() {
                                        t.element.pointer ('close');
                                } );
                                return button;
                        },
                        close: function () {
                                $.post (saswp_localize_data.ajax_url, {
                                        pointer: 'saswp_subscribe_pointer222',
                                        action: 'dismiss-wp-pointer'
                                });
                        },
                        show: function(event, t){
                         t.pointer.css({'left':'170px', 'top':'160px'});
                      }                                               
                });
                setup = function () {
                        $(saswp_localize_data.displayID).pointer(wp_pointers_tour_opts).pointer('open');
                         if (saswp_localize_data.button2) {
                                jQuery ('#pointer-close').after ('<a id="pointer-primary" class="button-primary">' + saswp_localize_data.button2+ '</a>');
                                jQuery ('#pointer-primary').click (function () {
                                        saswp_localize_data.function_name;
                                });
                                jQuery ('#pointer-close').click (function () {
                                        $.post (saswp_localize_data.ajax_url, {
                                                pointer: 'saswp_subscribe_pointer222',
                                                action: 'dismiss-wp-pointer'
                                        });
                                });
                         }
                };
                if (wp_pointers_tour_opts.position && wp_pointers_tour_opts.position.defer_loading) {
                        $(window).bind('load.wp-pointers', setup);
                }
                else {
                        setup ();
                }
                
            }
                
    /* Newletters js ends here */ 
    
    
	$(".saswp-tabs a").click(function(e){
		var href = $(this).attr('href');                
		var currentTab = getParameterByName('tab',href);
		if(!currentTab){
			currentTab = "general";
		}                                                                
		$(this).siblings().removeClass("nav-tab-active");
		$(this).addClass("nav-tab-active");
		$(".form-wrap").find(".saswp-"+currentTab).siblings().hide();
		$(".form-wrap .saswp-"+currentTab).show();
		window.history.pushState("", "", href);
		return false;
	});     
        
        $(".saswp-schame-type-select").change(function(){
            $(".saswp-custom-fields-table").html('');
            var schematype = $  (this).val(); 
            
           $(".saswp-option-table-class tr").each(function(index,value){                
               if(index>0){
                   $(this).hide(); 
                   $(this).find('select').attr('disabled', true);
               }                               
            });              
            if(schematype == 'TechArticle' || schematype == 'Article' || schematype == 'Blogposting' || schematype == 'NewsArticle' || schematype == 'WebPage'){
               
                $(".saswp-enable-speakable").parent().parent().show();
            }else{
                $(".saswp-enable-speakable").parent().parent().hide();
            }
            
            if(schematype == 'local_business'){
             $(".saswp-option-table-class tr").eq(1).show();   
             $(".saswp-business-text-field-tr").show();
             $(".saswp-option-table-class tr").find('select').attr('disabled', false);
            // $("#saswp_dayofweek").attr('disabled', false);
             $('.select-post-type').val('show_globally').trigger('change');             
             }
             if(schematype == 'Service'){            
             $(".saswp-service-text-field-tr").show();
             $(".saswp-option-table-class tr").find('select').attr('disabled', false);
             }
             if(schematype == 'Review'){            
             $(".saswp-review-text-field-tr").show();  
             $(".saswp-option-table-class tr").find('select').attr('disabled', false);
             saswp_item_reviewed_call();
             }
             if(schematype == 'Product'){            
             $(".saswp-product-text-field-tr").show();  
             $(".saswp-option-table-class tr").find('select').attr('disabled', false);
             }
             if(schematype == 'Event'){            
             $(".saswp-event-text-field-tr").show();  
             $(".saswp-option-table-class tr").find('select').attr('disabled', false);
             }
             if(schematype == 'AudioObject'){            
             $(".saswp-audio-text-field-tr").show();               
             }
             if(schematype == 'SoftwareApplication'){            
             $(".saswp-softwareapplication-text-field-tr").show();               
             }
             
             $(".saswp-schem-type-note").addClass('saswp_hide');
             if(schematype == 'qanda'){
              $(".saswp-schem-type-note").removeClass('saswp_hide');   
             }
             
             $(".saswp-job-posting-note").addClass('saswp_hide');
                          
//             if(schematype == 'JobPosting'){
//              $(".saswp-job-posting-note").removeClass('saswp_hide');   
//             }
             
             saswp_enable_rating_review();
        }); 
        
        $("#saswp_business_type").change(function(){
            var businesstype = $  (this).val(); 
            var schematype = $(".saswp-schame-type-select").val();
            
           $(".saswp-option-table-class tr").each(function(index,value){                
               if(index>1){
                   $(this).hide(); 
                   $(this).find('select').attr('disabled', true);
               }                               
            }); 
            
            if(schematype == 'TechArticle' || schematype == 'Article' || schematype == 'Blogposting' || schematype == 'NewsArticle' || schematype == 'WebPage'){
               
                $(".saswp-enable-speakable").parent().parent().show();
            }else{
                $(".saswp-enable-speakable").parent().parent().hide();
            }
            
            if(schematype == 'local_business'){
            $(".saswp-"+businesstype+'-tr').show(); 
            $(".saswp-business-text-field-tr").show(); 
            $(".saswp-"+businesstype+'-tr').find('select').attr('disabled', false); 
           // $("#saswp_dayofweek").attr('disabled', false);
            } 
             if(schematype == 'Service'){            
             $(".saswp-service-text-field-tr").show();  
             $(".saswp-service-text-field-tr").find('select').attr('disabled', false); 
             }
             if(schematype == 'Product'){            
             $(".saswp-product-text-field-tr").show(); 
             $(".saswp-product-text-field-tr").find('select').attr('disabled', false); 
             }
             if(schematype == 'AudioObject'){            
             $(".saswp-audio-text-field-tr").show();               
             }
             if(schematype == 'SoftwareApplication'){            
             $(".saswp-softwareapplication-text-field-tr").show();               
             }
             
             if(schematype == 'Review'){            
             $(".saswp-review-text-field-tr").show(); 
             $(".saswp-review-text-field-tr").find('select').attr('disabled', false);
             }
             if(schematype == 'Event'){            
             $(".saswp-event-text-field-tr").show(); 
             $(".saswp-event-text-field-tr").find('select').attr('disabled', false);
             }
            saswp_enable_rating_review();
        }).change(); 
        
        
    //Settings page jquery starts here    
 
    
    function saswp_compatibliy_notes(current, id){
        
                var plugin_name =  id.replace('-checkbox','');
                var text = $("#"+plugin_name).next('p').text(); 

                if (current.is(':checked') && text !=='') {              
                      $("#"+plugin_name).next('p').removeClass('saswp_hide');                   
                }else{

                    if($("#"+plugin_name).next('p').attr('data-id') == 1){
                        $("#"+plugin_name).next('p').text('This feature is only available in pro version');
                    }else{
                        $("#"+plugin_name).next('p').addClass('saswp_hide');
                    }                                                        
                }
        
    }
    
     
    $(".saswp-checkbox").change(function(){
        
                        var id = $(this).attr("id");
                        var current = $(this);
                                                                                                                        
                        
                  switch(id){
                      
                      case 'saswp-the-seo-framework-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-the-seo-framework").val(1);                                
                            }else{
                              $("#saswp-the-seo-framework").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-seo-press-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-seo-press").val(1);                                
                            }else{
                              $("#saswp-seo-press").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-aiosp-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-aiosp").val(1);                                
                            }else{
                              $("#saswp-aiosp").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-smart-crawl-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-smart-crawl").val(1);                                
                            }else{
                              $("#saswp-smart-crawl").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-for-wordpress-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-for-wordpress").val(1);  
                          }else{
                            $("#saswp-for-wordpress").val(0);  
                          }                          
                          break;
                      case 'saswp-facebook-enable-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-facebook-enable").val(1); 
                            $("#sd_facebook").show();
                          }else{
                            $("#saswp-facebook-enable").val(0);  
                            $("#sd_facebook").hide();
                          }                          
                          break;   
                      case 'saswp-twitter-enable-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-twitter-enable").val(1);
                            $("#sd_twitter").show();
                          }else{
                            $("#saswp-twitter-enable").val(0);  
                            $("#sd_twitter").hide();
                          }                          
                          break;
                      case 'saswp-google-plus-enable-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-google-plus-enable").val(1);  
                            $("#sd_google_plus").show();
                          }else{
                            $("#saswp-google-plus-enable").val(0); 
                            $("#sd_google_plus").hide();
                          }                          
                          break;
                      case 'saswp-instagram-enable-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-instagram-enable").val(1);  
                            $("#sd_instagram").show();
                          }else{
                            $("#saswp-instagram-enable").val(0);  
                            $("#sd_instagram").hide();
                          }                          
                          break;
                      case 'saswp-youtube-enable-checkbox':  
                          
                          if ($(this).is(':checked')) {
                            $("#sd_youtube").show();  
                            $("#saswp-youtube-enable").val(1);  
                          }else{
                            $("#saswp-youtube-enable").val(0);
                            $("#sd_youtube").hide();
                          }                          
                          break;
                      case 'saswp-linkedin-enable-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-linkedin-enable").val(1);  
                            $("#sd_linkedin").show();
                          }else{
                            $("#saswp-linkedin-enable").val(0);
                            $("#sd_linkedin").hide();
                          }                          
                          break; 
                      case 'saswp-pinterest-enable-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-pinterest-enable").val(1);  
                            $("#sd_pinterest").show();
                          }else{
                            $("#saswp-pinterest-enable").val(0); 
                            $("#sd_pinterest").hide();
                          }                          
                          break; 
                      case 'saswp-soundcloud-enable-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-soundcloud-enable").val(1);  
                            $("#sd_soundcloud").show();
                          }else{
                            $("#saswp-soundcloud-enable").val(0);
                            $("#sd_soundcloud").hide();
                          }                          
                          break; 
                      case 'saswp-tumblr-enable-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-tumblr-enable").val(1);  
                            $("#sd_tumblr").show();
                          }else{
                            $("#saswp-tumblr-enable").val(0);  
                            $("#sd_tumblr").hide();
                          }                          
                          break; 
                      case 'saswp-for-amp-checkbox':
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-for-amp").val(1);  
                          }else{
                            $("#saswp-for-amp").val(0);  
                          }                                           
                      break;
                      case 'saswp_kb_contact_1_checkbox':
                          
                        if ($(this).is(':checked')) {              
                         $("#saswp_kb_contact_1").val(1); 
                         $("#saswp_kb_telephone, #saswp_contact_type").parent().parent('li').removeClass("saswp-display-none");  
                       }else{                                                
                         $("#saswp_kb_contact_1").val(0);  
                         $("#saswp_kb_telephone, #saswp_contact_type").parent().parent('li').addClass("saswp-display-none"); 
                       }
                      break;
                      case 'saswp-logo-dimensions-check':
                          
                        if ($(this).is(':checked')) {              
                           $("#saswp-logo-dimensions").val(1);  
                           $("#saswp-logo-width, #saswp-logo-height").parent().parent('li').show();                           
                         }else{                             
                           $("#saswp-logo-dimensions").val(0);            
                           $("#saswp-logo-width, #saswp-logo-height").parent().parent('li').hide();
                         }
                      break;
                      case 'saswp_archive_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                                $("#saswp_archive_schema").val(1);
                                $(".saswp_archive_schema_type_class").parent().parent().show();
                              }else{
                                $("#saswp_archive_schema").val(0);           
                                $(".saswp_archive_schema_type_class").parent().parent().hide();
                              }
                      break;
                      
                      case 'saswp_website_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_website_schema").val(1);  
                              $("#saswp_search_box_schema").parent().parent().show();  
                            }else{
                              $("#saswp_website_schema").val(0);           
                              $("#saswp_search_box_schema").parent().parent().hide();
                            }
                      break;
                      
                      case 'saswp_search_box_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_search_box_schema").val(1);             
                            }else{
                              $("#saswp_search_box_schema").val(0);           
                            }
                      break;
                      
                      case 'saswp_breadcrumb_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_breadcrumb_schema").val(1);             
                            }else{
                              $("#saswp_breadcrumb_schema").val(0);           
                            }
                      break;
                                                                  
                      case 'saswp_comments_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_comments_schema").val(1);             
                            }else{
                              $("#saswp_comments_schema").val(0);           
                            }
                      break;
                      
                      case 'saswp-compativility-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-flexmlx-compativility").val(1);             
                            }else{
                              $("#saswp-flexmlx-compativility").val(0);           
                            }
                      break;
                      
                      case 'saswp-review-module-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-review-module").val(1);             
                            }else{
                              $("#saswp-review-module").val(0);           
                            }
                      break;
                      
                      case 'saswp-kk-star-raring-checkbox':
                          
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-kk-star-raring").val(1);             
                            }else{
                              $("#saswp-kk-star-raring").val(0);           
                            }
                      break;
                      case 'saswp-woocommerce-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woocommerce").val(1);                              
                            }else{
                              $("#saswp-woocommerce").val(0);                                         
                            }
                      break;
                      
                      case 'saswp-extra-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-extra").val(1);             
                            }else{
                              $("#saswp-extra").val(0);           
                            }
                      break;
                      
                      case 'saswp-dw-question-answer-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-dw-question-answer").val(1);             
                            }else{
                              $("#saswp-dw-question-answer").val(0);           
                            }
                      break;
                      
                      case 'saswp-wp-job-manager-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-job-manager").val(1);             
                            }else{
                              $("#saswp-wp-job-manager").val(0);           
                            }
                      break;
                      
                      case 'saswp-yoast-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-yoast").val(1);             
                            }else{
                              $("#saswp-yoast").val(0);           
                            }
                      break;
                     
                     case 'saswp-rankmath-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-rankmath").val(1);             
                            }else{
                              $("#saswp-rankmath").val(0);           
                            }
                      break;
                      
                      case 'saswp-tagyeem-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-tagyeem").val(1);             
                            }else{
                              $("#saswp-tagyeem").val(0);           
                            }
                      break;
                      
                      case 'saswp-the-events-calendar-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-the-events-calendar").val(1);             
                            }else{
                              $("#saswp-the-events-calendar").val(0);           
                            }
                      break;
                      
                                           
                      case 'saswp-woocommerce-booking-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woocommerce-booking").val(1);  
                              $("#saswp-woocommerce-booking-main").val(1); 
                            }else{
                              $("#saswp-woocommerce-booking").val(0); 
                              $("#saswp-woocommerce-booking-main").val(0); 
                            }
                      break;
                      
                      case 'saswp-woocommerce-booking-main-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woocommerce-booking-main").val(1);  
                              $("#saswp-woocommerce-booking").val(1); 
                            }else{
                              $("#saswp-woocommerce-booking-main").val(0);  
                              $("#saswp-woocommerce-booking").val(0);
                            }
                      break;
                      
                      case 'saswp-woocommerce-membership-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woocommerce-membership").val(1);             
                            }else{
                              $("#saswp-woocommerce-membership").val(0);           
                            }
                      break;
                      
                      case 'saswp-defragment-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-defragment").val(1);             
                            }else{
                              $("#saswp-defragment").val(0);           
                            }
                      break;
                      
                      case 'saswp-cooked-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-cooked").val(1);             
                            }else{
                              $("#saswp-cooked").val(0);           
                            }
                      break;
                      
                      case 'saswp-flexmlx-compativility-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-flexmlx-compativility").val(1);             
                            }else{
                              $("#saswp-flexmlx-compativility").val(0);           
                            }
                      break;
                      
                      case 'saswp-shopper-approved-review-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-shopper-approved-review").val(1);       
                              $(".saswp-s-reviews-settings-table").parent().parent().parent().show(); 
                            }else{
                              $("#saswp-shopper-approved-review").val(0);           
                              $(".saswp-s-reviews-settings-table").parent().parent().parent().hide(); 
                            }
                      break;
                      
                      case 'saswp-google-review-checkbox':
                          
                            if ($(this).is(':checked')) {
                                
                              $("#saswp-google-review").val(1); 
                              
                              if($("#saswp-google-rv-free-checkbox").length){
                               
                               $("#saswp-google-review-free").parent().parent().show();
                               
                               if($("#saswp-google-rv-free-checkbox").is(":checked")){
                                  $("#saswp_google_place_api_key").parent().parent().show();
                               }else{
                                  $("#saswp_google_place_api_key").parent().parent().hide(); 
                               }
                               }else{
                                  $("#saswp_google_place_api_key").parent().parent().show();                                  
                               } 
                                $(".saswp-g-reviews-settings-table").parent().parent().parent().show(); 
                                                                                                      
                            }else{
                                
                               $("#saswp-google-review").val(0);
                               $("#saswp_google_place_api_key").parent().parent().hide(); 
                               $(".saswp-g-reviews-settings-table").parent().parent().parent().hide(); 
                               
                               if($("#saswp-google-rv-free-checkbox").length){
                                   $("#saswp-google-review-free").parent().parent().hide();
                                   
                               }
                               
                               
                               
                               
                               
                            }
                      break;
                      
                      case 'saswp-google-rv-free-checkbox':
                          
                            if($("#saswp-google-review-checkbox").is(":checked")){
                                if ($(this).is(':checked')) {              
                              $("#saswp-google-review-free").val(1); 
                               $("#saswp_google_place_api_key").parent().parent().show();
                            }else{
                                $("#saswp-google-review-free").val(0);                    
                                $("#saswp_google_place_api_key").parent().parent().hide();
                            }
                                
                            }else{
                                $("#saswp-google-review-free").val(0);                    
                                $("#saswp_google_place_api_key").parent().parent().hide();
                            }
                          
                            
                      break;
                      
                      
                      case 'saswp-markup-footer-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-markup-footer").val(1);                                
                            }else{
                              $("#saswp-markup-footer").val(0);                                          
                            }
                      break;
                                                                  
                      case 'saswp-pretty-print-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-pretty-print").val(1);                                
                            }else{
                              $("#saswp-pretty-print").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-wppostratings-raring-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wppostratings-raring").val(1);                                
                            }else{
                              $("#saswp-wppostratings-raring").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-bbpress-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-bbpress").val(1);                                
                            }else{
                              $("#saswp-bbpress").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-microdata-cleanup-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-microdata-cleanup").val(1);                                
                            }else{
                              $("#saswp-microdata-cleanup").val(0);                                          
                            }
                      break;
                      
                      
                      default:
                          break;
                  }
                             
         }).change();
        
    $("#saswp_kb_type").change(function(){
              
          var datatype = $(this).val(); 
          
          $(".saswp_org_fields, .saswp_person_fields").parent().parent().addClass('saswp_hide');
          $(".saswp_kg_logo").parent().parent().parent().addClass('saswp_hide');
          $("#sd-person-image").parent().parent().parent().addClass('saswp_hide');
          
          
          if(datatype == 'Organization'){
              
              $(".saswp_org_fields").parent().parent().removeClass('saswp_hide');
              $(".saswp_person_fields").parent().parent().addClass('saswp_hide');
              $(".saswp_kg_logo").parent().parent().parent().removeClass('saswp_hide');
              $("#sd-person-image").parent().parent().parent().addClass('saswp_hide');
          }
          if(datatype == 'Person'){
              
              $(".saswp_org_fields").parent().parent().addClass('saswp_hide');
              $(".saswp_person_fields").parent().parent().removeClass('saswp_hide');
              $(".saswp_kg_logo").parent().parent().parent().removeClass('saswp_hide');
              $("#sd-person-image").parent().parent().parent().removeClass('saswp_hide');
          }

     }).change(); 
          
    $(document).on("click", "input[data-id=media]" ,function(e) {	// Application Icon upload
		e.preventDefault();
                var current = $(this);
                var button = current;
                var id = button.attr('id').replace('_button', '');                
		var saswpMediaUploader = wp.media({
			title: "Application Icon",
			button: {
				text: "Select Icon"
			},
			multiple: false,  // Set this to true to allow multiple files to be selected
                        library:{type : 'image'}
		})
		.on("select", function() {
			var attachment = saswpMediaUploader.state().get('selection').first().toJSON();                            
			
                         $("#"+id).val(attachment.url);
                         $("input[data-id='"+id+"_id']").val(attachment.id);
                         $("input[data-id='"+id+"_height']").val(attachment.height);
                         $("input[data-id='"+id+"_width']").val(attachment.width);
                         $("input[data-id='"+id+"_thumbnail']").val(attachment.url);
                         
                         if(current.attr('id') === 'sd_default_image_button'){
                             
                             $("#sd_default_image_width").val(attachment.width);
                             $("#sd_default_image_height").val(attachment.height);
                        
                         }
                         var smaller_img_notice = '';
                         if("saswp_image_div_"+id == 'saswp_image_div_sd_default_image' && attachment.height < 1200){
                              smaller_img_notice = '<p class="saswp_warning">Image size is smaller than recommended size</p>';
                         }
                         
                         $(".saswp_image_div_"+id).html('<div class="saswp_image_thumbnail"><img class="saswp_image_prev" src="'+attachment.url+'"/><a data-id="'+id+'" href="#" class="saswp_prev_close">X</a></div>'+smaller_img_notice);
                        
		})
		.open();
	});
        
    $(document).on("click", ".saswp_prev_close", function(e){
                e.preventDefault();
                
                var id = $(this).attr('data-id');   
                console.log(id);
                $(this).parent().remove();                
                $("#"+id).val('');
                $("input[data-id='"+id+"_id']").val('');
                $("input[data-id='"+id+"_height']").val('');
                $("input[data-id='"+id+"_width']").val('');
                $("input[data-id='"+id+"_thumbnail']").val('');
                
                 if(id === 'sd_default_image'){
                             
                    $("#sd_default_image_width").val('');
                    $("#sd_default_image_height").val('');
                        
                } 
                
                
        });
        
        //Settings page jquery ends here


    $(document).on("change",".saswp-schema-type-toggle", function(e){
               var schema_id = $(this).attr("data-schema-id"); 
               var post_id =   $(this).attr("data-post-id");     
               if($(this).is(':checked')){
               var status = 1;    
               }else{
               var status = 0;    
               }
             $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_enable_disable_schema_on_post",status:status, schema_id:schema_id, post_id:post_id, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){                                                     
                            },
                            error: function(response){                    
                            console.log(response);
                            }
                            });                                      

        });


    $(document).on("click",".saswp-reset-data", function(e){
                e.preventDefault();
             
                var saswp_confirm = confirm("Are you sure?");
             
                if(saswp_confirm == true){
                    
                $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_reset_all_settings", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){                               
                                setTimeout(function(){ location.reload(); }, 1000);
                            },
                            error: function(response){                    
                            console.log(response);
                            }
                            }); 
                
                }
                                                                 

        });
        
        //Licensing jquery starts here
    $(document).on("click",".saswp_license_activation", function(e){
                e.preventDefault();
                var current = $(this);
                current.addClass('updating-message');
                var license_status = $(this).attr('license-status');
                var add_on         = $(this).attr('add-on');
                var license_key    = $("#"+add_on+"_addon_license_key").val();
               
            if(license_status && add_on && license_key){
                
                $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_license_status_check",license_key:license_key,license_status:license_status, add_on:add_on, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){                               
                               
                               $("#"+add_on+"_addon_license_key_status").val(response['status']);
                                                                
                              if(response['status'] =='active'){  
                               $(".saswp-"+add_on+"-dashicons").addClass('dashicons-yes');
                               $(".saswp-"+add_on+"-dashicons").removeClass('dashicons-no-alt');
                               $(".saswp-"+add_on+"-dashicons").css("color", "green");
                               
                               $(".saswp_license_activation[add-on='" + add_on + "']").attr("license-status", "inactive");
                               $(".saswp_license_activation[add-on='" + add_on + "']").text("Deactivate");
                               
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").text('Activated');
                               
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").css("color", "green");                                
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").text(response['message']);
                                                                                             
                              }else{
                                  
                               $(".saswp-"+add_on+"-dashicons").addClass('dashicons-no-alt');
                               $(".saswp-"+add_on+"-dashicons").removeClass('dashicons-yes');
                               $(".saswp-"+add_on+"-dashicons").css("color", "red");
                               
                               $(".saswp_license_activation[add-on='" + add_on + "']").attr("license-status", "active");
                               $(".saswp_license_activation[add-on='" + add_on + "']").text("Activate");
                               
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").css("color", "red"); 
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").text(response['message']);
                              }
                               current.removeClass('updating-message');                                                           
                            },
                            error: function(response){                    
                                console.log(response);
                            }
                            });
                            
            }else{
                alert('Please enter value license key');
                current.removeClass('updating-message'); 
            }

        });
        //Licensing jquery ends here
  //query form send starts here

    $(".saswp-send-query").on("click", function(e){
            e.preventDefault();   
            var message = $("#saswp_query_message").val();              
            if($.trim(message) !=''){
             $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_send_query_message", message:message, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){                       
                              if(response['status'] =='t'){
                                $(".saswp-query-success").show();
                                $(".saswp-query-error").hide();
                              }else{
                                  console.log('dd');
                                $(".saswp-query-success").hide();  
                                $(".saswp-query-error").show();
                              }
                            },
                            error: function(response){                    
                            console.log(response);
                            }
                            });   
            }else{
                alert('Please enter the message');
            }                        

        });
        
        //Importer from schema plugin starts here

    $(".saswp-import-plugins").on("click", function(e){
            e.preventDefault();   
            var current_selection = $(this);
            current_selection.addClass('updating-message');
            var plugin_name = $(this).attr('data-id');                      
                         $.get(ajaxurl, 
                             { action:"saswp_import_plugin_data", plugin_name:plugin_name, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                              function(response){                                  
                              if(response['status'] =='t'){                                  
                                  $(current_selection).parent().find(".saswp-imported-message").text(response['message']);
                                  $(current_selection).parent().find(".saswp-imported-message").removeClass('saswp-error');
                                   setTimeout(function(){ location.reload(); }, 2000);
                              }else{
                                  $(current_selection).parent().find(".saswp-imported-message").addClass('saswp-error');
                                  $(current_selection).parent().find(".saswp-imported-message").text(response['message']);                                  
                              }  
                              current_selection.removeClass('updating-message');
                             },'json');
        });
        
        
    $(".saswp-feedback-no-thanks").on("click", function(e){
            e.preventDefault();               
                         $.get(ajaxurl, 
                             { action:"saswp_feeback_no_thanks"},
                              function(response){                                  
                              if(response['status'] =='t'){                                  
                                 $(".saswp-feedback-notice").hide();                                 
                              }       		   		
                             },'json');
        });
        
    $(".saswp-feedback-remindme").on("click", function(e){
            e.preventDefault();               
                         $.get(ajaxurl, 
                             { action:"saswp_feeback_remindme"},
                              function(response){                                  
                              if(response['status'] =='t'){                                  
                                 $(".saswp-feedback-notice").hide();                                 
                              }       		   		
                             },'json');
        });
        
    $(document).on("change",'.saswp-local-business-type-select', function(e){
            e.preventDefault();    
                        var current = $(this);    
                        var business_type = $(this).val();
                         $.get(ajaxurl, 
                             { action:"saswp_get_sub_business_ajax", business_type:business_type, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                              function(response){    
                                  
                              if(response['status'] =='t'){ 
                                   $(".saswp-local-business-name-select").parents('tr').remove();  
                                var schema_id = current.parents('.saswp-post-specific-wrapper').attr('data-id');                                
                                var html ='<tr><th><label for="saswp_business_name_'+schema_id+'">Sub Business Type</label></th>';
                                    html +='<td><select class="saswp-local-business-name-select" id="saswp_business_name_'+schema_id+'" name="saswp_business_name_'+schema_id+'">';    
                                    $.each(response['result'], function(index, element){
                                        html +='<option value="'+index+'">'+element+'</option>';      
                                    });                                    
                                    html +='</select></td>';    
                                    html +='</tr>'; 
                                    current.parents('.form-table tr:first').after(html);
                              }else{
                                    $(".saswp-local-business-name-select").parents('tr').remove();
                              }       		   		
                             },'json');
        });
        
        
    function saswp_item_reviewed_call(){

        $(".saswp-item-reviewed").change(function(e){
        e.preventDefault();
        var schema_type =""; 

        if($('select#schema_type option:selected').val()){
           schema_type = $('select#schema_type option:selected').val();    
        }       
        if($(".saswp-tab-links.selected").attr('saswp-schema-type')){
           schema_type = $(".saswp-tab-links.selected").attr('saswp-schema-type');    
        }

        if(schema_type === 'Review'){

                    var current = $(this);    
                    var item    = $(this).val();
                    var post_id = saswp_localize_data.post_id;
                    var schema_id = $(current).attr('data-id');  
                    var post_specific = $(current).attr('post-specific');  
                     $.get(ajaxurl, 
                         { action:"saswp_get_item_reviewed_fields",schema_id:schema_id,  post_specific:post_specific ,item:item, post_id:post_id, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                          function(response){    

                            $(current).parent().parent().nextAll().remove(".saswp-review-tr");                                    
                            $(current).parent().parent().after(response);    

                         });

        }


    }).change();

    }
    saswp_item_reviewed_call();
                                        
        function saswpAddTimepicker(){
         $('.saswp-local-schema-time-picker').timepicker({ 'timeFormat': 'H:i:s'});
        }
        $('.saswp-local-schema-time-picker').timepicker({ 'timeFormat': 'H:i:s'});
        
        $(document).on("click",".saswp-add-custom-schema", function(e){
            
            e.preventDefault();  
            
            $(".saswp-add-custom-schema-field").removeClass('saswp_hide');
            $(this).hide();
                       
        });
        
        $(document).on("click", ".saswp-delete-custom-schema", function(e){
            
            e.preventDefault();  
            
            $("#saswp_custom_schema_field").val('');
            $(".saswp-add-custom-schema-field").addClass('saswp_hide');
            $(".saswp-add-custom-schema").show();
                                               
        });
        
        $(".saswp-modify_schema_post_enable").on("click", function(e){
            var current = $(this);
            current.addClass('updating-message');
            e.preventDefault();                                                    
                         $.get(ajaxurl, 
                             { action:"saswp_modify_schema_post_enable", post_id: saswp_localize_data.post_id,saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                              function(response){   
                               current.remove();   
                               $(".saswp-add-custom-schema-div").remove();
                               $("#post_specific .inside").append(response); 
                               current.removeClass('updating-message');
                               saswpAddTimepicker();  
                               saswp_schema_datepicker();
                               saswp_enable_rating_review();
                               saswp_item_reviewed_call();
                             });
                             
        });
        saswp_schema_datepicker();        
        
        saswp_reviews_datepicker();
        function saswp_reviews_datepicker(){
        
            $('.saswp-reviews-datepicker-picker').datepicker({
             dateFormat: "yy-mm-dd"            
          });
        }
        
        //Review js starts here
        
        $(document).on("click", ".saswp-add-more-item",function(e){
            e.preventDefault();
            var rows = $('.saswp-review-item-list-table tr').length;
            console.log(rows);
            var html = '<tr class="saswp-review-item-tr">';
                html += '<td>Review Item Feature</td>';
                html += '<td><input type="text" name="saswp-review-item-feature[]"></td>';
                html += '<td>Rating</td>';
                html += '<td><input step="0.1" min="0" max="5" type="number" name="saswp-review-item-star-rating[]"></td>';
                html += '<td><a type="button" class="saswp-remove-review-item button">x</a></td>';
                html += '</tr>';                
                $(".saswp-review-item-list-table").append(html);
                
        });
        
        $(document).on("click", ".saswp-remove-review-item", function(e){
            e.preventDefault();        
            $(this).parent().parent('tr').remove();
       });
        
        $(document).on("focusout", ".saswp-review-item-tr input[type=number]", function(e){
            e.preventDefault();    
            var total_rating = 0;
            var element_count = $(".saswp-review-item-tr input[type=number]").length;            
            $(".saswp-review-item-tr input[type=number]").each(function(index, element){
                if($(element).val() ==''){
                  total_rating += parseFloat(0);  
                }else{
                  total_rating += parseFloat($(element).val());  
                }
                           
            });
            var over_all_rating = total_rating / element_count;
            $("#saswp-review-item-over-all").val(over_all_rating);
       });
       
       $("#saswp-review-location").change(function(){
          var location = $(this).val();
          $(".saswp-review-shortcode").addClass('saswp_hide');
          if(location == 3){  
              $(".saswp-review-shortcode").removeClass('saswp_hide');
          }                                          
        }).change();  
        
        $("#saswp-review-item-enable").change(function(){
                          if ($(this).is(':checked')) {              
                            $(".saswp-review-fields").show();  
                          }else{
                            $(".saswp-review-fields").hide();  
                          }                                        
        }).change();  
        
        $(document).on("click", ".saswp-restore-post-schema", function(e){
                    e.preventDefault(); 
                    var current = $(this);
                    current.addClass('updating-message');
            
                    if($(".saswp-post-specific-schema-ids").val()){
                        var schema_ids = JSON.parse($(".saswp-post-specific-schema-ids").val());                           
                    }
            
                         $.post(ajaxurl, 
                             { action:"saswp_restore_schema", schema_ids:schema_ids,post_id: saswp_localize_data.post_id, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                              function(response){                                  
                              if(response['status'] =='t'){                                                                    
                                   setTimeout(function(){ location.reload(); }, 1000);
                              }else{
                                  alert(response['msg']);
                                  setTimeout(function(){ location.reload(); }, 1000);
                              }  
                              current.removeClass('updating-message');
                             },'json');
        });
                
        //Review js ends here
                
        $(document).on("click","div.saswp-tab ul.saswp-tab-nav a", function(e){
            e.preventDefault();
                var attr = $(this).attr('data-id');
                $(".saswp-post-specific-wrapper").hide();            
                $("#"+attr).show();           
                $('div.saswp-tab ul.saswp-tab-nav a').removeClass('selected');
                $('div.saswp-tab ul.saswp-tab-nav li').removeClass('selected');
                $(this).addClass('selected'); 
                $(this).parent().addClass('selected'); 
            saswp_enable_rating_review();
        });
        
        
        $('#saswp-global-tabs a:first').addClass('saswp-global-selected');
        $('.saswp-global-container').hide();
        
        var hash = window.location.hash;
        
        if(hash == '#saswp-default-container'){
            $('.saswp-global-container:eq(2)').show();
        }else{
            $('.saswp-global-container:first').show();
        }
        
        
        
        $('#saswp-global-tabs a').click(function(){
            var t = $(this).attr('data-id');
            
          if(!$(this).hasClass('saswp-global-selected')){ 
            $('#saswp-global-tabs a').removeClass('saswp-global-selected');           
            $(this).addClass('saswp-global-selected');

            $('.saswp-global-container').hide();
            $('#'+t).show();
         }
        });
        
        
        $('#saswp-tools-tabs a:first').addClass('saswp-global-selected');
        $('.saswp-tools-container').hide();
        $('.saswp-tools-container:first').show();
        
        $('#saswp-tools-tabs a').click(function(){
            var t = $(this).attr('data-id');
            
          if(!$(this).hasClass('saswp-global-selected')){ 
            $('#saswp-tools-tabs a').removeClass('saswp-global-selected');           
            $(this).addClass('saswp-global-selected');

            $('.saswp-tools-container').hide();
            $('#'+t).show();
         }
        });
        
        
        $('#saswp-review-tabs a:first').addClass('saswp-global-selected');
        $('.saswp-review-container').hide();
        $('.saswp-review-container:first').show();
        
        $('#saswp-review-tabs a').click(function(){
            var t = $(this).attr('data-id');
            
          if(!$(this).hasClass('saswp-global-selected')){ 
            $('#saswp-review-tabs a').removeClass('saswp-global-selected');           
            $(this).addClass('saswp-global-selected');

            $('.saswp-review-container').hide();
            $('#'+t).show();
         }
        });
        
        
        //Importer from schema plugin ends here
        
        //custom fields modify schema starts here
        
        //Changing the url of add new schema type 
        $('a[href="'+saswp_localize_data.new_url_selector+'"]').attr( 'href', saswp_localize_data.new_url_href); 
        
        
       $("#saswp_enable_custom_field").change(function(){
            if ($(this).is(':checked')) { 
                $(".saswp-custom-fields-div").show();
            }else{
                $(".saswp-custom-fields-div").hide();
            }
        });
        
       $(document).on('change','.saswp-custom-fields-name',function(){
                                                   
            var type = 'text';               
            var fields_name = $(this).val();            
            var str2 = "image";
            if(fields_name.indexOf(str2) != -1){
                type = 'image';
            }
                         
             var id = $(this).parent().parent('tr').find("td:eq(1)");             
             saswp_get_meta_list(type, null, id, fields_name);                    
             $(this).parent().parent('tr').find("td:gt(1)").remove();
       }); 
                
       $(document).on("click", '.saswp-skip-button', function(e){
           e.preventDefault();
           $(this).parent().parent().hide();
           
                    $.post(ajaxurl, 
                        { action:"saswp_skip_wizard", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                         function(response){                                  
                          		   		
                        },'json');
           
       }); 
                                                                                    
       $(document).on("click", ".saswp_add_schema_fields_on_fly", function(e){
           e.preventDefault();
                      
          var schema_id   = $(this).attr('data-id');
          var fields_type = $(this).attr('fields_type'); 
          var div_type    = $(this).attr('div_type');
          
          var count =  $(".saswp-"+div_type+"-table-div").length;
          var index = $( ".saswp-"+div_type+"-table-div:nth-child("+count+")" ).attr('data-id');
              index = ++index;
           
           if(!index){
               index = 0;
           }
                       
            saswp_get_post_specific_schema_fields(index, fields_type, div_type, schema_id, fields_type+'_');               
            
       });
       
       $(document).on("click", ".saswp-table-close", function(){
           $(this).parent().remove();
       });
        
       //How to schema js ends here
       
       
       $(document).on("change",".saswp-custom-meta-list", function(){
           
          var meta_val = $(this).val();
          var field_name =  $(this).parent().parent('tr').find(".saswp-custom-fields-name").val();
          var html = '';
          if(meta_val == 'manual_text'){
              html = '<td><input type="text" name="saswp_fixed_text['+field_name+']"></td>';
          }
          
          if(meta_val == 'custom_field'){
              html += '<td><select class="saswp-custom-fields-select2" name="saswp_custom_meta_field['+field_name+']">';
              html += '</select></td>'; 
             
          }
          $(this).parent().parent('tr').find("td:gt(1)").remove();
          $(this).parent().parent('tr').append(html);
           saswpCustomSelect2();
           
       });
        
       $(document).on("click", '.saswp-add-custom-fields', function(){          
          var schema_type = $('select#schema_type option:selected').val();
          var post_id = $('#post_ID').val();
          if(schema_type !=''){
                            
              if(!saswp_meta_list_fields){
                  
                      $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_get_schema_type_fields",post_id:post_id, schema_type:schema_type, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){                                                                         
                                     saswp_meta_list_fields = response;
                                     saswp_get_meta_list('text', saswp_meta_list_fields, null, null);
                             
                            },
                            error: function(response){                    
                            console.log(response);
                            }
                            });
                  
                  
              }else{
                  saswp_get_meta_list('text', saswp_meta_list_fields, null, null);
              }
                     
          }
       });
       saswpCustomSelect2();
       function saswpCustomSelect2(){          
       if((saswp_localize_data.post_type == 'saswp' || saswp_localize_data.page_now =='saswp') && saswp_localize_data.page_now !='saswp_page_structured_data_options'){
           
           $('.saswp-custom-fields-select2').select2({
  		ajax: {
                        type: "POST",    
    			url: ajaxurl, // AJAX URL is predefined in WordPress admin
    			dataType: 'json',
    			delay: 250, // delay in ms while typing when to perform a AJAX search
    			data: function (params) {
      				return {
                                        saswp_security_nonce: saswp_localize_data.saswp_security_nonce,
        				q: params.term, // search query
        				action: 'saswp_get_custom_meta_fields' // AJAX action for admin-ajax.php
      				};
    			},
    			processResults: function( data ) {
				return {
					results: data
				};
			},
			cache: true
		},
		minimumInputLength: 2 // the minimum of symbols to input before perform a search
	});   
           
       }    
           
       }           
      
     function saswp_enable_rating_review(){
           var schema_type ="";                      
           if($('select#schema_type option:selected').val()){
              schema_type = $('select#schema_type option:selected').val();    
           }       
           if($(".saswp-tab-links.selected").attr('saswp-schema-type')){
              schema_type = $(".saswp-tab-links.selected").attr('saswp-schema-type');    
           }
          
         if(schema_type){
             $(".saswp-enable-rating-review-"+schema_type.toLowerCase()).change(function(){
                               
            if($(this).is(':checked')){
            $(this).parent().parent().siblings('.saswp-rating-review-'+schema_type.toLowerCase()).show();            
             }else{
            $(this).parent().parent().siblings('.saswp-rating-review-'+schema_type.toLowerCase()).hide(); 
             }
         
            }).change();   
         }
               
     }      
     saswp_enable_rating_review();                       
     
        //custom fields modify schema ends here
        
        
        //Google review js starts here        
        
        $('a[href="'+saswp_localize_data.collection_post_add_url+'"]').attr( 'href', saswp_localize_data.collection_post_add_new_url); 
        
        
        
        $(document).on("click", '.saswp_coonect_google_place', function(){          
          
          var place_id   = $("#saswp_google_place_id").val();
          var language   = $("#saswp_language_list").val();
          var google_api = $("#saswp_googel_api").val();
          
          if(place_id !=''){
              $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_connect_google_place",place_id:place_id, language:language, google_api:google_api, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){    
                                console.log(response['status']);                             
                            },
                            error: function(response){                    
                                console.log(response);
                            }
                            });
          }
       });
                
        //google review js ends here
                                        
        //Adding settings button beside add schema type button on schema type list page       
        
        if ('saswp' == saswp_localize_data.post_type && saswp_localize_data.page_now == 'edit.php') {
        
         jQuery(jQuery(".wrap a")[0]).after("<a href='"+saswp_localize_data.saswp_settings_url+"' id='' class='page-title-action'>Settings</a>");
         
        }
        
        //star rating stars here
            if(typeof(saswp_reviews_data) !== 'undefined'){
            
             $(".saswp-rating-div").rateYo({
                
              rating: saswp_reviews_data.rating_val,
              halfStar: true,
              //normalFill: "#ffd700",
              readOnly: saswp_reviews_data.readonly,
              onSet: function (rating, rateYoInstance) {
                $(this).next().val(rating);
                console.log(rating);
                }
                              
            });
                
            }
            $(document).on("click", ".saswp-add-g-location-btn", function(e){
                
                var blocks_field = '';
                
                if($("#saswp_google_place_api_key").length){
                    
                    blocks_field = '<input class="saswp-g-blocks-field" name="sd_data[saswp_reviews_location_blocks][]" type="number" min="5" step="5" placeholder="5" disabled="disabled">';
                }else{
                    blocks_field = '<input class="saswp-g-blocks-field" name="sd_data[saswp_reviews_location_blocks][]" type="number" min="10" step="10" placeholder="10">'; 
                }
                                
                e.preventDefault();
                    var html = '';
                        html    += '<tr>'
                                + '<td style="width:12%;"><strong>Place Id</strong></td>'
                                + '<td style="width:20%;"><input class="saswp-g-location-field" name="sd_data[saswp_reviews_location_name][]" type="text" value=""></td>'                                
                                + '<td style="width:10%;"><strong>Reviews</strong></td>'
                                + '<td style="width:10%;">'+blocks_field+'</td>'                                                            
                                + '<td style="width:10%;"><a class="button button-default saswp-fetch-g-reviews">Fetch</a></td>'
                                + '<td style="width:10%;"><a type="button" class="saswp-remove-review-item button">x</a></td>'
                                + '<td style="width:10%;"><p class="saswp-rv-fetched-msg"></p></td>' 
                                + '</tr>';                
                if(html){
                    $(".saswp-g-reviews-settings-table").append(html);
                }
                
            });
        
            function saswp_fetch_s_approved_reviews(current){
                
                current.addClass('updating-message');
                $.get(ajaxurl, 
                    { action:"saswp_fetch_s_approved_reviews", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                     function(response){ 
                         current.removeClass('updating-message');
                         console.log(response);
                                      if(response['status']){
                                         current.parent().parent().find('.saswp-rv-fetched-msg').text(response['message']);
                                         current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "green");
                                      }else{
                                         current.parent().parent().find('.saswp-rv-fetched-msg').text(response['message']); 
                                         current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "#988f1b");
                                      }  
                                                                                                                                                                                             
                    },'json');
                                
            }
        
            function saswp_add_s_approved_reviews(current, site_id, token, limit, api_key, page, loop_run){
                current.addClass('updating-message');
                $.get(ajaxurl, 
                    { action:"saswp_add_s_approved_reviews",site_id:site_id,token:token,limit:limit,api_key:api_key,page:page, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                     function(response){ 
                         current.removeClass('updating-message');
                         console.log(response);
                                      if(response['status']){
                                         current.parent().parent().find('.saswp-rv-fetched-msg').text(response['message']);
                                         current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "green");
                                      }else{
                                         current.parent().parent().find('.saswp-rv-fetched-msg').text(response['message']); 
                                         current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "#988f1b");
                                      }                                        
                                      page++;
                                      if(page <loop_run){
                                          saswp_add_s_approved_reviews(current, site_id, token, limit, api_key, page);
                                      }else{
                                         saswp_fetch_s_approved_reviews(current);
                                      }                                                                                                                  
                    },'json');
                
            }
                
            $(document).on("click",".saswp-fetch-s-approved-reviews", function(e){
                
                e.preventDefault();
                var current = $(this);
                current.addClass('updating-message');
                var site_id  = $("#saswp_s_approved_site_id").val();
                var token    = $("#saswp_s_approved_token").val();
                var limit    = $("#saswp_s_approved_reviews").val();
                var api_key  = $("#reviews_addon_license_key").val();
                var loop_run = 1;
                var page     = 0;
                
                if(limit > 100){
                    var div_limit = limit/100;
                    var div_remainder = limit%100;
                    loop_run = div_limit;
                    
                    if(div_remainder){
                        loop_run++;
                    }
                                        
                }
                                
                if(site_id && token && api_key){
                      
                        saswp_add_s_approved_reviews(current, site_id, token, limit, api_key, page, loop_run);
                                        
                }else{
                        current.removeClass('updating-message');
                        alert('Fill the site id and token with valid api key');
                }
                                
            });
        
        
            $(document).on("click", '.saswp-fetch-g-reviews', function(){          
                                                              
              var current        = $(this);  
              var premium_status = 'free';
              current.addClass('updating-message');
                                          
              var location           = $(this).parent().parent().find('.saswp-g-location-field').val();
              var blocks             = $(this).parent().parent().find('.saswp-g-blocks-field').val();
              var g_api              = $("#saswp_google_place_api_key").val();
              var reviews_api        = $("#reviews_addon_license_key").val();
              var reviews_api_status = $("#reviews_addon_license_key_status").val();
                                              
                if($("#saswp_google_place_api_key").length){
                    premium_status = 'free';
                }else{
                    premium_status = 'premium'; 
                }                 
                   
                if(premium_status == 'premium'){
                    
                    if(blocks > 0){
                    
                    var blocks_remainder = blocks % 10;
                                        
                        if(blocks_remainder != 0){
                            
                            current.parent().parent().find('.saswp-rv-fetched-msg').text('Reviews count should be in step of 10');
                            current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "#988f1b");
                            current.removeClass('updating-message');
                            return false;
                            
                        }
                        
                    }else{
                        alert('Blocks value is zero');
                        current.removeClass('updating-message');
                        return false;
                    }
                                        
                }
                
                if(location !='' && (reviews_api || g_api)){
                    $.ajax({
                                  type: "POST",    
                                  url:ajaxurl,                    
                                  dataType: "json",
                                  data:{action:"saswp_fetch_google_reviews",reviews_api_status:reviews_api_status, reviews_api:reviews_api,location:location,blocks:blocks,g_api:g_api,premium_status:premium_status, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                                  success:function(response){    
                                      if(response['status'] =='t'){
                                         current.parent().parent().find('.saswp-rv-fetched-msg').text('Success');
                                         current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "green");
                                      }else{
                                         current.parent().parent().find('.saswp-rv-fetched-msg').text(response['message']); 
                                         current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "#988f1b");
                                      }  
                                      current.removeClass('updating-message');
                                  },
                                  error: function(response){                    
                                      console.log(response);
                                  }
                                  });
                }else{
                    if(location ==''){
                        alert('Please enter place id'); 
                    }
                    if(g_api ==''){
                        alert('Please enter api key'); 
                    }
                    if(reviews_api ==''){
                        alert('Please enter reviews api key'); 
                    }
                   current.removeClass('updating-message');
                }
            });
                                            
        //rating ends here
               
            $("#sd-person-phone-number, #saswp_kb_telephone").focusout(function(){
                var current = $(this);
                
                current.parent().find('.saswp-phone-validation').remove();   
                
                var pnumber = $(this).val();
                var p_regex = /^\+([0-9]{1,3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{2,4})[-. ]?([0-9]{2,4})$/;
                
                if(!p_regex.test(pnumber)){
                 current.after('<span style="color:red;" class="saswp-phone-validation">Invalid Phone Number</span>');   
                }else{
                 current.parent().find('.saswp-phone-validation').remove();   
                }
                                
            });   
      
});
