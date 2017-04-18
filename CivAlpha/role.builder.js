var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var debug = false;
        var color = '#ffffff';
        if (creep.memory.color) {
            color = creep.memory.color;
        }
        if (debug) console.log('color configured: ' + color);
        // creep.memory.build = true;
        if (creep.memory.build) {
            if (creep.carry.energy == 0) {
                creep.memory.build = false;
            }
        }
        else {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.build = true;
            }
            else {
                creep.memory.build = false;
            }
        }
        if (!creep.memory.build) {
            creep.say('🔋 need energy');
            //var spwns = creep.room.find(FIND_MY_SPAWNS);
            //if (spwns.length) {
            //    var spwn = spwns[0];
            //    if (debug) console.log('needs energy, move to spawn: ' + JSON.stringify(spwn));
            //    creep.moveTo(spwn);
            //    if ((spwn) > [199]) {
                    
            //        var a = spwn.transferEnergy(creep);
            //        if (debug) console.log('taking energy ' + a);
            //    }
            //}
            var src = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(src) == ERR_NOT_IN_RANGE) {
                creep.moveTo(src, { visualizePathStyle: { stroke: color } });
            }
        }
        else {
            if (debug) console.log('have energy, look for repair targets:');
            var structures = creep.room.find(FIND_STRUCTURES);
            if (debug) console.log('structures: ' + JSON.stringify(structures));
            var repairTargets = _.filter(structures, function (struc) {
                if (debug) console.log('struc: ' + JSON.stringify(struc));
                if (debug) console.log('struc.hitsMax = ' + struc.hitsMax + '; struc.hits = ' + struc.hits);
                if (struc.hits >= struc.hitsMax / 2) {
                    if (debug) console.log('return false');
                    return false;
                }
                if (debug) console.log('return true');
                return true;
            });
            if (debug) console.log('repairTargets.length: ' + repairTargets.length);
            if (repairTargets.length) {
                creep.say('🛠 repair');
                if (debug) console.log('have repair targets, go to first one: ');
                if (creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    if (debug) console.log('moveTo: ' + JSON.stringify(repairTargets[0]));
                    creep.moveTo(repairTargets[0], { visualizePathStyle: { stroke: color } });
                }
                else {
                    if (debug) console.log('reparing: ' + JSON.stringify(repairTargets[0]));
                }
            }
            else {
                if (debug) console.log('no repair targets, look for construction targets');
                var constructionTargets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (constructionTargets) {
                    creep.say('🚧 build');
                    if (debug) console.log('have construction targets, go to first one: ');
                    if (creep.build(constructionTargets) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionTargets, { visualizePathStyle: { stroke: color } });
                    }
                    else {
                        if (debug) console.log('building')
                    }
                }
                else {
                    if (debug) console.log('no construction targets');
                }
            }
        }
	}
};

module.exports = roleBuilder;