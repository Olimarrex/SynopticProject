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
    this.validate = function () {
        var error = validatePropertiesExist(maze, ['rooms'], 'maze');
        if (error) {
            return error;
        }
        for (var i = 0; i < maze.rooms.length; i++) {
            error = validateRoom(i);
            if (error) {
                return error;
            }
        }
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
};