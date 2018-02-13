<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class FormView extends ActiveRecord
{

	public function getForm()
    {
        return $this->hasOne(Form::className(), ['id' => 'form_id']);
    }
	
	public function attributeLabels()
    {
        return [];
    }
	
	public function rules()
    {
		return [];
    }
	
	public static function tableName()
    {
        return '{{form_view}}';
    }
	
}
