<?php

$translation = [
	/* SITE */
	'Add New Folder' => Yii::t('site', 'Add New Folder'),
	'Add New Form' => Yii::t('site', 'Add New Form'),
	'Rename Folder' => Yii::t('site', 'Rename Folder'),
	'Rename Form' => Yii::t('site', 'Rename Form'),
	'Delete Folder' => Yii::t('site', 'Delete Folder'),
	'Delete Form' => Yii::t('site', 'Delete Form'),
	'Move to...' => Yii::t('site', 'Move to...'),
	'Publish Form' => Yii::t('site', 'Publish Form'),
	'Views' => Yii::t('site', 'Views'),
	'Submissions' => Yii::t('site', 'Submissions'),
	'Form Submissions' => Yii::t('site', 'Form Submissions'),
	'Are you sure you want to delete this submission?' => Yii::t('site', 'Are you sure you want to delete this submission?'),
	'Are you sure you want to delete selected submissions?' => Yii::t('site', 'Are you sure you want to delete selected submissions?'),
	'Form Statistics' => Yii::t('site', 'Form Statistics'),
	'Cancel' => Yii::t('site', 'Cancel'),
	
	/* FORMS */
	'Element Params' => Yii::t('forms', 'Element Params'),
	'Delete' => Yii::t('forms', 'Delete'),
	
	'off' => Yii::t('forms', 'off'),
	'on' => Yii::t('forms', 'on'),
	
	'Page' => Yii::t('forms', 'Page'),
	'Edit Content' => Yii::t('forms', 'Edit Content'),
	'Choose Image' => Yii::t('forms', 'Choose Image'),
	'Edit...' => Yii::t('forms', 'Edit...'),
	'Remove Image' => Yii::t('forms', 'Remove Image'),
	'Save' => Yii::t('forms', 'Save'),
	'Choose Image...' => Yii::t('forms', 'Choose Image...'),
	'Loading' => Yii::t('forms', 'Loading'),
	'or drag & drop the file in this area' => Yii::t('forms', 'or drag & drop the file in this area'),
	'File type not allowed' => Yii::t('forms', 'File type not allowed'),
	'Max file size exceeded' => Yii::t('forms', 'Max file size exceeded'),
	'Upload' => Yii::t('forms', 'Upload'),
	'Uploaded' => Yii::t('forms', 'Uploaded'),
	'Link' => Yii::t('forms', 'Link'),
	'Delete' => Yii::t('forms', 'Delete'),
	'Choose' => Yii::t('forms', 'Choose'),
	'HTTP Link to Image' => Yii::t('forms', 'HTTP Link to Image'),
	'Hours' => Yii::t('forms', 'Hours'),
	'Minutes' => Yii::t('forms', 'Minutes'),
	'Hours' => Yii::t('forms', 'Hours'),
	'Minutes' => Yii::t('forms', 'Minutes'),
	
	'left' => Yii::t('forms', 'left'),
	'right' => Yii::t('forms', 'right'),
	'center' => Yii::t('forms', 'center'),
	'distribute' => Yii::t('forms', 'distribute'),
	'sunday' => Yii::t('forms', 'sunday'),
	'monday' => Yii::t('forms', 'monday'),
	'24 hours' => Yii::t('forms', '24 hours'),
	'false' => Yii::t('forms', 'false'),
	'true' => Yii::t('forms', 'true'),
	'hide' => Yii::t('forms', 'hide'),
	'show' => Yii::t('forms', 'show'),
	'none' => Yii::t('forms', 'none'),
	'letters only' => Yii::t('forms', 'letters only'),
	'numbers only' => Yii::t('forms', 'numbers only'),
	
	'Sorry, this form is currently unavailable.' => Yii::t('forms', 'Sorry, this form is currently unavailable.'),
	'This field is required' => Yii::t('forms', 'This field is required'),
	'This field can only contains letters' => Yii::t('forms', 'This field can only contains letters'),
	'This field can only contains numbers' => Yii::t('forms', 'This field can only contains numbers'),
	'Wrong e-mail' => Yii::t('forms', 'Wrong e-mail'),
];

$this->registerJs("
	var translation = " . json_encode($translation) . ";
	function t(text) {
		return translation[text] || text;
	}
", yii\web\View::POS_HEAD);