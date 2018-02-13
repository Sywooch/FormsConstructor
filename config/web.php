<?php

$params = require(__DIR__ . '/params.php');

$config = [
    'id' => 'forms',
	'name' => 'FormsConstructor',
    'basePath' => dirname(__DIR__),
    'bootstrap' => [
		'log',
		[
            'class' => 'app\components\LanguageSelector',
            'supportedLanguages' => [
				'en_US' => 'English', 
				'ru' => 'Russian',
			],
        ]
	],
	'language' => 'en_US',
	'timeZone' => 'Europe/Moscow',
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => '225577',
			//'baseUrl' => '',
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
			'transport' => [
				'class' => 'Swift_SmtpTransport',
				'host' => 'mail.fc.ru',
				'username' => 'noreply@fc.ru',
				'password' => 'fc123456zZz',
				'port' => '25',
				//'encryption' => 'tls', 
			],
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),
        
		'assetManager' => [
            'appendTimestamp' => true,
        ],
		
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
				'constructor/folder/<folder_id:\d+>' => 'constructor/index',
				'constructor/form/<form_id:\d+>' => 'constructor/index',
				'form/<form_id:\d+>' => 'form/index',
				'submissions/<id:\d+>' => 'submissions/index',
				'stats/<id:\d+>' => 'stats/index',
            ],
        ],
		
		'view' => [
			'theme' => [
				'pathMap' => [
					'@dektrium/user/views' => '@app/views/user'
				],
			],
		],
		
		'i18n' => [
			'translations' => [
				'site*' => [
					'class' => 'yii\i18n\PhpMessageSource',
					'fileMap' => [
						'site' => 'site.php',
					],
				],
				'user*' => [
					'class' => 'yii\i18n\PhpMessageSource',
					'fileMap' => [
						'user' => 'user.php',
					],
				],
				'forms*' => [
					'class' => 'yii\i18n\PhpMessageSource',
					'fileMap' => [
						'forms' => 'forms.php',
					],
				]
			],
		],
		
    ],
	
	'modules' => [
		'user' => [
			'class' => 'dektrium\user\Module',
			'enableUnconfirmedLogin' => true,
			'admins' => ['admin'],
			'modelMap' => [
				'RegistrationForm' => 'app\models\RegistrationForm',
				'Profile' => 'app\models\Profile',
			],
			'mailer' => [
				'sender'                => ['noreply@fc.ru' => 'FormsConstructor'], // or ['no-reply@myhost.com' => 'Sender name']
				'welcomeSubject'        => 'Welcome to FormsConstructor',
				'confirmationSubject'   => 'Confirmation for FormsConstructor',
				'reconfirmationSubject' => 'Email change for FormsConstructor',
				'recoverySubject'       => 'Account recovery for FormsConstructor',
			],
		],
		'gridview' => [
			'class' => 'kartik\grid\Module',
		]
	],
	
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
