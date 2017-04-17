var CreepPreset = require('CreepPreset');

var CreepMonitor = function (presets) {
    this.presets = presets;
    this.initialized = false;
}  
CreepMonitor.prototype = {
    init: function () {
        for (var i = 0; i < this.presets.length; i++) {
            if (!this.presets[i].initialized) {
                this.presets[i].init();
            }
        }
        this.initialized = true;
        //console.log('CreepMonitor initialized');
    },
    countCreeps: function () {
        var debug = false;
        if (debug) console.log('countCreeps() started, presets has ' + this.presets.length + ' items');
        for (var i = 0; i < this.presets.length; i++) {
            var preset = this.presets[i];
            if (debug) console.log('i = ' + i + '; preset: ' + JSON.stringify(preset));
            var creeps = Game.creeps;
            if (debug) console.log('filtering: ' + JSON.stringify(creeps));
            var presetCreeps = _.filter(creeps, function (creep) {
                if (debug) console.log('creep.memory: ' + JSON.stringify(creep.memory));
                if (debug) {
                    if (creep.memory.role == preset.role) {
                        console.log('role igual: ' + creep.memory.role + '=' + preset.role);
                    }
                    if (creep.memory.grade == preset.grade) {
                        console.log('grade igual: ' + creep.memory.grade + '=' + preset.grade);
                    }
                }
                return (creep.memory.role == preset.role && creep.memory.grade == preset.grade);
            });
            if (debug) console.log('presetCreeps.length: ' + presetCreeps.length + ' items: ' + JSON.stringify(presetCreeps));
            preset.count = presetCreeps.length;
            if (debug) console.log('preset actualizado: ' + JSON.stringify(preset));
        }
    },
    showCount: function () {
        var str = 'presets.length: ' + this.presets.length + '; items: ';
        console.log(str);
        for (var i = 0; i < this.presets.length; i++) {
            console.log(i + ') ' + this.presets[i].role + '(' + this.presets[i].grade + '): ' + this.presets[i].count + '/' + this.presets[i].needed + '; cost: ' + this.presets[i].energyCost);
        }
    },
    cleanDeadCreeps: function () {
        for (var i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    },
    loop: function () {
        this.cleanDeadCreeps();
        this.countCreeps();
    }
};

module.exports = CreepMonitor;