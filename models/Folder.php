<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Folder extends ActiveRecord
{

	public function getFolderForms()
    {
        return $this->hasMany(FolderToForm::className(), ['folder_id' => 'id']);
    }

    public function getForms()
    {
        return $this->hasMany(Form::className(), ['id' => 'form_id'])
            ->via('folderForms');
    }

	public function attributeLabels()
    {
        return [
            'name' => Yii::t('site', 'Folder Name'),
        ];
    }
	
	public function rules()
    {
        $rules = [
            'requiredFields' => [['!user_id', 'name'], 'required'],
            'trimValues' => ['name', 'trim'],
			'emptyToNull' => ['parent_id', 'default'],
			'maxLength' => ['name', 'string', 'max' => 255],
			'access' => [
				'!user_id', 
				'compare', 
				'compareValue' => Yii::$app->user->id, 
				'type' => 'number',
				'message' => Yii::t('site', 'Content access error'),
			],
        ];

        return $rules;
    }
	
}
