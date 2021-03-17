(function () {
    var currMaze;

    window.addEventListener('load', function (e) {
        var btnStartNew = document.getElementById('startNew');
        var btnConfigureMaze = document.getElementById('configureMaze');
        var mainMenu = document.getElementById('mainMenu');
        var game = document.getElementById('game');
        btnStartNew.addEventListener('click', function () {
            play();
        });
        btnConfigureMaze.addEventListener('click', function () {
            currMaze = new Maze();
        });

        function play() {
            mainMenu.style.display = 'none';
            game.style.display = '';
            currMaze.play();
        }
        function pause() {

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
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
                        },
                        {
                            "type": "threat",
                            "name": "Troll",
                            "defeat": "Club"
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
        currMaze = new Maze(config);
        var error = currMaze.validate();
        if (error) {
            alert('error in default maze: ' + error);
        }
    })();
})();