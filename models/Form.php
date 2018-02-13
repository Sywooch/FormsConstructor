<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Form extends ActiveRecord
{

	public function getFormFolder()
    {
        return $this->hasOne(FolderToForm::className(), ['form_id' => 'id']);
    }

    public function getFolder()
    {
        return $this->hasOne(Folder::className(), ['id' => 'folder_id'])
            ->via('formFolder');
    }
	
	public function getFormFormFiles()
    {
        return $this->hasMany(FormToFormFile::className(), ['form_id' => 'id']);
    }

    public function getFormFiles()
    {
        return $this->hasMany(FormFile::className(), ['id' => 'form_file_id'])
            ->via('formFormFiles');
    }
	
	public function getFormSubmissions()
    {
        return $this->hasMany(FormSubmission::className(), ['form_id' => 'id'])
			->orderBy(['sub_date' => SORT_DESC]);
    }
	
	public function getFormViews()
    {
        return $this->hasMany(FormView::className(), ['form_id' => 'id'])
			->orderBy(['view_date' => SORT_DESC]);
    }
	
	public function attributeLabels()
    {
        return [
            'name' => Yii::t('site', 'Form Name'),
        ];
    }
	
	public function rules()
    {
        $rules = [
            'requiredFields' => [['!user_id', 'name'], 'required'],
            'trimValues' => ['name', 'trim'],
			'maxLength' => ['name', 'string', 'max' => 255],
			'defaultContent' => [['form_params', 'form_settings', 'form_elements'], 'default'],
			'access' => ['!user_id', 'compare', 'compareValue' => Yii::$app->user->id, 'operator' => '==', 'type' => 'number'],
        ];

        return $rules;
    }
	
	public static function getUsersForm($id)
	{
		return Form::find()
			->where([
				'form.id' => $id, 
				'form.user_id' => Yii::$app->user->id,
			])
			->one();
	}
	
	public function getNewFormSubmissionsCount()
	{
		return FormSubmission::find()
			->where([
				'form_id' => $this->id,
				'is_new' => 1,
			])
			->count();
	}
	
	public function getFormSetting($settingName, $formSettings = null) 
	{
		$formSettings = is_null($formSettings) ? Param::getParams('setting', true) : $formSettings;
		
		$formSetting = $formSettings[ array_search($settingName, array_column($formSettings, 'name')) ];
		$form_settings = json_decode($this->form_settings, true);		
		$form_setting = $form_settings[$formSetting['id']];
		
		return $form_setting ?? $formSetting['default_value'];
	}
	
	public function setFormSetting($settingName, $value, $formSettings = null) 
	{
		$formSettings = is_null($formSettings) ? Param::getParams('setting', true) : $formSettings;
		
		$formSetting = $formSettings[ array_search($settingName, array_column($formSettings, 'name')) ];
		$form_settings = json_decode($this->form_settings, true);		
		$form_settings[$formSetting['id']] = $value;
		$this->form_settings = json_encode($form_settings);
		$this->save();
		
		return $form_setting ?? $formSetting['default_value'];
	}
	
}
