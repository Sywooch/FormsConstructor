<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class FormFile extends ActiveRecord
{
	
	public $file_type_name;
	
	public static function find()
    {
        return parent::find()
			->select(['form_file.*', 'dic_file_type.name AS file_type_name'])
			->leftJoin('dic_file_type', 'form_file.file_type = dic_file_type.id');
    }
	
	public function getFormFormFile()
    {
        return $this->hasOne(FormToFormFile::className(), ['form_file_id' => 'id']);
    }

    public function getForm()
    {
        return $this->hasOne(Form::className(), ['id' => 'form_id'])
            ->via('formFormFile');
    }
	
	public function attributeLabels()
    {
        return [
            'name' => Yii::t('site', 'File Name'),
        ];
    }
	
	public function rules()
    {
        $rules = [
            'requiredFields' => ['name', 'required'],
            'trimValues' => ['name', 'trim'],
			'maxLength' => ['name', 'string', 'max' => 255],
        ];

        return $rules;
    }
	
	public static function tableName()
    {
        return '{{form_file}}';
    }
	
}
