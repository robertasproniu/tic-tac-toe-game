<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app){
    return view('game', [
        'path' => url('js/tictactoe.js')
    ]);
});

/**
 * accept only json request
 */

$app->group(['prefix' => 'api', 'middleware' => 'json-only'], function() use ($app)
{
    $app->get('/params', [
        'uses' => 'TicTacToeController@getParams'
    ]);

    $app->post('/play', [
        'uses' => 'TicTacToeController@playGame'
    ]);

});




