var fontsList = {
	'Georgia, serif': 'Georgia',
	'Palatino Linotype, Book Antiqua, Palatino, serif': 'Palatino Linotype',
	'Times New Roman, Times, serif': 'Times New Roman',
	'Arial, Helvetica, sans-serif': 'Arial',
	'Arial Black, Gadget, sans-serif': 'Arial Black',
	'Comic Sans MS, cursive, sans-serif': 'Comic Sans MS',
	'Impact, Charcoal, sans-serif': 'Impact',
	'Lucida Sans Unicode, Lucida Grande, sans-serif': 'Lucida Sans Unicode',
	'Tahoma, Geneva, sans-serif': 'Tahoma',
	'Trebuchet MS, Helvetica, sans-serif': 'Trebuchet MS',
	'Verdana, Geneva, sans-serif': 'Verdana',
	'Courier New, Courier, monospace': 'Courier New',
	'Lucida Console, Monaco, monospace': 'Lucida Console'
}
var dateFormats = {
	'dd.mm.yyyy': 'dd.mm.yyyy',
	'mm.dd.yyyy': 'mm.dd.yyyy',
	'yyyy.mm.dd': 'yyyy.mm.dd',
	'dd-mm-yyyy': 'dd-mm-yyyy',
	'mm-dd-yyyy': 'mm-dd-yyyy',
	'yyyy-mm-dd': 'yyyy-mm-dd',
	'dd/mm/yyyy': 'dd/mm/yyyy',
	'mm/dd/yyyy': 'mm/dd/yyyy',
	'yyyy/mm/dd': 'yyyy/mm/dd',
	'd M yyyy': 'd M yyyy',
	'd MM yyyy': 'd MM yyyy',
	'M d yyyy': 'M d yyyy',
	'MM d yyyy': 'MM d yyyy',
	'D M d yyyy': 'D M d yyyy',
	'DD MM d yyyy': 'DD MM d yyyy',
}
var sideMenuWidth = 300;

$(function() {
	$('#userForm').on('afterInit', function() {
		formEditorInit();
	});
});

function formEditorInit() {
		
	for (var e = 0; e < yiiParams.formElements.length; e++) {
		if (yiiParams.formElements[e].is_system == false) {
			var elementBtn = $(' \
				<div class="form-controls-element form-group col-md-12" data-element-id="' + yiiParams.formElements[e].id + '"> \
					<a class="btn btn-default btn-block" href="javascript: void(0);"> \
						<span class="glyphicon glyphicon-' + yiiParams.formElements[e].img + '"></span> \
						' + yiiParams.formElements[e].label + ' \
					</a> \
				</div> \
			');
			elementBtn.on('click', function() {
				var elemID = $(this).data('element-id');
				var formElement = getFormElementByID(elemID);
				var field = addNewFormElement(formElement);
				addFormElementControls(field, formElement.is_system);
			});
			$('#formElements .form-controls-page').append(elementBtn);
		}
	}
	
	for (var pageIdx = 0; pageIdx < yiiParams.form.form_elements.length; pageIdx++) {
		addFormPageControls(pageIdx, pageIdx == currentPageIdx);
		var page = $('.form-page[data-page-idx="' + pageIdx + '"]');
		
		for (var e = 0; e < yiiParams.form.form_elements[pageIdx].length; e++) {
			var elemID = yiiParams.form.form_elements[pageIdx][e].id;
			var number = yiiParams.form.form_elements[pageIdx][e].number;
			var formElement = getFormElementByID(elemID);
			var field = page.find('.form-element-group[data-elemid="' + elemID + '"][data-number="' + number + '"]');
			addFormElementControls(field, formElement.is_system);
		}
	}	
	updateFormPage();
	
	$('#btnAddPageForm').on('click', function() {
		var pageIdx = parseInt(currentPage.attr('data-page-idx'));
		yiiParams.form.form_elements.splice(pageIdx + 1, 0, []);
		
		addFormPageControls(pageIdx + 1, false);
		addFormPage(pageIdx + 1, false);
		updateFormPage();
		
		$('.btnPageLink[data-page-idx="' + (pageIdx + 1) + '"] a').trigger('click');
		
		if (yiiParams.form.form_elements.length > 1) {
			$('#btnRemovePageForm').removeClass('hidden');
		}
	});
	
	if (yiiParams.form.form_elements.length > 1) {
		$('#btnRemovePageForm').removeClass('hidden');
	}
	$('#btnRemovePageForm').on('click', function() {
		if (yiiParams.form.form_elements.length > 1) {
			
			var elems = currentPage.find('.form-element-group');
			if ($('#elementParams').hasClass('opened-controls') && elems.hasClass('selected')) {
				triggerMenu('#elementParams', false);
				$('#elementParams .form-controls-page').html('');
			}
			
			var pageIdx = parseInt(currentPage.attr('data-page-idx'));
			yiiParams.form.form_elements.splice(pageIdx, 1);
			$('.btnPageLink[data-page-idx="' + pageIdx + '"]').remove();
			$('.form-page[data-page-idx="' + pageIdx + '"]').remove();
			
			updateFormPage();
			
			$('.btnPageLink[data-page-idx="' + (pageIdx > 0 ? pageIdx - 1 : pageIdx) + '"] a').trigger('click');
			
			if (yiiParams.form.form_elements.length == 1) {
				$('#btnRemovePageForm').addClass('hidden');
			}
		}
	});

	for (var p = 0; p < yiiParams.formParams.length; p++) {
		var param = yiiParams.formParams[p];
		var field = getFormParamField(param);
		$('#formParams .form-controls-page').append(field);
	}
	
	for (var s = 0; s < yiiParams.formSettings.length; s++) {
		var setting = yiiParams.formSettings[s];
		if (setting.is_system == false) {
			var field = getFormSettingField(setting);
			$('#formSettings .form-settings-page').append(field);
			field.wrap('<div class="panel panel-default"></div>');
		}
	}
	
	$('.formelements-show-btn').on('click', function() {
		triggerMenu('#formElements');
	});
	
	$('.formparams-show-btn').on('click', function() {
		triggerMenu('#elementParams', false);
		triggerMenu('#formParams');
	});
	
	$('.form-controls .close').on('click', function() {
		var id = '#' + $(this).parent('.form-controls').attr('id');
		triggerMenu(id, false);
	});
	
	$('.formsettings-show-btn').on('click', function() {
		$('.form-settings#formSettings').addClass('active');
	});
	$('.formpublish-show-btn').on('click', function() {
		$('.form-settings#formPublish').addClass('active');
	});
	$('.form-settings .close').on('click', function() {
		$('.form-settings.active').removeClass('active');
	});
	
	$('#btnSaveForm').on('click', function() {
		var btn = $(this);
		buttonLoading(btn);
		
		var heights = $(".form-page").map(function() {
			return $(this).outerHeight();
		}).get();
		var maxHeight = Math.max.apply(null, heights);
		setFormSettingValue('form_height', maxHeight);
		
		$.ajax({
			url: yiiParams.editFormURL + '?id=' + yiiParams.form.id,
            type: 'POST',
            data: {
				Form: {
					form_params: JSON.stringify(yiiParams.form.form_params),
					form_settings: JSON.stringify(yiiParams.form.form_settings),
					form_elements: JSON.stringify(yiiParams.form.form_elements)
				},
				subModalForm: '1'
			},
            success: function(response) {
                var result = $(response).filter('#result').text();
				if (result == 'success') {
					$.pjax.reload('#settingsPjax0', {});
					
					buttonActive(btn);
				}
            }
        });
	});
	
	$('.form-pages').off('click.fc-nav', '.form-element-button-prev');
	$('.form-pages').off('click.fc-nav', '.form-element-button-next');
	$('.form-pages').on('click', '.form-element-group label, .form-element-group button', function(e) {
		e.preventDefault();
	});
	
	$('.form-pages').on('click', '.form-element-group', function(e) {
		if ($(this).hasClass('selected')) {
			$('.form-page .form-element-group').removeClass('selected');
			
			if ($('#elementParams').hasClass('opened-controls')) {
				triggerMenu('#elementParams', false);
				$('#elementParams .form-controls-page').html('');
			}
		} else {
		
			$('.form-page .form-element-group').removeClass('selected');
			$(this).addClass('selected');
			
			if ($('#elementParams').hasClass('opened-controls')) {
				$(this).find('.btnControlsProperties').triggerHandler('click');
			}
		
		}
	});
	
	
	/* drag'n'drop */
	var dragObject = {
		dropElem: null,
		elemType: null
	};
	
	function onMouseDown(e) {
	
		if (e.which != 1) return;
		
		var elem = e.target.closest('.form-element-wrapper, .btnPageLink');
		if (!elem) return;
		
		dragObject.elem = $(elem);
		
		if (dragObject.elem.hasClass('form-element-wrapper')) {
			dragObject.elemType = 'formElement';
		} else if (dragObject.elem.hasClass('btnPageLink')) {
			dragObject.elemType = 'pageBtn';
		}
		
		dragObject.downX = e.pageX;
		dragObject.downY = e.pageY;
		
		return false;
	}
	
	function onMouseMove(e) {
		if (!dragObject.elem) return;
	
		if (!dragObject.avatar) {
			var moveX = e.pageX - dragObject.downX;
			var moveY = e.pageY - dragObject.downY;
		
			if (Math.abs(moveX) < 5 && Math.abs(moveY) < 5) {
				return;
			}
		
			dragObject.avatar = createAvatar(e);
			if (!dragObject.avatar) {
				dragObject = {};
				return;
			}

			dragObject.shiftX = dragObject.downX - dragObject.elem.offset().left;
			dragObject.shiftY = dragObject.downY - dragObject.elem.offset().top;
		
			startDrag(e);
		}
	
		switch (dragObject.elemType) {
			
			case 'formElement':
			default:
				
				dragObject.avatar.offset({
					top: e.pageY - dragObject.shiftY
				});
				
				dropElem = findDroppable(e);
				if (dropElem != null && dropElem.hasClass('btnPageLink') && !dropElem.hasClass('active')) {
		
					$('.btnPageLink a:focus').trigger('blur');
					dropElem.find('a').trigger('click');
					transferElemToPage(dragObject.elem);
					
				} else if (dropElem == null || !dropElem.hasClass('btnPageLink')) {
					
					if (
						dropElem != null
						&& (dragObject.dropElem == null || !dragObject.dropElem.is(dropElem))
						&& !dropElem.is(dragObject.elem)
					) {
						dropEnter(dropElem);
					} else if (
						(dropElem == null && dragObject.dropElem != null) 
						|| (dragObject.dropElem != null && dropElem.is(dragObject.elem))
					) {
						dropLeave();
					}
					
				}
				
				break;
				
			case 'pageBtn':
				
				dragObject.avatar.offset({
					left: e.pageX - dragObject.shiftX
				});
				
				dropElem = findDroppable(e);
				if (
					dropElem != null
					&& (dragObject.dropElem == null || !dragObject.dropElem.is(dropElem))
					&& !dropElem.is(dragObject.elem)
				) {
					dropEnter(dropElem);
				} else if (
					(dropElem == null && dragObject.dropElem != null) 
					|| (dragObject.dropElem != null && dropElem.is(dragObject.elem))
				) {
					dropLeave();
				}
				
				break;
				
		}

		return false;
	}
	
	function dropEnter(dropElem) {
		dragObject.dropElem = dropElem;
		
		switch (dragObject.elemType) {
			
			case 'formElement':
			default:
				if (dragObject.elem.offset().top < dragObject.dropElem.offset().top) {
					swapElements(dragObject.elem, dragObject.dropElem, 'after');
				} else {
					swapElements(dragObject.elem, dragObject.dropElem, 'before');
				}
				break;
				
			case 'pageBtn':
				if (dragObject.elem.offset().left < dragObject.dropElem.offset().left) {
					swapPages(dragObject.elem, dragObject.dropElem, 'after');
				} else {
					swapPages(dragObject.elem, dragObject.dropElem, 'before');
				}
				break;
		
		}
	}
	
	function dropLeave() {
		dragObject.dropElem = null;
	}
	
	function onMouseUp(e) {
		if (dragObject.avatar) {
			finishDrag(e);
		}

		dragObject = {};
	}
	
	function finishDrag(e) {
		var dropElem = findDroppable(e);
		
		if (!dropElem) {
			dragCancel();
		} else {
			dragEnd(dropElem);
		}
		
		updateFormPage();
	}
	
	function createAvatar(e) {
		var avatar = dragObject.elem.clone();
		
		switch (dragObject.elemType) {
			
			case 'formElement':
			default:
				avatar.find('.element-controls-btn').off('click');
				$('.form-pages').append(avatar);				
				break;
				
			case 'pageBtn':
				dragObject.elem.parent().append(avatar);
				break;
			
		}

		avatar.css({
			position: 'absolute',
			width: dragObject.elem.width() + 'px',
			height: dragObject.elem.height() + 'px',
			opacity: 0.8,
			zIndex: 9999
		});	
		
		dragObject.elem.css({ opacity: 0 });
		
		return avatar;
	}
	
	function startDrag(e) {		
		dragObject.avatar.offset({ 
			top: dragObject.elem.offset().top, 
			left: dragObject.elem.offset().left
		});
	}
		
	function findDroppable(e) {
		dragObject.avatar.hide();
		var elem = document.elementFromPoint(e.clientX, e.clientY);
		dragObject.avatar.show();
		
		if (elem == null) {
			return null;
		}
		
		var droppable = null;
		switch (dragObject.elemType) {
			case 'formElement':
			default:
				droppable = $(elem).closest('.form-element-wrapper, .btnPageLink');
				break;
			case 'pageBtn':
				droppable = $(elem).closest('.btnPageLink');
				break;
		}
		return droppable.length ? droppable : null;
	}
	
	function dragEnd(dropElem) {
		dragCancel();
	}
	
	function dragCancel() {
		dropLeave();
		dragObject.avatar.remove();
		dragObject.elem.css({ opacity: '' });
	}
	
	function transferElemToPage(dragged) {
		var draggedElemID = dragged.children('.form-element-group').data('elemid');
		var draggedNumber = dragged.children('.form-element-group').data('number');
		var draggedPageIdx = parseInt(dragged.parents('.form-page').attr('id').split('_')[1]);
		
		var draggedIdx = getDraggedElemIdx(draggedElemID, draggedNumber, draggedPageIdx);
		
		var elem = yiiParams.form.form_elements[draggedPageIdx].splice(draggedIdx, 1)[0];
		yiiParams.form.form_elements[currentPageIdx].splice(0, 0, elem);
		currentPage.prepend(dragged);
	}
	
	function swapElements(dragged, target, dir) {
		var draggedElemID = dragged.children('.form-element-group').data('elemid');
		var draggedNumber = dragged.children('.form-element-group').data('number');
		var targetElemID = target.children('.form-element-group').data('elemid');
		var targetNumber = target.children('.form-element-group').data('number');

		var draggedIdx = getDraggedElemIdx(draggedElemID, draggedNumber, currentPageIdx);
		
		switch (dir) {
			
			case 'after':
			default:
				var elem = yiiParams.form.form_elements[currentPageIdx].splice(draggedIdx, 1)[0];
				var targetIdx = getTargetElemIdx(targetElemID, targetNumber, currentPageIdx);
				yiiParams.form.form_elements[currentPageIdx].splice(targetIdx + 1, 0, elem);
				target.after(dragged);
				break;
				
			case 'before':
				var elem = yiiParams.form.form_elements[currentPageIdx].splice(draggedIdx, 1)[0];
				var targetIdx = getTargetElemIdx(targetElemID, targetNumber, currentPageIdx);
				yiiParams.form.form_elements[currentPageIdx].splice(targetIdx, 0, elem);
				target.before(dragged);
				break;
				
		}
	}
	
	function getDraggedElemIdx(draggedElemID, draggedNumber, pageIdx) {
		var idx = 0;
		for (var e = 0; e < yiiParams.form.form_elements[pageIdx].length; e++) {
			var elemID = yiiParams.form.form_elements[pageIdx][e].id;
			var number = yiiParams.form.form_elements[pageIdx][e].number;
			
			if (elemID == draggedElemID && number == draggedNumber) {
				idx = e;
			}
		}
		return idx;
	}
	
	function getTargetElemIdx(targetElemID, targetNumber, pageIdx) {
		var idx = 0;
		for (var e = 0; e < yiiParams.form.form_elements[pageIdx].length; e++) {
			var elemID = yiiParams.form.form_elements[pageIdx][e].id;
			var number = yiiParams.form.form_elements[pageIdx][e].number;
			
			if (elemID == targetElemID && number == targetNumber) {
				idx = e;
			}
		}
		return idx;
	}
	
	function swapPages(dragged, target, dir) {
		var draggedIdx = dragged.attr('data-page-idx');
		var draggedPageIdx = $('.form-page[data-page-idx="' + draggedIdx + '"]').index('.form-page');
		var targetIdx = target.attr('data-page-idx');
		var targetPageIdx = $('.form-page[data-page-idx="' + targetIdx + '"]').index('.form-page');
		
		switch (dir) {
			
			case 'after':
			default:
				var page = yiiParams.form.form_elements.splice(draggedPageIdx, 1)[0];
				yiiParams.form.form_elements.splice(targetPageIdx, 0, page);
				target.after(dragged);
				$('.form-page').eq(targetPageIdx).after($('.form-page').eq(draggedPageIdx));
				break;
				
			case 'before':
				var page = yiiParams.form.form_elements.splice(draggedPageIdx, 1)[0];
				yiiParams.form.form_elements.splice(targetPageIdx, 0, page);
				target.before(dragged);
				$('.form-page').eq(targetPageIdx).before($('.form-page').eq(draggedPageIdx));
				break;
				
		}
	}
	
	function getDraggedPageIdx(pageIdx) {
		var idx = 0;
		for (var e = 0; e < yiiParams.form.form_elements[pageIdx].length; e++) {
			var elemID = yiiParams.form.form_elements[pageIdx][e].id;
			var number = yiiParams.form.form_elements[pageIdx][e].number;
			
			if (elemID == draggedElemID && number == draggedNumber) {
				idx = e;
			}
		}
		return idx;
	}
	
	function getTargetPageIdx(pageIdx) {
		var idx = 0;
		for (var e = 0; e < yiiParams.form.form_elements[pageIdx].length; e++) {
			var elemID = yiiParams.form.form_elements[pageIdx][e].id;
			var number = yiiParams.form.form_elements[pageIdx][e].number;
			
			if (elemID == targetElemID && number == targetNumber) {
				idx = e;
			}
		}
		return idx;
	}
	
	$(document).on('mousemove', onMouseMove);
	$(document).on('mouseup', onMouseUp);
	$(document).on('mousedown', onMouseDown);
	
	CP.each(function(p) {
		p.on('fit', function(p) {
			var tWidth = $(p.target).outerWidth();
			var tHeight = $(p.target).outerHeight();
			var wWidth = $(window).width();
			var wHeight = $(window).height();
			var pWidth = p.picker.offsetWidth;
			var pHeight = p.picker.offsetHeight;
			var left = $(p.target).offset().left;
			var top = $(p.target).offset().top + tHeight;
			left = (left + pWidth) > wWidth ? left - (left + pWidth - wWidth) : left;
			top = (top + pHeight) > wHeight ? top - (top + pHeight - wHeight) : top;
			p.picker.style.left = left + 'px';
			p.picker.style.top = top + 'px';
		});
	});

}

/* ADD FORM PAGE*/
function addFormPageControls(pageIdx, isActive) {
	var pageControls = $('.form-controls-pagelist .nav');
	var pageBtn = $('<li role="presentation" class="btnPageLink small"><a role="tab" data-toggle="pill"></a></li>');
	if ($('.btnPageLink').eq(pageIdx - 1).length) {
		$('.btnPageLink').eq(pageIdx - 1).after(pageBtn);
	} else {
		pageControls.append(pageBtn);
	}
	
	if (isActive) {
		pageBtn.addClass('active');
	}
	
	return pageControls;
}

/* UPDATE FORM PAGE */
function updateFormPage() {
	updateFormPageLinks();
	updateFormPageIdx();
	updateFormPageNavField();
	updateFormPageNav();
}
function updateFormPageLinks() {
	$('.btnPageLink').each(function(idx, elem) {
		$(elem).attr('data-page-idx', idx);
		var pageLabel = t('Page') + ' ' + (idx + 1);
		var a = $(elem).children('a');
		a.attr('href', '#page_' + idx);
		a.text(pageLabel);
	});
	
	$('.btnPageLink a').off('click');
	$('.btnPageLink a').on('click', function (e) {
		e.preventDefault();
		$(this).tab('show');
		
		var target = $(this).attr('href');
		currentPageIdx = parseInt($(this).parent().attr('data-page-idx'));
		currentPage = $('.form-page' + target);
	});
}
function updateFormPageNavField() {
	var navBtns = null;
	$('.form-page').each(function(idx, elem) {
		if ($('.form-page').length > 1) {
			
			if (!$(elem).find('.form-element-navigation_buttons').length) {
				var formElement = getFormElementByName('navigation_buttons');
				navBtns = addNewFormElement(formElement, idx);
			}
			
		} else {
			
			if ($(elem).find('.form-element-navigation_buttons').length) {
				navBtns = $(elem).find('.form-element-navigation_buttons');
				if ($('#elementParams').hasClass('opened-controls') && navBtns.hasClass('selected')) {
					triggerMenu('#elementParams', false);
					$('#elementParams .form-controls-page').html('');
				}

				removeFormElement(navBtns.data('elemid'), navBtns.data('number'), idx);
			}
			
		}
	});
	
	$('.form-page .form-element-navigation_buttons').each(function(idx, elem) {
		if (!$(elem).find('.form-element-controls').length) {
			var formElement = getFormElementByName('navigation_buttons');
			addFormElementControls($(elem), formElement.is_system);
		}
	});
}

/* ADD NEW FORM ELEMENT */
function addNewFormElement(formElement, pageIdx) {
	pageIdx = pageIdx != undefined ? pageIdx : currentPageIdx;
	
	var field = addFormElement(formElement, null, pageIdx);
	
	var elem = {
		id: field.data('elemid'),
		number: field.data('number'),
		params: {}
	};
	
	for (var p = 0; p < formElement.elementParams.length; p++) {
		var val = 
			formElement.elementParams[p].default_value != null 
			? formElement.elementParams[p].default_value
			: formElement.elementParams[p].param.default_value;
		elem.params[formElement.elementParams[p].param_id] = val;
		
		updateFormElement(field, elem, formElement, formElement.elementParams[p].param, val);
	}
	
	yiiParams.form.form_elements[pageIdx].push(elem);
	
	return field;
}

/* ADD FORM ELEMENT CONTROLS */
function addFormElementControls(field, isSystem) {		
	var controls = $(' \
		<div class="form-element-controls"> \
			<div class="element-controls-btn btnControlsProperties" title="' + t('Element Params') + '"><span class="glyphicon glyphicon-cog"></span></div> \
			' + (isSystem == false ? '<div class="element-controls-btn btnControlsDelete" title="' + t('Delete') + '"><span class="glyphicon glyphicon-remove"></span></div>' : '') + ' \
		</div> \
	');
	field.append(controls);
	
	if (isSystem == false) {
		controls.children('.btnControlsDelete').on('click', function(e) {
			e.stopPropagation();
			
			triggerMenu('#elementParams', false);
			$('#elementParams .form-controls-page').html('');
			
			var elem = $(this).parents('.form-element-group');
			removeFormElement(elem.data('elemid'), elem.data('number'));
		});
	}
	
	controls.children('.btnControlsProperties').on('click', function(e) {
		e.stopPropagation();

		triggerMenu('#formParams', false);
		
		$('#elementParams .form-controls-page').html('');
		
		var el = $(this).parents('.form-element-group');
		currentPage.find('.form-element-group').each(function(idx, elem) {
			if (el.is(elem)) {
				addFormElementParams($(elem), yiiParams.form.form_elements[currentPageIdx][idx]);
				return;
			}
		});

		triggerMenu('#elementParams');
	});
	
	return field;
}

function addFormElementParams(field, elem) {
	var formElement = getFormElementByID(elem.id);
	
	for (var p = 0; p < formElement.elementParams.length; p++) {
		var inputField = getElementParamField(field, elem, formElement, formElement.elementParams[p].param);
		$('#elementParams .form-controls-page').append(inputField);
	}
}

/* REMOVE FORM ELEMENT */
function removeFormElement(elemID, number, pageIdx) {
	pageIdx = pageIdx != undefined ? pageIdx : currentPageIdx;
	
	var page = $('.form-page[data-page-idx="' + pageIdx + '"]');
	var field = page.find('.form-element-group[data-elemid="' + elemID + '"][data-number="' + number + '"]');
	
	removeFromActiveForm(field);
	
	field.parent().remove();
	
	var result = $.grep(yiiParams.form.form_elements[pageIdx], function(elem, idx) { 
		return !(elem.id == elemID && elem.number == number); 
	});
	yiiParams.form.form_elements[pageIdx] = result;
}

/* FORM PARAMS */
function getFormParamField(param) {
	var field = $('<div class="form-param-group form-group col-md-12" />');
	field.append('<label class="form-param-label control-label" for="' + (param.name + '_' + param.id) + '">' + param.label + '</label>');
	
	var inputField;
	switch (param.name) {
		
		case 'page_color':
		case 'form_color':
		case 'font_color':
		case 'input_background':
		case 'input_text_color':
			
			inputField = getParamTextField(param);
			field.append(inputField);
			inputField.val(yiiParams.form.form_params[param.id]);
			
			var picker = new CP(inputField[0]);
			picker.on('change', function(color) {
				var val = '#' + color;
				inputField.val(val);
				
				updateFormParam(param, val);
				
				yiiParams.form.form_params[param.id] = val;
			});
			
			inputField.on('change input', function() {
				var val = $(this).val();
				if (isValidCSSColor(val)) {
					picker.set(val).enter();
					
					updateFormParam(param, val);
					
					yiiParams.form.form_params[param.id] = val;
				}
			});
			
			break;
			
		case 'success_color':
		case 'error_color':
			
			inputField = getParamTextField(param);
			field.append(inputField);
			inputField.val(yiiParams.form.form_params[param.id]);
			
			var picker = new CP(inputField[0]);			
			picker.on('change', function(color) {
				var val = '#' + color;
				inputField.val(val);
				
				updateFormParam(param, val);
				
				yiiParams.form.form_params[param.id] = val;
			});
			
			inputField.on('change input blur', function() {
				var val = $(this).val();
				if (isValidCSSColor(val) || !val) {
					if (val) {
						picker.set(val).enter();
					} else {
						picker.set(null).exit();
					}
				
					updateFormParam(param, val);
					
					yiiParams.form.form_params[param.id] = val;
				}
			});
			
			if (!yiiParams.form.form_params[param.id]) {
				setTimeout(function() {
					inputField.val('');
					updateFormParam(param, '');
					yiiParams.form.form_params[param.id] = '';
				}, 0);
			}
			
			break;
			
		case 'form_width':
		case 'question_spacing':
		case 'label_width':
		case 'font_size':
			
			inputField = getParamTextField(param);
			field.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();
				if (isValidCSSSize(val)) {	
					
					updateFormParam(param, val);

					yiiParams.form.form_params[param.id] = val;
				}
			});
			
			inputField.val(yiiParams.form.form_params[param.id]);
			
			break;

		case 'label_alignment':
			
			inputField = getParamSelectField(param, {'left': 'left', 'right': 'right', 'top': 'top'});
			field.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	
					
				updateFormParam(param, val);

				yiiParams.form.form_params[param.id] = val;
			});
			
			inputField.val(yiiParams.form.form_params[param.id]);
			
			break;
			
		case 'font':
			
			inputField = getParamSelectField(param, fontsList);
			
			for (var font in fontsList) {
				inputField.children("option[value='" + font + "']").css('font-family', font);
			}
			
			field.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();
				
				updateFormParam(param, val);

				yiiParams.form.form_params[param.id] = val;
			});
			
			inputField.val(yiiParams.form.form_params[param.id]);
			
			break;
			
		case 'required_sign':
			
			inputField = getParamSelectField(param, { 0: t('false'), 1: t('true') });
			field.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	
					
				updateFormParam(param, val);

				yiiParams.form.form_params[param.id] = val;
			});
			
			inputField.val(yiiParams.form.form_params[param.id]);
			
			break;
		
		default:
			break;
	}
	
	if (param.help_text) {
		field.append('<div class="form-param-help help-block small">' + param.help_text + '</div>');
	}
	
	return field;
}

/* FORM SETTINGS */
function getFormSettingField(setting) {
	var field = $('<div class="form-setting-group form-group panel-body" />');
	field.append('<label class="form-setting-label control-label" for="' + (setting.name + '_' + setting.id) + '">' + setting.label + '</label>');
	
	var inputField;
	switch (setting.name) {

		case 'submit_page':
			
			inputField = getParamHtmlField(setting);
			field.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();
				
				updateFormSetting(setting, val);

				yiiParams.form.form_settings[setting.id] = val;
			});
			
			inputField.val(yiiParams.form.form_settings[setting.id]);
			
			break;
			
		case 'form_active':
			
			inputField = getParamSelectField(setting, { 0: t('off'), 1: t('on') });
			field.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();
				
				updateFormSetting(setting, val);

				yiiParams.form.form_settings[setting.id] = val;
			});
			
			inputField.val(yiiParams.form.form_settings[setting.id]);
			
			break;
			
		case 'submit_email':
			
			inputField = getParamEmailField(setting);
			field.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();
				if (isValidEmail(val) || !val) {
					updateFormSetting(setting, val);
					yiiParams.form.form_settings[setting.id] = val;
				}
			});
			
			inputField.on('change blur', function() {
				var val = $(this).val();
				if (isValidEmail(val) || !val) {
					removeError(field);
				} else {
					addError(field, t('Wrong e-mail'));
				}
			});
			
			inputField.val(yiiParams.form.form_settings[setting.id]);
			
			break;
		
		default:
			break;
	}
	
	if (setting.help_text) {
		field.append('<div class="form-param-help help-block small">' + setting.help_text + '</div>');
	}
	
	field.append('<div class="form-param-help help-block error-block small hidden"></div>');
	
	return field;
}

/* ELEMENT PARAMS */
function getElementParamField(field, elem, formElement, param) {
	var formGroup = $('<div class="form-param-group form-group col-md-12" />');
	formGroup.append('<label class="form-param-label control-label" for="' + (param.name + '_' + param.id) + '">' + param.label + '</label>');
	
	var inputField;
	switch (param.name) {
		
		case 'label_text':
		case 'button_text':
		case 'header_text':
		case 'back_button_text':
		case 'next_button_text':
			
			inputField = getParamTextField(param);
			formGroup.append(inputField);
			
			inputField.off('change input');
			inputField.on('change input', function() {
				var val = $(this).val();
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'separator_color':
			
			inputField = getParamTextField(param);
			formGroup.append(inputField);
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			var picker = new CP(inputField[0]);
			picker.on('change', function(color) {
				var val = '#' + color;
				inputField.val(val);
				
				updateFormElement(field, elem, formElement, param, val);
				
				elem.params[param.id] = val;
			});
			
			inputField.on('change input', function() {
				var val = $(this).val();
				if (isValidCSSColor(val)) {
					picker.set(val).enter();
					
					updateFormElement(field, elem, formElement, param, val);

					elem.params[param.id] = val;
				}
			});
			
			break;
			
		case 'button_alignment':
		case 'header_alignment':
		case 'img_alignment':
			
			inputField = getParamSelectField(param, { 'left': t('left'), 'center': t('center'), 'right': t('right') });
			formGroup.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'html_content':
			
			inputField = getParamHtmlButtonField(param);
			formGroup.append(inputField);
			
			var id = '#' + param.name + '_' + param.id;
			inputField.off('change input', id);
			inputField.on('change input', id, function() {
				var val = $(this).val();
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.find(id).on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.find(id).trigger('paramchange');
			
			break;
			
		case 'options_list':
		case 'radios_list':
		case 'checkboxes_list':
			
			inputField = getParamTextAreaField(param);
			formGroup.append(inputField);
			
			inputField.off('change input');
			inputField.on('change input', function() {
				var val = $(this).val();
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'upload_img':
			
			inputField = getParamImageField(param);
			formGroup.append(inputField);
			
			var id = '#' + param.name + '_' + param.id;
			inputField.off('change input', id);
			inputField.on('change input', id, function() {
				var val = $(this).val();
					
				updateFormElement(field, elem, formElement, param, val, true);

				elem.params[param.id] = val;
				
				updateButtonsState(inputField);
			});
			
			inputField.find(id).on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.find(id).trigger('paramchange');
			
			function updateButtonsState(inputField) {
				var val = inputField.find(id).val();
				var btn = inputField.children(id + '_btn');
				var removeBtn = inputField.children(id + '_remove');
				if (val) {
					btn.addClass('hidden');
					removeBtn.removeClass('hidden');
				} else {
					removeBtn.addClass('hidden');
					btn.removeClass('hidden');
				}
			}
			updateButtonsState(inputField);
			
			break;
			
		case 'img_width':
		case 'img_height':
			
			inputField = getParamTextField(param);
			formGroup.append(inputField);
			
			inputField.off('change input');
			inputField.on('change input', function() {
				var val = $(this).val();
				if (isValidCSSSize(val)) {					
					
					updateFormElement(field, elem, formElement, param, val);
					
					elem.params[param.id] = val;
				}
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'date_format':
			
			inputField = getParamSelectField(param, dateFormats);
			formGroup.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'date_firstweekday':
			
			inputField = getParamSelectField(param, { 0: t('sunday'), 1: t('monday') });
			formGroup.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'time_format':
			
			inputField = getParamSelectField(param, {'24 hours': t('24 hours'), 'AM/PM': 'AM/PM'});
			formGroup.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'time_minute_stepping':
			
			inputField = getParamSelectField(param, {'1': '1', '5': '5', '10': '10', '15': '15', '30': '30'});
			formGroup.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'back_button_visible':
			
			inputField = getParamSelectField(param, { '0': t('hide'), '1': t('show') });
			formGroup.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'nav_button_alignment':
			
			inputField = getParamSelectField(param, { 
				'left': t('left'), 
				'center': t('center'), 
				'right': t('right'), 
				'distribute': t('distribute') 
			});
			formGroup.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	
					
				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'required':
			
			inputField = getParamSelectField(param, { 0: t('false'), 1: t('true') });
			formGroup.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	

				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
			
		case 'input_validation':
			
			inputField = getParamSelectField(param, { 
				'': t('none'), 
				'alphabetic': t('letters only'),
				'numeric': t('numbers only'),
			});
			formGroup.append(inputField);
			
			inputField.on('change input', function() {
				var val = $(this).val();	

				updateFormElement(field, elem, formElement, param, val);

				elem.params[param.id] = val;
			});
			
			inputField.on('paramchange', function() {
				$(this).val(elem.params[param.id]);
			});
			inputField.trigger('paramchange');
			
			break;
		
		default:
			break;
	}

	if (param.help_text) {
		formGroup.append('<div class="form-param-help help-block small">' + param.help_text + '</div>');
	}
	
	return formGroup;
}

/* FORM PARAMS */
function getParamTextField(param) {
	var id = param.name + '_' + param.id;
	var textField = $('<input type="text" class="form-control" name="' + id + '" id="' + id + '" />');
	
	return textField;
}

function getParamEmailField(param) {
	var id = param.name + '_' + param.id;
	var emailField = $('<input type="email" class="form-control" name="' + id + '" id="' + id + '" placeholder="email@example.com" />');
	
	return emailField;
}

function getParamTextAreaField(param) {
	var id = param.name + '_' + param.id;
	var textField = $('<textarea class="form-control" name="' + id + '" id="' + id + '" rows="3" style="resize: none;"></textarea>');
	
	return textField;
}

function getParamSelectField(param, options) {
	var id = param.name + '_' + param.id;
	var textField = $('<select class="form-control" name="' + id + '" id="' + id + '"></select>');
	for (var val in options) {
		var opt = $('<option value="' + val + '">' + options[val] + '</option>');
		textField.append(opt);
	}
	
	return textField;
}

function getParamHtmlButtonField(param) {
	var id = param.name + '_' + param.id;
	
	var htmlField = $('<div></div>');
	var textArea = $('<textarea class="hidden" name="' + id + '" id="' + id + '"></textarea>');
	htmlField.append(textArea);
	
	var btn = $('<button type="button" id="' + id + '_btn" class="btn btn-default" name="' + id + '_btn" value="1">' + t('Edit...') + '</button>');
	htmlField.append(btn);
	
	btn.on('click', function() {
		var content = $('<div></div>');
		
		$('#' + id + '_mce').remove();
		
		var mce = textArea.clone();
		mce.attr('id', id + '_mce');
		mce.val(textArea.val());
		mce.wrap('<div class="form-group"></div>');
		content.append(mce.parent('.form-group'));
		
		var saveID = id + '_save';
		var saveBtn = $('<div class="form-group text-right"><button type="button" id="' + saveID + '" class="btn btn-primary" name="' + saveID + '" value="1">' + t('Save') + '</button></div>');
		content.append(saveBtn);
		
		saveBtn.find('#' + saveID).off('click');
		saveBtn.find('#' + saveID).on('click', function() {
			tinymce.get(id + '_mce').save();
			
			var val = $('#' + id + '_mce').val();
			$('#' + id).val(val);
			$('#' + id).trigger('change');
			
			$('#modal').modal('hide');
		});
		
		$('#modal').find('.modal-title').html(t('Edit Content'));
		showModal('#modal', content, 'large');
		
		tinymce.init({
			selector: '#' + id + '_mce'
		});
	});
	
	return htmlField;
}

function getParamHtmlField(param) {
	var id = param.name + '_' + param.id;

	var htmlField = $('<textarea name="' + id + '" id="' + id + '"></textarea>');
		
	tinymce.init({
		selector: '#' + id,
		setup: function(editor) {
			editor.on('change input', function() {
				editor.save();
				htmlField.trigger('change');
			});
		}
	});
	
	return htmlField;
}

function getParamImageField(param) {
	var id = param.name + '_' + param.id;
	
	var imageField = $('<div></div>');
	var inputField = $('<input type="text" class="hidden" name="' + id + '" id="' + id + '" />');
	imageField.append(inputField);
	
	var btn = $('<button type="button" id="' + id + '_btn" class="btn btn-default" name="' + id + '_btn" value="1">' + t('Choose Image...') + '</button>');
	imageField.append(btn);
	var removeBtn = $('<button type="button" id="' + id + '_remove" class="btn btn-link hidden" name="' + id + '_remove" value="1">' + t('Remove Image') + '</button>');
	imageField.append(removeBtn);
	
	removeBtn.on('click', function() {
		$('#' + id).val('');
		$('#' + id).trigger('change');
	});
	
	btn.on('click', function() {
		var content = $('<div></div>');
		content.html(' \
			<ul class="nav nav-tabs" role="tablist"> \
				<li class="active"><a href="#tabUploadImage" aria-controls="upload image" role="tab" data-toggle="tab">' + t('Upload') + '</a></li> \
				<li><a href="#tabImageBrowse" aria-controls="browse image" role="tab" data-toggle="tab">' + t('Uploaded') + '</a></li> \
				<li><a href="#tabImageLink" aria-controls="link" role="tab" data-toggle="tab">' + t('Link') + '</a></li> \
			</ul> \
			\
			<div class="tab-content"> \
				<div role="tabpanel" class="tab-pane active" id="tabUploadImage"></div> \
				<div role="tabpanel" class="tab-pane" id="tabImageBrowse"></div> \
				<div role="tabpanel" class="tab-pane" id="tabImageLink"></div> \
			</div> \
		');
		
		
		var imgUpload = $('<div class="drop-file-block"><div class="upload-progress-bar"></div></div>');
		var uploadBtnID = id + '_upload';
		var uploadBlock = $(' \
			<div class="form-group upload-btn"> \
				<input type="file" class="btn btn-default" accept="image/*" name="ImageUpload[imageFile]" id="' + uploadBtnID + '" value="Upload..." /> \
				<p class="help-block help-block-error upload-status">' + t('or drag & drop the file in this area') + '</p> \
			</div> \
		');
		var uploadBtn = uploadBlock.children('#' + uploadBtnID);
		imgUpload.append(uploadBlock);
		content.find('#tabUploadImage').append(imgUpload);
		
		uploadBtn.fileupload({
			url: yiiParams.uploadImageURL + '?id=' + yiiParams.form.id,
			dataType: 'json',
			dropZone: imgUpload,
			
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				imgUpload.children('.upload-progress-bar').css('width', progress + '%');
			},
			
			add: function (e, data) {
				imgUpload.children('.upload-progress-bar').css('width', '0%');
				
				var uploadErrors = [];
				var acceptFileTypes = /^image\/(gif|jpe?g|png|bmp)$/i;
				if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
					uploadErrors.push(t('File type not allowed'));
				}
				if (data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > 1024 * 1024) {
					uploadErrors.push(t('Max file size exceeded'));
				}
				if (uploadErrors.length > 0) {
					updateStatus(uploadErrors.join('; '), true);
				} else {
					
					updateStatus(t('Loading') + '...');
					data.submit();
					
				}
			},
			
			fail: function (e, data) {
				updateStatus(data.textStatus, true);
			},
			
			done: function (e, data) {
				if (data.result.error.status) {
					updateStatus(data.result.error.text, true);
				} else {
					
					$('#' + id).val(data.result.file);
					$('#' + id).trigger('change');
					
					$('#modal').modal('hide');
					
				}
			}
		});
		
		
		var imageBrowse = $('<div class="image-browse-block row form-group" />');
		content.find('#tabImageBrowse').append(imageBrowse);
		
		var loader = $('<div class="loader" id="loader_imageBrowse"></div>');
		imageBrowse.html(loader.show());
		
		var useBtnID = id + '_use';
		var deleteBtnID = id + '_delete';
		var imageBrowseBtns = $(' \
			<div class="form-group text-right"> \
				<button type="button" id="' + deleteBtnID + '" class="btn btn-danger pull-left hidden" name="' + deleteBtnID + '">' + t('Delete') + '</button> \
				<button type="button" id="' + useBtnID + '" class="btn btn-primary hidden" name="' + useBtnID + '">' + t('Choose') + '</button> \
			</div> \
		');
		content.find('#tabImageBrowse').append(imageBrowseBtns);
		var useBtn = imageBrowseBtns.find('#' + useBtnID);
		var deleteBtn = imageBrowseBtns.find('#' + deleteBtnID);
		
		content.find('a[href="#tabImageBrowse"]').off('show.bs.tab');
		content.find('a[href="#tabImageBrowse"]').on('show.bs.tab', function (e) {
			imageBrowse.html(loader.show());
			
			updateImageBrowse();
		});
		
		imageBrowse.on('click', '.image-link', function() {
			imageBrowse.find('.image-link').removeClass('active');
			$(this).addClass('active');
			
			imageBrowseBtns.find('.btn').removeClass('disabled hidden');
			imageBrowseBtns.find('.btn').prop('disabled', false);
		});
		
		deleteBtn.off('click');
		deleteBtn.on('click', function() {
			var imageID = imageBrowse.find('.image-link.active').data('file-id');
			
			if (imageID) {
				imageBrowse.html(loader.show());
				
				imageBrowseBtns.find('.btn').addClass('disabled hidden');
				imageBrowseBtns.find('.btn').prop('disabled', true);
				
				$.ajax({
					url: yiiParams.imageDeleteURL + '?id=' + imageID,
					type: 'POST',
					success: function(response) {
						updateImageBrowse();
					}
				});
			}
			
		});
		
		useBtn.off('click');
		useBtn.on('click', function() {
			
			var val = imageBrowse.find('.image-link.active').data('file-src');
			
			if (val) {
				$('#' + id).val(val);
				$('#' + id).trigger('change');
				
				$('#modal').modal('hide');
			}
			
		});
		
		
		var linkID = id + '_link';
		var linkField = $(' \
			<div class="form-group"> \
				<label for="' + linkID + '">' + t('HTTP Link to Image') + '</label> \
				<input type="text" class="form-control" name="' + linkID + '" id="' + linkID + '" placeholder="http://"/> \
			</div> \
		');
		content.find('#tabImageLink').append(linkField);
		
		var saveID = id + '_save';
		var saveBtn = $('<div class="form-group text-right"><button type="button" id="' + saveID + '" class="btn btn-primary" name="' + saveID + '">' + t('Choose') + '</button></div>');
		content.find('#tabImageLink').append(saveBtn);
		
		saveBtn.find('#' + saveID).off('click');
		saveBtn.find('#' + saveID).on('click', function() {
			
			var val = $('#' + linkID).val();
			$('#' + id).val(val);
			$('#' + id).trigger('change');
			
			$('#modal').modal('hide');
			
		});
		
		
		$('#modal').find('.modal-title').html(t('Choose Image'));
		showModal('#modal', content);
		
		function updateImageBrowse() {
			var imageBrowseBlock = content.find('.image-browse-block');
			imageBrowseBlock.find('.image-link').removeClass('active');
			
			imageBrowseBtns.find('.btn').addClass('disabled hidden');
			imageBrowseBtns.find('.btn').prop('disabled', true);
			
			$.ajax({
				url: yiiParams.imageBrowseURL + '?id=' + yiiParams.form.id,
				type: 'POST',
				success: function(response) {
					imageBrowseBlock.html(response);
				}
			});
		}
		
		function updateStatus(statusText, isError) {
			isError = isError || false;
			
			var uploadStatus = uploadBlock.find('.upload-status');
			if (!isError) {
				uploadBlock.removeClass('has-error');
			} else {
				uploadBlock.addClass('has-error');
			}
			uploadStatus.text(statusText);
		}
	});
	
	return imageField;
}

function triggerMenu(menuSelector, isShown) {
	isShown = isShown != undefined ? isShown : true;
	
	if (isShown) {
		$(menuSelector).addClass('opened-controls');
	} else {
		$(menuSelector).removeClass('opened-controls');
	}

	var menuWidth = 
		$('.left-controls').hasClass('opened-controls') && $('.right-controls').hasClass('opened-controls')
		? sideMenuWidth * 2
		: sideMenuWidth; 
	var width = $('.form-controls').hasClass('opened-controls') ? 'calc(100% - ' + menuWidth + 'px)' : '';
	$('.form-wrapper').css({
		width: width,
		marginLeft: $('.left-controls').hasClass('opened-controls') ? sideMenuWidth + 'px' : '',
		marginRight: $('.right-controls').hasClass('opened-controls') ? sideMenuWidth + 'px' : ''
	});
}

function addError(field, msg) {
	field.addClass('has-error');
	
	var helpBlock = field.find('.help-block');
	if (helpBlock.length) {
		helpBlock.addClass('hidden');
	}
	
	var errorBlock = field.find('.error-block');
	if (errorBlock.length && msg) {
		errorBlock.text(msg);
		errorBlock.removeClass('hidden');
	}
}

function removeError(field) {
	field.removeClass('has-error');
	
	var helpBlock = field.find('.help-block');
	if (helpBlock.length) {
		helpBlock.removeClass('hidden');
	}
	
	var errorBlock = field.find('.error-block');
	if (errorBlock.length) {
		errorBlock.text('');
	}
}