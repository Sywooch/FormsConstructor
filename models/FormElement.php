<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class FormElement extends ActiveRecord
{

	public function getElementParams()
    {
        return $this->hasMany(FormElementToParam::className(), ['form_element_id' => 'id']);
    }

    public function getParams()
    {
        return $this->hasMany(Param::className(), ['id' => 'param_id'])
            ->via('elementParams');
    }
	
	public function attributeLabels()
    {
        return [
            'name' => Yii::t('site', 'Form Element Name'),
        ];
    }
	
	public function rules()
    {
        $rules = [
            'requiredFields' => [['name', 'label'], 'required'],
            'trimValues' => [['name', 'label'], 'trim'],
			'maxLength' => [['name', 'label'], 'string', 'max' => 255],
			'defaultImage' => ['img', 'default', 'log-in'],
        ];

        return $rules;
    }
	
	public static function tableName()
    {
        return '{{form_element}}';
    }
	
}
