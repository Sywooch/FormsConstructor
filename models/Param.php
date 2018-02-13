<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Param extends ActiveRecord
{
	
	public $param_type_name;
	
	public static function find()
    {
        return parent::find()
			->select(['param.*', 'dic_param_type.name AS param_type_name'])
			->leftJoin('dic_param_type', 'param.param_type = dic_param_type.id');
    }
	
	public function attributeLabels()
    {
        return [
            'name' => Yii::t('site', 'Param Name'),
        ];
    }
	
	public function rules()
    {
        $rules = [
            'requiredFields' => [['name', 'label', 'default_value'], 'required'],
            'trimValues' => [['name', 'label', 'default_value'], 'trim'],
			'maxLength' => [['name', 'label', 'default_value'], 'string', 'max' => 255],
        ];

        return $rules;
    }
	
	public static function getParams($paramType, $asArray = false)
	{
		$settings = Param::find()
			->where(['dic_param_type.name' => $paramType, 'is_active' => true])
			->orderBy('order_group, name');
		if ($asArray) {
			$settings = $settings->asArray();
		}
		$settings = $settings->all();
		
		return $settings;
	}
	
}
