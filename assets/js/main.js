( function( $ ) {

    "use strict";

    var isMobile = false;
    var isiPhoneiPad = false;
    var swiperObjs = [];

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
    }

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        isiPhoneiPad = true;
    }
    var swiperStickyProduct = $( '#single-product-sticky' );

    /* Remove cookie policy on page load if page is cached */
    var gdpr_cookie_name = 'hongo_gdpr_cookie_notice_accepted'+hongoMain.site_id;
    if( typeof getHongoCookie( gdpr_cookie_name ) != 'undefined' && getHongoCookie(gdpr_cookie_name) ){
        $('.hongo-cookie-policy-wrapper').remove();
    }

    /* Set default variation Function */
    function hongoSetDefaultVariation() {

        /* All variation hide / show based on condition */
        $( '.variations_form' ).find( '.hongo-attribute-filter' ).each( function() {

            var $wrap = $( this ),
                $variation_select = $wrap.closest( '.value' ).find( 'select' );

                $wrap.find( '.hongo-swatch' ).each( function() {
                    var value = $( this ).data( 'value' );

                    if ( ! $variation_select.find( 'option[value="' + value + '"]' ).length ) {

                        $( this ).addClass( 'disable' );
                        
                    } else {

                        $( this ).removeClass( 'disable' );
                    }
                });
        });
    };

    /* Single product boxed variation form */
    $.fn.hongoVariationSwatchesForm = function () {
        return this.each( function() {

            var $form = $( this ),
                clicked = null,
                selected = [];

            $form.on( 'click', '.hongo-swatch', function ( e ) {

                e.preventDefault();

                var $el = $( this ),
                    $select = $el.closest( '.value' ).find( 'select' ),
                    attribute_name = $select.data( 'attribute_name' ) || $select.attr( 'name' ),
                    value = $el.data( 'value' );

                // Check if this combination is available
                if ( ! $select.find( 'option[value="' + value + '"]' ).length ) {
                    
                    $form.trigger( 'hongo_no_matching_variations', [$el] );
                    return;
                }

                clicked = attribute_name;

                if ( selected.indexOf( attribute_name ) === -1 ) {
                    selected.push(attribute_name);
                }

                if ( $el.hasClass( 'active' ) ) {

                    $select.val( '' );
                    $el.removeClass( 'active' );

                } else {

                    $el.addClass( 'active' ).siblings( '.active' ).removeClass( 'active' );
                    $select.val( value );
                }

                $select.change();

                /* Set default variation */
                hongoSetDefaultVariation();
            } )
            .on( 'click', '.reset_variations', function () {
                $( this ).closest( '.variations_form' ).find( '.hongo-swatch.active' ).removeClass( 'active' );
                $( this ).closest( '.variations_form' ).find( '.hongo-swatch.disable' ).removeClass( 'disable' );
                selected = [];
                        
                setTimeout(function() {
                    
                    /* Set default variation */
                    hongoSetDefaultVariation();

                }, 100 );

            } )
            .on( 'hongo_no_matching_variations', function() {
                window.alert( wc_add_to_cart_variation_params.i18n_no_matching_variations_text );
            } );
        });
    };

    /* Single product boxed variation form */
    $( '.variations_form' ).hongoVariationSwatchesForm();

    /* Window load event start code */
    $(window).load(function () {

        setResizeContent();

        setTimeout(function() {
            
            /* Set default variation */
            hongoSetDefaultVariation();

        }, 100 );

        if ( isIE() ) {

            $( ".hongo-row-min-height" ).each(function() {

        		if( ! $( this ).parent().hasClass( 'vc_ie-flexbox-fixer' ) && ! $( this ).hasClass( 'vc_row-o-full-height' ) ) {

                    $( this ).wrap( '<div class="vc_ie-flexbox-fixer"></div>' );
                }
            });
        }        

        /* One page smooth navigation */
        var hash = window.location.hash.substr(1);
        if (hash != "") {
            setTimeout(function () {
                $(window).imagesLoaded(function () {
                    var scrollAnimationTime = 1200,
                            scrollAnimation = 'easeInOutExpo';
                    var target = '#' + hash;
                    if ($(target).length > 0) {

                        $('html, body').stop()
                                .animate({
                                    'scrollTop': $(target).offset().top
                                }, scrollAnimationTime, scrollAnimation, function () {
                                    window.location.hash = target;
                                });
                    }
                });
            }, 500);
        }

        /*Add Custom Zoom Icon*/
        if( hongoMain.zoom_enabled ) {

            if( hongoMain.enable_zoom_icon == 1 ) {

                if( $( '.woocommerce-product-gallery__trigger' ).length > 0 ) {
                    
                    // Zoom Icon
                    if( $( '.woocommerce-product-gallery__trigger img' ).length > 0 ) {
                        $( '.woocommerce-product-gallery__trigger img' ).attr('src',hongoMain.zoom_icon);
                    } else {
                        $( '.woocommerce-product-gallery__trigger' ).html('<img draggable="false" class="emoji" alt="🔍" src="'+hongoMain.zoom_icon+'">');
                    }

                    $( '.woocommerce-product-gallery__trigger' ).addClass( 'product-img-btn' );

                    // Tooltip
                    $( '.woocommerce-product-gallery__trigger' ).attr( 'data-original-title', hongoMain.zoom_tooltip_text );
                    $( '.woocommerce-product-gallery__trigger' ).attr( 'data-placement', 'left' );
                    $( '.woocommerce-product-gallery__trigger' ).tooltip();
                }
            }
        }

        setTimeout(function () {
            $( '.product-img-btn' ).fadeIn();
        }, 10 );

        /* Product sale, new, zoom and video box position changed on page load event when thumbnails slider is off */
        
        if( $( '.flex-viewport' ).length > 0 || $( '.hongo-single-product-image-wrap' ).length > 0 ) {

            if( hongoMain.enable_zoom_icon == 1 ) {

                if( $( '.hongo-single-product-image-wrap' ).length > 0 ) {

                    var $product_box_obj = $( '.hongo-single-product-image-wrap' );
                    
                    $( '.woocommerce-product-gallery .flex-viewport' ).prepend( $product_box_obj );
                }
                if( $( '.woocommerce-product-gallery__trigger' ).length > 0 ) {

                    var $product_gallery_obj = $( '.woocommerce-product-gallery__trigger' );
                    
                    $( '.woocommerce-product-gallery .flex-viewport' ).prepend( $product_gallery_obj );
                    $( '.woocommerce-product-gallery .hongo-single-product-image-wrap' ).prepend( $product_gallery_obj );
                }
            }
        }

    });
    /* Window load event end code */
    
    /* Window ready event start code */
    $(document).ready(function () {

        var gdpr_cookie_name = 'hongo_gdpr_cookie_notice_accepted'+hongoMain.site_id;
        if( typeof getHongoCookie( gdpr_cookie_name ) != 'undefined' && getHongoCookie(gdpr_cookie_name) ){            
            $('.hongo-cookie-policy-wrapper').addClass('banner-visited');
            $('.hongo-cookie-policy-wrapper').remove();
        }else{
            $('.hongo-cookie-policy-wrapper').removeClass('banner-visited');
        }
        $('.hongo-cookie-policy-button').on('click', function(){
            $('.hongo-cookie-policy-wrapper').remove();
            setHongoCookie( gdpr_cookie_name, 'visited', '7' );
        });

        // Shop banner style 10 blur effect
        if( $( '.hongo-shop-banner-blur-event' ).length > 0 ) {

            $( '.hongo-shop-banner-blur-event' ).on( 'mouseenter', function () {

                var sectionObj = $( this ).parents( '.vc_row' );
                $( '.hongo-shop-banner-blur-event', sectionObj ).addClass( 'hongo-shop-banner-blur-effect' );
                $( this ).removeClass( 'hongo-shop-banner-blur-effect' );

            }).on( 'mouseleave', function () {

                $( '.hongo-shop-banner-blur-event' ).removeClass( 'hongo-shop-banner-blur-effect' );
            });
        }

        $(".comment-button").on("click", function () {
            var fields;
                fields = "";
            if($(this).parent().parent().find('#author').length == 1) {
                if ($("#author").val().length == 0 || $("#author").val().value == '')
                {
                    fields ='1';
                    $("#author").addClass("inputerror");
                }
            }
            if($(this).parent().parent().find('#comment').length == 1) {
                if ($("#comment").val().length == 0 || $("#comment").val().value == '')
                {
                    fields ='1';
                    $("#comment").addClass("inputerror");
                }
            }
            if($(this).parent().parent().find('#email').length == 1) {
                if ($("#email").val().length == 0 || $("#email").val().length =='')
                {
                    fields ='1';
                    $("#email").addClass("inputerror");
                }
                else
                    {
                        var re = new RegExp();
                        re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        var sinput ;
                        sinput= "" ;
                        sinput = $("#email").val();
                        if (!re.test(sinput))
                        {
                            fields ='1';
                            $("#email").addClass("inputerror");
                        }
                    }
            }
            if(fields !="")
            {
                return false;
            }           
            else
            {
                return true;
            }
        });

        $('.comment-field').on('keyup',function(e){
            var id = $(this).attr('id');
            if( id ){
                $('#'+id).removeClass('inputerror');
            }
        });

        // For minimalist style title remove
        if( $( '.hongo-shop-minimalist' ).length > 0 ) {
            $( '.hongo-shop-minimalist .hongo-quick-view i' ).attr('title', '');
            $( '.hongo-shop-minimalist .hongo-wishlist i' ).attr('title', '');
        }

        /* For Stretch Effect */
        $( 'body' ).addClass('hongo-ready');

        setResizeContent();
        mobileBreakpoint();
        hongoCustomHorizontalScroll( '' );
        hongoCustomVerticalScroll( '' );
        topFilterDynamicWidth();

        /* Equal height code from product featurebox element */
        if( $( '.hongo-product-featurebox' ).length > 0 ) {

            $( '.hongo-product-featurebox' ).each( function() {

                if( ! $( this ).hasClass( 'equal_height_disable' ) ) {

                    if( $( this ).parents( '.vc_row' ).hasClass( 'vc_inner' ) ) {
                        $( this ).parents( '.vc_inner' ).addClass( 'hongo-vc-equal-height' );
                        $( this ).parents( '.vc_column-inner' ).addClass( 'hongo-vc-equal-height-column-inner' );
                    } else {
                        $( this ).parents( '.vc_row' ).addClass( 'hongo-vc-equal-height' );
                        $( this ).parents( '.vc_column-inner' ).addClass( 'hongo-vc-equal-height-column-inner' );
                    }
                }
            });
        }

        /* Sticky add to cart scroll to up*/
        $( document ).on( 'click', '.sticky-add-to-cart', function() {
            setTimeout(function() {
                $('html, body').stop()
                    .animate({
                        'scrollTop': 0
                    });
            }, 300);
        });

        /* WooCommerce Sticky Product thumb*/
        $( document ).on( 'click', '.hongo-single-product-sticky-thumb-wrap a', function() {

            $( '.hongo-single-product-sticky-thumb-wrap a' ).removeClass( 'active' );
            $( this ).addClass( 'active' );
            var stickyIndex = $( this ).attr( 'data-image-attribute' );

            var offsetTopValue = $( '.hongo-single-product-image-wrap .woocommerce-product-gallery__image:eq( ' + stickyIndex + ' )' );
                offsetTopValue = offsetTopValue.offset().top;

            $('html, body').stop()
                .animate({
                    'scrollTop': offsetTopValue
                });
        });

        /* WooCommerce Sticky Product thumb active on appear */
        if( $( '.hongo-sticky-content-images-wrap' ).length > 0 && $.inArray( 'jquery-appear', hongoMain.disable_scripts ) < 0 ) {

            $( '.hongo-single-product-image-wrap .woocommerce-product-gallery__image' ).appear();
            $( '.hongo-single-product-image-wrap .woocommerce-product-gallery__image' ).each( function( index ) {

                $( this ).on( 'appear', function (e) {

                    $( '.hongo-single-product-sticky-thumb-wrap a' ).removeClass( 'active' );
                    $( '.hongo-single-product-sticky-thumb-wrap a:eq( ' + index + ' )' ).addClass( 'active' );
                });
            });
        }

        /* WooCommerce product single zoom  */
        if ( hongoMain.zoom_enabled && $('body').hasClass( 'single-product' ) && $('.single-product .woocommerce-product-gallery__image').length > 0 ) {

            if( !( $( '#single-product-carousel' ).length > 0 || $( '.hongo-sticky-content-images-wrap' ).length > 0 || $( '.hongo-modern-content-images-wrap' ).length > 0 || isiPhoneiPad || isMobile ) ) { // Zoom is not applied to single product carousel and sticky style                
                $('.single-product .woocommerce-product-gallery .woocommerce-product-gallery__image').trigger('zoom.destroy'); // remove zoom
                $('.single-product .woocommerce-product-gallery .woocommerce-product-gallery__image').zoom();

                /* Open photoSwipe popup by clicking on single product image  */
                $( document ).on( 'click', '.woocommerce-product-gallery__image .zoomImg', function() {

                    $( this ).closest( '.woocommerce-product-gallery__image' ).find( 'a' ).trigger( 'click' );
                });
            }
        }

        /*360 Product Images Module*/
        if( $( '.hongo-single-product-360-button' ).length > 0 && $.inArray( 'threesixty', hongoMain.disable_scripts ) < 0 ) {

            /*Single Product 360 Rotation tooltip*/
            $( '.hongo-single-product-360-button' ).tooltip();
        
            var all_images  = $( '.hongo-single-product-360-button' ).attr( 'data-images' ),
                height      = $( '.hongo-single-product-360-button' ).attr( 'data-height' ),
                width       = $( '.hongo-single-product-360-button' ).attr( 'data-width' ),
                window_height = $( window ).outerHeight();

            $( document ).on( 'click', '.hongo-single-product-360-button', function () {
        	
            	setTimeout( function(){
		            if( all_images != '' && all_images != undefined ) {

		                var images      = all_images.split( ',' ),
		                    imgArray    = [];
		                for( var i = 0; i < images.length; i++ ) {
		                    imgArray.push( images[i] );
		                }
		                var hongo_threesixty = $( '.hongo_threesixty' ).ThreeSixty({
		                    totalFrames: imgArray.length,
		                    endFrame: imgArray.length,
		                    currentFrame: 1,
		                    imgList: '.threesixty_images',
		                    progress: '.spinner',
		                    height: 800,
		                    width: width,
		                    playSpeed: 100,//when play the 360 images
		                    framerate: 10, // navigation speed
		                    navigation: true, //
		                    disableSpin: true, //loading 360 images
		                    imgArray: imgArray,// for image array
		                    responsive: true, // for responsive
		                    showCursor: true,
		                    drag: true,
		                });
		            }
		        }, 100 );
	        });

            
            if( $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {

                /* Single product Other 360 modules magnific popup */
                $( '.hongo-single-product-360-button' ).magnificPopup({
                    type: 'inline',
                    mainClass: 'mfp-fade hongo-360-single-popup',
                    fixedContentPos: true,
                    closeBtnInside: false,
                    focus: '#product_360_wrap',
                    autoFocusLast: false,
                    callbacks: {
                        close: function() {
                            // For Nav bar destroy
                            var navBarLength = $( '#hongo_threesixty_content_wrap .nav_bar' ).length;
                            if( navBarLength > 0 ) {
                                for( var k = navBarLength; k > 0 ; k-- ) {
                                    $( '#hongo_threesixty_content_wrap .nav_bar' ).remove();
                                }
                            }
                            
                            $( this.content ).find( '#hongo_threesixty_content_wrap' ).stop();
                        }
                    }
                });
            }
        }

        /* Successfully loaded cart */
        $( document.body ).on( 'wc_fragments_loaded', function( event, fragments, cart_hash, $button ){

            refreshMiniCartHeight();

            hongoCustomVerticalScroll( '.widget_shopping_cart_content .hongo-mini-cart-lists-wrap' );
        });

        /* Update Custom scroll bar after hover mini cart */
        $( document ).on( 'mouseenter', '.widget_shopping_cart', function() {

            hongoCustomVerticalScroll( '.widget_shopping_cart_content .hongo-mini-cart-lists-wrap' );
        });

        /* Open mini cart in slide view */
        $( document ).on( 'click', '.widget_shopping_cart .mini-cart-slide', function () {

            if( $( this ).parents( '.widget_shopping_cart' ).hasClass( 'active' ) ) {

                $( this ).parents( '.widget_shopping_cart' ).removeClass( 'active' );
            
            } else {

                $( this ).parents( '.widget_shopping_cart' ).addClass( 'active' );
            }
            

            refreshMiniCartHeight();

            if( $( '.hongo-mini-cart-slide-sidebar' ).length > 0 ) {
                if ( $( 'html, body' ).hasClass( 'hongo-mini-cart-slide-sidebar-wrap' ) ) {
                    setTimeout( function() {

                        $( 'html, body' ).removeClass( 'hongo-mini-cart-slide-sidebar-wrap' );
                    }, 100 );
                } else {
                    $( 'html, body' ).addClass( 'hongo-mini-cart-slide-sidebar-wrap' );
                }
            }
        });

        /* Close mini cart in slide view */
        $( document ).on( 'click', '.hongo-close-mini-cart-slide', function () {

            $( '.widget_shopping_cart .mini-cart-slide' ).trigger( 'click' );
        });

        $( document ).on( 'touchstart click', '.hongo-mini-cart-slide-overlay', function () {

            if( $( '.hongo-mini-cart-slide-sidebar' ).length > 0 ) {

                setTimeout( function() {

                    $( 'html, body' ).removeClass( 'hongo-mini-cart-slide-sidebar-wrap' );
                }, 100 );
                $( '.widget_shopping_cart' ).removeClass( 'active' );
            }
        });
        
        /* Added Cart html modify */
        $( document.body ).on( 'wc_cart_button_updated', function( e, button ) {

            if ( $( button ) ) {

                var added_to_cart = $( button ).parent().find( '.added_to_cart' );

                /* Open mini cart in slide view */
                if( $( '.hongo-mini-cart-slide-sidebar' ).length > 0 ) {

                    setTimeout( function() {

                        $( '.widget_shopping_cart' ).addClass( 'active' );
                            
                        refreshMiniCartHeight();

                        if( $( '.hongo-mini-cart-slide-sidebar' ).length > 0 ) {
                            if ( ! $( 'html, body' ).hasClass( 'hongo-mini-cart-slide-sidebar-wrap' ) ) {
                                setTimeout( function() {                                    
                                    $( 'html, body' ).addClass( 'hongo-mini-cart-slide-sidebar-wrap' );
                                }, 100 );
                            }
                        }
                        
                    }, 10 );
                }

                // View cart text.
                if ( ! wc_add_to_cart_params.is_cart && added_to_cart.length > 0 ) {

                    added_to_cart.addClass( 'alt-font button hongo-loop-product-button' );
                    added_to_cart.html( '<i class="'+ hongoMain.add_to_cart_fill_icon +'" data-placement="'+$( button ).attr( 'data-placement' )+'" title="' + wc_add_to_cart_params.i18n_view_cart + '"></i><span class="added-to-cart-text button-text">' + wc_add_to_cart_params.i18n_view_cart + '</span>' );
                    $( '.hongo-wishlist-message' ).remove();

                    /* Display add to cart message when mini cart style is default */
                    if( ! $( '.hongo-mini-cart-slide-sidebar' ).length > 0 ) {

                        $( document.body ).append( '<div class="hongo-cart-message alt-font"><i class="fas fa-check"></i>'+hongoMain.product_added_message+'</div>' );
                        // Product added Message
                        setTimeout( function(){

                            $( '.hongo-cart-message' ).remove();

                        }, 3000 );
                    }
                }

                $( button ).parents().find( '.product-buttons-wrap' ).each( function( i ) {

                    var tooltip_pos = $( this ).attr( 'data-tooltip-position' );
                    if( tooltip_pos != '' && tooltip_pos != undefined ) { // Check tooltip position
        
                        $( this ).find('a.added_to_cart i').attr( 'data-placement', tooltip_pos ).tooltip();
                    }
                });
            }
        });

        /* If page has no section */
        if( $( 'body.page .type-page' ).find( '.entry-content section.vc_row:not( .woocommerce-terms-and-conditions section.vc_row )' ).length == 0 ) {
            $( 'body.page .type-page' ).addClass( 'default-page-space' );
        } else {
            $( 'body.page .type-page' ).removeClass( 'default-page-space' );
        }        

        /* If post has no section */
        if( $( 'body.single .hongo-main-content-wrap' ).find( '.entry-content section.vc_row:not( .woocommerce-terms-and-conditions section.vc_row )' ).length == 0 ) {
            $( 'body.single .hongo-main-content-wrap' ).addClass( 'default-page-space' );
        } else {
            $( 'body.single .hongo-main-content-wrap' ).removeClass( 'default-page-space' );
        }        

        /* Shop page top filter toggle */
        $( document ).on( 'click', '.hongo-top-shop-filter', function () {

            $( this ).parent().find( '.hongo-woocommerce-top-sidebar' ).slideToggle();            
            if( $( this ).hasClass( 'active' ) ) {
                $( this ).removeClass( 'active' );
                $( this ).parent().find( '.hongo-woocommerce-top-sidebar' ).removeClass( 'active' );
            } else {
                $( this ).addClass( 'active' );
                $( this ).parent().find( '.hongo-woocommerce-top-sidebar' ).addClass( 'active' );
            }
            if( $( '.hongo-off-canvas-filter-sidebar' ).length > 0 ) {
                if ( $( 'html, body' ).hasClass( 'hongo-filter-sidebar-wrap' ) ) {
                    setTimeout( function() {

                        $( 'html, body' ).removeClass( 'hongo-filter-sidebar-wrap' );
                    }, 400 );
                } else {
                    $( 'html, body' ).addClass( 'hongo-filter-sidebar-wrap' );
                }
            }
            hongoCustomHorizontalScroll( '.hongo-top-filter-sidebar .top-sidebar-scroll' );
            hongoCustomVerticalScroll( '.hongo-top-filter-sidebar .widget, .hongo-off-canvas-filter-sidebar .top-sidebar-scroll' );
        });

        $( document ).on( 'touchstart click', '.hongo-top-shop-filter-overlay', function () { // hongo-filter-sidebar-wrap

            if( $( '.hongo-off-canvas-filter-sidebar' ).length > 0 ) {
                setTimeout( function() {

                    $( 'html, body' ).removeClass( 'hongo-filter-sidebar-wrap' );
                }, 400 );
                $( '.hongo-woocommerce-top-sidebar' ).slideToggle();
                
                if( $( '.hongo-woocommerce-top-sidebar' ).hasClass( 'active' ) ) {
                    setTimeout( function() {
                        
                        $( '.hongo-woocommerce-top-sidebar' ).removeClass( 'active' );
                    }, 100 );
                } else {
                    $( '.hongo-woocommerce-top-sidebar' ).addClass( 'active' );
                }

                $( '.hongo-top-shop-filter' ).removeClass( 'active' );
            }
        });

        $( document ).on( 'click', '.hongo-close-filter-sidebar', function () {
            $( '.hongo-top-shop-filter' ).trigger( 'click' );
        });

        /* Shop Page Left sidebar toggle */
        $( document ).on( 'click', '.hongo-left-common-sidebar-link', function () {

            $( '.hongo-product-common-sidebar-left' ).slideToggle();
            if( $( this ).hasClass( 'active' ) ) {
                $( this ).removeClass( 'active' );
                $( '.hongo-product-common-sidebar-left' ).removeClass( 'active' );
                $( 'html, body' ).removeClass( 'hongo-left-sidebar-wrap' );
            } else {
                $( this ).addClass( 'active' );
                $( '.hongo-product-common-sidebar-left' ).addClass( 'active' );
                $( 'html, body' ).addClass( 'hongo-left-sidebar-wrap' );
            }

            hongoCustomVerticalScroll( '.hongo-product-common-sidebar-left-wrap' );
        });

        $( document ).on( 'touchstart click', '.hongo-product-common-sidebar-left-overlay', function () {

            $( 'html, body' ).removeClass( 'hongo-left-sidebar-wrap' );
            $( '.hongo-product-common-sidebar-left' ).removeClass( 'active' );
            $( '.hongo-left-common-sidebar-link' ).removeClass( 'active' );
        });

        $( document ).on( 'click', '.hongo-close-left-sidebar', function () {

            $( '.hongo-left-common-sidebar-link' ).trigger( 'click' );
        });

        /* Shop Page Right sidebar toggle */
        $( document ).on( 'click', '.hongo-right-common-sidebar-link', function () {
            $( '.hongo-product-common-sidebar-right' ).slideToggle();
            if( $( this ).hasClass( 'active' ) ){
                $( this ).removeClass( 'active' );
                $( '.hongo-product-common-sidebar-right' ).removeClass( 'active' );
                $( 'html, body' ).removeClass( 'hongo-right-sidebar-wrap' );
            } else {
                $( this ).addClass( 'active' );
                $( '.hongo-product-common-sidebar-right' ).addClass( 'active' );
                $( 'html, body' ).addClass( 'hongo-right-sidebar-wrap' );
            }
            hongoCustomVerticalScroll( '.hongo-product-common-sidebar-right-wrap' );
        });

        $( document ).on( 'touchstart click', '.hongo-product-common-sidebar-right-overlay', function () {

            $( 'html, body' ).removeClass( 'hongo-right-sidebar-wrap' );            
            $( '.hongo-product-common-sidebar-right' ).removeClass( 'active' );
            $( '.hongo-right-common-sidebar-link' ).removeClass( 'active' );
        });

        $( document ).on( 'click', '.hongo-close-right-sidebar', function () {

            $( '.hongo-right-common-sidebar-link' ).trigger( 'click' );
        });

        /* Menu work with eualize height */
        $( 'nav.navbar ul.nav' ).each( function () {
            
            $( 'li.dropdown', this ).on( 'mouseenter', function () {
                equalizeHeight();
                return false;
            });
        });

        /* Single Product Carousel Slider */
        if( $.inArray( 'swiper', hongoMain.disable_scripts ) < 0 ) {
            var swiperProductCarousel = '';
            if( $('#single-product-carousel').length > 0 ) {

                $( '#single-product-carousel .woocommerce-product-gallery__image' ).addClass('swiper-slide');
                
                var column_number = 3;
                var swiperProductCarousel = new Swiper( '#single-product-carousel', {
                    slidesPerView: column_number,
                    watchSlidesVisibility: true, /* If you use slidesPerView "auto" or slidesPerView > 1, then you should also enable watchSlidesVisibility */
                    watchSlidesProgress: true,
                    breakpoints: { 991: { slidesPerView: 1 }, },
                    watchOverflow: true,
                    loop: false, /* If enable loop then do not display same image in popup by clicking on image */
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        resize: function () { 
                            this.update();
                        }
                    }
                });

                $('.variations_form.cart').on('found_variation', function (e, variation) {

                    var $form                   = $( this ), 
                        $product_content_wrap   = $form.closest( '.hongo-carousel-content-images-wrap' ),
                        $product_img_wrap       = $( $product_content_wrap ).find( '#single-product-carousel' ),
                        $product_img_0          = $product_img_wrap.find( 'img:eq(0)' );

                    if( $( window ).width() <= '991' ) {

                        var $product_img        = $product_img_wrap.find( '.swiper-slide-active img' ); // img:eq(2)
                            
                    } else {

                        var $product_img        = $product_img_wrap.find( '.swiper-slide-next img' ); // img:eq(2)
                    }

                    var $product_link           = $product_img.closest( 'a' );
                        

                    setTimeout( function() {

                        /* reset image on 0 position image */
                        $product_img_0.wc_reset_variation_attr( 'src' );
                        $product_img_0.wc_reset_variation_attr( 'height' );
                        $product_img_0.wc_reset_variation_attr( 'width' );
                        $product_img_0.wc_reset_variation_attr( 'srcset' );
                        $product_img_0.wc_reset_variation_attr( 'title' );
                        $product_img_0.wc_reset_variation_attr( 'data-caption' );
                        $product_img_0.wc_reset_variation_attr( 'alt' );
                        $product_img_0.wc_reset_variation_attr( 'data-large_image' );
                        $product_img_0.closest( 'a' ).wc_reset_variation_attr( 'href' );

                        if ( variation && variation.image && variation.image.src && variation.image.src.length > 1 ) {

                            /* Change image on 2 position image */
                            $product_img.wc_set_variation_attr( 'src', variation.image.src );
                            $product_img.wc_set_variation_attr( 'height', variation.image.src_h );
                            $product_img.wc_set_variation_attr( 'width', variation.image.src_w );
                            $product_img.wc_set_variation_attr( 'srcset', variation.image.srcset );
                            $product_img.wc_set_variation_attr( 'title', variation.image.title );
                            $product_img.wc_set_variation_attr( 'data-caption', variation.image.caption );
                            $product_img.wc_set_variation_attr( 'alt', variation.image.alt );
                            $product_img.wc_set_variation_attr( 'data-large_image', variation.image.full_src );
                            $product_link.wc_set_variation_attr( 'href', variation.image.full_src );
                        }
                        
                    }, 100 );

                    e.preventDefault();
                });

                $('.variations_form.cart').on('reset_data', function (e) {

                    /* Reset product image */
                    var $product_data     = $( this ).closest( '.hongo-carousel-content-images-wrap' );

                    if( $( window ).width() <= '991' ) {

                        var $product_img  = $( $product_data ).find( '#single-product-carousel .swiper-slide-active img' ); // img:eq(2)
                            
                    } else {

                        var $product_img  = $( $product_data ).find( '#single-product-carousel .swiper-slide-next img' ); // img:eq(2)
                    }

                    var $product_link      = $product_img.closest( 'a' );

                    $product_img.wc_reset_variation_attr( 'src' );
                    $product_img.wc_reset_variation_attr( 'height' );
                    $product_img.wc_reset_variation_attr( 'width' );
                    $product_img.wc_reset_variation_attr( 'srcset' );
                    $product_img.wc_reset_variation_attr( 'title' );
                    $product_img.wc_reset_variation_attr( 'data-caption' );
                    $product_img.wc_reset_variation_attr( 'alt' );
                    $product_link.wc_reset_variation_attr( 'data-large_image' );
                    $product_link.wc_reset_variation_attr( 'href' );

                    e.preventDefault();
                });
            }
        
            /* swiper slider */
            var vSliderFlag = false;
            if( $( '.single-product-classic .hongo-single-product-thumb' ).length > 0 ) {

                var direction_type = 'vertical';
                var per_view = 'auto'; //4;
                var space_between = 15;
                vSliderFlag = true;

            } else if( $( '.single-product-extended-descriptions .hongo-single-product-thumb' ).length > 0 ) {
                
                var direction_type = 'vertical';
                var per_view = 'auto'; //5;
                var space_between = 10;
                vSliderFlag = true;

            }else if( $( '.single-product-modern .hongo-single-product-thumb' ).length > 0 ) {
                
                var direction_type = 'vertical';
                var per_view = 'auto'; //4;
                var space_between = 22;
                vSliderFlag = true;

            } else{

                var direction_type = 'horizontal';
                var per_view = 4;
                var space_between = 20;
                vSliderFlag = false;
            }
            
            if( $( window ).width() <= 991 && vSliderFlag ) {
                
                direction_type = 'horizontal';
            }            

            var swiperProductThumbs = new Swiper('.hongo-single-product-thumb', {
                spaceBetween: space_between,
                slidesPerView: per_view,
                direction: direction_type,
                watchSlidesVisibility: true, /* If you use slidesPerView "auto" or slidesPerView > 1, then you should also enable watchSlidesVisibility */
                watchSlidesProgress: true,
                watchOverflow: true,
                navigation: {
                    nextEl: '.swiper-thumb-next',
                    prevEl: '.swiper-thumb-prev',
                },
                on: {
                    init: function() {
                        //if ( /Mozilla/i.test( navigator.userAgent ) ) {

                            setTimeout( function() {

                                swiperProductThumbs.update();

                            }, 10 );
                        //}
                    },
                    click: function() {
                        
                        /* Product thumbs automatic next / previous on click slide */
                        if( this.activeIndex == this.clickedIndex ) {

                            this.slidePrev();

                        } else {

                            this.slideNext();
                        }
                    },
                    resize: function () {

                        if( $( window ).width() <= 991 ) {
                            this.changeDirection( 'horizontal' );
                        } else if( vSliderFlag ) {
                            this.changeDirection( 'vertical' );
                        }
                        this.update();
                    }
                }
            });

            var hongoSwiperProductCarousel = new Swiper('.hongo-single-product-slider', {
                spaceBetween: 0,
                watchOverflow: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                thumbs: {
                    swiper: swiperProductThumbs
                },
                on: {
                    slideChange: function() { 
                        
                        $( '.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image' ).removeClass( 'flex-active-slide' );
                        $( '.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image:eq( ' + this.activeIndex + ' )' ).addClass( 'flex-active-slide' );
                    },
                    resize: function () {
                        this.update();
                    }
                }
            });

            var swiperFull = new Swiper('.swiper-full-screen', {
                loop: true,
                autoplay: {
                    delay: 1000,
                },
                slidesPerView: 1,
                keyboardControl: true,
                preventClicks: false,
                watchOverflow: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on: {
                    resize: function () {
                        this.update();
                    }
                }
            });

            var swiperAutoFade = new Swiper('.swiper-auto-fade', {
                loop: true,
                autoplay: {
                    delay: 3000,
                },
                slidesPerView: 1,
                clickable: true,
                keyboardControl: true,
                preventClicks: false,
                watchOverflow: true,
                effect:'fade',
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on: {
                    resize: function () {
                        this.update();
                    }
                }
            });

            // FOr product loop slider
            setTimeout( function() {
                if( $( '.hongo-loop-product-slider' ).length > 0 ) {
                    $( '.hongo-loop-product-slider' ).each(function ( index, element ) {
                        var $this = $( this );
                        var enableNavigation = $this.attr( 'data-attr' );
                        var navigationOption = false;
                        $this.addClass( 'loop-slider-'+ index );
                        if( enableNavigation == 1 ){
                            navigationOption = {
                                nextEl: '.loop-slider-'+index+' .swiper-button-next',
                                prevEl: '.loop-slider-'+index+' .swiper-button-prev',
                            };
                        }
                        var swiperProductLoops = new Swiper( '.loop-slider-'+ index , {
                            navigation: navigationOption,
                            on: {
                                resize: function () {
                                    this.update();
                                }
                            }
                        });
                        swiperObjs.push( swiperProductLoops );
                    });
                }
            }, 100 );

            // For Sticky Product Swiper
            if( $( window ).width() <= 1199 ) {
                
                if( ! ( $( '#single-product-sticky' ).length > 0 ) ) {

                    $( '.hongo-sticky-content-images-wrap .woocommerce-product-gallery__wrapper' ).wrapInner( '<div id="single-product-sticky" class="swiper-container"><div class="swiper-wrapper"></div><div class="swiper-button-next"><i class="ti-angle-right"></i></div><div class="swiper-button-prev"><i class="ti-angle-left"></i></div></div>' );
                    $( '#single-product-sticky .woocommerce-product-gallery__image' ).addClass('swiper-slide');

                    swiperStickyProduct = new Swiper( '#single-product-sticky', {
                        watchSlidesVisibility: true, /* If you use slidesPerView "auto" or slidesPerView > 1, then you should also enable watchSlidesVisibility */
                        watchSlidesProgress: true,
                        breakpoints: { 767: { slidesPerView: 1 }, },
                        watchOverflow: true,
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }
                    });
                }

            } else {

                $( '#single-product-sticky .swiper-button-next, #single-product-sticky .swiper-button-prev, #single-product-sticky .swiper-notification' ).remove();
                $( '#single-product-sticky .woocommerce-product-gallery__image' ).removeClass( 'swiper-slide swiper-slide-visible swiper-slide-active' ).css( 'width', 'inherit' );
                $( '#single-product-sticky .swiper-wrapper' ).contents().unwrap();
                $( '#single-product-sticky' ).contents().unwrap();
            }
        }

        $( ".variations_form.cart" ).on( "found_variation", function ( event, variation ) {

            if( hongoMain.zoom_enabled && $('.single-product').length > 0 && ! ( $('#single-product-carousel').length > 0 || $( '.hongo-sticky-content-images-wrap' ).length > 0 || $( '.hongo-modern-content-images-wrap' ).length > 0 || isiPhoneiPad || isMobile ) ) { // Zoom is not applied to single product carousel style

                $('.single-product .woocommerce-product-gallery__image').trigger('zoom.destroy'); // remove zoom

                /* Provide 100 delay because take time for change variation image */                
                setTimeout(function(){
                    
                    $('.single-product .woocommerce-product-gallery .woocommerce-product-gallery__image').zoom();

                }, 100);                
            }

            /* Changed variation and change slide as per variation */
            if( $.inArray( 'swiper', hongoMain.disable_scripts ) < 0 ) {
                if( $('.hongo-single-product-slider').length ) {

                    setTimeout(function () {

                        var activeItem     = $( '.hongo-single-product-slider .swiper-slide img[src="' + variation.image.src + '"]' );
                        if( activeItem.length > 0 ) {

                            var activeIndex = activeItem.index( '.hongo-single-product-slider .swiper-slide a img' );

                            hongoSwiperProductCarousel.slideTo( activeIndex, 1000, false );
                        }
                    }, 300);
                }

                if( $(window).width() <= 1199 ) {
                    if( $( '#single-product-sticky' ).length > 0 ) {
                        setTimeout(function () {
                            var activeItem     = $( '.single-product-sticky .swiper-slide img[src="' + variation.image.src + '"]' );
                            if( activeItem.length > 0 ) {

                                var activeIndex = activeItem.index( '#single-product-sticky .swiper-slide a img' );

                                swiperStickyProduct.slideTo( activeIndex, 1000, false );
                            }
                        }, 300);
                    }
                }
            }

            if( $( '.hongo-sticky-content-images-wrap' ).length > 0 ) {

                $( '.hongo-single-product-sticky-thumb-wrap a' ).removeClass( 'active' );
                $( '.hongo-single-product-sticky-thumb-wrap a:eq(0)' ).addClass( 'active' );
            }

            if( $( '.archive .hongo-shop-list' ).length > 0 ) {

                var $form             = $( this ),
                    $product_data     = $form.closest( '.product' ),
                    $product_img_wrap = $( $product_data ).find( '.product-thumb-wrap' ),
                    $product_img      = $product_img_wrap.find( 'img:eq(0)' );

                if ( variation && variation.image && variation.image.thumb_src && variation.image.thumb_src.length > 1 ) {
                    
                    /* Change variation product image */
                    $product_img.wc_set_variation_attr( 'src', variation.image.thumb_src );
                    $product_img.wc_set_variation_attr( 'height', variation.image.thumb_src_h );
                    $product_img.wc_set_variation_attr( 'width', variation.image.thumb_src_w );
                    $product_img.wc_set_variation_attr( 'srcset', variation.image.srcset );
                    $product_img.wc_set_variation_attr( 'title', variation.image.title );
                    $product_img.wc_set_variation_attr( 'data-caption', variation.image.caption );
                    $product_img.wc_set_variation_attr( 'alt', variation.image.alt );
                }

                window.setTimeout( function() {

                    $( window ).trigger( 'resize' );

                }, 20 );
            }

            /* Variation animation Scroll */
            if( hongoMain.variation_animation != '0' ) {
                
                $('html, body').stop()
                            .animate({
                                'scrollTop': 0
                            }, 1500 );
            }
        });

        $('.variations_form.cart').on('reset_data', function (e) {

            if( hongoMain.zoom_enabled && $('.single-product').length > 0 && !( $( '#single-product-carousel' ).length > 0 || $( '.hongo-sticky-content-images-wrap' ).length > 0 || $( '.hongo-modern-content-images-wrap' ).length > 0 ) ) { // Zoom is not applied to single product carousel and sticky style

                $('.single-product .woocommerce-product-gallery__image').trigger('zoom.destroy'); // remove zoom
                
                /* Provide 100 delay because take time for change variation image */
                setTimeout(function(){
                    
                    $('.single-product .woocommerce-product-gallery .woocommerce-product-gallery__image').zoom();

                }, 100);
            }

            /* Changed variation and change slide as per variation */
            if( $.inArray( 'swiper', hongoMain.disable_scripts ) < 0 ) {
                if( $('.hongo-single-product-slider').length ) {                    
                    hongoSwiperProductCarousel.slideTo( 0, 1000, false );
                }

                if( $( '#single-product-sticky' ).length ) {
                    if( $(window).width() <= 1199 ) {
                        swiperStickyProduct.slideTo( 0, 1000, false );
                    }
                }
            }

            if( $( '.hongo-sticky-content-images-wrap' ).length > 0 ) {
                
                $( '.hongo-single-product-sticky-thumb-wrap a' ).removeClass( 'active' );
                $( '.hongo-single-product-sticky-thumb-wrap a:eq(0)' ).addClass( 'active' );
            }

            if( $( '.archive .hongo-shop-list' ).length > 0 ) {

                /* Reset product image */
                var $product_data     = $( this ).closest( '.product' ),
                    $product_img      = $( $product_data ).find( '.product-thumb-wrap img:eq(0)' );

                $product_img.wc_reset_variation_attr( 'src' );
                $product_img.wc_reset_variation_attr( 'height' );
                $product_img.wc_reset_variation_attr( 'width' );
                $product_img.wc_reset_variation_attr( 'srcset' );
                $product_img.wc_reset_variation_attr( 'title' );
                $product_img.wc_reset_variation_attr( 'data-caption' );
                $product_img.wc_reset_variation_attr( 'alt' );
            }

            e.preventDefault();
        });

        /* counter number reset while scrolling */
        if( $( '.timer' ).length > 0 ) {
            if( $.inArray( 'jquery-appear', hongoMain.disable_scripts ) < 0 ) {
                $('.timer').appear();
            }
            $( document.body ).on( 'appear', '.timer', function (e) {

                // this code is executed for each appeared element
                var element = $(this);
                if ( !$( this ).hasClass( 'appear' ) ) {
                    animateCounters( element );
                    $(this).addClass( 'appear' );
                }
            });
        }

        /* sticky add to cart appear or disappear */
        if( $( '.sticky-add-to-cart-wrapper' ).length > 0 && $.inArray( 'jquery-appear', hongoMain.disable_scripts ) < 0 ) {
            $( '.entry-summary .single_add_to_cart_button' ).appear();
            $( document.body ).on( 'disappear', '.entry-summary .single_add_to_cart_button', function (e) {

                $('body').addClass('sticky-cart-appear');
            });
            $( document.body ).on( 'appear', '.entry-summary .single_add_to_cart_button', function (e) {

                $('body').removeClass('sticky-cart-appear');
            });
        }

        
        if( $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {

            /* Lightbox gallery magnific popup */
            $( '.lightbox-gallery' ).magnificPopup({
                delegate: 'a',
                type: 'image',
                tLoading: 'Loading image #%curr%...',
                mainClass: 'mfp-fade hongo-lightbox-gallery-popup',
                fixedContentPos: true,
                closeBtnInside: false,
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
                },
                image: {
                    titleSrc: function (item) {
                        var title = '';
                        var lightbox_caption = '';
                        if( item.el.attr('title') ){
                            title = item.el.attr('title');
                        }
                        if( item.el.attr('data-lightbox-caption') ){
                            lightbox_caption = '<span class="hongo-lightbox-caption">'+item.el.attr('data-lightbox-caption')+'</span>';
                        }
                        return title + lightbox_caption;
                    }
                }
            });

            /* for group gallery */
            var lightboxgallerygroups = {};
            $('.lightbox-group-gallery-item').each(function () {
                var id = $(this).attr('data-group');
                if (!lightboxgallerygroups[id]) {
                    lightboxgallerygroups[id] = [];
                }
                lightboxgallerygroups[id].push(this);
            });
            $.each(lightboxgallerygroups, function () {
                $(this).magnificPopup({
                    type: 'image',
                    mainClass: 'hongo-group-gallery-popup',
                    fixedContentPos: true,
                    closeBtnInside: false,
                    closeOnContentClick: true,
                    gallery: { enabled: true },                    
                    image: {
                        titleSrc: function (item) {
                            var title = '';
                            var lightbox_caption = '';
                            if( item.el.attr('title') ){
                                title = item.el.attr('title');
                            }
                            if( item.el.attr('data-lightbox-caption') ){
                                lightbox_caption = '<span class="hongo-lightbox-caption">'+item.el.attr('data-lightbox-caption')+'</span>';
                            }
                            return title + lightbox_caption;
                        }
                    }
                });
            });
        }

        /* Smooth scroll animation */        
        var scrollAnimationTime = 1200, scrollAnimation = 'easeInOutExpo';
        $( document ).on( 'click.smoothscroll', 'a.scrollto', function (event) {
            event.preventDefault();
            var target = this.hash;
            if ($(target).length != 0) {
                $('html, body').stop()
                        .animate({
                            'scrollTop': $(target)
                                    .offset()
                                    .top
                        }, scrollAnimationTime, scrollAnimation, function () {
                            window.location.hash = target;
                        });
            }
        });
            
        /* Smooth scroll */
        if( $.inArray( 'smooth-scroll', hongoMain.disable_scripts ) < 0 ) {    
            
            var adminBarHeight = 0;
            if( $('.admin-bar').length > 0 ) {
                adminBarHeight = 32;
            }
            var smoothHeaderHeight = adminBarHeight;
            if( $( '.appear-down-scroll' ).length > 0 ) {
                smoothHeaderHeight = smoothHeaderHeight + $('.navbar').outerHeight();
            }

            /* Down section links smooth scroll */
            if( $('.navbar-fixed-top').length > 0 ) {
                $('.down-section-link').smoothScroll({
                    speed: 900,
                    offset: -(smoothHeaderHeight)
                });
            } else {
                $('.down-section-link').smoothScroll({
                    speed: 900,
                    offset: 0
                });
            }

            /* Section link smooth scroll */
            if( $('.section-link').length > 0 ) {
                $('.section-link').smoothScroll({
                    speed: 900,
                    offset: 1
                });
            }

            // For Single icon one page link
            if( $('.smooth-navigation-link a').length > 0 ) {
                $('.smooth-navigation-link a').smoothScroll({
                    speed: 900,
                    offset: 1
                });
            }
        }

        if( $.inArray( 'isotope', hongoMain.disable_scripts ) < 0 ) {

            /* Shop Grid, Masonry, Metro, Modern Isotope */
            var isotopeObjs = [];
            var transitionTime = 0;
            if( $( '.hongo-column-switch' ).length > 0 ) { // Column switch is found

                transitionTime = '0.4s';
            }
            $( '.hongo-shop-common-isotope' ).each( function () {
                var $this = $(this);
                $this.imagesLoaded(function () {
                    $this.isotope({
                        layoutMode: 'masonry',
                        itemSelector: '.product',
                        percentPosition: true,
                        transitionDuration: transitionTime,
                        stagger: 0,
                        masonry: {
                            columnWidth: '.grid-sizer',
                        },
                    });
                    $this.isotope();

                    isotopeObjs.push( $this );
                });      
            });

            var $shop_grid = $('.hongo-shop-grid');
            $shop_grid.imagesLoaded(function () {
                $shop_grid.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.hongo-grid-item',
                    percentPosition: true,
                    transitionDuration: 0,
                    stagger: 0,
                    masonry: {
                        columnWidth: '.hongo-grid-sizer'
                    }
                });
                $shop_grid.isotope();

                isotopeObjs.push( $shop_grid );
            });

            /* Categoty Grid Isotope */
            var $category_grid = $('.hongo-category-grid');
            $category_grid.imagesLoaded(function () {
                $category_grid.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.hongo-grid-item',
                    percentPosition: true,
                    transitionDuration: 0,
                    stagger: 0,
                    masonry: {
                        columnWidth: '.hongo-grid-sizer'
                    }
                });
                $category_grid.isotope();

                isotopeObjs.push( $category_grid );
            });

            /* Image Gallery Isotope */
            var $image_gallery_grid = $('.image-gallery-grid');
            $image_gallery_grid.imagesLoaded(function () {
                $image_gallery_grid.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.grid-item',
                    percentPosition: true,
                    fixedContentPos: true,
                    transitionDuration: 0,
                    stagger: 0,
                    masonry: {
                        columnWidth: '.grid-sizer'
                    }
                });
                $image_gallery_grid.isotope();

                isotopeObjs.push( $image_gallery_grid );
            });

            /* Instagram Isotope */
            var $instagram_grid = $('.hongo-instagram-masonary');
            setTimeout( function(){                
                $instagram_grid.imagesLoaded(function () {
                    $instagram_grid.isotope({
                        layoutMode: 'masonry',
                        itemSelector: '.grid-item',
                        percentPosition: true,
                        transitionDuration: 0,
                        stagger: 0,
                        masonry: {
                            columnWidth: '.grid-sizer'
                        }
                    });
                    $instagram_grid.imagesLoaded().progress( function() {
                        $instagram_grid.isotope();
                    });

                    isotopeObjs.push( $instagram_grid );
                });
            },2000 );

            /* Blog Image Gallery Isotope */
            var $blog_gallery_filter = $('.blog-post-gallery-grid');
            $blog_gallery_filter.imagesLoaded(function () {
                $blog_gallery_filter.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.grid-item',
                    percentPosition: true,
                    transitionDuration: 0,
                    stagger: 0,
                    masonry: {
                        columnWidth: '.grid-sizer'
                    }
                });
                $blog_gallery_filter.isotope();

                isotopeObjs.push( $blog_gallery_filter );
            });
        }

        /* Single Product Page Product Lists Tab */
        $( 'body' ).on( 'click', '.hongo-tabs li a, .wc-tabs li a', function( e ) {
            e.preventDefault();

            var $this           = $( this );
            var $tabs_wrapper   = $this.closest( '.hongo-woocommerce-tabs-wrapper' );
            var $tabs           = $tabs_wrapper.find( '.hongo-tabs' );
            var currentTab      = $this.attr( 'href' );
            var currIsotopeObj  = $( currentTab ).find( '.hongo-shop-common-isotope' );

            $tabs.find( 'li' ).removeClass( 'active' );
            $tabs_wrapper.find( '.hongo-tab' ).hide();

            $this.closest( 'li' ).addClass( 'active' );
            $tabs_wrapper.find( currentTab ).show();

            // Active isotope refresh
            resetIsotopeLayout( currIsotopeObj, false );

            for( var i=0; i < swiperObjs.length; i++ ) {
                        
                ( swiperObjs[i] ).update();
            };
            resetSwiper( swiperProductCarousel );
            resetSwiper( hongoSwiperProductCarousel );
            resetSwiper( swiperProductThumbs );
            resetSwiper( swiperFull );
            resetSwiper( swiperAutoFade );

            equalizeHeight();
        } );

        /* Refresh Isotope, Swiper On change tab event */
        $( '.nav-tabs a[data-toggle="tab"]' ).each( function () {
            var $this = $(this);
            $this.on('shown.bs.tab', function () {

                var currentTab = $( this ).attr( 'href' );
                var currIsotopeObj = $( currentTab ).find( '.hongo-shop-common-isotope' );

                // Active isotope refresh
                resetIsotopeLayout( currIsotopeObj, false );
                
                for( var i=0; i < swiperObjs.length; i++ ) {
                    
                    ( swiperObjs[i] ).update();
                };
                resetSwiper( swiperProductCarousel );
                resetSwiper( hongoSwiperProductCarousel );
                resetSwiper( swiperProductThumbs );
                resetSwiper( swiperFull );
                resetSwiper( swiperAutoFade );

                equalizeHeight();
            });
        });

        /* Refresh Isotope after smush it lazyloaded event */
        $( document ).on( 'lazyloaded', function(e){

            resetIsotopeLayoutLoop( isotopeObjs );
        });

        /* Refresh Isotope On change resize event */
        $( window ).resize( function (event) {
            if( $.inArray( 'isotope', hongoMain.disable_scripts ) < 0 ) {
                setTimeout(function () {

                    resetIsotopeLayoutLoop( isotopeObjs );

                }, 300 );
            }
        });

        /* Fit Videos */
        if( $( ".fit-videos" ).length > 0 && $.inArray( 'jquery-fitvids', hongoMain.disable_scripts ) < 0 ) {
            $( ".fit-videos" ).fitVids();
        }

        /* Modal magnific popup */
        if( $( '.modal-popup' ).length > 0 && $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {

            $( '.modal-popup' ).magnificPopup({
                type: 'inline',
                mainClass: 'hongo-modal-popup',
                preloader: false,
                // modal: true,
                blackbg: true,
            });
        }

        $( document ).on( 'click', '.popup-modal-dismiss', function (e) {

            e.preventDefault();
            $.magnificPopup.close();
        });

        /* Modal magnific popup - zoom animation */
        if( $( '.popup-with-zoom-anim' ).length > 0 && $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {

            $('.popup-with-zoom-anim').magnificPopup({
                type: 'inline',
                fixedBgPos: true,
                overflowY: 'auto',
                fixedContentPos: true,
                closeBtnInside: true,
                preloader: false,
                midClick: true,
                removalDelay: 300,
                blackbg: true,
                mainClass: 'my-mfp-zoom-in modal-zoom-popup'
            });
        }

        /* Modal magnific popup - slide animation */
        if( $( '.popup-with-move-anim' ).length > 0 && $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {
            
            $( '.popup-with-move-anim' ).magnificPopup({
                type: 'inline',
                fixedBgPos: true,
                overflowY: 'auto',
                fixedContentPos: true,
                closeBtnInside: true,
                preloader: false,
                midClick: true,
                removalDelay: 300,
                blackbg: true,
                mainClass: 'my-mfp-slide-bottom modal-slide-popup'
            });
        }

        /* Contact form magnific popup */
        if( $( '.popup-with-form' ).length > 0 && $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {
                
            $('.popup-with-form').magnificPopup({
                type: 'inline',
                preloader: false,
                mainClass: 'hongo-mfp-popup-default-scroll hongo-contant-form-popup',
                fixedContentPos: true,
                closeBtnInside: false,
            });
        }

        /* HTML5 Video magnific popup */
        if( $( '.html5-video-1' ).length > 0 && $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {
                
            $('.html5-video-1').magnificPopup({

                type: 'inline',
                mainClass: 'hongo-html-video-popup',
                removalDelay: 160,
                fixedContentPos: true,
                closeBtnInside: false,
                callbacks: {
                    open: function() {

                        // Play video on open:
                        $(this.content).find('video')[0].play();
                        $( $(this.content).find('video')[0] ).show();
                    },
                    close: function() {

                        // Reset video on close:
                        $(this.content).find('video')[0].load();
                    }
                }
            });
        }

        /* Other Video magnific popup */
        if( ( $( '.popup-youtube' ).length > 0 || $( '.popup-vimeo' ).length > 0 || $( '.popup-googlemap' ).length > 0 ) && $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {
                  
            $( '.popup-youtube, .popup-vimeo, .popup-googlemap' ).magnificPopup({

                disableOn: hongoMain.popup_disableon,
                preloader: false,
                type: 'iframe',
                mainClass: 'mfp-fade hongo-video-popup',
                removalDelay: 160,
                fixedContentPos: true,
                closeBtnInside: false,
            });
        }

        /* Single product HTML5 Video magnific popup */
        if( $( '.hongo-single-product-video' ).length > 0 && $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {
                    
            $( '.hongo-single-product-video' ).magnificPopup({
                preloader: false,
                type: 'inline',
                mainClass: 'mfp-fade hongo-mfp-bg-white hongo-single-html-video-popup',
                removalDelay: 160,
                fixedContentPos: true,
                closeBtnInside: false,
                callbacks: {
                    open: function() {
                        // Play video on open:
                        $(this.content).find('video')[0].play();
                        $( $(this.content).find('video')[0] ).show();
                    },
                    close: function() {
                        // Reset video on close:
                        $(this.content).find('video')[0].load();
                    }
                }
            });
        }

        /* Single product Other Video magnific popup */
        if( $( '.hongo-single-product-video-play-button' ).length > 0 && $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {
                    
            $( '.hongo-single-product-video-play-button' ).magnificPopup({
                preloader: false,
                disableOn: hongoMain.popup_disableon,
                type: 'iframe',
                mainClass: 'mfp-fade hongo-single-other-video-popup',
                removalDelay: 160,
                fixedContentPos: true,
                closeBtnInside: false,
            });
        }
        
        /* Header search magnific popup */
        if( $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {
            $( '.header-search-form' ).magnificPopup({
                preloader: false,
                mainClass: 'mfp-fade show-search-popup hongo-search-popup',
                fixedContentPos: true,
                closeBtnInside: false,
                closeMarkup:'<button title="%title%" type="button" class="mfp-close alt-font">×</button>',
                callbacks: {
                    open: function () {
                        setTimeout(function () {
                            $('.search-popup .search-form').addClass('search-popup-animation');
                        }, 10);
                        setTimeout(function () {
                            $('.search-input').focus();
                        }, 500);
                        $('#search-header').parent().addClass('search-popup');
                    },
                    close: function () {
                        $('.search-popup .search-form').removeClass('search-popup-animation');
                        $('#search-header input[type="text"]').each(function (index) {
                            if (index == 0) {
                                $(this).val('');
                                $("#search-header").find("input:eq(" + index + ")").css({ "border": "none", "border-bottom": "2px solid rgba(255,255,255,0.5)" });
                            }
                        });
                    }
                }
            });
        }

        /* Size guide magnific popup on click event */
        $( document ).on( 'click', '.size-guide-link', function() {
            if( $.inArray( 'jquery-magnific-popup', hongoMain.disable_scripts ) < 0 ) {
                $.magnificPopup.open({
                    fixedContentPos: true,
                    mainClass: 'mfp-fade size-guide-popup-wrap hongo-mfp-bg-white hongo-size-guide-popup',    
                    items: {
                        src: '#hongo-size-chart',
                        type: 'inline'
                    },
                    callbacks: {
                        elementParse: function(item) {
                            hongoCustomHorizontalScroll( '.size-guide-content' );
                        }
                    }
                });
            }
        });

        /* wow animation - on scroll */
        if( $.inArray( 'wow', hongoMain.disable_scripts ) < 0 ) {
            var wow = new WOW({
                boxClass: 'wow',
                animateClass: 'animated',
                offset: 0,
                mobile: ( hongoMain.mobileAnimation ) ? true : false,
                live: true
            });

            $( window ).imagesLoaded(function () {
                wow.init();
            });
        }
        
        /* Comment validation */
        $( document ).on('click', '.hongo-comment-button', function () {

            var fields = "";
            if ($(this).parent().parent().find('#author').length == 1) {
                if ($(".comment-form").find("#author").val().length == 0 || $(".comment-form").find("#author").val().value == '') {
                    fields = '1';
                    $(".comment-form").find("#author").addClass("inputerror");
                }
            }
            if ($(this).parent().parent().find('#comment').length == 1) {
                if ($(".comment-form").find("#comment").val().length == 0 || $(".comment-form").find("#comment").val().value == '') {
                    fields = '1';
                    $(".comment-form").find("#comment").addClass("inputerror");
                }
            }
            if ($(this).parent().parent().find('#email').length == 1) {
                if ($(".comment-form").find("#email").val().length == 0 || $(".comment-form").find("#email").val().length == '') {
                    fields = '1';
                    $(".comment-form").find("#email").addClass("inputerror");
                } else {
                    var re = new RegExp();
                    re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    var sinput;
                    sinput = "";
                    sinput = $(".comment-form").find("#email").val();
                    if (!re.test(sinput)) {
                        fields = '1';
                        $(".comment-form").find("#email").addClass("inputerror");
                    }
                }
            }
            if (fields != "") {
                return false;
            } else {
                return true;
            }
        });

        /* Comment Focus */
        $('.comment-fields, .comment-field').on( 'keyup', function () {
            $(this).removeClass('inputerror');
        });
        
        // Blog Filter + Infinite scroll + Isotope
        if( $.inArray( 'isotope', hongoMain.disable_scripts ) < 0 ) {
            $( '.blog-posts' ).each( function (index) {
                
                var hidedefault = true;

                var $blog_filter = $('.post-grid');
                $blog_filter.imagesLoaded(function () {
                    $blog_filter.isotope({
                        layoutMode: 'masonry',
                        itemSelector: '.grid-item',
                        percentPosition: true,
                        masonry: {
                            columnWidth: '.grid-sizer'
                        }
                    });
                    $blog_filter.isotope();
                });

                var arr_uniqueid = [];
                var arr_dataid = [];
                
                $( '.hongo-blog-common' ).each(function() {
                    arr_uniqueid.push($(this).attr('data-uniqueid'));
                });

                $('.hongo-blog-filter-wrap > li.active > a').each(function( index ) {
                    var selector = $(this).attr('data-filter');                
                    if( selector != '*'){
                        hidedefault = false;
                        if( $.inArray( $(this).attr( 'data-id' ), arr_dataid ) == -1 ){
                            arr_dataid.push($(this).attr( 'data-id' ));
                        }
                        $(this).parent().parent().attr( 'data-infinite', 'false' );
                        $(this).parent().parent().parent().find( '.hongo-blog-pagination' ).hide();
                    }else{                    
                        hidedefault = true;
                        var idx = arr_dataid.indexOf($(this).attr( 'data-id' ));
                        if( idx >= 0 ){
                            arr_dataid.splice(idx, 1);
                        }   
                        $(this).parent().parent().attr( 'data-infinite', 'true' );
                        $(this).parent().parent().parent().find( '.hongo-blog-pagination' ).show();
                    }
                    default_selector(hidedefault);
                });

                function default_selector(hidedefault){
                    if( !hidedefault ) {
                        $blog_filter.imagesLoaded(function () {
                            $('.hongo-blog-filter-wrap').each(function() {
                                if( $('#'+ $(this).attr( 'data-id' )+' > li.active > a').attr( 'data-id' ) != '' ){
                                    var blog_filter = $('.'+$(this).find('li.filter-tab.active a').attr( 'data-id' ));                                
                                    var data_id = $('#'+ $(this).find('li.filter-tab.active a').attr( 'data-id' )).find('li.filter-tab.active a').attr('data-filter');
                                    var blog_selector = data_id;
                                    blog_filter.isotope({
                                        layoutMode: 'masonry',
                                        itemSelector: '.grid-item',
                                        percentPosition: true,
                                        masonry: {
                                            columnWidth: '.grid-sizer'
                                        },
                                        filter: blog_selector
                                    }); 
                                }
                            });
                        });
                    }
                }

                var $grid_selectors = $('.hongo-blog-filter-wrap > li > a');
                $grid_selectors.on('click', function () {
                    var selector = $(this).attr('data-filter');
                    var $bloginfinite = blogInfiniteScroll( $(this).attr( 'data-id' ) );
                    if( selector != '*'){
                        if( $.inArray( $(this).attr( 'data-id' ), arr_dataid ) == -1 ){
                            arr_dataid.push($(this).attr( 'data-id' ));
                        }
                        $(this).parent().parent().attr( 'data-infinite', 'false' );
                        if( $( '.hongo-common-blog-scroll' ).length > 0 ) {
                            $bloginfinite.infiniteScroll( 'destroy' );
                        }
                        $(this).parent().parent().parent().find( '.hongo-blog-pagination' ).hide();
                    }else{
                        var idx = arr_dataid.indexOf($(this).attr( 'data-id' ));
                        if( idx >= 0 ){
                            arr_dataid.splice(idx, 1);
                        }
                        $(this).parent().parent().attr( 'data-infinite', 'true' );
                        if( $( '.hongo-common-blog-scroll' ).length > 0 ) {
                            $bloginfinite.infiniteScroll( 'destroy' );
                            blogInfiniteScroll( $(this).attr( 'data-id' ) );
                        }
                        $(this).parent().parent().parent().find( '.hongo-blog-pagination' ).show();
                    }
                    $blog_filter.find('.grid-item').removeClass('animated').css("visibility", ""); // avoid problem to filter after sorting
                    $blog_filter.find('.grid-item').each(function () {

                        if( $.inArray( 'wow', hongoMain.disable_scripts ) < 0 ) {
                            /* remove particular element from WOW array when you don't want animation on element after DOM lead */
                            wow.removeBox(this);
                        }
                        $(this).css("-webkit-animation", "none");
                        $(this).css("-moz-animation", "none");
                        $(this).css("-ms-animation", "none");
                        $(this).css("animation", "none");
                    });                

                    if( $(this).attr( 'data-id' ) != '' ){
                        $grid_selectors = $('#'+ $(this).attr( 'data-id' )+' > li > a');
                        $grid_selectors.parent().removeClass('active');
                        $(this).parent().addClass('active');
                        $('.' + $(this).attr( 'data-id' )).isotope({filter: selector});

                    }else{
                        $grid_selectors.parent().removeClass('active');
                        $(this).parent().addClass('active');
                        $blog_filter.isotope({filter: selector});
                    }                
                    return false;
                });

                // Blog Resize Isotop
                $(window).resize(function () {                
                	setTimeout(function () {
                        $blog_filter.find('.grid-item').removeClass('animated').css("visibility", ""); // avoid problem to filter after sorting

                        if( $.inArray( 'wow', hongoMain.disable_scripts ) < 0 ) {
                          	wow.removeBox( $( '.grid-item', $blog_filter ) );
                        }
                        $( '.grid-item', $blog_filter ).css("-webkit-animation", "none");
                        $( '.grid-item', $blog_filter ).css("-moz-animation", "none");
                        $( '.grid-item', $blog_filter ).css("-ms-animation", "none");
                        $( '.grid-item', $blog_filter ).css("animation", "none");
                        
                        resetIsotopeLayout( $blog_filter, false );
                    }, 500);
                });

                blog_infinite_arr(arr_dataid);
            
                function blog_infinite_arr(arr_dataid){
                    $(arr_uniqueid).each(function(key,value){
                        var hideinfinite = $('#'+value).attr('data-infinite');
                        if( $.inArray( value, arr_dataid ) == -1 && ( hideinfinite || typeof(hideinfinite) == "undefined" ) ){
                            var $bloginfinite = blogInfiniteScroll( value );
                            if( $bloginfinite.length > 0 ) {
                                $bloginfinite.on( 'append.infiniteScroll', function( event, response, path, items ) {
                                    /* For safari */
                                    $( items ).find('img[srcset]').each( function( i, img ) {
                                        img.outerHTML = img.outerHTML;
                                    });
                                    /* For new element set masonry */
                                    var $newblogpost = $( items );
                                    if( $.inArray( 'isotope', hongoMain.disable_scripts ) < 0 ) {
                                        $newblogpost.imagesLoaded( function() {                                    
                                            if( $('.'+value).parents( '.hongo-blog-standard' ).length > 0 ) {

                                                $('.'+value).append( $newblogpost );

                                            } else {
                                                
                                                $('.'+value).isotope( 'appended', $newblogpost );
                                                $('.'+value).isotope( 'layout' );
                                            }
                                        });

                                        //fit video recall
                                        if( $( ".fit-videos" ).length > 0 && $.inArray( 'jquery-fitvids', hongoMain.disable_scripts ) < 0 ) {
                                            $( ".fit-videos" ).fitVids();
                                        }

                                        // Recall Lightbox gallery
                                        $( '.lightbox-gallery' ).magnificPopup({
                                            delegate: 'a',
                                            type: 'image',
                                            tLoading: 'Loading image #%curr%...',
                                            mainClass: 'mfp-fade hongo-recall-lightbox-popup',
                                            fixedContentPos: true,
                                            closeBtnInside: false,
                                            gallery: {
                                                enabled: true,
                                                navigateByImgClick: true,
                                                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
                                            },
                                            image: {
                                                titleSrc: function (item) {
                                                    var title = '';
                                                    var lightbox_caption = '';
                                                    if( item.el.attr('title') ){
                                                        title = item.el.attr('title');
                                                    }
                                                    if( item.el.attr('data-lightbox-caption') ){
                                                        lightbox_caption = '<span class="hongo-lightbox-caption">'+item.el.attr('data-lightbox-caption')+'</span>';
                                                    }
                                                    return title + lightbox_caption;
                                                }
                                            }
                                        });

                                        // Recall isotope
                                        if( $( '.blog-post-gallery-grid' ).length > 0 ) {
                                            var $blog_gallery_filter = $('.blog-post-gallery-grid');
                                            $blog_gallery_filter.imagesLoaded(function () {
                                                $blog_gallery_filter.isotope({
                                                    layoutMode: 'masonry',
                                                    itemSelector: '.grid-item',
                                                    percentPosition: true,
                                                    transitionDuration: 0,
                                                    stagger: 0,
                                                    masonry: {
                                                        columnWidth: '.grid-sizer'
                                                    }
                                                });
                                                $blog_gallery_filter.isotope();

                                                isotopeObjs.push( $blog_gallery_filter );
                                                setTimeout( function() {
                                                    $blog_gallery_filter.isotope();
                                                }, 100 );
                                            });
                                        }
                                        equalizeHeight();
                                    }
                                });
                                $bloginfinite.on( 'last.infiniteScroll', function( event, response, path ) {
                                    $('.page-load-status').hide();
                                    setTimeout( function() {
                                        $('.page-load-status').show();
                                    }, 500 );
                                    setTimeout( function() { 
                                        $('.page-load-status').hide();
                                    }, 2500 );
                                });
                            }
                        }
                    });
                }
                // Blog Infinite Scroll
                function blogInfiniteScroll( blog_val ) {
                    var pagesNum = $( 'div.hongo-common-blog-scroll' ).attr( 'data-pagination' );
                    var navselector = 'div.hongo-common-blog-scroll a';
                    var contentselector = '.'+blog_val;
                    var itemselector = '.'+blog_val+' .blog-single-post';
                    var $bloginfinite = '';
                    if( $( '.hongo-common-blog-scroll a' ).length > 0 ) {
                        $bloginfinite = $( '.'+blog_val ).infiniteScroll({
                            path: '.hongo-common-blog-scroll a',
                            history: false,
                            navSelector: navselector,
                            contentSelector: contentselector,
                            append: itemselector,
                            status: '.page-load-status',
                            button: '.view-more-button'                        
                        });
                    }
                    if( $( '.hongo-loadmore-scroll' ).length > 0 ) {
                        $bloginfinite.infiniteScroll( 'option', {
                            scrollThreshold: false,
                            loadOnScroll: false
                        });
                    }
                    return $bloginfinite;
                }
            });
        }

        /* Product Archive Infinite Scroll */
        if( $( '.hongo-product-list-common-wrap.products' ).length > 0 && $( '.hongo-common-pagination-wrap .hongo-common-scroll a.next' ).length > 0  ) {
            var $productinfinite = productInfiniteScroll();
                productAppendInfiniteScroll( $productinfinite );
        }

        /* Post Like Dislike Button JQuery */
        $(document).on('click', '.sl-button', function() {
            var button = $(this);
            var post_id = button.attr('data-post-id');
            var security = button.attr('data-nonce');
            var iscomment = button.attr('data-iscomment');
            var allbuttons;
            if ( iscomment === '1' ) { // Comments can have same id
                allbuttons = $('.sl-comment-button-'+post_id);
            } else {
                allbuttons = $('.sl-button-'+post_id);
            }
            var loader = allbuttons.next('#sl-loader');
            if (post_id !== '') {
                $.ajax({
                    type: 'POST',
                    url: simpleLikes.ajaxurl,
                    data : {
                        action : 'process_simple_like',
                        post_id : post_id,
                        nonce : security,
                        is_comment : iscomment
                    },
                    beforeSend:function(){
                    },  
                    success: function(response){
                        var icon = response.icon;
                        var count = response.count;
                        allbuttons.html(icon+count);
                        if(response.status === 'unliked') {
                            var like_text = simpleLikes.like;
                            allbuttons.prop('title', like_text);
                            allbuttons.removeClass('liked');
                        } else {
                            var unlike_text = simpleLikes.unlike;
                            allbuttons.prop('title', unlike_text);
                            allbuttons.addClass('liked');
                        }
                        loader.empty();
                    }
                });
                
            }
            return false;
        });

        /* Shop list / grid view switcher */
        $( document ).on( 'click', '.hongo-view-switch a', function( e ) {
            e.preventDefault();

            var view = $( this ).attr( 'data-view' );
            if( !$( this ).hasClass( 'active' ) && view != '' && view != undefined ) {

                $( '.hongo-view-switch a' ).removeClass( 'active' );
                $( this ).addClass( 'active' );

                $( '.products' ).removeClass( 'hongo-product-grid-view' ).removeClass( 'hongo-product-list-view' );
                $( '.products' ).addClass( 'hongo-product-' + view + '-view' );

                if( view == 'list' ) { // check if list view
                    $( '.hongo-column-switch' ).addClass( 'display-none' ); // Hide column switcher
                } else {
                    $( '.hongo-column-switch' ).removeClass( 'display-none' ); // Show column switcher
                }
            }
        });

        /* Shop column switcher */
        $( document ).on( 'click', '.hongo-column-switch a', function( e ) {
            e.preventDefault();

            var column = $( this ).attr( 'data-col' );
            if( !$( this ).hasClass( 'active' ) && column != '' && column != undefined ) {

                $( '.hongo-column-switch a' ).removeClass( 'active' );
                $( this ).addClass( 'active' );

                $( '.products' ).removeClass( 'hongo-shop-col-2' ).removeClass( 'hongo-shop-col-3' ).removeClass( 'hongo-shop-col-4' ).removeClass( 'hongo-shop-col-5' ).removeClass( 'hongo-shop-col-6' );
                $( '.products' ).addClass( 'hongo-shop-col-' + column );

                refreshProductColumns( column, $( '.products' ) );

                setTimeout( function() {

                    var currIsotopeObj = $( '.hongo-shop-common-isotope' );

                    if( $.inArray( 'wow', hongoMain.disable_scripts ) < 0 ) {
                        /* remove particular element from WOW array when you don't want animation on element after DOM lead */
                        wow.removeBox( $( '.product', currIsotopeObj ) );
                    }
                    $( '.product', currIsotopeObj ).css("-webkit-animation", "none");
                    $( '.product', currIsotopeObj ).css("-moz-animation", "none");
                    $( '.product', currIsotopeObj ).css("-ms-animation", "none");
                    $( '.product', currIsotopeObj ).css("animation", "none");
                    
                    for( var i=0; i < swiperObjs.length; i++ ) {
                        
                        ( swiperObjs[i] ).update();
                    };

                    resetIsotopeLayout( currIsotopeObj, false );

                    equalizeHeight();

                }, 100 );
            }
        });

        /* Applied Select2 on Shop ordering dropdown */
        if( $( '.woocommerce-ordering' ).length > 0 && $.inArray( 'select2', hongoMain.disable_scripts ) < 0 ) {

            $( '.woocommerce-ordering select' ).select2({
                minimumResultsForSearch: Infinity
            });
        }

        /* Applied Select2 on Widget dropdown */
        if( $.inArray( 'select2', hongoMain.disable_scripts ) < 0 ) {

            if( $( '.widget' ).length > 0 ) {

                $( '.widget select:not( .widget.widget-woocommerce-currency-switcher select )' ).select2();
            }
        }

        /* Product Tooltip */
        if( $( '.product-buttons-wrap' ).length > 0 ) {

            $( '.product-buttons-wrap' ).each( function( i ) {

                var tooltip_pos = $( this ).attr( 'data-tooltip-position' );
                if( tooltip_pos != '' && tooltip_pos != undefined ) { // Check tooltip position
    
                    $( this ).find('a i').attr( 'data-placement', tooltip_pos ).tooltip();
                }
            });
        }

        /* Tooltip for all tooltips */
        if( $( '.hongo-tooltip' ).length > 0 ) {
           
            $( '.hongo-tooltip' ).tooltip();
        }

        /*Single Product video tooltip*/
        if( $( '.hongo-single-product-video' ).length > 0 ) {

            $( '.hongo-single-product-video' ).tooltip();
        }

        /*Single Product video tooltip*/
        if( $( '.hongo-single-product-video-play-button' ).length > 0 ) {

            $( '.hongo-single-product-video-play-button' ).tooltip();
        } 

        /* Empty Cart Message */
        $( document ).on( 'click', '.hongo-empty-cart', function() {
            if( confirm( hongoMain.cart_empty_message ) ) {
                return true;
            }
            return false;
        });

        // Enable AJAX shop filter & sorting
        if( hongoMain.enable_shop_filter_ajax ) {

            /* Shop Product filter AJAX */
            $( document ).on( 'click', '.hongo-product-taxonomy-filter-wrap-ajax a, .hongo-attribute-filter-ajax a, .hongo-active-filter-ajax a, .widget_rating_filter a, a.hongo-clear-all-filters-ajax', function() {

                var filter_url   = $( this ).attr( 'href' );

                if( filter_url != '' && filter_url != undefined ) {

                    $( '.hongo-shop-content-part .hongo-shop-common-isotope' ).block( { message: null, overlayCSS: { background: '#ffffff', opacity: 0.6 } } );

                    $.ajax({
                        url: filter_url,
                        success: function(response){
                            window.history.pushState("", "", this.url);
                            
                            var destroyLayout = false;
                            if( $( '.hongo-shop-content-part ul.products' ).length > 0 ) {

                                destroyLayout = true;
                            }

                            refreshShopProducts( response );
                            
                            if( response != '' && response != undefined ) {
                                if( $.inArray( 'isotope', hongoMain.disable_scripts ) < 0 ) {
                                
                                    if( destroyLayout ) {

                                        /* Destroy isotope */
                                        if( $( '.hongo-shop-common-isotope' ).data( 'isotope' ) ) {

                                            $( '.hongo-shop-common-isotope' ).isotope( 'destroy' );
                                        }
                                    }

                                        /* Recall isotope */
                                        var transitionTime = 0;
                                        if( $( '.hongo-column-switch' ).length > 0 ) { // Column switch is found

                                            transitionTime = '0.4s';
                                        }
                                        var $shop_common = $('.hongo-shop-common-isotope');
                                        $shop_common.imagesLoaded(function () {
                                            $shop_common.isotope({
                                                layoutMode: 'masonry',
                                                itemSelector: '.product',
                                                percentPosition: true,
                                                transitionDuration: transitionTime,
                                                stagger: 0,
                                                masonry: {
                                                    columnWidth: '.grid-sizer',
                                                },
                                            });
                                            $shop_common.isotope();
                                            if( $( '.hongo-shop-common-isotope' ).data( 'isotope' ) ) {
                                                setTimeout( function() {
                                                    if( $shop_common.data( 'isotope' ) ) {
                                                        $shop_common.isotope( 'layout' );
                                                    }
                                                }, 500 );
                                            }
                                        });

                                        $( document ).trigger( 'hongo_shop_lists_refresh_after_isotope' );

                                        // Recall Product Loop
                                        setTimeout( function() {
                                            if( $( '.hongo-loop-product-slider' ).length > 0 ) {
                                                $( '.hongo-loop-product-slider' ).each(function ( index, element ) {
                                                    var $this = $( this );
                                                    var enableNavigation = $this.attr( 'data-attr' );
                                                    var navigationOption = false;
                                                    $this.addClass( 'loop-slider-'+ index );
                                                    if( enableNavigation == 1 ){
                                                        navigationOption = {
                                                            nextEl: '.loop-slider-'+index+' .swiper-button-next',
                                                            prevEl: '.loop-slider-'+index+' .swiper-button-prev',
                                                        };
                                                    }
                                                    var swiperProductLoops = new Swiper( '.loop-slider-'+ index , {
                                                        navigation: navigationOption,
                                                        on: {
                                                            resize: function () {
                                                                this.update();
                                                            }
                                                        }
                                                    });
                                                    swiperObjs.push( swiperProductLoops );
                                                });
                                            }
                                        }, 100 );
                                }

                                $( document ).trigger( 'hongo_shop_lists_refresh' );

                                hongoCustomHorizontalScroll( '.hongo-top-filter-sidebar .top-sidebar-scroll' );
                                hongoCustomVerticalScroll( '.hongo-top-filter-sidebar .widget, .hongo-off-canvas-filter-sidebar .top-sidebar-scroll' );
                                hongoCustomVerticalScroll( '.hongo-product-common-sidebar-left-wrap' );
                                hongoCustomVerticalScroll( '.hongo-product-common-sidebar-right-wrap' );
                            }
                        }
                    });
                    return false;
                }
            });

            /* Shop Product ordering AJAX */
            $( document ).on( 'submit', '.widget_price_filter form, .woocommerce-ordering-ajax', function() {

                $( '.hongo-shop-content-part .hongo-shop-common-isotope' ).block( { message: null, overlayCSS: { background: '#ffffff', opacity: 0.6 } } );

                $.ajax({
                    url     : $(this).attr('action'),
                    type    : $(this).attr('method'),
                    data    : $(this).serialize(),

                    success : function( response ) {

                        var destroyLayout = false;
                        if( $( '.hongo-shop-content-part ul.products' ).length > 0 ) {

                            destroyLayout = true;
                        }

                        refreshShopProducts( response );

                        if( response != '' && response != undefined ) {
                            if( $.inArray( 'isotope', hongoMain.disable_scripts ) < 0 ) {

                                if( destroyLayout ) {

                                    /* Destroy isotope */
                                    if( $( '.hongo-shop-common-isotope' ).data( 'isotope' ) ) {
                                        $( '.hongo-shop-common-isotope' ).isotope( 'destroy' );
                                    }
                                }

                                    /* Recall isotope */
                                    var transitionTime = 0;
                                    if( $( '.hongo-column-switch' ).length > 0 ) { // Column switch is found

                                        transitionTime = '0.4s';
                                    }
                                    var $shop_common = $('.hongo-shop-common-isotope');
                                    $shop_common.imagesLoaded(function () {
                                        $shop_common.isotope({
                                            layoutMode: 'masonry',
                                            itemSelector: '.product',
                                            percentPosition: true,
                                            transitionDuration: transitionTime,
                                            stagger: 0,
                                            masonry: {
                                                columnWidth: '.grid-sizer',
                                            },
                                        });
                                        $shop_common.isotope();
                                        if( $( '.hongo-shop-common-isotope' ).data( 'isotope' ) ) {
                                            setTimeout( function() {
                                                if( $shop_common.data( 'isotope' ) ) {
                                                    $shop_common.isotope( 'layout' );
                                                }
                                            }, 500 );
                                        }
                                    });                                    

                                    $( document ).trigger( 'hongo_shop_lists_refresh_after_isotope' );

                                    // Recall Product Loop
                                    setTimeout( function() {
                                        if( $( '.hongo-loop-product-slider' ).length > 0 ) {                                            
                                            $( '.hongo-loop-product-slider' ).each(function ( index, element ) {
                                                var $this = $( this );
                                                var enableNavigation = $this.attr( 'data-attr' );
                                                var navigationOption = false;
                                                $this.addClass( 'loop-slider-'+ index );
                                                if( enableNavigation == 1 ){
                                                    navigationOption = {
                                                        nextEl: '.loop-slider-'+index+' .swiper-button-next',
                                                        prevEl: '.loop-slider-'+index+' .swiper-button-prev',
                                                    };
                                                }
                                                var swiperProductLoops = new Swiper( '.loop-slider-'+ index , {
                                                    navigation: navigationOption,
                                                    on: {
                                                        resize: function () {
                                                            this.update();
                                                        }
                                                    }
                                                });
                                                swiperObjs.push( swiperProductLoops );
                                            });
                                        }
                                    }, 100 );                                
                            }

                            $( document ).trigger( 'hongo_shop_lists_refresh' );
                        }
                        window.history.pushState("", "", this.url);
                    }
                });
                return false;
            });
        }

        /* Single Product Page Product Lists Accordion */
        $( document ).on( 'click', '.hongo-accordion-section-title', function(e) {

            setTimeout( function () {
                $( '.hongo-sticky-content-images-wrap' ).trigger( 'sticky_kit:recalc' );
            }, 500);            

            // Grab current anchor value
            var currentAttrValue = $(this).attr('href');

            if($( this ).hasClass( 'active' ) ) {
                closeAccordionSection();
            }else {
                closeAccordionSection();

                // Add active class to section title
                $( this ).addClass( 'active' );
                $( this ).find( 'span' ).html( '<i class="ti-minus"></i>' );

                // Open up the hidden content panel
                $( '.hongo-accordion ' + currentAttrValue).slideDown(500).addClass( 'open' ); 
            }

            // Active isotope refresh
            var currIsotopeObj  = $( currentAttrValue ).find( '.hongo-shop-common-isotope' );
            resetIsotopeLayout( currIsotopeObj, false );

            for( var i=0; i < swiperObjs.length; i++ ) {
                        
                ( swiperObjs[i] ).update();
            };
            
            e.preventDefault();
        });

        /* Single Product Page Product Images sticky on scroll in half layout */
        if( ( $( '.hongo-sticky-content-images-wrap .summary, .hongo-sticky-content-images-wrap .hongo-single-product-sticky-thumb-wrap' ).length > 0 ) && $.inArray( 'sticky-kit', hongoMain.disable_scripts ) < 0 && $( window ).width() > 1199 ) {
            $('.hongo-sticky-content-images-wrap .summary, .hongo-sticky-content-images-wrap .hongo-single-product-sticky-thumb-wrap').imagesLoaded( function() {                 
                $( '.hongo-sticky-content-images-wrap .summary, .hongo-sticky-content-images-wrap .hongo-single-product-sticky-thumb-wrap' ).stick_in_parent({
                    offset_top:100
                });
            });
        }

        /* Single Product Page Quantity input increment field */
        $( document ).on( 'click', '.hongo-qtyplus', function(e) {

            // Stop acting like a button
            e.preventDefault();

            // Get the field name
            var fieldName = $( this ).attr( 'data-field' );

            // Get its current value
            var currentVal = parseInt( $( 'input[id='+fieldName+']' ).val() );

            // Trigger change value
            $(this).closest(".quantity").find(".input-text").trigger("change");

            // If is not undefined
            if( !isNaN( currentVal ) ) {
                // Increment
                $( 'input[id='+fieldName+']' ).val( currentVal + 1 );
            } else {
                // Otherwise put a 0 there
                $( 'input[id='+fieldName+']' ).val(0);
            }
        });

        /* Single Product Page Quantity input decrement field till 0 */
        $( document ).on( 'click', '.hongo-qtyminus', function(e) {

            // Stop acting like a button
            e.preventDefault();

            // Get the field name
            var fieldName = $( this ).attr( 'data-field' );

            // Get its current value
            var currentVal = parseInt( $( 'input[id='+fieldName+']' ).val() );

            // Trigger change value
            $(this).closest(".quantity").find(".input-text").trigger("change");

            // If it isn't undefined or its greater than 0
            if( !isNaN( currentVal ) && currentVal > 0 ) {
                // Decrement one
                $( 'input[id='+fieldName+']' ).val( currentVal - 1 );
            } else {
                // Otherwise put a 0 there
                $( 'input[id='+fieldName+']' ).val(0);
            }
        });

        /* Scroll to reviews section click on review link */
        $( '.woocommerce-review-link' ).on( 'click', function () {

            if( !$( '.reviews_tab a.hongo-accordion-section-title' ).hasClass( 'active' ) ) {
                $( '#tab-title-reviews a' ).trigger( 'click' );
            } 
            
            $( 'html, body' ).animate ( {
                scrollTop: $( '.woocommerce-tabs , .hongo-accordion' ).offset().top
            }, 1500 );
            
            return false;
        });

        /* Scroll to Top Button */
        $(window).scroll(function () {
            var scrollTop    = $( document ).scrollTop();
            if( scrollTop > 150) {
                $('.scroll-top-arrow').addClass( 'scroll-active' );
            } else {
                $('.scroll-top-arrow').removeClass( 'scroll-active' );
            }
        });

        $('.scroll-top-arrow').on('click', function () {
            $('html, body').animate({scrollTop: 0}, 800);
            return false;
        });

        /* Ratina Ready */
        var $allNonRatinaImages = $( "img:not([data-rjs])" );
        $allNonRatinaImages.attr( 'data-no-retina', '' );

        /* Ready functions start code */

            /* Animationa counters Function */
            function animateCounters( element ) {

                var getCounterNumber = $(element).attr('data-to');
                var getCounterSpeed = $(element).attr('data-speed');
                var countersign = $(element).attr('data-postfix');

                getCounterSpeed = ( getCounterSpeed != '' && getCounterSpeed != undefined ) ? getCounterSpeed : 2000;
                
                $({ ValuerHbcO: 0 }).delay(0).animate({ ValuerHbcO: getCounterNumber }, {
                    duration: parseInt(getCounterSpeed),
                    //easing: "swing",
                    step: function (currentLeft) {
                        var roundNumber = Math.ceil( currentLeft );
                        if( countersign != '' && countersign != undefined ) {
                            $(element).text( roundNumber + countersign );
                        } else {
                            $(element).text( roundNumber );
                        }
                    }
                });
            }

            /* Top filter dynamic width Function */
            function topFilterDynamicWidth(){            
                
                var totalWidth = 0;

                $( '.hongo-top-filter-sidebar .top-sidebar-scroll-full' ).children().each( function() {

                    if( ! isIE() ) {
                        totalWidth = totalWidth + $( this ).outerWidth();
                    } else {
                        totalWidth = totalWidth + $( this ).width();
                    }
                });
                
                $( '.hongo-top-filter-sidebar .top-sidebar-scroll-full' ).css( 'width', totalWidth+'px' );
            }

            /* Refresh Tooltip after product filter Function */
            function refreshProductTooltip( response ) {
                
                var tooltip_pos = $( response ).find( '.product-buttons-wrap' ).attr( 'data-tooltip-position' );
                if( tooltip_pos != '' && tooltip_pos != undefined ) { // Check tooltip position

                    $('.product-buttons-wrap a i').attr( 'data-placement', tooltip_pos ).tooltip();
                }
            }

            /* Refresh Columns after product filter Function */
            function refreshProductColumns( column, response ) {

                // WooCommerce first & last class login for product lists
                var total_products = response.find( 'li.product' ).length;
                if( total_products != '' && total_products != undefined ) {

                    var total_rows = Math.ceil( total_products / column ) - 1;

                    response.find( 'li.product' ).removeClass( 'first' ).removeClass( 'last' );
                    if( !( response.hasClass( 'hongo-shop-masonry' ) || response.hasClass( 'hongo-shop-metro' ) || response.hasClass( 'hongo-shop-modern' ) ) ) {

                        for (var i = 0; i < total_products; i++) {
                            if( i == 0 || i % column == 0 ) {
                                response.find( 'li.product:eq( ' + i + ' )' ).addClass( 'first' );
                            } else if( ( i + 1 ) % column == 0 ) {
                                response.find( 'li.product:eq( ' + i + ' )' ).addClass( 'last' );
                            }
                            
                        }
                    }
                }
            }        

            /* Refresh Shop products after product filter Function */
            function refreshShopProducts( response ) {

                if( response != '' && response != undefined ) {

                    var reInitializeInfiniteScroll = false;
                    if( ! $( '.hongo-common-pagination-wrap' ).length > 0 ) {
                        
                        reInitializeInfiniteScroll = true;
                    }

                    if( $( response ).find( '.hongo-shop-content-part ul.products' ).length > 0 && $( '.hongo-shop-content-part ul.products' ).length > 0 ) {

                        var products = $( response ).find( '.hongo-shop-content-part ul.products' ).html();

                        // Display products
                        $( '.hongo-shop-content-part ul.products' ).html( products );

                    } else {                     

                        var products = $( response ).find( '.hongo-shop-content-part' ).html();

                        // Display products
                        $( '.hongo-shop-content-part' ).html( products );
                    }                    

                    // Display pagination
                    if( $( response ).find( '.hongo-default-pagination-wrap' ).length > 0 ) {

                        $( '.hongo-default-pagination-wrap' ).html( $( response ).find( '.hongo-default-pagination-wrap' ).html() );

                    } else {

                        $( '.hongo-default-pagination-wrap' ).html( '' );
                    }

                    // Display infinite pagination
                    if( $( response ).find( '.hongo-common-pagination-wrap' ).length > 0 ) {

                        $( '.hongo-common-pagination-wrap' ).html( $( response ).find( '.hongo-common-pagination-wrap' ).html() );

                        /* Product Archive Infinite Scroll */
                        if( $( '.hongo-common-pagination-wrap .hongo-common-scroll a.next' ).length > 0 ) {
                            $productinfinite = productInfiniteScroll();
                            $productinfinite.infiniteScroll( 'create' );
                        }
                        if( reInitializeInfiniteScroll ) { // Re-Initialize Infinite Scroll
                            $( '.hongo-shop-content-part ul.products' ).after( '<div class="hongo-common-pagination-wrap wow fadeIn">' + $( response ).find( '.hongo-common-pagination-wrap' ).html() + '</div>' );
                            $productinfinite = productInfiniteScroll();
                            $productinfinite.infiniteScroll( 'create' );
                            productAppendInfiniteScroll( $productinfinite );
                        }

                    } else {

                        if( $( '.hongo-common-pagination-wrap' ).length > 0 ) {
                            $productinfinite = productInfiniteScroll();
                            if( $productinfinite != '' && $productinfinite != undefined ) {

                                $( '.view-more-button' ).css( 'display', 'none' );
                                $productinfinite.infiniteScroll( 'destroy' );
                            }
                        }
                    }

                    // Display Tooltip
                    refreshProductTooltip( response );

                    // Display Columns after filter
                    var column = $( '.hongo-column-switch a.active' ).attr( 'data-col' );
                    refreshProductColumns( column, $( 'ul.products' ) );

                    setTimeout( function() {

                        equalizeHeight();

                    }, 300 );

                    // Display Filter Count
                    $('.woocommerce-result-count').html( $( response ).find( '.woocommerce-result-count' ).html() );

                    // Display ordering form
                    $( '.woocommerce-ordering-ajax' ).html( $( response ).find( '.woocommerce-ordering-ajax' ).html() );

                    // Display sidebar widget
                    $( '.hongo-woocommerce-sidebar' ).html( $( response ).find( '.hongo-woocommerce-sidebar' ).html() );

                    // Display top filter widget
                    $( '.hongo-woocommerce-top-sidebar' ).html( $( response ).find( '.hongo-woocommerce-top-sidebar' ).html() );

                    // Display price filter in proper format
                    initPriceFilter();

                    // Display cart in proper format
                    $( document.body ).trigger( 'wc_fragments_loaded' );

                    // For Top filter Sidebar Width after filteration and apply custom scrollbar
                    topFilterDynamicWidth();    

                    // Display Product Images
                    var product_gallery = $( '.woocommerce-product-gallery' );
                    product_gallery.each( function() {
                        $( this ).wc_product_gallery();
                    });

                    // Variation Form
                    var form_variation = $( '.variations_form' );
                    form_variation.each( function() {
                        $( this ).wc_variation_form();
                    });

                    // Init after gallery.
                    setTimeout( function() {
                        form_variation.trigger( 'check_variations' );
                        form_variation.trigger( 'wc_variation_form' );
                    }, 100 );

                    $( '.hongo-shop-content-part .hongo-shop-common-isotope' ).unblock( { message: null, overlayCSS: { background: '#ffffff', opacity: 0.6 } } );

                    // Apply select2 to sorting dropdown
                    if( $( '.woocommerce-ordering-ajax' ).length > 0 && $.inArray( 'select2', hongoMain.disable_scripts ) < 0 ) {
                        $( '.woocommerce-ordering-ajax select' ).select2({
                            minimumResultsForSearch: Infinity
                        });
                    }

                    // Apply select2 to widget dropdown
                    if( $( '.widget' ).length > 0 && $.inArray( 'select2', hongoMain.disable_scripts ) < 0 ) {
                        $( '.widget select' ).select2();
                    }
                }
            }

            /* Accordion close based on action Function */
            function closeAccordionSection() {
                $( '.hongo-accordion .hongo-accordion-section-title' ).removeClass( 'active' );
                $( '.hongo-accordion .hongo-accordion-section-title span' ).html( '<i class="ti-plus"></i>' );
                $( '.hongo-accordion .hongo-accordion-section-content' ).slideUp(500).removeClass( 'open' );
            }

            /* Reset Isotope Loop Function */
            function resetIsotopeLayoutLoop( isotopeObjs ) {

                for( var i=0; i < isotopeObjs.length; i++ ) {

                    if( $.inArray( 'wow', hongoMain.disable_scripts ) < 0 ) {
                        // remove particular element from WOW array when you don't want animation on element after DOM lead
                        wow.removeBox( $( '.product', isotopeObjs[i] ) );
                    }
                    $( '.product', isotopeObjs[i] ).css("-webkit-animation", "none");
                    $( '.product', isotopeObjs[i] ).css("-moz-animation", "none");
                    $( '.product', isotopeObjs[i] ).css("-ms-animation", "none");
                    $( '.product', isotopeObjs[i] ).css("animation", "none");
                    resetIsotopeLayout( isotopeObjs[i], true );
                };

                equalizeHeight();
            }

            /* Reset Isotope Function */
            function resetIsotopeLayout( $item, $resize ) {

                if( $item != undefined && $item.length > 0 ) {

                    if( $.inArray( 'isotope', hongoMain.disable_scripts ) < 0 ) {

                        if( $item.data( 'isotope' ) ) {
                            $item.isotope( 'layout' );
                        }
                    }
                }
            }

            /* Reset Swiper Function */
            function resetSwiper( $item ) {

                if( $.inArray( 'swiper', hongoMain.disable_scripts ) < 0 ) {
                    if( $item != undefined && $item.length > 0 ) {

                        $item.update();
                    }
                }
            }

            /* Product Archive Infinite Scroll */
            function productInfiniteScroll() {

                if( $( '.hongo-common-pagination-wrap .hongo-common-scroll a.next' ).length > 0 && $.inArray( 'infinite-scroll', hongoMain.disable_scripts ) < 0 ) {
                    var pagesNum = $( '.hongo-common-pagination-wrap .hongo-common-scroll' ).attr( 'data-pagination' );         
                    var navselector = '.hongo-common-pagination-wrap .hongo-common-scroll';
                    var contentselector = '.hongo-product-list-common-wrap.products';
                    var itemselector = '.hongo-product-list-common-wrap.products .product';

                    if( $( '.hongo-common-pagination-wrap .hongo-common-scroll a.next' ).length > 0 ) {
                        var $productinfinite = $( '.hongo-product-list-common-wrap.products' ).infiniteScroll({
                            path: '.hongo-common-pagination-wrap .hongo-common-scroll a.next',
                            history: false,
                            navSelector: navselector,
                            contentSelector: contentselector,
                            append: itemselector,
                            status: '.page-load-status',
                            button: '.view-more-button'
                            //loadOnScroll: true,
                        });
                    }
                    if( $( '.hongo-loadmore-pagination-wrap .hongo-loadmore-scroll a.next' ).length > 0 ) {
                        $( '.view-more-button' ).css( 'display', 'block' );
                        $productinfinite.infiniteScroll( 'option', {
                            scrollThreshold: false,
                            loadOnScroll: false
                        });
                    }
                    return $productinfinite;
                }
            }

            /* Append Product Archive Infinite Scroll */
            function productAppendInfiniteScroll( $productinfinite ) {

                if( $( '.hongo-common-pagination-wrap .hongo-common-scroll a.next' ).length > 0 && ! $( '.hongo-shop-list' ).length > 0 ) {
                    if( $.inArray( 'isotope', hongoMain.disable_scripts ) < 0 ) {
                        $productinfinite.on( 'append.infiniteScroll', function( event, response, path, items ) {
                            /* For safari */
                            $( items ).find('img[srcset]').each( function( i, img ) {
                                img.outerHTML = img.outerHTML;
                            });
                                /* For new element set masonry */
                                if( $.inArray( 'isotope', hongoMain.disable_scripts ) < 0 ) {
                                    var $newProducts = $( items );
                                    $newProducts.imagesLoaded( function() {
                                        $( '.hongo-product-list-common-wrap.products' ).isotope( 'appended', $newProducts );
                                        if( $( '.hongo-product-list-common-wrap.products' ).data( 'isotope' ) ) {
                                            $( '.hongo-product-list-common-wrap.products' ).isotope( 'layout' );
                                        }
                                    });
                                }

                                $( document ).trigger( 'hongo_shop_lists_refresh_after_isotope' );

                                // Recall Product Loop
                                if( $( '.hongo-loop-product-slider' ).length > 0 ) {
                                    $( '.hongo-loop-product-slider' ).each(function ( index, element ) {
                                        var $this = $( this );
                                        var enableNavigation = $this.attr( 'data-attr' );
                                        var navigationOption = false;
                                        $this.addClass( 'loop-slider-'+ index );
                                        if( enableNavigation == 1 ){
                                            navigationOption = {
                                                nextEl: '.loop-slider-'+index+' .swiper-button-next',
                                                prevEl: '.loop-slider-'+index+' .swiper-button-prev',
                                            };
                                        }
                                        var swiperProductLoops = new Swiper( '.loop-slider-'+ index , {
                                            navigation: navigationOption,
                                            on: {
                                                resize: function () {
                                                    this.update();
                                                }
                                            }
                                        });
                                        swiperObjs.push( swiperProductLoops );
                                    });
                                }
                        });
                    }
                    $productinfinite.on( 'last.infiniteScroll', function( event, response, path ) {
                        $('.page-load-status').hide();
                        setTimeout( function() {
                            $('.page-load-status').show();
                        }, 500 );
                        setTimeout( function() {
                            $('.page-load-status').hide();
                        }, 2500 );
                    });
                }
            }
        /* Ready functions end code */

    });
    /* Window ready event end code */

    /* Set Hongo Cookie Function */
    function setHongoCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = ( exdays != 0 && exdays != '' ) ? d.toUTCString() : 0;
        document.cookie = cname + "=" + cvalue + ";expires=" + expires + ";path=/";
    }

    /* Remove Hongo Cookie Function */
    function getHongoCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // .mini-header-main-wrapper .wp-nav-menu-responsive-button, 
    $( document ).on( 'click', '.navbar .navbar-collapse a.dropdown-toggle, .accordion-style-1 .panel-heading a, .accordion-style-2 .panel-heading a, .accordion-style-3 .panel-heading a, .toggles .panel-heading a, .toggle-style-1 .panel-heading a, .nav-tabs a[data-toggle="tab"], a.shopping-cart, .hongo-top-shop-filter, .hongo-tabs li a, .popup-modal-dismiss, .size-guide-link, .sl-button, .hongo-view-switch a, .hongo-column-switch a, .hongo-accordion-section-title, .woocommerce-review-link', function (e) {
        e.preventDefault();
    });

    /* Window scroll event start code */    
    $( window ).on( 'scroll', initScrollNavigate );
    function initScrollNavigate() {
                
        var scrollPos = $(document).scrollTop();

        /* WooCommerce product single page navigation */
        if ( $( 'body' ).hasClass( 'single-product' ) ) {

            if( scrollPos >= 350 ) {
                $('body').addClass( 'single-product-navigation' );
            } else {
                $('body').removeClass( 'single-product-navigation' );
            }
        }
    }
    /* Window scroll event end code */

    /* Window resize event start code */
    $( window ).resize(function (event) {

        setTimeout(function () {
            setResizeContent();
        }, 500);

        refreshMiniCartHeight();

        // Menu work with eualize height
        $("nav.navbar ul.nav").each(function () {
            $("li.dropdown", this).on("mouseenter", function () {
                equalizeHeight();
                return false;
            });
        });

        // Tab work with eualize height
        $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
            equalizeHeight();
            return false;
        });

        /* Single Product Page Product Images sticky destroy on mobile layout */
        if( $.inArray( 'sticky-kit', hongoMain.disable_scripts ) < 0 ) {

            if( $( '.hongo-sticky-content-images-wrap .summary, .hongo-sticky-content-images-wrap .hongo-single-product-sticky-thumb-wrap' ).length > 0 && $( window ).width() <= 1199 ) {

                $( '.hongo-sticky-content-images-wrap .summary, .hongo-sticky-content-images-wrap .hongo-single-product-sticky-thumb-wrap' ).trigger("sticky_kit:detach");

            } else {

                $('.hongo-sticky-content-images-wrap .summary, .hongo-sticky-content-images-wrap .hongo-single-product-sticky-thumb-wrap').imagesLoaded( function() {
                
                    $( '.hongo-sticky-content-images-wrap .summary, .hongo-sticky-content-images-wrap .hongo-single-product-sticky-thumb-wrap' ).stick_in_parent({
                        offset_top:100
                    });
                });
            }
        }

        /*Single Product Sticky Slider 1024 Width*/
        if( $.inArray( 'swiper', hongoMain.disable_scripts ) < 0 ) {

            if( $( window ).width() <= 1199 ) {
                
                if( ! ( $( '#single-product-sticky' ).length > 0 ) ) {

                    $( '.hongo-sticky-content-images-wrap .woocommerce-product-gallery__wrapper' ).wrapInner( '<div id="single-product-sticky" class="swiper-container"><div class="swiper-wrapper"></div><div class="swiper-button-next"><i class="ti-angle-right"></i></div><div class="swiper-button-prev"><i class="ti-angle-left"></i></div></div>' );
                    $( '#single-product-sticky .woocommerce-product-gallery__image' ).addClass('swiper-slide');

                    swiperStickyProduct = new Swiper( '#single-product-sticky', {
                        watchSlidesVisibility: true, /* If you use slidesPerView "auto" or slidesPerView > 1, then you should also enable watchSlidesVisibility */
                        watchSlidesProgress: true,
                        breakpoints: { 767: { slidesPerView: 1 }, },
                        watchOverflow: true,
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }
                    });
                }

            } else {

                $( '#single-product-sticky .swiper-button-next, #single-product-sticky .swiper-button-prev, #single-product-sticky .swiper-notification' ).remove();
                $( '#single-product-sticky .woocommerce-product-gallery__image' ).removeClass( 'swiper-slide swiper-slide-visible swiper-slide-active' ).css( 'width', 'inherit' );
                $( '#single-product-sticky .swiper-wrapper' ).contents().unwrap();
                $( '#single-product-sticky' ).contents().unwrap();
            }
        }
        
        event.preventDefault();
    });
    /* Window resize event end code */
    
    // Window orientationchange event start code
    $( window ).on( "orientationchange", function( event ) {

        $( window ).trigger( 'resize' );

    }); // End orientationchange event

    /* Mini cart height Function */
    function refreshMiniCartHeight() {

        var windowHeight    = $( window ).height();
        var miniCartHeading = 80; //$( '.mini-cart-slide-sidebar-heading' ).outerHeight();
        var miniCartBottom  = $( '.mini-cart-slide-bottom' ).outerHeight();
        var otherButtonHeight= $( '.wcppec-cart-widget-spb' ).length > 0 ? $( '.wcppec-cart-widget-spb' ).outerHeight() : 0;
        var middleHeight    = parseInt( windowHeight ) - ( parseInt( miniCartHeading ) + parseInt( miniCartBottom ) + parseInt( otherButtonHeight ) )
        $( '.mini-cart-slide-middle' ).height( parseInt( middleHeight ) );

        hongoCustomVerticalScroll( '.widget_shopping_cart .mini-cart-slide-middle' );
    }

    /* Custom Vertical Scroll Bar Function */
    function hongoCustomVerticalScroll( key ) {

        if (typeof key === "undefined" || key === null || key === '') { 
            key = '.slide-menu-wrapper, .hongo-top-filter-sidebar .widget, .hongo-off-canvas-filter-sidebar .top-sidebar-scroll, .widget_shopping_cart_content .hongo-mini-cart-lists-wrap, .widget_shopping_cart .mini-cart-slide-middle, .hongo-left-menu .hongo-mini-cart-lists-wrap, .hongo-product-common-sidebar-left-wrap'; // ,.hongo-size-guide-details, .ui-autocomplete
        }
       
        /* Vertical Custom Scrollbar - Compare popup, Quick view, Right slide menu */
        if( $.inArray( 'hongo-mcustomscrollbar', hongoMain.disable_scripts ) < 0 ) {
            $( key ).mCustomScrollbar({
                scrollInertia: 100,
                scrollButtons:{
                    enable:false
                },
                keyboard:{
                    enable: true
                },
                mouseWheel:{
                    enable:true,
                    scrollAmount:200
                },
                advanced:{
                    updateOnContentResize:true, /*auto-update scrollbars on content resize (for dynamic content): boolean*/
                    autoExpandHorizontalScroll:true, /*auto-expand width for horizontal scrolling: boolean*/
                }
            });
            
            // Distroy mCustom Scrollbar in mini desktop
            if( $( window ).width() > 1199 ) {

                if( $( ".hongo-product-common-sidebar-left-wrap" ).length > 0 ) { 
                
                    $( ".hongo-product-common-sidebar-left-wrap" ).mCustomScrollbar( "destroy" );
                }

                if( $( ".hongo-product-common-sidebar-right-wrap" ).length > 0 ) { 
                
                    $( ".hongo-product-common-sidebar-right-wrap" ).mCustomScrollbar( "destroy" );
                }

            } else {
                
                if( $( ".hongo-product-common-sidebar-left-wrap" ).length > 0 ) { 
                    
                    $( ".hongo-product-common-sidebar-left-wrap" ).mCustomScrollbar( "update" );
                }

                if( $( ".hongo-product-common-sidebar-right-wrap" ).length > 0 ) { 
                
                    $( ".hongo-product-common-sidebar-right-wrap" ).mCustomScrollbar( "update" );
                }
            }

            // Distroy mCustom Scrollbar in mobile
            if( $( window ).width() < 768 ) {

                if( $( ".hongo-top-filter-sidebar .widget" ).length > 0 ) {

                    $( ".hongo-top-filter-sidebar .widget" ).mCustomScrollbar( "destroy" );
                }

            } else {
                
                if( $( ".hongo-top-filter-sidebar .widget" ).length > 0 ) {
                    
                    $( ".hongo-top-filter-sidebar .widget" ).mCustomScrollbar( "update" );
                }
            }
        }
    }

    /* Custom Horizontal Scroll Bar Function */
    function hongoCustomHorizontalScroll( key ) {

        if (typeof key === "undefined" || key === null || key === '') { 
            key = '.compare-popup-main-content .content-right, .hongo-top-filter-sidebar .top-sidebar-scroll, .size-guide-content'; 
        }

        /* Horizontal Custom Scrollbar - Compare popup, Top sidebar */
        if( $.inArray( 'hongo-mcustomscrollbar', hongoMain.disable_scripts ) < 0 ) {            
            $( key ).mCustomScrollbar({
                axis:"x", // horizontal scrollbar
                scrollInertia: 100,
                scrollButtons:{
                    enable:false
                },
                keyboard:{
                    enable: true
                },
                mouseWheel:{
                    enable:false,
                    scrollAmount:200
                },
                advanced:{
                    updateOnContentResize:true, /*auto-update scrollbars on content resize (for dynamic content): boolean*/
                    autoExpandHorizontalScroll:true, /*auto-expand width for horizontal scrolling: boolean*/
                }
            });            
        }
    }

    /* Ajax price filter Function */
    function initPriceFilter() {

        if( $( '.price_slider' ).length > 0 ) {

            $( 'input#min_price, input#max_price' ).hide();
            $( '.price_slider, .price_label' ).show();

            var min_price = $( '.price_slider_amount #min_price' ).data( 'min' ),
                max_price = $( '.price_slider_amount #max_price' ).data( 'max' ),
                current_min_price = $( '.price_slider_amount #min_price' ).val(),
                current_max_price = $( '.price_slider_amount #max_price' ).val();

            $( '.price_slider:not(.ui-slider)' ).slider({
                range: true,
                animate: true,
                min: min_price,
                max: max_price,
                values: [ current_min_price, current_max_price ],
                create: function() {

                    $( '.price_slider_amount #min_price' ).val( current_min_price );
                    $( '.price_slider_amount #max_price' ).val( current_max_price );

                    $( document.body ).trigger( 'price_slider_create', [ current_min_price, current_max_price ] );
                },
                slide: function( event, ui ) {

                    $( 'input#min_price' ).val( ui.values[0] );
                    $( 'input#max_price' ).val( ui.values[1] );

                    $( document.body ).trigger( 'price_slider_slide', [ ui.values[0], ui.values[1] ] );
                },
                change: function( event, ui ) {

                    $( document.body ).trigger( 'price_slider_change', [ ui.values[0], ui.values[1] ] );
                }
            });

            hongoCustomVerticalScroll( '.hongo-top-filter-sidebar .widget, .hongo-off-canvas-filter-sidebar .top-sidebar-scroll' );
            hongoCustomHorizontalScroll( '.hongo-top-filter-sidebar .top-sidebar-scroll' );
            hongoCustomVerticalScroll( '.hongo-product-common-sidebar-left-wrap' );
            hongoCustomVerticalScroll( '.hongo-product-common-sidebar-right-wrap' );
        }
    }

    /* Internet Explorer Function */
    function isIE() {

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { // If Internet Explorer, return version number
        
            return true;

        } else {  // If another browser, return 0
        
            return false;
        }
        return false;
    }

    /* Mobile Height Function */
    function setMobileHeight() {

        if( isMobile ) {
            if( $('.vc_row-o-full-height').length > 0 ) {
                setTimeout(function () {
                    var windowHeight = $(window).height();
                    $('.vc_row-o-full-height').css('min-height', windowHeight);
                }, 500);
            }
        }
    }

    /* Mobile Breakpoint Function */
    function mobileBreakpoint() {
        if( $(window).width() <= hongoMain.menu_breakpoint ) {
            $( 'nav.hongo-left-menu' ).addClass( 'hongo-mobile-menu' );
        } else {
            $( 'nav.hongo-left-menu' ).removeClass( 'hongo-mobile-menu' );
        }
    }

    /* Equalize Function */
    function equalizeHeight() {
        if( $('.equalize').length > 0 && $.inArray( 'equalize', hongoMain.disable_scripts ) < 0 ) {
            setTimeout(function () {
                $('.equalize').equalize({equalize: 'outerHeight', reset: true});

                if( $('.inner-match-height').length > 0 ) {
                    $('.equalize').equalize({equalize: 'outerHeight', children: '.inner-match-height', reset: true});
                }
            }, 100 );
        }
    }

    /* Resize & Load Function */
    function setResizeContent() {

        /* vertical Product Slider Height Adjustment */
        if( $( '.single-product-classic .hongo-single-product-thumb-wrap' ).length > 0 ) {

            // Single product page vertical slider assign height
            var verticalThumbHeight = $( '.single-product-classic .hongo-single-product-image-wrap' ).height();
            $( '.single-product-classic .hongo-single-product-thumb-wrap' ).height( verticalThumbHeight - 45 );
        }
        if( $( '.single-product-modern .hongo-single-product-thumb-wrap' ).length > 0 ) {

            // Single product page vertical slider assign height
            var verticalThumbHeight = $( '.single-product-modern .hongo-single-product-image-wrap' ).height();
            if( verticalThumbHeight > 600 ) {
                $( '.single-product-modern .hongo-single-product-thumb-wrap' ).height( verticalThumbHeight - 325 );
            } else if( verticalThumbHeight > 500 ) {
                $( '.single-product-modern .hongo-single-product-thumb-wrap' ).height( verticalThumbHeight - 200 );
            } else {
                $( '.single-product-modern .hongo-single-product-thumb-wrap' ).height( verticalThumbHeight );
            }
        }
        if( $( '.single-product-extended-descriptions' ).length > 0 ) {

            // Single product page vertical slider assign height
            var verticalThumbHeight = $( '.single-product-extended-descriptions .hongo-single-product-image-wrap' ).height();
            $( '.single-product-extended-descriptions .hongo-single-product-thumb-wrap' ).height( verticalThumbHeight );
        }

        equalizeHeight();
        mobileBreakpoint();
        setMobileHeight();
        hongoCustomHorizontalScroll( '' );
        hongoCustomVerticalScroll( '' );
    }
})( jQuery );