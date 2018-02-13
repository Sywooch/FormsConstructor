$(function() {
	
	var submissionsURL = yiiParams.submissionsURL + '/' + yiiParams.form.id;
	
	function fixExportMenu() {
		var fixExportMenuInterval = setInterval(function() {			
			
			if ($('.export-csv').data('gridexport') != undefined) {
				
				$('.export-csv').data('gridexport').exportTEXT = function(expType) {
					var self = this, $table = self.clean(expType),
						$rows = $table.find('tr:has(' + self.columns + ')');
					// temporary delimiter characters unlikely to be typed by keyboard,
					// this is to avoid accidentally splitting the actual contents
					var tmpColDelim = String.fromCharCode(11), // vertical tab character
						tmpRowDelim = String.fromCharCode(0); // null character
					// actual delimiter characters for CSV format
					/** @namespace self.config.rowDelimiter */
					/** @namespace self.config.colDelimiter */
					var colD = '"' + self.config.colDelimiter + '"', rowD = '"' + self.config.rowDelimiter + '"';
					// grab text from table into CSV formatted string
					var txt = '"' + $rows.map(function (i, row) {
							var $row = $(row), $cols = $row.find(self.columns);
							return $cols.map(function (j, col) {
								var $col = $(col), text = $col.html().replace(/<br\s*[\/]?>/gi, "\r\n").trim();
								return text.replace(/"/g, '""'); // escape double quotes
							}).get().join(tmpColDelim);
						}).get().join(tmpRowDelim)
							.split(tmpRowDelim).join(rowD)
							.split(tmpColDelim).join(colD) + '"';
					self.download(expType, txt);
				};

				clearInterval(fixExportMenuInterval);
				fixExportMenuInterval = null;
				
			}
			
		}, 0);
	}
	
	$('.container').off('pjax:success', '#pjaxSub');
	$('.container').on('pjax:success', '#pjaxSub', function() {
		fixExportMenu();
		
		var currentKey = $('.form-submissions-view').attr('data-key');
		var currentRow = $('.form-submissions-list tr[data-key="' + currentKey + '"]');
		if (currentRow.length) {
			currentRow.addClass('active');
		}
	});
	
	$('.container').on('click', '.kv-grid-table tbody tr', function(e) {
		if ($(e.target).is('td')) {
			viewSubmission($(this));
		}
	});
	
	$('.container').off('click', '#subViewPrev');
	$('.container').on('click', '#subViewPrev', function(e) {
		var currentKey = $('.form-submissions-view').attr('data-key');
		var currentRow = $('.form-submissions-list tr[data-key="' + currentKey + '"]');
		if (currentRow.length) {
			var prevRow = currentRow.prev('tr');
			if (prevRow.length) {
				viewSubmission(prevRow);
			} else {
				viewSubmission($('.kv-grid-table tbody tr:last-child'));
			}
		} else {
			viewSubmission($('.kv-grid-table tbody tr:last-child'));
		}
	});
	
	$('.container').off('click', '#subViewNext');
	$('.container').on('click', '#subViewNext', function(e) {
		var currentKey = $('.form-submissions-view').attr('data-key');
		var currentRow = $('.form-submissions-list tr[data-key="' + currentKey + '"]');
		if (currentRow.length) {
			var nextRow = currentRow.next('tr');
			if (nextRow.length) {
				viewSubmission(nextRow);
			} else {
				viewSubmission($('.kv-grid-table tbody tr:first-child'));
			}
		} else {
			viewSubmission($('.kv-grid-table tbody tr:first-child'));
		}
	});
	
	$('.container').off('change', 'input[name="export_columns_selector[]"]');
	$('.container').on('change', 'input[name="export_columns_selector[]"]', function(e) {
		var key = $(this).data('key');
		if ($(this).prop('checked')) {
			$('th[data-col-seq="' + key + '"], td[data-col-seq="' + key + '"]').removeClass('skip-export');
		} else {
			$('th[data-col-seq="' + key + '"], td[data-col-seq="' + key + '"]').addClass('skip-export');
		}
	});
	$('.container').off('change', 'input[name="export_columns_toggle"]');
	$('.container').on('change', 'input[name="export_columns_toggle"]', function(e) {
		$('input[name="export_columns_selector[]"]').trigger('change');
	});
	
	$('.container').off('click', '.subSetAsRead');
	$('.container').on('click', '.subSetAsRead', function(e) {
		
		e.stopPropagation();
		
		var id = $(this).data('sub_id');
		buttonLoading($(this));
		
		$.ajax({
			url: yiiParams.subSetAsReadURL + '?id=' + id,
			type: 'POST',
			data: {
				read: !$(this).hasClass('submission-new') ? 1 : 0
			},
			success: function(response) {
				if (response == 'OK') {
					$.pjax.reload('#pjaxSub', {
						url: ($.pjax.state != undefined && $.pjax.state.url.search(submissionsURL) != -1) ? $.pjax.state.url : submissionsURL,
						push: false
					});
				} else {
					console.log('Set submission as read: ' + response);
				}
			}
		});
	});

	$('.container').off('click', '#subSetAllAsRead');
	$('.container').on('click', '#subSetAllAsRead', function(e) {
		
		var keys = $('#subGrid0').yiiGridView('getSelectedRows');
		if (keys.length) {
			
			var btn = $(this);
			buttonLoading(btn);
			
			var counter = keys.length;
			for (var k = 0; k < keys.length; k++) {
				$.ajax({
					url: yiiParams.subSetAsReadURL + '?id=' + keys[k],
					type: 'POST',
					data: {
						read: 0
					},
					success: function(response) {
						counter--;
						
						if (response != 'OK') {
							console.log('Set submission as read: ' + response);
						}
						
						if (counter == 0) {							
							$.pjax.reload('#pjaxSub', {
								url: ($.pjax.state != undefined && $.pjax.state.url.search(submissionsURL) != -1) ? $.pjax.state.url : submissionsURL
							});
						}
					}
				});
			}
			
		}
	});
	
	$('.container').off('click', '.subDelete');
	$('.container').on('click', '.subDelete', function(e) {

		e.stopPropagation();	
	
		var id = $(this).data('sub_id');
		var tr = $(this).parents('tr');
		var tds = tr.find('td');
		tds.hide();
		
		var confirmation = $('<td colspan="' + tds.length + '" data-sub_id="' + id + '" />');
		confirmation.append('<p class="text-left strong">' + t('Are you sure you want to delete this submission?') + '</p>');
		
		var btns = $('<div class="form-group btn-toolbar" />');
		
		var btnCancel = $('<button class="btn btn-default">' + t('Cancel') + '</button>');
		btnCancel.on('click', function() {
			confirmation.remove();
			tds.show();
		});
		
		var btnConfirm = $('<button class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span> ' + t('Delete') + '</button>');
		btnConfirm.on('click', function() {
			
			buttonLoading(btnConfirm);
			
			$.ajax({
				url: yiiParams.subDeleteURL + '?id=' + id,
				type: 'POST',
				data: {},
				success: function(response) {
					if (response == 'OK') {
						$.pjax.reload('#pjaxSub', {
							url: ($.pjax.state != undefined && $.pjax.state.url.search(submissionsURL) != -1) ? $.pjax.state.url : submissionsURL
						});					
					} else {
						console.log('Delete submission: ' + response);
					}
				}
			});
			
		});
		
		btns.append(btnCancel)
			.append(btnConfirm);
		
		confirmation.append(btns);
		tr.append(confirmation);
		
	});
	
	$('.container').off('click', '#subDeleteAll');
	$('.container').on('click', '#subDeleteAll', function(e) {

		var keys = $('#subGrid0').yiiGridView('getSelectedRows');
		if (keys.length) {
			
			var group = $(this).parents('.form-group');
			var toolbar = group.find('button');
			toolbar.hide();
			
			var confirmation = $('<div class="form-confirmation" />');
			confirmation.append('<p class="text-left strong">' + t('Are you sure you want to delete selected submissions?') + '</p>');
			
			var btns = $('<div class="form-group btn-toolbar" />');
			
			var btnCancel = $('<button class="btn btn-default">' + t('Cancel') + '</button>');
			btnCancel.on('click', function() {
				confirmation.remove();
				toolbar.show();
			});
			
			var btnConfirm = $('<button class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span> ' + t('Delete') + '</button>');
			btnConfirm.on('click', function() {
				
				buttonLoading(btnConfirm);
				
				var counter = keys.length;
				for (var k = 0; k < keys.length; k++) {
					$.ajax({
						url: yiiParams.subDeleteURL + '?id=' + keys[k],
						type: 'POST',
						data: {},
						success: function(response) {
							counter--;
							
							if (response != 'OK') {
								console.log('Delete submission: ' + response);
							}
							
							if (counter == 0) {								
								$.pjax.reload('#pjaxSub', {
									url: ($.pjax.state != undefined && $.pjax.state.url.search(submissionsURL) != -1) ? $.pjax.state.url : submissionsURL
								});
							}
						}
					});
				}
				
			});
			
			btns.append(btnCancel)
				.append(btnConfirm);
			
			confirmation.append(btns);
			group.append(confirmation);
			
		}
		
	});
	
	fixExportMenu();
	viewSubmission($('.kv-grid-table tbody tr:first-child'));
	
});

function viewSubmission(tr) {
	var key = tr.data('key');
	
	tr.parents('tbody').find('tr').removeClass('active');
	tr.addClass('active');
	
	$('.form-submissions-view').attr('data-key', key);
	$('.form-submissions-view').html('');
	tr.find('td').each(function(idx, elem) {
		if ($(elem).hasClass('value-cell')) {
			var seq = $(elem).data('col-seq');
			var list = $('.form-submissions-list');
			var header = list.find('th[data-col-seq="' + seq + '"]').text();
			var val = $(elem).html();
			
			var field = $('<div class="form-group">');
			field.append($('<label class="control-label col-md-2">' + header + '</label>'));
			field.append($('<div class="col-md-10"><p class="form-control-static">' + val + '</p></div>'));
			$('.form-submissions-view').append(field);
		}
	});
	
	if ($(window).scrollTop() > 20) {
		$(window).scrollTop(20);
	}
	$('.form-submissions-view').scrollTop(0);
	
	var setAsReadBtn = tr.find('.subSetAsRead');
	if (setAsReadBtn.hasClass('submission-new')) {
		
		buttonLoading(setAsReadBtn);
		
		$.ajax({
			url: yiiParams.subSetAsReadURL + '?id=' + key,
			type: 'POST',
			data: {
				read: !setAsReadBtn.hasClass('submission-new') ? 1 : 0
			},
			success: function(response) {
				if (response == 'OK') {
					buttonActive(setAsReadBtn);
					setAsReadBtn.removeClass('submission-new');						
				} else {
					console.log('Set submission as read: ' + response);
				}
			}
		});
		
	}
}