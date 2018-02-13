$(function() {
	
	$('.container').on('click', '.form-publish .btn-copy-content', function() {
		var content = $(this).parents('.form-publish-group').find('.form-publish-content').val();
		
		var temp = $('<input />');
		$('body').append(temp);
		temp.val(content).select();
		document.execCommand('copy');
		temp.remove();
	});
	
});