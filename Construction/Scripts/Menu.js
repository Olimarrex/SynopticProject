(function () {
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
                        "isExit": true
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
    window.addEventListener('load', function (e) {
        console.log('e');
        var btnStartNew = document.getElementById('startNew');
        var btnConfigureMaze = document.getElementById('configureMaze');
        btnStartNew.addEventListener('click', function () {
            var maze = new Maze(config);
            var error = maze.validate();
            if (error) {
                alert(error);
            }
            else {
                alert('maze configured successfully');
            }

        });
        btnConfigureMaze.addEventListener('click', function () {
            
        });
    });
})();