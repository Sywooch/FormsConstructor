var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

function buttonLoading(btn) {
	if (btn.children('.glyphicon').length) {
		btn.children('.glyphicon').addClass('hidden');
	}
	btn.prepend('<span class="glyphicon glyphicon-cog glyphicon-btn-loading"></span>');
	btn.addClass('disabled');
	btn.prop('disabled', true);
}
	
function buttonActive(btn) {
	btn.children('.glyphicon-btn-loading').remove();
	btn.removeClass('disabled');
	btn.prop('disabled', false);
	if (btn.children('.glyphicon').length) {
		btn.children('.glyphicon').removeClass('hidden');
	}
}

function showModal(selector, content, size) {
	size = size == undefined ? '' : size;
	
	$(selector).find('.modal-body').html(content);
	
	var dialog = $(selector).find('.modal-dialog');
	dialog.removeClass('modal-sm modal-lg');
	switch (size) {
		case 'small':
			dialog.addClass('modal-sm');
			break;
		case 'large':
			dialog.addClass('modal-lg');
			break;
		default:
			break;
	}
	
    $(selector).modal('show');
}

function isValidEmail(value) {
	value = $.trim(value);
	
	var valid = true,
        regexp = /^((?:"?([^"]*)"?\s)?)(?:\s+)?(?:(<?)((.+)@([^>]+))(>?))$/,
        matches = regexp.exec(value);

    if (matches === null) {
        valid = false;
    } else {
        var localPart = matches[5],
            domain = matches[6];

        if (localPart.length > 64) {
            valid = false;
        } else if ((localPart + '@' + domain).length > 254) {
            valid = false;
        }
    }
	
	return valid;
}

function isValidCSSColor(color) {
	var $div = $("<div>");
	$div.css("border", "1px solid " + color);
	return $div.css("border-color") != "";
}

function isValidCSSSize(size) {
	return /^(auto|0)$|^[+-]?[0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)$/.test(size);
}

function isValidURL(str) {
	var pattern = new RegExp(/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i);
	return pattern.test(str);
}

function ifImageExists(src, exists, notExists) {		
	var img = new Image();
	img.onload = exists;
	img.onerror = notExists;
	img.src = src;
}

$(function() {
	
	if ($.pjax) {
		
		$.pjax.defaults.timeout = 5000;
		
		$(document).on('pjax:timeout', function(e) {
			e.preventDefault();
		});
		
		$(document).on('pjax:send', function(e) {
			var pjaxID = e.target.id;
			$('#loader_' + pjaxID).show();
		});
		$(document).on('pjax:complete', function(e) {
			var pjaxID = e.target.id;
			$('#loader_' + pjaxID).hide();
		});
		
	}
	
	$('#modal').off('hidden.bs.modal');
	$('#modal').on('hidden.bs.modal', function() {
		$(this).find('.mce-tinymce').remove();
		$(this).find('.modal-title').html('');
		$(this).find('.modal-body').html('');
	});
	
	$('#modal').off('shown.bs.modal');
	$('#modal').on('shown.bs.modal', function() {
		$('*[autofocus]').focus();
	});
	
});