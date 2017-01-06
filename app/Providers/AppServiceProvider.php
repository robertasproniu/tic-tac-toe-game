<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use TicTacToeAgent\Contracts\GameInterface;
use TicTacToeAgent\Board;
use TicTacToeAgent\TicTacToe;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(GameInterface::class, function(){
            return new TicTacToe(new Board());
        });
    }
}
