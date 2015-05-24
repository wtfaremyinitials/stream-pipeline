module.exports.Pipeline = require('./dist/pipeline.js');
module.exports.createPipeline = function(transforms) { return new Pipeline(transforms) };
