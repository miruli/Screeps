var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader'); 
var roleBuilder = require('role.builder');
var roleRecovery = require('role.recovery');
var CreepFactory = require('CreepFactory');
var CreepPreset = require('CreepPreset');
var CreepMonitor = require('CreepMonitor');
var SourceMonitor = require('SourceMonitor');


module.exports.loop = function () {

    var list = [];
    list.push(new CreepPreset('harvester', [CARRY], [WORK, MOVE], 1, 3, '#ff0000'));
    list.push(new CreepPreset('upgrader', [CARRY], [WORK, MOVE], 1, 0, '#00ff00'));
    list.push(new CreepPreset('builder', [CARRY], [WORK, MOVE], 1, 1, '#0000ff'));
    list.push(new CreepPreset('harvester', [CARRY], [WORK, MOVE], 2, 13, '#ff0000'));
    list.push(new CreepPreset('upgrader', [CARRY], [WORK, MOVE], 2, 5, '#00ff00'));
    list.push(new CreepPreset('builder', [CARRY], [WORK, MOVE], 2, 5, '#0000ff'));
    var moni = new CreepMonitor(list);
    if (!moni.initiated) {
        moni.init();
    }
    moni.loop();
    moni.showCount();

    var factory = new CreepFactory();
    for (var i = 0; i < moni.presets.length; i++) {
        if (moni.presets[i].needed > moni.presets[i].count) {
            factory.addToQueue(moni.presets[i]);
            break;
        }
    } 
    factory.showQueue();
    factory.loop();

    var manConf = [];
    manConf.push({ id: '58dbc24b8283ff5308a3bad1', harvestersCount: 6 });
    manConf.push({ id: '58dbc24b8283ff5308a3bad3', harvestersCount: 20 });

    var sourceMonitor = new SourceMonitor(['W99S3'], manConf);
    sourceMonitor.init();
    sourceMonitor.loop();

    //monitor.run(creepConfig); 
    //creepFactory.run(creepConfig);
    
    ////console.log('tower?');
    //var tower = Game.getObjectById('a28aea0cf31b429b0208275f');
    //if(tower) {
    //    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //        filter: (structure) => structure.hits < structure.hitsMax
    //    });
    //    if(closestDamagedStructure) {
    //        tower.repair(closestDamagedStructure);
    //    }

    //    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //    if(closestHostile) {
    //        tower.attack(closestHostile);
    //    }
    //}

    //console.log('foreach creeps');
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role.indexOf('harvester', 0) >= 0) {
            roleHarvester.run(creep);
        } 
        if (creep.memory.role.indexOf('upgrader', 0) >= 0) {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role.indexOf('builder', 0) >= 0) {
            roleBuilder.run(creep);  
        }
        if(creep.memory.role == 'recovery') {
            roleRecovery.run(creep);
        }
    }
    
}