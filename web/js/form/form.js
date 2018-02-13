var currentPageIdx = 0;
var currentPage = null;

var designMode = $('.formpage').hasClass('construct-mode');

yiiParams.form.form_params = JSON.parse(yiiParams.form.form_params);
yiiParams.form.form_settings = JSON.parse(yiiParams.form.form_settings);
yiiParams.form.form_elements = JSON.parse(yiiParams.form.form_elements);

$(function() {
	$('#userForm').on('afterInit', function() {
		formInit();
	});
});

function formInit() {
	
	if (window.frameElement != null) {
		$('.wrap').addClass('iframe');
	}
	
	var formActive = parseInt(getFormSettingValue('form_active'));
	if (!designMode && (!formActive || yiiParams.submitted)) {
		
		if (!formActive) {
			$('.form-pages').html(' \
				<div class="alert alert-danger col-md-6 col-md-offset-3">\
					<span class="glyphicon glyphicon-info-sign"></span> \
					' + t('Sorry, this form is currently unavailable.') + ' \
				</div> \
			');
		} else {
			var submitPage = getFormSettingValue('submit_page');
			currentPage = addFormPage(0, true);
			currentPage.html(submitPage);
		}
		
	} else {
		
		for (var pageIdx = 0; pageIdx < yiiParams.form.form_elements.length; pageIdx++) {
			
			currentPage = addFormPage(pageIdx, pageIdx == currentPageIdx);
			
			for (var e = 0; e < yiiParams.form.form_elements[pageIdx].length; e++) {
				var elemID = yiiParams.form.form_elements[pageIdx][e].id;
				var number = yiiParams.form.form_elements[pageIdx][e].number;
				var formElement = getFormElementByID(elemID);
				var field = addFormElement(formElement, number);
				
				for (var p = 0; p < formElement.elementParams.length; p++) {
					var param_id = formElement.elementParams[p].param_id;
					var val = yiiParams.form.form_elements[pageIdx][e].params[param_id];
					updateFormElement(field, yiiParams.form.form_elements[pageIdx][e], formElement, formElement.elementParams[p].param, val);
				}
			}
		}
		
		currentPage = $('.form-page').eq(0);
		
		updateFormPageIdx();
		updateFormPageNav();
		
		$('.form-pages').on('click.fc-nav', '.form-element-button-prev', function() {
			var page = $(this).parents('.form-page');
			var pageIdx = parseInt(page.data('page-idx'));
			if (pageIdx > 0) {
				page.removeClass('active');
				$('.form-page[data-page-idx="' + (pageIdx - 1) + '"]').addClass('active');
			}
		});
		
		$('.form-pages').on('click.fc-nav', '.form-element-button-next', function() {
			var page = $(this).parents('.form-page');
			var pageIdx = parseInt(page.data('page-idx'));
			if (pageIdx < $('.form-page').length - 1) {
				
				var valid = true;
				var fieldsToValidate = [];
				page.find('.form-element-group .form-element-field').each(function(idx, elem) {
					if (!elem.hasAttribute('donotvalidate')) {
						var id = $(elem).attr('id');
						var field = $('#userForm').yiiActiveForm('find', id);
						if (field) {
							fieldsToValidate.push(field);
						}
					}
				});
				var cnt = fieldsToValidate.length;
				
				if (!cnt) {
					turnPage();
				} else {
					
					$('#userForm').off('afterValidateAttribute');
					fieldsToValidate.forEach(function(elem, idx) {
						$('#userForm').on('afterValidateAttribute', function (e, attr, messages) {
							if (attr.id == elem.id && attr.status == 3) {
								if (messages.length > 0) {
									valid = false;
								}
								cnt--;
							}
						});
						$('#userForm').yiiActiveForm('validateAttribute', elem.id);
					});
					
					var pending = setInterval(function() {
						if (!cnt) {
							if (valid) {
								turnPage();
							}
							
							clearInterval(pending);
							pending = null;
						}
					}, 100);
				}
				
				function turnPage() {
					page.removeClass('active');
					$('.form-page[data-page-idx="' + (pageIdx + 1) + '"]').addClass('active');
				}
			}
		});
	
	}
	
	var formParamsStyle = $('<style id="formParamsStyle"></style>');
	$('head').append(formParamsStyle);
	var formElementsStyle = $('<style id="formElementsStyle"></style>');
	$('head').append(formElementsStyle);
	
	for (var s = 0; s < yiiParams.formSettings.length; s++) {
		var setting = yiiParams.formSettings[s];
		var val = yiiParams.form.form_settings[setting.id];
		updateFormSetting(setting, val);
	}
	
	if (designMode || (!designMode && formActive)) {
		for (var p = 0; p < yiiParams.formParams.length; p++) {
			var param = yiiParams.formParams[p];
			var val = yiiParams.form.form_params[yiiParams.formParams[p].id];
			updateFormParam(param, val);
		}
	}
	
}

/* ADD FORM PAGE*/
function addFormPage(pageIdx, isActive) {
	var page = $('<div class="form-page tab-pane" role="tabpanel"></div>');
	if ($('.form-page').eq(pageIdx - 1).length) {
		$('.form-page').eq(pageIdx - 1).after(page);	
	} else {
		$('.form-pages').append(page);
	}
	
	if (isActive) {
		page.addClass('active');
	}
	
	return page;
}

/* UPDATE FORM PAGE */
function updateFormPageIdx() {
	$('.form-page').each(function(idx, elem) {
		$(elem).attr('id', 'page_' + idx);
		$(elem).attr('data-page-idx', idx);
		$(elem).data('page-idx', idx);
	});
	
	currentPageIdx = currentPage.data('page-idx');
}
function updateFormPageNav() {
	$('.form-page').each(function(idx, elem) {
		if ($('.form-page').length > 1) {
			
			var navBtns = $(elem).find('.form-element-navigation_buttons');
			var id = navBtns.data('elemname') + '_' + navBtns.data('elemid') + '_' + navBtns.data('number');
			if (idx == 0) {
				if (navBtns.find('.form-element-button-prev').length) {
					navBtns.find('.form-element-button-prev').remove();
				}
				if (!navBtns.find('.form-element-button-next').length) {
					navBtns.find('.btn-toolbar').append(getNextBtn(id));
				}
			} else if (idx == $('.form-page').length - 1) {
				if (navBtns.find('.form-element-button-next').length) {
					navBtns.find('.form-element-button-next').remove();
				}
				if (!navBtns.find('.form-element-button-prev').length) {
					navBtns.find('.btn-toolbar').prepend(getPrevBtn(id));
				}
			} else {
				if (!navBtns.find('.form-element-button-prev').length) {
					navBtns.find('.btn-toolbar').prepend(getPrevBtn(id));
				}
				if (!navBtns.find('.form-element-button-next').length) {
					navBtns.find('.btn-toolbar').append(getNextBtn(id));
				}
			}

			var formElement = getFormElementByName('navigation_buttons');
			for (var p = 0; p < formElement.elementParams.length; p++) {
				var param_id = formElement.elementParams[p].param_id;
				var e = function(elemID, number, pageIdx) {
					for (var el = 0; el < yiiParams.form.form_elements[pageIdx].length; el++) {
						if (elemID == yiiParams.form.form_elements[pageIdx][el].id && number == yiiParams.form.form_elements[pageIdx][el].number) {
							return el;
						}
					}
				}(navBtns.data('elemid'), navBtns.data('number'), idx);
				var val = yiiParams.form.form_elements[idx][e].params[param_id];
				updateFormElement(navBtns, yiiParams.form.form_elements[idx][e], formElement, formElement.elementParams[p].param, val);
			}
			
		}
	});
}

/* ADD FORM ELEMENT */
function addFormElement(elem, number, pageIdx) {
	number = number != undefined ? number : null;
	
	var page = pageIdx != undefined ? $('.form-page[data-page-idx="' + pageIdx + '"]') : currentPage;
	
	if (number == null) {
		number = 
			$('.form-element-' + elem.name).length 
			? Math.max.apply(Math, $.map($('.form-element-' + elem.name).toArray(), function(el) {
				return $(el).data('number');
			})) + 1 
			: 0;
	}
	
	var id = elem.name + '_' + elem.id + '_' + number;
	var field = $('<div class="form-element-group form-group form-element-' + elem.name + ' form-element-' + elem.name + '-' + number + '" data-elemid="' + elem.id + '" data-number="' + number + '" data-elemname="' + elem.name + '" />');
	switch (elem.name) {
		
		case 'header':
			getFormHeader(field, id);
			break;
		
		case 'text_field':
			getFormTextField(field, id);
			break;
			
		case 'text_area':
			getFormTextArea(field, id);
			break;
			
		case 'content_block':
			getFormContentBlock(field, id);
			break;
			
		case 'select_field':
			getFormSelectField(field, id);
			break;
			
		case 'radio_field':
			getFormRadioBlock(field, id);
			break;
			
		case 'checkbox_field':
			getFormCheckboxBlock(field, id);
			break;
		
		case 'date_field':
			getFormDateField(field, id);
			break;
			
		case 'time_field':
			getFormTimeField(field, id);
			break;
		
		case 'image':
			getFormImage(field, id);
			break;
		
		case 'separator':
			getFormSeparator(field, id);
			break;
			
		case 'submit_button':
			getFormSubmit(field, id);
			break;
			
		case 'navigation_buttons':
			getFormNavigation(field, id);
			break;
		
		default:
			break;
	}
	page.append(field);
	field.wrap('<div class="form-element-wrapper">');
	
	appendToActiveForm(field);
	
	return field;
}

/* GET FORM ELEMENT */
function getFormElementByID(elemID) { 
	for (var el = 0; el < yiiParams.formElements.length; el++) {
		if (elemID == yiiParams.formElements[el].id) {
			return yiiParams.formElements[el];
		}
	}
	return null;
}
function getFormElementByName(elemName) { 
	for (var el = 0; el < yiiParams.formElements.length; el++) {
		if (elemName == yiiParams.formElements[el].name) {
			return yiiParams.formElements[el];
		}
	}
	return null;
}
function getFormElementSettings(elemID, number, pageIdx) { 
	pageIdx = pageIdx != undefined ? pageIdx : currentPageIdx;
	for (var e = 0; e < yiiParams.form.form_elements[pageIdx].length; e++) {
		if (elemID == yiiParams.form.form_elements[pageIdx][e].id && number == yiiParams.form.form_elements[pageIdx][e].number) {
			return yiiParams.form.form_elements[pageIdx][e];
		}
	}
	return null;
}

/* UPDATE FORM SETTING */
function updateFormSetting(param, val) {
	switch (param.name) {
		
		case 'submit_page':			
		case 'form_active':
		case 'submit_email':
		case 'form_height':
			break;
		
		default:
			break;
	}
}

function getFormSetting(setting_name) {
	for (var s = 0; s < yiiParams.formSettings.length; s++) {
		if (yiiParams.formSettings[s].name == setting_name) {
			return yiiParams.formSettings[s];
		}
	}
	
	return null;
}

function getFormSettingValue(setting_name) {
	var setting = getFormSetting(setting_name);
	return setting != null ? yiiParams.form.form_settings[setting.id] : null;
}

function setFormSettingValue(setting_name, value) {
	var setting = getFormSetting(setting_name);
	yiiParams.form.form_settings[setting.id] = value;
}

/* UPDATE FORM PARAM */
function updateFormParam(param, val) {
	switch (param.name) {
		
		case 'page_color':
			updateStyle('#formParamsStyle {.form-wrapper}', 'background-color', val);
			break;
		
		case 'form_color':
			updateStyle('#formParamsStyle {.form-page}', 'background-color', val);			
			break;
			
		case 'font_color':
			updateStyle('#formParamsStyle {.form-pages}', 'color', val);
			break;
		
		case 'input_background':
			updateStyle('#formParamsStyle {.form-pages input, .form-pages input[readonly="readonly"], .form-pages textarea, .form-pages select}', 'background-color', val);
			break;
			
		case 'input_text_color':
			updateStyle('#formParamsStyle {.form-pages input, .form-pages textarea, .form-pages select}', 'color', val);
			break;
			
		case 'form_width':
			updateStyle('#formParamsStyle {.form-page}', 'width', val);
			break;
			
		case 'question_spacing':
			updateStyle('#formParamsStyle {.form-pages .form-element-group}', 'margin-bottom', val);
			break;
			
		case 'label_width':
			updateStyle('#formParamsStyle {.form-pages .control-label}', 'width', val);
			break;
			
		case 'font_size':
			updateStyle('#formParamsStyle {.form-pages}', 'font-size', val);
			break;
			
		case 'label_alignment':
			switch (val) {
				case 'left':
					$('.form-pages').addClass('form-inline');
					updateStyle('#formParamsStyle {.form-pages .form-element-label}', 'text-align', 'left');
					updateStyle('#formParamsStyle {.form-pages .form-element-label}', 'padding-right', '15px');
					break;
				case 'right':
					$('.form-pages').addClass('form-inline');
					updateStyle('#formParamsStyle {.form-pages .form-element-label}', 'text-align', 'right');
					updateStyle('#formParamsStyle {.form-pages .form-element-label}', 'padding-right', '15px');
					break;
				case 'top':
					$('.form-pages').removeClass('form-inline');
					updateStyle('#formParamsStyle {.form-pages .form-element-label}', 'text-align', 'left');
					updateStyle('#formParamsStyle {.form-pages .form-element-label}', 'padding-right', null);
					break;
				default:
					break;
			}
			break;
			
		case 'font':
			updateStyle('#formParamsStyle {.form-pages}', 'font-family', val);
			break;
			
		case 'success_color':
			updateStyle('#formParamsStyle {.form-pages .form-group.val-success label, .form-pages .form-group.val-success .help-block}', 'color', val);
			updateStyle('#formParamsStyle {.form-pages .form-group.val-success .form-control', 'border-color', val);
			break;
			
		case 'error_color':
			updateStyle('#formParamsStyle {.form-pages .form-group.val-error label, .form-pages .form-group.val-error .help-block}', 'color', val);
			updateStyle('#formParamsStyle {.form-pages .form-group.val-error .form-control', 'border-color', val);
			break;
			
		case 'required_sign':
			if (parseInt(val)) {
				updateStyle('#formParamsStyle {.form-element-group.required .control-label::after}', 'content', '"*"');
				updateStyle('#formParamsStyle {.form-element-group.required .control-label::after}', 'color', '#f00');
			} else {
				updateStyle('#formParamsStyle {.form-element-group.required .control-label::after}', 'content', null);
				updateStyle('#formParamsStyle {.form-element-group.required .control-label::after}', 'color', null);
			}
			break;
		
		default:
			break;
	}
}

/* UPDATE FORM ELEMENTS */
function updateFormElement(field, elem, formElement, param, val, cascadeUpdate) {
	cascadeUpdate = cascadeUpdate != undefined ? cascadeUpdate : false;
	switch (param.name) {
		
		case 'label_text':
			field.find('.form-element-label').text(val);
			break;
			
		case 'button_text':
			field.find('.form-element-button').text(val);
			break;
			
		case 'separator_color':
			var selector = '.form-element-' + formElement.name + '-' + field.data('number') + ' hr';
			updateStyle('#formElementsStyle {' + selector + '}', 'border-top-color', val);
			break;
			
		case 'button_alignment':
		case 'header_alignment':
		case 'img_alignment':
			var selector = '.form-element-' + formElement.name + '-' + field.data('number');
			updateStyle('#formElementsStyle {' + selector + '}', 'text-align', val);
			break;
		
		case 'header_text':
			field.find('.form-element-header').text(val);
			break;
			
		case 'html_content':
			field.find('.form-element-content').html(val);
			break;
			
		case 'options_list':
			var opts = val.split(/\r?\n/g);
			opts.forEach(function(opt, idx) {
				var selected = idx == 0 ? 'selected="selected"' : '';
				opts[idx] = '<option value="' + opt + '" ' + selected + '>' + opt + '</option>';
			});
			field.find('.form-element-select').html(opts.join(''));
			removeFromActiveForm(field);
			appendToActiveForm(field);
			break;
			
		case 'radios_list':
			var name = formElement.name + '_' + field.data('elemid') + '_' + field.data('number');
			var opts = val.split(/\r?\n/g);
			opts.forEach(function(opt, idx) {
				var checked = idx == 0 ? 'checked="checked"' : '';
				var id = name + '_r' + idx;
				opts[idx] = ' \
					<div class="radio"> \
						<label> \
							<input type="radio" name="UserForm[' + name + ']" id="' + id + '" value="' + opt + '" ' + checked + ' /> \
							' + opt + ' \
						</label> \
					</div> \
				';
			});
			field.find('.form-element-radio-block').html(opts.join(''));
			removeFromActiveForm(field);
			appendToActiveForm(field);
			break;
			
		case 'checkboxes_list':
			var name = formElement.name + '_' + field.data('elemid') + '_' + field.data('number');
			var opts = val.split(/\r?\n/g);
			opts.forEach(function(opt, idx) {
				var id = name + '_r' + idx;
				opts[idx] = ' \
					<div class="checkbox"> \
						<label> \
							<input type="checkbox" name="UserForm[' + name + '][]" id="' + id + '" value="' + opt + '" /> \
							' + opt + ' \
						</label> \
					</div> \
				';
			});
			field.find('.form-element-checkbox-block').html(opts.join(''));
			removeFromActiveForm(field);
			appendToActiveForm(field);
			break;
			
		case 'upload_img':
			val = val.trim();
			var imgPlaceholder = yiiParams.WEB_PATH + 'img/image_placeholder.png';
			var path = '';
			if (isValidURL(val)) {
				path = val;
			} else if (val) {
				path = yiiParams.WEB_PATH + val;
			}
			var widthParam = getFormElementParam(formElement, 'img_width');
			var heightParam = getFormElementParam(formElement, 'img_height');
			if (path) {
				ifImageExists(path, 
					function() {
						field.find('.form-element-image').attr('src', path);
						if (cascadeUpdate) {
							var width = this.width > field.width() ? field.width() : this.width;
							updateFormElementParam(field, elem, formElement, widthParam, width + 'px');
							var height = this.width > field.width() ? this.height * (width / this.width) : this.height;
							updateFormElementParam(field, elem, formElement, heightParam, height + 'px');
						}
					}, 
					function() {
						field.find('.form-element-image').attr('src', imgPlaceholder);
						if (cascadeUpdate) {
							updateFormElementParam(field, elem, formElement, widthParam, '128px');
							updateFormElementParam(field, elem, formElement, heightParam, '128px');
						}
					}
				);
			} else {
				field.find('.form-element-image').attr('src', imgPlaceholder);
				if (cascadeUpdate) {
					updateFormElementParam(field, elem, formElement, widthParam, '128px');
					updateFormElementParam(field, elem, formElement, heightParam, '128px');
				}
			}
			break;
			
		case 'img_width':
			var selector = '.form-element-' + formElement.name + '-' + field.data('number');
			updateStyle('#formElementsStyle {' + selector + ' img}', 'width', val);
			break;
			
		case 'img_height':
			var selector = '.form-element-' + formElement.name + '-' + field.data('number');
			updateStyle('#formElementsStyle {' + selector + ' img}', 'height', val);
			break;
			
		case 'date_format':
			var dateField = field.find('.form-element-date');
			var date = dateField.datepicker('getDate');
			dateField.datepicker('remove');
			dateField.data('date-format', val);
			dateField.attr('placeholder', val);
			dateField.datepicker();
			dateField.datepicker('setDate', date);
			break;
			
		case 'date_firstweekday':
			var dateField = field.find('.form-element-date');
			var date = dateField.datepicker('getDate');
			dateField.datepicker('remove');
			dateField.data('date-week-start', val);
			dateField.datepicker();
			dateField.datepicker('setDate', date);
			break;
			
		case 'time_format':
			var hoursList = field.find('.form-element-time-hours');
			hoursList.html('');
			var meridiemList = field.find('.form-element-time-meridiem');
			switch(val) {
				case '24 hours':
					hoursList.append($('<option value=""></option>'));
					for (var h = 0; h <= 24; h++) {
						var _h = (h < 10 ? '0' + h : h);
						var hour = $('<option value="' + _h + '">' + _h + '</option>');
						hoursList.append(hour);
					}
					meridiemList.val('');
					meridiemList.addClass('hidden');
					meridiemList.attr('donotvalidate', null);
					break;
				case 'AM/PM':
					hoursList.append($('<option value=""></option>'));
					for (var h = 0; h <= 12; h++) {
						var _h = (h < 10 ? '0' + h : h);
						var hour = $('<option value="' + _h + '">' + _h + '</option>');
						hoursList.append(hour);
					}
					meridiemList.val('AM');
					meridiemList.removeClass('hidden');
					meridiemList.removeAttr('donotvalidate');
					break;
			}
			removeFromActiveForm(field);
			appendToActiveForm(field);
			break;
			
		case 'time_minute_stepping':
			var minutesList = field.find('.form-element-time-minutes');
			minutesList.html('');
			minutesList.append($('<option value=""></option>'));
			for (var m = 0; m <= 60; m += parseInt(val)) {
				var _m = (m < 10 ? '0' + m : m);
				var minute = $('<option value="' + _m + '">' + _m + '</option>');
				minutesList.append(minute);
			}
			removeFromActiveForm(field);
			appendToActiveForm(field);
			break;
		
		case 'back_button_text':
			field.find('.form-element-button-prev').text(val);
			break;
			
		case 'next_button_text':
			field.find('.form-element-button-next').text(val);
			break;
			
		case 'next_button_text':
			field.find('.form-element-button-next').text(val);
			break;
			
		case 'back_button_visible':
			var prev = field.find('.form-element-button-prev');
			switch(val) {
				case '0':
					prev.addClass('hidden');
					prev.prop('disabled', true);
					prev.addClass('disabled');
					break;
				case '1':
					prev.prop('disabled', false);
					prev.removeClass('disabled');
					prev.removeClass('hidden');
					break;
			}
			
		case 'nav_button_alignment':
			var selector = '.form-element-' + formElement.name + '-' + field.data('number');
			if (val == 'distribute') {
				updateStyle('#formElementsStyle {' + selector  + ' .btn-toolbar' + '}', 'text-align', null);
				updateStyle('#formElementsStyle {' + selector  + ' .btn' + '}', 'float', null);
				updateStyle('#formElementsStyle {' + selector  + ' .form-element-button-prev' + '}', 'float', 'left');
				updateStyle('#formElementsStyle {' + selector  + ' .form-element-button-next' + '}', 'float', 'right');
			} else {
				updateStyle('#formElementsStyle {' + selector  + ' .btn-toolbar' + '}', 'text-align', val);
				updateStyle('#formElementsStyle {' + selector  + ' .btn' + '}', 'float', 'none');
				updateStyle('#formElementsStyle {' + selector  + ' .form-element-button-prev' + '}', 'float', null);
				updateStyle('#formElementsStyle {' + selector  + ' .form-element-button-next' + '}', 'float', null);
			}
			break;
			
		case 'required':
			addValidation(field, elem, formElement);
			if (parseInt(val)) {
				field.addClass('required');
			} else {
				field.removeClass('required');
			}
			break;
			
		case 'input_validation':
			addValidation(field, elem, formElement);
			break;
		
		default:
			break;
	}
}

function getFormElementParam(formElement, param_name) {
	for (var p = 0; p < formElement.elementParams.length; p++) {
		if (formElement.elementParams[p].param.name == param_name) {
			return formElement.elementParams[p].param;
		}
	}
	
	return null;
}

function getFormElementParamValue(field, elem, formElement, param_name) {
	var param = getFormElementParam(formElement, param_name);
	return param != null ? elem.params[param.id] : null;
}

function updateFormElementParam(field, elem, formElement, param, val) {
	elem.params[param.id] = val;
	$('#' + param.name + '_' + param.id).trigger('paramchange');
	updateFormElement(field, elem, formElement, param, val);
	
}

/* FORM ELEMENTS */
function getFormHeader(field, id) {
	var header = $('<h2 class="form-element-header" id="' + id + '"></h2>');
	field.append(header);
	
	return field;
}

function getFormTextField(field, id) {
	var label = $('<label class="form-element-label control-label" for="' + id + '"></label>')
	field.append(label);
	
	var textField = $('<input type="text" class="form-control form-element-field" name="UserForm[' + id + ']" id="' + id + '" placeholder="Enter text" />');
	field.append(textField);
	
	var helpBlock = $('<div class="help-block error-block small"></div>');
	field.append(helpBlock);
	
	return field;
}

function getFormTextArea(field, id) {
	var label = $('<label class="form-element-label control-label" for="' + id + '"></label>')
	field.append(label);
	
	var textField = $('<textarea class="form-control form-element-field" name="UserForm[' + id + ']" id="' + id + '" placeholder="Enter text" style="resize: none;"/>');
	field.append(textField);
	
	var helpBlock = $('<div class="help-block error-block small"></div>');
	field.append(helpBlock);
	
	return field;
}

function getFormContentBlock(field, id) {
	var content = $('<div class="form-element-content"></div>')
	field.append(content);
	
	return field;
}

function getFormSelectField(field, id) {
	var label = $('<label class="form-element-label control-label" for="' + id + '"></label>')
	field.append(label);
	
	var selectField = $('<select class="form-control form-element-field form-element-select" name="UserForm[' + id + ']" id="' + id + '" />');
	field.append(selectField);
	
	var helpBlock = $('<div class="help-block error-block small"></div>');
	field.append(helpBlock);
	
	return field;
}

function getFormRadioBlock(field, id) {
	var label = $('<label class="form-element-label control-label"></label>')
	field.append(label);
	
	var hiddenInput = $('<input type="hidden" name="UserForm[' + id + ']" value="">');
	field.append(hiddenInput);
	
	var radioBlock = $('<div class="form-element-field form-element-radio-block form-group" id="' + id + '" />');
	field.append(radioBlock);
	
	var helpBlock = $('<div class="help-block error-block small"></div>');
	field.append(helpBlock);
	
	return field;
}

function getFormCheckboxBlock(field, id) {
	var label = $('<label class="form-element-label control-label"></label>')
	field.append(label);
	
	var hiddenInput = $('<input type="hidden" name="UserForm[' + id + ']" value="">');
	field.append(hiddenInput);
	
	var checkboxBlock = $('<div class="form-element-field form-element-checkbox-block form-group" id="' + id + '" />');
	field.append(checkboxBlock);
	
	var helpBlock = $('<div class="help-block error-block small"></div>');
	field.append(helpBlock);
	
	return field;
}

function getFormDateField(field, id) {
	var label = $('<label class="form-element-label control-label" for="' + id + '"></label>')
	field.append(label);
	
	var dateField = $(' \
		<input type="text" class="form-control form-element-field form-element-date" name="UserForm[' + id + ']" id="' + id + '" placeholder="" readonly="readonly" \
			data-date-language="' + (yiiParams.lang != 'en_US' ? yiiParams.lang : 'en') + '" \
			data-date-autoclose="true" \
			data-date-clear-btn="true" \
			data-date-today-highlight="true" \
		/> \
	');
	field.append(dateField);
	
	var helpBlock = $('<div class="help-block error-block small"></div>');
	field.append(helpBlock);
	
	dateField.datepicker();
	
	return field;
}

function getFormTimeField(field, id) {
	var label = $('<label class="form-element-label control-label" for="' + id + '"></label>')
	field.append(label);
	
	var formGroup = $('<div class="form-group form-inline"></div>');
	
	var elemClass = 'form-element-' + field.data('elemname') + '-' + field.data('number');
	var hourID = id + '_hour';
	var hourClass = elemClass + '-hour';
	var hoursList = $(' \
		<div class="form-group ' + hourClass + '"> \
			<select type="text" class="form-control form-element-field input-sm form-element-time-hours" name="UserForm[' + hourID + ']" id="' + hourID + '" data-subname="hour"></select> \
			<span class="help-block small">' + t('Hours') + '</span> \
			<span class="error-block hidden"></span> \
		</div> \
	');
	formGroup.append(hoursList);
	
	var minuteID = id + '_minute';
	var minutesClass = elemClass + '-minute';
	var minutesList = $(' \
		<div class="form-group ' + minutesClass + '"> \
			<select type="text" class="form-control form-element-field input-sm form-element-time-minutes" name="UserForm[' + minuteID + ']" id="' + minuteID + '" data-subname="minute"></select> \
			<span class="help-block small">' + t('Minutes') + '</span> \
			<span class="error-block hidden"></span> \
		</div> \
	');
	formGroup.append(minutesList);
	
	var meridiemID = id + '_meridiem';
	var meridiemClass = elemClass + '-meridiem';
	var meridiemList = $(' \
		<div class="form-group ' + meridiemClass + '"> \
			<select type="text" class="form-control form-element-field input-sm form-element-time-meridiem" name="UserForm[' + meridiemID + ']" id="' + meridiemID + '" data-subname="meridiem" donotvalidate></select> \
			<span class="help-block small">&nbsp</span> \
			<span class="error-block hidden"></span> \
		</div> \
	');
	meridiemList.find('select').append($('<option value="AM">AM</option><option value="PM">PM</option>'));
	formGroup.append(meridiemList);
	
	field.append(formGroup);
	
	var helpBlock = $('<div class="help-block error-block small"></div>');
	field.append(helpBlock);
	
	return field;
}

function getFormImage(field, id) {
	var img = $('<img class="form-element-image" src="" alt="" />');
	field.append(img);
	
	return field;
}

function getFormSeparator(field, id) {
	var hr = $('<hr class="form-element-separator" />');
	field.append(hr);
	
	return field;
}

function getFormSubmit(field, id) {
	var btn = $('<button type="submit" class="btn btn-default form-element-button form-element-button-submit" name="' + id + '" id="' + id + '" value="1"></button>');
	field.append(btn);
	
	btn.on('click', function(e) {
		$('#userForm').yiiActiveForm('validate', true);
	});
	
	return field;
}

function getFormNavigation(field, id) {
	var nav = $('<div class="btn-toolbar"></div>');
	
	var prevBtn = getPrevBtn(id);
	nav.append(prevBtn);
	
	var nextBtn = getNextBtn(id);
	nav.append(nextBtn);
	
	field.append(nav);
	
	return field;
}

function getPrevBtn(id) {
	var prevID = id + '_prev';
	var prevBtn = $(' \
		<button type="button" id="' + prevID + '" class="btn btn-default form-element-button form-element-button-prev" name="' + prevID + '"> \
			<span class="glyphicon glyphicon-arrow-left"></span> \
		</button> \
	');
	
	return prevBtn;
}

function getNextBtn(id) {
	var nextID = id + '_next';
	var nextBtn = $(' \
		<button type="button" id="' + nextID + '" class="btn btn-default form-element-button form-element-button-next" name="' + nextID + '"> \
			<span class="glyphicon glyphicon-arrow-right"></span> \
		</button> \
	');
	
	return nextBtn;
}

/* APPEND FIELD TO ACTIVE FORM */
function appendToActiveForm(field) {
	field.find('.form-element-field').each(function(idx, elem) {
		var id = $(elem).attr('id');
		var subname = $(elem).data('subname');
		
		$('#userForm').yiiActiveForm('add', {
			id: id,
			name: id,
			container: '.form-element-' + field.data('elemname') + '-' + field.data('number') + (subname ? '-' + subname : ''),
			input: '#' + id,
			error: '.error-block'
		});
		
	});
}

function removeFromActiveForm(field) {
	field.find('.form-element-field').each(function(idx, elem) {
		var id = $(elem).attr('id');
		if ($('#userForm').yiiActiveForm('find', id) != undefined) {
			$('#userForm').yiiActiveForm('remove', id);
		}
	});
}

/* VALIDATION */
function addValidation(field, elemSettings, formElement) {
	field.find('.form-element-field').each(function(idx, elem) {
		if (!elem.hasAttribute('donotvalidate')) {
			
			var id = $(elem).attr('id');
			var subname = $(elem).data('subname');
			
			var required = parseInt(getFormElementParamValue(field, elemSettings, formElement, 'required'));
			var validationType = function() {
				return getFormElementParamValue(field, elemSettings, formElement, 'input_validation')
					|| null;
			}();
			
			$('#userForm').yiiActiveForm('find', id).validate = function(attribute, value, messages, deferred, $form) {

				if (subname && (required || validationType)) {
					var valid = true;
					var fieldsToValidate = [];
					var validChecked = [];
					field.find('.form-element-field').each(function(i, el) {
						if (!el.hasAttribute('donotvalidate')) {
							var fld = $('#userForm').yiiActiveForm('find', $(el).attr('id'));
							if (fld) {
								fieldsToValidate.push(fld);
								validChecked.push(false);
								
								if (fld.id != id && fld.status == 0) {
									setTimeout(function() {
										$('#userForm').yiiActiveForm('validateAttribute', fld.id);
									}, 0);
								}
							}
						}
					});					
					
					var cnt = fieldsToValidate.length;
					var msg = '';
					var pending = setInterval(function() {
	
						fieldsToValidate.forEach(function(fld, i) {
	
							if (!validChecked[i]) {
								if (fld.status == 1) {
									
									var el = field.find('#' + fld.id);
									var elSubname = el.data('subname');
									var elContainer = '.form-element-' + field.data('elemname') + '-' + field.data('number') + '-' + elSubname;
									var fieldSubgroup = el.parents(elContainer);
									if (fieldSubgroup.hasClass('val-error')) {
										valid = false;
										msg = fieldSubgroup.find('.error-block').text();
									}
									
									validChecked[i] = true;
									cnt--;
								}
							}
							
						});
	
						if (!cnt) {
							if (valid) {
								field.find('.error-block').text('');
								field.removeClass('val-error');
								field.addClass('val-success');
							} else {
								field.find('.error-block').text(msg);
								field.removeClass('val-success');
								field.addClass('val-error');
							}
							
							clearInterval(pending);
							pending = null;
						}
						
					}, 100);	
				}
				
				switch (validationType) {
					case 'alphabetic':
						yii.validation.regularExpression(value, messages, { 
							message: t('This field can only contains letters'),
							pattern: /^[A-Za-z\s]*$/g
						});
						break;
					case 'numeric':
						yii.validation.regularExpression(value, messages, { 
							message: t('This field can only contains numbers'),
							pattern: /^[0-9\s]*$/g
						});
						break;
					default:
						break;
				}
				
				if (required) {
					yii.validation.required(value, messages, { 
						message: t('This field is required')
					});
				}
				
			}
			
		}
	});
}
function removeValidation(field, type) {
	field.find('.form-element-field').each(function(idx, elem) {			
		var id = $(elem).attr('id');
		$('#userForm').yiiActiveForm('find', id).validate = null;
	});
}

/* HELPERS */
function updateStyle(ssSelector, styleProp, val) {
	var $ss = $.stylesheet(ssSelector);
	if (styleProp) {
		$ss.css(styleProp, val);
	} else {
		$ss.css(null);
	}
}