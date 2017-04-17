var CreepPreset = require('CreepPreset');

var CreepFactory = function () {
    this.queue = [];
}
CreepFactory.prototype = {
    addToQueue: function (preset) {
        this.queue.push(preset);
    },
    loop: function () {
        var newQueue = [];
        for (var i = 0; i < this.queue.length; i++) {
            if (i > 0) {
                newQueue.push(this.queue[i]);
            }
            else {
                for (var name in Game.spawns) {
                    var spawn = Game.spawns[name];
                    if (spawn.canCreateCreep(this.queue[i].parts, null, {role: this.queue[i].role}) == 0) {
                        console.log('creating ' + this.queue[i].role);
                        spawn.createCreep(this.queue[i].parts, null, { role: this.queue[i].role, grade: this.queue[i].grade, color: this.queue[i].color });
                    }
                }
            }
        }
        this.queue = newQueue;
    },
    showQueue: function () {
        var str = 'queue.length: ' + this.queue.length + '; items: ';
        for (var i = 0; i < this.queue.length; i++) {
            str = str + ' ' + i + ')' + this.queue[i].role + '(' + this.queue[i].grade + ')';
        }
        console.log(str);
    }
};

module.exports = CreepFactory;