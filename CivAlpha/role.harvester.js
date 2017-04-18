var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var debug = false;
        var color = '#ffffff';
        if (creep.memory.color) {
            color = creep.memory.color;
        }
        if (debug) console.log('color configured: ' + color);
        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.memory.target) {
                if (debug) console.log('target configured: ' + creep.memory.target);
                src = Game.getObjectById(creep.memory.target);
                if (src) {
                    if (debug) console.log('target found');
                    creep.say('🔄 ' + creep.memory.target);
                    if (creep.harvest(src) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(src, { visualizePathStyle: { stroke: color } });
                    }
                }
                else {
                    if (debug) console.log('target not found');
                }
            }
            else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: color } });
                }
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: color } });
                }
            }
        }
	}
};

module.exports = roleHarvester;