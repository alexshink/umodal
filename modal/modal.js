$('.modal__open').click(function(e){
	e.preventDefault();
	$('.page').toggleClass('page_modal');
	var modalTemp;
	var modalSrc = $(this).attr('modal-src');
	var modalContent = $(this).attr('modal-content');
	if (typeof modalSrc !== typeof undefined && modalSrc !== false) {
		var modalTemp = '<div class="modal">' +
											'<div class="modal__inner">' +
												'<button class="modal__close"></button>' +
												'<div class="modal__content"></div>' +
											'</div>' +
										'</div>';
		$(modalTemp).appendTo('.page').hide().addClass('modal_show modal_loading').fadeIn(200);
		$('.modal_show .modal__content').hide().load(modalSrc + ' ' + modalContent, function(response, status, xhr){
			if (status == 'error') {
				$(this).append('Не удалось загрузить содержимое: ' + xhr.status + ' ' + xhr.statusText);
			}
			$(this).fadeIn(200);
			$('.modal_show').removeClass('modal_loading');
		});
		$('.modal_show .modal__close').click(function(){
			$(this).closest('.modal').fadeOut(200, function(){$(this).remove();})
		});
	} else {
		$(this).next().addClass('modal_show').hide().fadeIn(200);
		$('.modal__close').click(function(){
			$(this).closest('.modal').fadeOut(200, function(){$(this).removeClass('modal_show');})
		})
	}
	$('.modal__close').attr('title', 'Закрыть [Esc]')
	// escape key
	$(document).keyup(function(e) {
		if (e.keyCode === 27) {
			$('.modal_show .modal__close').click();
		}
	});
});