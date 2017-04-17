var SourceMonitor = function (roomsList, manualAssignment) {
    this.roomsList = roomsList;
    this.manualAssignment = manualAssignment;
    this.sourcesList = [];
    this.harvestersList = [];
    this.configurations = [];
    this.initialized = false;
}

SourceMonitor.prototype = {
    init: function () {
        var debug = false;
        if (debug) console.log('initialize SourceMonitor, controling rooms: ' + JSON.stringify(this.roomsList));
        this.sourcesList = [];
        this.harvestersList = [];
        this.configuration = [];
        for (var i = 0; i < this.roomsList.length; i++) {
            var src = { room: this.roomsList[i], sources: [] };
            var config = { room: this.roomsList[i], sources: [] }
            var m = Game.rooms[this.roomsList[i]];
            if (debug) console.log('room ' + this.roomsList[i] + ': ' + JSON.stringify(m));
            var sources = m.find(FIND_SOURCES);
            if (debug) console.log('found sources: ' + JSON.stringify(sources));
            for (var j = 0; j < sources.length; j++) {
                src.sources.push({ id: sources[j].id });
                config.sources.push({ id: sources[j].id, creeps: [] });
            }
            this.sourcesList.push(src);
            this.configurations.push(config);

            var crps = m.find(FIND_CREEPS);
            if (debug) console.log('creeps in room: ' + crps.length);
            var harvesters = _.filter(crps, function (creep) {
                return (creep.memory.role == 'harvester');
            });
            if (debug) console.log('harvesters in room: ' + harvesters.length);
            var crp = { room: this.roomsList[i], creeps: [] };
            for (var j = 0; j < harvesters.length; j++) {
                crp.creeps.push(harvesters[j].id);
            }
            this.harvestersList.push(crp);
        }
        this.initialized = true;
    },
    buildConfiguration: function () {
        var debug = false;
        for (var i = 0; i < this.configurations.length; i++) {
            var conf = this.configurations[i];
            if (debug) console.log('conf: ' + JSON.stringify(conf));
            var harvesters = this.harvestersList.filter(function (val) {
                return val.room == conf.room;
            })[0].creeps;
            var harvPerSource = harvesters.length / conf.sources.length;
            for (var j = 0; j < harvesters.length; j++) {
                if (debug) console.log('assigning harvester(' + j + '): ' + JSON.stringify(harvesters[j]));
                for (var k = 0; k < conf.sources.length; k++) {
                    var manConf = this.manualAssignment.filter(function (val) {
                        return val.id == conf.sources[k].id;
                    });
                    if (manConf.length) {
                        if (conf.sources[k].creeps.length < manConf[0].harvestersCount) {
                            conf.sources[k].creeps.push(harvesters[j]);
                            break;
                        }
                    }
                    else if (conf.sources[k].creeps.length < harvPerSource) {
                        conf.sources[k].creeps.push(harvesters[j]);
                        break;
                    }
                }
            }
        }

        if (debug) console.log('builded config: ' + JSON.stringify(this.configurations));
    },
    toString: function () {
        return JSON.stringify(this);
    },
    applyConfiguration: function () {
        for (var i = 0; i < this.configurations.length; i++) {
            var config = this.configurations[i];
            for (var j = 0; j < config.sources.length; j++) {
                var src = config.sources[j];
                for (var k = 0; k < src.creeps.length; k++) {
                    var crp = Game.getObjectById(src.creeps[k]);
                    crp.memory.target = src.id;
                }
            }
        }
    },
    loop: function () {
        var debug = false;
        if (debug) console.log('SourceMonitor.loop()');
        this.buildConfiguration();
        this.applyConfiguration();
    }
};

module.exports = SourceMonitor;