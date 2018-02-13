<?php

namespace app\models;

use Yii;

class RegistrationForm extends \dektrium\user\models\RegistrationForm
{
    public $passwordConfirm;
    public $captcha;
    
	/**
     * @inheritdoc
     */
    public function rules()
    {
        $rules = parent::rules();
        
		$rules[] = ['captcha', 'required'];
        $rules[] = ['captcha', 'captcha'];
		
		$rules[] = ['passwordConfirm', 'required'];
		$rules[] = [
			'passwordConfirm', 
			'compare',
			'compareAttribute' => 'password',
			'operator' => '==',
			'message' => Yii::t('user', 'Passwords must match'),
		];
        
		return $rules;
    }
	
	public function attributeLabels()
	{
		$labels = parent::attributeLabels();
    
		$labels['passwordConfirm'] = Yii::t('user', 'Password Confirm');
		
		return $labels;
	}
}