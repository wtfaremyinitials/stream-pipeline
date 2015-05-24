module.exports = require('./dist/pipeline.js');
module.exports.createPipeline = function(transforms) { return new module.exports(transforms) };
