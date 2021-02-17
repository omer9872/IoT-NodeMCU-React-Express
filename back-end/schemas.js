const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const circuit = new Schema({
  circuit: Schema.Types.ObjectId,
  key: Schema.Types.String,
  relay: Schema.Types.Boolean,
  tmpThreshold: Schema.Types.Number,
  hmdThreshold: Schema.Types.Number,
  metThreshold: Schema.Types.Number,
  motThreshold: Schema.Types.Number,
  insertDate: {
    type: Schema.Types.Date,
    default: Date.now
  }
});

const circuitData = new Schema({
  circuit: Schema.Types.ObjectId,
  key: Schema.Types.String,
  temperature: Schema.Types.Number,
  humidity: Schema.Types.Number,
  motion: Schema.Types.Boolean,
  methane: Schema.Types.Number,
  date: {
    type: Schema.Types.Date,
    default: Date.now
  }
});

const circuitModel = mongoose.model('circuit', circuit);
const circuitDataModel = mongoose.model('circuitData', circuitData);

module.exports.circuitModel = circuitModel;
module.exports.circuitDataModel = circuitDataModel;