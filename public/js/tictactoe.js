function TTT(sentOptions) {
    //Since we are using Jquery we need to throw an error if it is not loaded
    if (!window.jQuery && !window.$) {
        throwError('noJquery');
    }

    // keep error messages by code
    var errors = {
        noJquery: "JQuery is not included, TicTacToe requires JQuery to work",
        noContainer: "Please provide a container for TicTacToe game. This must be the Id of the element",
        noServiceEndpoint: "Please provide http(s) endpoint for web service of TicTacToe game",
        generalError: "An unknown error has occurred"
    };
    var VERSION = 0.1;


    var throwError = function (errorKey) {
        var errorText = errors[errorKey] || errors.generalError;
        throw new Error('TTT: ' + errorText)
    };


    var options = {
        containerId: null,
        serviceEndpoint: null
    }

    var game = {
        board: [],
        players: ['X', 'O'],
        state: {
            active: true,
            winner: ""
        }
    }

    $.extend(options, sentOptions, true);

    /**
     * web service provider
     * @returns {{init: init, play: play}}
     */
    var $http = function () {
        if (!options.serviceEndpoint) {
            throwError(errors.noServiceEndpoint);
            return false;
        }
        // helper
        var ajaxCall = function (method, url, data) {
            method = method.toUpperCase() || 'GET';

            return $.ajax({
                url: options.serviceEndpoint + '/' + url,
                method: method,
                data: JSON.stringify(data) || null,
                dataType: "json",
                beforeSend: function () {
                    // show loader
                    $loader().show();
                    // deactivate
                    $board().deactivate();
                }
            }).always(function () {
                $loader().hide();
            });
        };

        return {
            init: function () {
                return ajaxCall('get', 'params')
            },

            play: function (data) {
                return ajaxCall('post', 'play', data)
            }
        }
    };


    /**
     * Game set
     *
     * @returns {{state: state, board: board, players: players}}
     */
    var $game = function () {

        return {
            state: function (data) {
                if (data) {
                    $.extend(game.state, data || {});
                }

                return game.state;
            },

            board: function (data) {
                if (data) {
                    $.extend(game.board, data || []);
                }

                return game.board;
            },

            players: function (data) {
                if (data) {
                    $.extend(game.players, data || []);
                }

                return game.players;
            }
        }
    }

    /**
     * initialize container
     * @returns {boolean}
     */
    var $container = function () {

        options.containerId = $('#' + options.containerId);

        if (!options.containerId.length) {

            throwError(errors.noContainer);
            return false;

        }

        options.containerId.html(null);
    };

    /**
     * loader elem
     * @returns {{show: show, hide: hide}}
     */
    var $loader = function () {
        var loaderElem = $('.loader');

        if (!options.containerId.find(loaderElem).length) {
            (loaderElem = $('<div>')
                    .addClass('hide')
                    .addClass('loader')
                    .css({
                        'position': 'absolute',
                        'left': 0,
                        'right': 0,
                        'top': 0,
                        'bottom': 0,
                        'background': '#fff',
                        'opacity': '0'
                    })
            ).appendTo(options.containerId);
        }

        return {
            show: function () {
                loaderElem.removeClass('hide');
            },
            hide: function () {
                loaderElem.addClass('hide');
            }
        }
    }


    var $board = function () {
        var boardElem = $('.board');

        if (!options.containerId.find(boardElem).length) {
            var boardElem = $('<div>')
                .addClass('board');
            boardElem.appendTo(options.containerId);
        }

        var boardEvents = function () {

            boardElem.off('click').on('click', '.col', function (e) {
                var cell = $(this);

                // if game state is not active then stop click
                if (cell.text() || !$game().state().active) {
                    e.preventDefault();

                    return false;
                }

                var position = cell.data('position').split(','),
                    board = $board().update(position, $players().currentPlayer);

                $http().play({
                    board: $board().get(),
                    player: $players().opponentPlayer
                }).then(function (data) {

                    $board().draw(data.response.board || {});

                    $game().state(data.response.game || {});

                    $reporter().notify();

                });
            });

            boardElem.off('mouseover').on('mouseover', '.col', function (e) {
                var cell = $(this);
                boardElem.find('.col').removeClass('no-cursor');

                // if game state is not active then stop click
                if (cell.text() || !$game().state().active) {
                    cell.addClass('no-cursor');
                }
            });

        }

        boardEvents();

        return {
            get: function () {
                return $game().board()
            },

            update: function (position, value) {
                $game().board()[position[0]][position[1]] = value;
                this.draw();
            },

            draw: function (data) {
                if (data) {
                    $game().board(data);
                }
                // clear board

                boardElem.html(null);

                $.each($game().board(), function (indexX, data) {

                    var col = ($('<div>').addClass('row'));
                    var colSize = Math.ceil(12 / data.length) || 12;

                    $.each(data, function (indexY, value) {
                        $('<div>')
                            .addClass('col')
                            .addClass('col-lg-' + colSize + ' col-md-' + colSize)
                            .attr('data-position', indexX + ',' + indexY)
                            .appendTo(col).text(value || '');
                    });

                    col.appendTo(boardElem);
                });


            },

            deactivate: function () {
                boardElem.off('click').on('click', '.col', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                });
            },
        }
    };

    var $reporter = function () {

        var reporterElem = $('.reporter');

        if (!options.containerId.find(reporterElem).length) {
            reporterElem = $('<div>').addClass('reporter').addClass('row').appendTo(options.containerId);
        }


        return {
            notify: function () {

                reporterElem.html(null);

                var content = [],
                    gameState = $game().state(),
                    text = null;

                if (!gameState.active) {
                    text = gameState.winner ? gameState.winner + ' won!' : 'It\'s a draw!';

                }


                $('<div>').text($players().currentPlayer).addClass('col col-lg-4 col-md-4 text-center').appendTo(reporterElem);
                $('<div>').text(text).addClass('col col-lg-4 col-md-4 text-center').appendTo(reporterElem);
                $('<div>').text($players().opponentPlayer).addClass('col col-lg-4 col-md-4 text-center').appendTo(reporterElem);

                if (!gameState.active) {
                    $('<button>').text("Restart").addClass('btn btn-primary').appendTo(options.containerId).on('click', function () {
                        location.reload();
                    });
                }
            }
        }
    };

    var $players = function () {
        var players = $game().players();
        return {
            currentPlayer: players[0],
            opponentPlayer: players[1]
        }
    };


    var initGame = function () {
        // get params
        $container();

        $http().init().then(function ($data) {
            // draw board
            $board().draw($data.response.board || {});
            // game state
            $game().state($data.response.game || {});
            // init players
            $game().players($data.response.players || {});
            // notify
            $reporter().notify();
        });

    };

    // call at the end
    $(document).ready(function () {
        initGame();
    });
}

TTT({
    containerId: 'tic-tac-toe',
    serviceEndpoint: apiEndpoint || null
});