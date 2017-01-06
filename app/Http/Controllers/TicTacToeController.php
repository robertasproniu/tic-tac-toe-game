<?php
/**
 * Created by PhpStorm.
 * User: robert.asproniu
 * Date: 1/2/2017
 * Time: 5:39 PM
 */

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use TicTacToeAgent\Contracts\GameInterface;


class TicTacToeController extends Controller
{
    private $game = null;

    private $request = null;

    public function __construct(GameInterface $game, Request $request)
    {
        $this->request = $request;

        $this->game = $game;
    }

    public function getParams()
    {
        return response([
            'players' => $this->game->getPlayers(),
            'board'   => $this->game->getBoard(),
            'game'   => $this->game->getState()
        ]);
    }

    public function playGame()
    {
        $params = (object) $this->request->json()->all();

        if (empty($params->player) || empty($params->board)){
            throw new \Exception('Empty params', 400);
        }

        $moveResponse = $this->game->makeMove($params->board, $params->player);

        return response([
            'move'  => $moveResponse,
            'board' => $this->game->getBoard(),
            'game' => $this->game->getState()
        ]);
    }
}