<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Pattern extends ActiveRecord
{
	
	public function attributeLabels()
    {
        return [
            'name' => Yii::t('site', 'Pattern Name'),
			'img' => Yii::t('site', 'Pattern Image'),
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
	
}
