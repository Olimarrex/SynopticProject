//Handles attaching events to buttons and user input.
'use strict';
(function () {
    //stringified JSON of config kept separately from the maze itself for when a new game of the same config is needed.
    var currConfig;
    //Current maze.
    var currMaze;
    //Current player in the maze.
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

        //switch to game screen
        function play() {
            //show game screen
            mainMenu.style.display = 'none';
            game.style.display = '';

            //attach win event listener - return to menu and hide continue button.
            currMaze.onWin = function () {
                btnContinue.style.display = 'none';
                toMenu();
            }

            currMaze.play(currPlayer);
        }

        //switches to menu screen.
        function toMenu() {
            mainMenu.style.display = '';
            game.style.display = 'none';
        }

        //drops a coin at the player's current room.
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
                //recreate maze
                currMaze = new Maze(JSON.parse(currConfig));

                //new player at random position
                currPlayer = new Player(Math.floor(Math.random() * currMaze.getRoomCount()));

                play();
            });

            btnContinue.addEventListener('click', function () {
                play();
            });

            btnPause.addEventListener('click', function () {
                //show continue button
                btnContinue.style.display = '';

                toMenu();
            });

            btnDropCoin.addEventListener('click', function () {
                dropCoin();
            });

            btnConfigureMaze.addEventListener('click', function () {
                var input = prompt('paste the content of the JSON file wish to import here. See the user guide for details on how to configure mazes.');
                //if user didn't cancel
                if (input !== null) {
                    var config;
                    try {
                        config = JSON.parse(input);
                    }
                    catch (error) {
                        //must have been a parse error, respond with error message.
                        alert('Invalid JSON supplied: ' + error.message);
                        return;
                    }
                    var maze = new Maze(config);
                    var error = maze.validate();
                    //it was valid JSON, but not a valid maze config.
                    if (error) {
                        alert(error);
                    }
                    else {
                        currMaze = maze;
                        currConfig = input;
                    }
                }
            });
        }
    });

    //keyboard inputs for maze navigation.
    window.addEventListener('keydown', function (e) {
        var direction = null;
        if (e.keyCode === 38) {
            // up arrow
            direction = 'north';
        }
        else if (e.keyCode === 40) {
            // down arrow
            direction = 'south';
        }
        else if (e.keyCode === 37) {
            // left arrow
            direction = 'west';
        }
        else if (e.keyCode === 39) {
            // right arrow
            direction = 'east'
        }
        //only move if key pressed was an arrow key and we are currently in the maze.
        if (direction && document.getElementById('game').style.display === '') {
            currMaze.moveDirection(direction);
        }
    });

    (function init() {
        //init defaults
        //default config - unable to fetch due to CORS policy https://stackoverflow.com/a/48403181/10805528
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