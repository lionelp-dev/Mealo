<?php

// Set APP_ENV to testing before Laravel loads
putenv('APP_ENV=testing');
$_ENV['APP_ENV'] = 'testing';
$_SERVER['APP_ENV'] = 'testing';

// Load the Laravel autoloader
require dirname(__DIR__).'/vendor/autoload.php';
