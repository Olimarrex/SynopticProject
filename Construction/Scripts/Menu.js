'use strict';
(function () {
    var currConfig;
    var currMaze;
    var currPlayer;

    window.addEventListener('load', function (e) {
        var mainMenu = document.getElementById('mainMenu');
        var game = document.getElementById('game');
        var btnStartNew = document.getElementById('startNew');
        var btnContinue = document.getElementById('continue');
        var btnConfigureMaze = document.getElementById('configureMaze');
        var btnPause = document.getElementById('pause');
        var btnDropCoin = document.getElementById('dropCoin');
        configureButtons();

        function play(player) {
            mainMenu.style.display = 'none';
            game.style.display = '';
            currMaze.onWin = function () {
                btnContinue.style.display = 'none';
                toMenu();
            }
            currMaze.play(currPlayer);
        }

        function toMenu() {
            mainMenu.style.display = '';
            game.style.display = 'none';
            currMaze.pause();
        }

        function dropCoin() {
            if (currPlayer.wealth > 0) {
                currPlayer.wealth--;
                currMaze.addItem(currPlayer.roomIndex, { type: 'treasure', wealth: 1, name: 'coin' });
            }
            else {
                alert('you must have at least one coin to drop!');
            }
        }

        function configureButtons() {
            btnStartNew.addEventListener('click', function () {
                currMaze = new Maze(JSON.parse(currConfig));
                currPlayer = new Player(Math.floor(Math.random() * currMaze.getRoomCount()));
                play();
            });
            btnContinue.addEventListener('click', function () {
                play();
            });
            btnPause.addEventListener('click', function () {
                btnContinue.style.display = '';
                toMenu();
            });
            btnDropCoin.addEventListener('click', function () {
                dropCoin();
            });
            btnConfigureMaze.addEventListener('click', function () {
                var input = prompt('paste the content of the JSON file you need here');
                if (input !== null) {
                    try {
                        var config = JSON.parse(input);
                        var maze = new Maze(config);
                        var error = maze.validate();
                        if (error) {
                            alert(error);
                        }
                        else {
                            currMaze = maze;
                            currConfig = input;
                        }
                    }
                    catch (error) {
                        alert('Invalid JSON supplied: ' + error.message);
                    }
                }
            });
        }
    });

    (function init() {
        //init defaults
        var config = {
            "rooms": [
                {
                    "items": [
                        {
                            "type": "treasure",
                            "name": "Gold",
                            "wealth": 100
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        }
                    ],
                    "passages": {
                        "east": {
                            "isExit": false,
                            "targetRoom": 1,
                            "targetPassage": "north"
                        },
                        "south": {
                            "isExit": false,
                            "targetRoom": 1,
                            "targetPassage": "west"
                        }
                    }
                },
                {
                    "items": [
                        {
                            "type": "treasure",
                            "name": "Silver",
                            "wealth": 50
                        },
                        {
                            "type": "threat",
                            "name": "Bomb",
                            "defeat": "Disarm"
                        }
                    ],
                    "passages": {
                        "north": {
                            "isExit": false,
                            "targetRoom": 0,
                            "targetPassage": "east"
                        },
                        "east": {
                            "isExit": true
                        },
                        "west": {
                            "isExit": false,
                            "targetRoom": 0,
                            "targetPassage": "south"
                        }
                    }
                }
            ]
        };
        currConfig = JSON.stringify(config);
        currMaze = new Maze(config);
        var error = currMaze.validate();
        if (error) {
            alert('error in default maze: ' + error);
        }
    })();
})();