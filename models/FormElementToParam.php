<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class FormElementToParam extends ActiveRecord
{

	public function getFormElement()
    {
        return $this->hasOne(FormElement::className(), ['id' => 'form_element_id']);
    }

    public function getParam()
    {
        return $this->hasOne(Param::className(), ['id' => 'param_id']);
    }
	
	public static function tableName()
    {
        return '{{form_element_to_param}}';
    }
	
}
