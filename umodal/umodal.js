$(document).ready(function(){

// umodal closing function | функция закрытия umodal
  function umodalClose(){
  // return scrollbar to page | возвращаем скроллбар странице
    $('body').removeClass('umodal-disable-scroll').css({paddingRight: 0});
  // remove the indent from the umodal | убираем отступ у umodal-окна
    $('.umodal_show').css({paddingRight: 0});
  // return the scrolling position of the page | возвращаем скролл-позицию странице
    $(window).scrollTop(umodalScrollTop);
  };

// umodal-image dynamic height | динамическая высота umodal-изображения
  $(window).resize(function(){
    $('.umodal_show .umodal__image').css('max-height', 'initial').css('max-height', '' + $('.umodal_show .umodal__content').height() + 'px');
  });

// open the umodal | открываем umodal-окно
  $('.umodal__open').on('click', function(e){
    e.preventDefault();

  // page scrollbar width | ширина скроллбара страницы
    var umodalPageScrollWidth = window.innerWidth - $(document).width();

  // save scrollTop position | записываем на сколько прокручена страница
    window.umodalScrollTop = $(window).scrollTop();

    setTimeout(function(){
    // set a fixed position for 'body' | задаём фиксированное положение для 'body'
      $('body').addClass('umodal-disable-scroll').css({
      // replace scrollbar to indent | заменяем скроллбар отступом
        paddingRight: umodalPageScrollWidth,
      // replace the scrolled distance with the 'top' property | заменяем прокрученное расстояние свойством 'top'
        top: -umodalScrollTop
      });
    // add an indent right to the umodal for the centering | добавляем также отступ справа umodal-окну для отцентровки
      $('.umodal_show').css({paddingRight: umodalPageScrollWidth});
    }, 200);

  // umodal
    var umodalTemp;
    var umodalId = $(this).attr('umodal-id');
    var umodalSrc = $(this).attr('umodal-src');
    var umodalHref = $(this).attr('href');
    var umodalContent = $(this).attr('umodal-content');
  // check for an image | проверяем, ведёт ли ссылка на изображение
    if ( umodalHref != undefined ) {
      var umodalDetectImage = umodalHref.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jpg|jpeg|png|bmp|gif|webp|ico|svg)((\?|#).*)?$)/i);
    }
  // opening a umodal embedded on the page | открытие встроенного на странцие umodal
    if ( umodalSrc == undefined && umodalDetectImage == null ) {
      $('.umodal[umodal-id="' + umodalId + '"]').addClass('umodal_show').hide().fadeIn(200);
      $('.umodal__close').click(function(){
        $(this).closest('.umodal').fadeOut(200, function(){$(this).removeClass('umodal_show')});
        umodalClose();
      });
    } else {
  // otherwise create umodal template | в ином случае создаём шаблон umodal-окна
      var umodalTemp = '<div class="umodal">' +
                        '<div class="umodal__inner">' +
                          '<button class="umodal__close"></button>' +
                          '<div class="umodal__content"></div>' +
                        '</div>' +
                      '</div>';
    // fade in the template at the end of the 'body' | плавно выводим шаблон в конце 'body'
      $(umodalTemp).appendTo('body').hide().addClass('umodal_show umodal_loading').fadeIn(200);
      var umodalCurrentContent = $('.umodal_show .umodal__content');
    // if there is no 'umodal-src', then load the image in the umodal | если нет 'umodal-src', то загружаем изображение в umodal
      if ( umodalSrc == undefined ) {
      // change the style of umodal to dark | меняем стиль umodal на тёмный
        $('.umodal_show').addClass('umodal_inverse umodal_image');
      // add an image in umodal | добавляем изображение в umodal
        umodalCurrentContent.html('<img src="' + umodalHref + '" class="umodal__image">');
        umodalCurrentContent.children('.umodal__image').on('load', function(){
        // when the image is loaded, smoothly show it | когда изображение загрузилось, плавно его показываем
          $('.umodal__image').addClass('umodal__image_show');
          setTimeout(function(){
          // remove the preloader | убираем прелоадер
            $('.umodal_show').removeClass('umodal_loading');
          },30)
        // update image dimensions | обновляем размеры изображения
          $(window).resize();
        });
      // if the image doesn't load, then output the message | если изображение не загрузилось, то выводим сообщение
        umodalCurrentContent.children('.umodal__image').on('error', function(){
          umodalCurrentContent.html('Не удалось загрузить изображение').fadeIn(200);
          $('.umodal_show').removeClass('umodal_loading');
        });
      } else if ( umodalContent != undefined ) {
        // if there is 'umodal-ontent', then load the content from the specified block | если есть 'umodal-ontent', то загружаем контент из указанного блока
        umodalCurrentContent.hide().load(umodalSrc + ' ' + umodalContent, function(response, status, xhr){
          if (status == 'error') {
            $(this).html('Не удалось загрузить содержимое: ' + xhr.status + ' ' + xhr.statusText);
          }
          $(this).fadeIn(200);
          $('.umodal_show').removeClass('umodal_loading');
        });
      } else {
      // if there is 'umodal-src' and no 'umodal-content', then load the content by link | если есть 'umodal-src' и нет 'umodal-content', то загружаем контент по ссылке
        umodalCurrentContent.hide();
        $.ajax({
          url: umodalSrc,
          type: 'GET',
          success: function(data){
            var inBody = data.replace(/\r\n|\r|\n/g,'').match('<body[^>]*>(.*?)<\/body>')[0];
            umodalCurrentContent.html(inBody).fadeIn(200);
            $('.umodal_show').removeClass('umodal_loading');
          },
          error: function(data) {
            umodalCurrentContent.html('Не удалось загрузить содержимое').fadeIn(200);
            $('.umodal_show').removeClass('umodal_loading');
          }
        });
      }
    // closing and removing the open umodal | закрытие и удаление открытого umodal
      $('.umodal_show .umodal__close').click(function(){
        $(this).closest('.umodal').fadeOut(200, function(){$(this).remove();});
        umodalClose();
      });
    }
    $('.umodal__close').attr('title', 'Закрыть [Esc]');
    // closing umodal on the key 'Esc' | закрытие umodal на клавишу 'Esc'
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        $('.umodal_show .umodal__close').click();
      };
    });
  });
})
