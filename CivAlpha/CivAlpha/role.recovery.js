var roleRecovery = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var debug = false;
        var color = '#000000';
        
        creep.moveTo(Game.spawns['Spawn1'], { visualizePathStyle: { stroke: color } })
	}
};

module.exports = roleRecovery;