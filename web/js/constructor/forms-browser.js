$(function() {
	
	$('.container').off('submit', '#modalForm');
	$('.container').on('submit', '#modalForm', function(e) {
		e.preventDefault();
		
		var subButton = $(this).find('#subModalForm');
		buttonLoading(subButton);
		
		$.ajax({
			url: $(this).attr('action'),
            type: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                var result = $(response).filter('#result').text();
				if (result == 'success') {

					$('#modal').modal('hide');
					$.pjax.reload('#fbPjax0', {});
				
				} else {
					
					$('#modal').find('.modal-body').html(response);
					
					buttonActive(subButton);
				
				}
            }
        });
	});
	
	/* add folder */
	$('.container').off('click', '#showAddFolder');
	$('.container').on('click', '#showAddFolder', function() {
		$('#modal').find('.modal-title').html(t('Add New Folder'));

		$.ajax({
			url: yiiParams.addFolderURL,
            type: 'POST',
            success: function(response) {
				showModal('#modal', response, 'small');
            }
        });
	});
	
	/* add form */
	$('.container').off('click', '#showAddForm');
	$('.container').on('click', '#showAddForm', function() {
		$('#modal').find('.modal-title').html(t('Add New Form'));
		
		$.ajax({
			url: yiiParams.addFormURL,
            type: 'POST',
            success: function(response) {
                showModal('#modal', response);
            }
        });
	});
	
	$('.container').off('submit', '#modalAddForm');
	$('.container').on('submit', '#modalAddForm', function(e) {
		e.preventDefault();
		
		var subButton = $(this).find('#subModalForm');
		buttonLoading(subButton);
		
		$.ajax({
			url: $(this).attr('action'),
            type: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                var result = $(response).filter('#result').text();
				if (result == 'success') {

					var id = $(response).filter('#form_id').text();
					location.href = yiiParams.formUrl + '/' + id;
				
				} else {
					
					$('#modal').find('.modal-body').html(response);
					
					buttonActive(subButton);
				
				}
            }
        });
	});
	
	/* rename folder */
	$('.container').off('click', '.showRenameFolder');
	$('.container').on('click', '.showRenameFolder', function() {
		$('#modal').find('.modal-title').html(t('Rename Folder'));

		var id = $(this).data('folder_id');
		$.ajax({
			url: yiiParams.editFolderURL + '?id=' + id,
            type: 'POST',
            success: function(response) {
                showModal('#modal', response, 'small');
            }
        });
	});
	
	/* rename form */
	$('.container').off('click', '.showRenameForm');
	$('.container').on('click', '.showRenameForm', function() {
		$('#modal').find('.modal-title').html(t('Rename Form'));

		var id = $(this).data('form_id');
		$.ajax({
			url: yiiParams.editFormURL + '?id=' + id,
            type: 'POST',
            success: function(response) {
                showModal('#modal', response, 'small');
            }
        });
	});
	
	/* delete folder */
	$('.container').off('click', '.showDeleteFolder');
	$('.container').on('click', '.showDeleteFolder', function() {
		$('#modal').find('.modal-title').html(t('Delete Folder'));

		var id = $(this).data('folder_id');
		$.ajax({
			url: yiiParams.deleteFolderURL + '?id=' + id,
            type: 'POST',
            success: function(response) {
                showModal('#modal', response, 'small');
            }
        });
	});
	
	/* delete form */
	$('.container').off('click', '.showDeleteForm');
	$('.container').on('click', '.showDeleteForm', function() {
		$('#modal').find('.modal-title').html(t('Delete Form'));

		var id = $(this).data('form_id');
		$.ajax({
			url: yiiParams.deleteFormURL + '?id=' + id,
            type: 'POST',
            success: function(response) {
                showModal('#modal', response, 'small');
            }
        });
	});
	
	/* move folder to folder form */
	$('.container').off('click', '.showMoveFolderToFolder');
	$('.container').on('click', '.showMoveFolderToFolder', function() {
		$('#modal').find('.modal-title').html(t('Move to...'));

		var id = $(this).data('folder_id');
		
		$.ajax({
			url: yiiParams.moveFolderToFolderURL + '?id=' + id,
            type: 'POST',
            data: { 
				Folder: {
					parent_id: yiiParams.folder_id
				}
			},
            success: function(response) {
                showModal('#modal', response);
            }
        });
	});
	
	/* move form to folder form */
	$('.container').off('click', '.showMoveFormToFolder');
	$('.container').on('click', '.showMoveFormToFolder', function() {
		$('#modal').find('.modal-title').html(t('Move to...'));

		var id = $(this).data('form_id');
		
		$.ajax({
			url: yiiParams.moveFormToFolderURL + '?id=' + id,
            type: 'POST',
            data: {
				Folder: {
					id: yiiParams.folder_id
				}
			},
            success: function(response) {
                showModal('#modal', response);
            }
        });
	});
	
	/* publish form */
	$('.container').off('click', '.showPublishForm');
	$('.container').on('click', '.showPublishForm', function() {
		$('#modal').find('.modal-title').html(t('Publish Form'));

		var id = $(this).data('form_id');
		$.ajax({
			url: yiiParams.publishFormURL + '?id=' + id,
            type: 'POST',
            success: function(response) {
                showModal('#modal', response);
            }
        });
	});
	
	/* turn form on-off */
	$('.container').off('click', '.cmdTurnOnForm, .cmdTurnOffForm');
	$('.container').on('click', '.cmdTurnOnForm, .cmdTurnOffForm', function(e) {
		var id = $(this).data('form_id');
		$.ajax({
			url: yiiParams.turnFormOnOffURL + '?id=' + id,
            type: 'POST',
			data: {
				on: $(e.target).hasClass('cmdTurnOnForm') ? 1 : 0
			},
            success: function(response) {
                if (response == 'OK') {
					$.pjax.reload('#fbPjax0', {});
				} else {
					console.log('Turn form on: ' + response);
				}
            }
        });
	});
	
	/* drag'n'drop */
	var dragObject = {};
	dragObject.dropElem = null;
	
	function onMouseDown(e) {
	
		if (e.which != 1) return;
		
		var elem = e.target.closest('.draggable');
		if (!elem) return;
		
		dragObject.elem = $(elem);
		
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
	
		dragObject.avatar.offset({
			top: e.pageY - dragObject.shiftY,
			left: e.pageX - dragObject.shiftX
		});
		
		dropElem = findDroppable(e);
		if (
			dropElem != null 
			&& (!dragObject.dropElem || !dragObject.dropElem.is(dropElem))
			&& !dropElem.parent().is(dragObject.elem)
		) {
			dropEnter(dropElem);
		} else if (dragObject.dropElem && !dragObject.dropElem.is(dropElem)) {
			dropLeave();
		}

		return false;
	}
	
	function dropEnter(dropElem) {
		if (dragObject.dropElem) {
			dragObject.dropElem.find('.fb-folder').removeClass('btn-primary');
		}
		dragObject.dropElem = dropElem;
		dragObject.dropElem.find('.fb-folder').addClass('btn-primary');
	}
	
	function dropLeave() {
		if (dragObject.dropElem) {
			dragObject.dropElem.find('.fb-folder').removeClass('btn-primary');
			dragObject.dropElem = null;
		}
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
	}
	
	function createAvatar(e) {
		var avatar = dragObject.elem.clone();
		dragObject.elem.parent().append(avatar);
		avatar.css({
			position: 'absolute',
			opacity: 0.75,
			zIndex: 9999
		});		
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
		
		return $(elem).closest('.droppable');
	}
	
	/* move to folder */
	function moveToFolder(data, url) {		
		var obj = dragObject.elem.find('.btn');
		obj.addClass('disabled');
		obj.prop('disabled', true);
		
		$.ajax({
			url: url,
            type: 'POST',
            data: data,
            success: function(response) {
				var result = $(response).filter('#result').text();
				if (result == 'success') {

					$.pjax.reload('#fbPjax0', {});
				
				} else {
					obj.removeClass('disabled');
					obj.prop('disabled', false);
				}
            }
        });
	}
	
	function dragEnd(dropElem) {
		if (dropElem.find('.fb-folder').length && !dropElem.parent().is(dragObject.elem)) {
			
			var dragFolder = dragObject.elem.find('.fb-folder');
			var dragForm = dragObject.elem.find('.fb-form');
			var dropFolder = dropElem.find('.fb-folder');
			
			if (dragFolder.length) {
				
				moveToFolder({
					Folder: {
						parent_id: dropFolder.data('folder_id')
					},
					'subModalForm': 1
				}, yiiParams.moveFolderToFolderURL + '?id=' + dragFolder.data('folder_id'));
				
			} else if (dragForm.length) {
				
				moveToFolder({
					Folder: {
						id: dropFolder.data('folder_id')
					},
					'subModalForm': 1
				}, yiiParams.moveFormToFolderURL + '?id=' + dragForm.data('form_id'));
				
			}
			
		}
		
		dragCancel();
	}
	
	function dragCancel() {
		dropLeave();
		dragObject.avatar.remove();
	}
	
	$(document).on('mousemove', onMouseMove);
	$(document).on('mouseup', onMouseUp);
	$(document).on('mousedown', onMouseDown);
	
});

function updateSubmissionsCount(id) {
	$.ajax({
		url: yiiParams.subGetNewSubmissionsCount + '?id=' + id,
        type: 'POST',
        data: {},
        success: function(result) {
            if (!result.error.status) {
				
				var submissionsBadgeBtn = $('.fb-form[data-form_id="' + id + '"] .badge');
				var submissionsBadgeLink = $('.showFormSubmissions[data-form_id="' + id + '"] .badge');
				var val = result.submissions > 0 ? result.submissions : '';
				submissionsBadgeBtn.text(val);
				submissionsBadgeLink.text(val);
				
			} else {
				console.log('Set submission as read: ' + result.error.text);
			}
        }
    });
}