var CreepPreset = function (role, fixedParts, variableParts, grade, needed, color) {
    this.role = role;
    this.fixedParts = fixedParts;
    this.variableParts = variableParts;
    this.parts = [];
    this.grade = grade;
    this.needed = needed;
    this.color = color;
    this.count = 0;
    this.energyCost = 0;
    this.initialized = false;
};
CreepPreset.prototype = {
    init: function () {
        for (var i = 0; i < this.fixedParts.length; i++) {
            this.parts.push(this.fixedParts[i]);
        }
        for (var i = 0; i < this.grade; i++) {
            for (var j = 0; j < this.variableParts.length; j++) {
                this.parts.push(this.variableParts[j]);
            }
        }
        this.energyCost = 0;
        for (var i = 0; i < this.parts.length; i++) {
            this.energyCost = this.energyCost + BODYPART_COST[this.parts[i]];
        }
        this.initialized = true;
        //console.log('CreepPreset initialized');
    },
    toString: function () {
        return JSON.stringify(this);
    }
};

module.exports = CreepPreset;