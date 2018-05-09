$(document).ready(function(){

// SAFARI SCROLL FIX
  function safariScrollFix(){
    // disable scroll
    $('body').on('touchmove',function(e){
      if ( $(this).hasClass('umodal-disable-scroll') ) {
        e.preventDefault();
      }
    });
    // custom scroll
    $('.umodal-disable-scroll').on('touchstart','.umodal__item-scrollable',function(e) {
      if (e.currentTarget.scrollTop === 0) {
        e.currentTarget.scrollTop = 1;
      } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
        e.currentTarget.scrollTop -= 1;
      }
    });
    // enable scroll in scrollable elements
    $('.umodal-disable-scroll').on('touchmove','.umodal__item-scrollable',function(e) {
      e.stopPropagation();
    });
  }

// UMODAL CLOSING FUNCTION
  function umodalClose(){
    $('body').removeClass('umodal-disable-scroll').css({paddingRight: 0});
    $('.umodal').css({paddingRight: 0});
    $(window).scrollTop(umodalScrollTop);
  };

  var umodalTemp = '<div class="umodal umodal_loading">' +
                     '<div class="umodal__inner">' +
                       '<button class="umodal__close"></button>' +
                       '<div class="umodal__content"></div>' +
                     '</div>' +
                   '</div>';

// OPEN THE UMODAL
  $('.umodal__open').on('click', function(e){
    e.preventDefault();

    var umodalPageScrollWidth = window.innerWidth - $(document).width();
    window.umodalScrollTop = $(window).scrollTop();

    $('body').addClass('umodal-disable-scroll').css({
      paddingRight: umodalPageScrollWidth,
      top: -umodalScrollTop
    });
    $('.umodal').css({paddingRight: umodalPageScrollWidth});

  // umodal
    var umodalId = $(this).attr('umodal-id');
    var umodalSrc = $(this).attr('umodal-src');
    var umodalHref = $(this).attr('href');
    var umodalContent = $(this).attr('umodal-content');

  // check for an image
    if ( umodalHref != undefined ) {
      var umodalDetectImage = umodalHref.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jpg|jpeg|png|bmp|gif|webp|ico|svg)((\?|#).*)?$)/i);
    }

  // fade in the template at the end of the 'body'
    $(umodalTemp).appendTo('body').hide().fadeIn(200);
    var umodalCurrentContent = $('.umodal__content');

  // opening a umodal embedded on the page
    if ( umodalId != undefined && umodalId != null ) {
      $('.umodal').removeClass('umodal_loading').addClass('umodal_' + umodalId)
      var umodalParent = $($('[umodal-id="' + umodalId + '"]:not(.umodal__open)').parents()[0]);
      $('[umodal-id="' + umodalId + '"]:not(.umodal__open)').appendTo(umodalCurrentContent);
      $('.umodal__close, .umodal__shut').on('click', function(){
        $('.umodal').fadeOut(200, function(){
          $('.umodal__content [umodal-id]').appendTo(umodalParent);
          $(this).remove();
          umodalClose();
        });
      });

    } else {
    // if there is no 'umodal-src', then load the image in the umodal
      if ( umodalSrc == undefined ) {
        $('.umodal').addClass('umodal_inverse umodal_image');
        umodalCurrentContent.html('<img src="' + umodalHref + '" class="umodal__image">');

        $('.umodal__image').on('load', function(){
          $(this).addClass('umodal__image_show');
          setTimeout(function(){
            $('.umodal').removeClass('umodal_loading');
          }, 50)
        }).on('error', function(){
          umodalCurrentContent.html('Не удалось загрузить изображение').fadeIn(200);
          $('.umodal').removeClass('umodal_loading');
        });

      } else if ( umodalContent != undefined ) {
        // if there is 'umodal-content', then load the content from the specified block
        umodalCurrentContent.hide().load(umodalSrc + ' ' + umodalContent, function(response, status, xhr){
          if (status == 'error') {
            $(this).html('Не удалось загрузить содержимое: ' + xhr.status + ' ' + xhr.statusText);
          }
          $(this).fadeIn(200);
          setTimeout(function(){
            $('.umodal').removeClass('umodal_loading');
          }, 50)
        });
      } else {
      // if there is 'umodal-src' and no 'umodal-content', then load the content by link
        umodalCurrentContent.hide();
        $.ajax({
          url: umodalSrc,
          type: 'GET',
          success: function(data){
            var inBody = data.replace(/\r\n|\r|\n/g,'').match('<body[^>]*>(.*?)<\/body>')[0];
            umodalCurrentContent.html(inBody).fadeIn(200);
            $('.umodal').removeClass('umodal_loading');
          },
          error: function(data) {
            $('.umodal').removeClass('umodal_loading');
            umodalCurrentContent.html('Не удалось загрузить содержимое').fadeIn(200);
          }
        });
      }

    // closing and removing the open umodal
      $('.umodal__close, .umodal__shut').click(function(){
        $('.umodal').fadeOut(200, function(){
          $(this).remove();
          umodalClose();
        });
      });
    }
    
    // for safari scroll fix
    setTimeout(function(){
      var z = $('.umodal__inner *').length;
      for ( ; z > -1; z-- ) {
        if ( $($('.umodal__inner *')[z]).css('overflow') == 'auto' ) {
          $($('.umodal__inner *')[z]).addClass('umodal__item-scrollable');
        }
      };
      safariScrollFix();
    }, 250);

    $('.umodal__close').attr('title', '[Esc]');

  });

  // closing umodal on the key 'Esc'
  $(document).keyup(function(e) {
    if (e.keyCode === 27) {
      $('.umodal__close, .umodal__shut').click();
    };
  });
})
