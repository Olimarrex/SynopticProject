'use strict';
//#region typedefs
/**@typedef {Object} passage
 * @property {bool} isExit
 * @property {number} targetRoom
 * @property {string} targetPassage*/

/**@typedef {Object} item
 * @property {string} type
 * @property {string} name
 * @property {number} wealth
 * @property {string} defeat*/

/**@typedef {Object} room
 * @property {item[]} items
 * @property {Object.<string, passage>} passages*/

/**@typedef {Object} maze
 * @property {room[]} rooms*/
//#endregion

/**@param {maze} maze*/
window.Maze = function (maze) {
    var self = this;
    //#region public properties
    this.validate = function () {
        var error = validatePropertiesExist(maze, ['rooms'], 'maze');
        if (error) {
            return error;
        }
        if (maze.rooms.length === 0) {
            return 'must have at least one room!';
        }
        for (var i = 0; i < maze.rooms.length; i++) {
            error = validateRoom(i);
            if (error) {
                return error;
            }
        }
    }

    this.play = function (newPlayer) {
        if (newPlayer) {
            player = newPlayer;
        }
        //render the current room.
        goToRoom(player.roomIndex);
    };

    this.pause = function () { };

    //expose only needed external info to keep maze encapsulated.
    this.getRoomCount = function () {
        return maze.rooms.length;
    }

    this.addItem = function (roomIndex, item) {
        maze.rooms[roomIndex].items.push(item);
        if (player.roomIndex === roomIndex) {
            //render the item and add it.
            var itemDivs = document.getElementById('itemHolder').appendChild(renderItem(roomIndex, maze.rooms[roomIndex].items.length - 1))
        }
    };

    //#endregion
    //#region private properties
    var player;

    function goToRoom(roomIndex) {
        player.roomIndex = roomIndex;

        var room = maze.rooms[roomIndex];
        var roomDiv = document.createElement('div');
        roomDiv.classList.add('room');

        var roomImg = document.createElement('img');
        roomImg.src = '../Assets/Room.png';
        roomImg.classList.add('roomImage')
        roomDiv.appendChild(roomImg);

        var itemHolderDiv = document.createElement('div');
        itemHolderDiv.classList.add('itemHolder');
        itemHolderDiv.id = 'itemHolder';

        //Render items
        for (var i = 0; i < room.items.length; i++) {
            itemHolderDiv.appendChild(renderItem(roomIndex, i));
        }

        //Render pasasges
        forEachPassage(room.passages, function (passage, passageName) {
            var passageDiv = document.createElement('div');
            passageDiv.classList.add('passage', 'interactive', passageName);
            passageDiv.addEventListener('click', function () {
                //If there are no threats
                if (!room.items.some(function (item) { return item.type === 'threat' })) {
                    if (passage.isExit) {
                        alert('you found the exit! your current wealth: ' + player.wealth);
                        if (self.onWin) {
                            self.onWin();
                        }
                    }
                    else {
                        goToRoom(passage.targetRoom);
                    }
                }
                else {
                    alert('you must defeat all threats before venturing forth');
                }
            });
            roomDiv.appendChild(passageDiv);
        });

        roomDiv.appendChild(itemHolderDiv);

        //clear any pre-existing room elements.
        var gameDiv = document.getElementById('roomHolder');
        gameDiv.innerHTML = '';
        gameDiv.appendChild(roomDiv);
    }

    function renderItem(roomIndex, itemIndex) {
        var room = maze.rooms[roomIndex];
        var item = room.items[itemIndex];
        var itemDiv = document.createElement('div');
        itemDiv.classList.add('item', 'interactive', item.type);
        itemDiv.addEventListener('click', function () {
            //index might have changed since - update variable.
            itemIndex = maze.rooms[roomIndex].items.indexOf(item);
            var itemHolderDiv = document.getElementById('itemHolder');
            if (item.type === 'treasure') {
                player.wealth += item.wealth;
                //remove from the screen & remove from maze object.
                room.items.splice(itemIndex, 1);
                itemHolderDiv.children[itemIndex].remove();
                alert('picked up a ' + item.name + ' for ' + item.wealth + ' wealth, current wealth: ' + player.wealth);
            }
            else {
                var killStr = prompt('how do you deal with the ' + item.name);
                if (killStr != null) {
                    if (killStr.toLowerCase() === item.defeat.toLowerCase()) {
                        alert('you defeated the ' + item.name);
                        //remove from the screen & remove from maze object.
                        room.items.splice(itemIndex, 1);
                        itemHolderDiv.children[itemIndex].remove()
                    }
                    else {
                        alert('failed to defeat the ' + item.name);
                    }
                }
            }
        });

        return itemDiv;
    }

    /**@param {room} room*/
    function validateRoom(roomIndex) {
        var room = maze.rooms[roomIndex];

        var error = validatePropertiesExist(room, ['items', 'passages'], 'room: ' + roomIndex);
        if (error) {
            return error;
        }

        for (var i = 0; i < room.items.length; i++) {
            error = validateItem(roomIndex, i);
            if (error) {
                return error;
            }
        }

        forEachPassage(room.passages, function (passage, passageName) {
            if (!error) {
                error = validatePassage(roomIndex, passageName);
            }
        });
        if (error) {
            return error;
        }
    }

    function validatePassage(roomIndex, passageName) {
        var passage = maze.rooms[roomIndex].passages[passageName];
        var passageDesc = passageName + ' passage on room: ' + roomIndex;
        var error = validatePropertiesExist(passage, ['isExit'], passageDesc);
        if (error) {
            return error;
        }
        //Only need to check for other properties and target if isExit is false.
        if (!passage.isExit) {
            error = validatePropertiesExist(passage, ['targetPassage', 'targetRoom'], passageDesc)
            if (error) {
                return error;
            }

            //check to ensure passages have mirrored targets
            var targetPassage = getTargetPassage(passage);
            if (getTargetPassage(targetPassage) !== passage) {
                return passageDesc + ' doesn\'t have a mirrored target! Ensure that the passages target each other.';
            }
        }
    }

    function validateItem(roomIndex, itemIndex) {
        var item = maze.rooms[roomIndex].items[itemIndex];
        var itemDesc = 'item number ' + itemIndex + ' on room number: ' + roomIndex;
        var error = validatePropertiesExist(item, ['type', 'name'], itemDesc);
        if (error) {
            return error;
        }
        if (item.type === 'treasure') {
            error = validatePropertiesExist(item, ['wealth'], itemDesc);
        }
        else if (item.type === 'threat') {
            error = validatePropertiesExist(item, ['defeat'], itemDesc);
        }
        else {
            error = itemDesc + ' has an invalid item type ' + item.type;
        }
        return error;
    }

    function validatePropertiesExist(object, properties, descPrefix) {
        for (var i = 0; i < properties.length; i++) {
            if (!(properties[i] in object)) {
                return descPrefix + ' doesn\'t have property: ' + properties[i];
            }
        }
    }

    /**@param {passage} passage
     * @returns {passage}*/
    function getTargetPassage(passage) {
        if (!maze.rooms[passage.targetRoom] || !maze.rooms[passage.targetRoom].passages[passage.targetPassage]) {
            return null;
        }
        return maze.rooms[passage.targetRoom].passages[passage.targetPassage];
    }


    /**loops through all passages and runs the specified on them.
     * @param {any} passages dict of passages
     * @param {any} func function to run on each passage*/
    function forEachPassage(passages, func) {
        var keys = Object.keys(passages);
        for (var i = 0; i < keys.length; i++) {
            var passage = passages[keys[i]];
            func(passage, keys[i]);
        }
    }
    //#endregion
};