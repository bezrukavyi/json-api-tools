'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _groupBy = require('lodash/groupBy');

var _groupBy2 = _interopRequireDefault(_groupBy);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _camelCaseKeys = require('./camelCaseKeys');

var _camelCaseKeys2 = _interopRequireDefault(_camelCaseKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keys = Object.keys;

var normalizeEntity = function normalizeEntity(entity) {
  var normalized = {
    id: entity.id,
    type: (0, _camelCase2.default)(entity.type)
  };

  keys(entity.attributes || []).forEach(function (key) {
    normalized[key] = entity.attributes[key];
  });

  keys(entity.relationships || []).forEach(function (key) {
    var value = entity.relationships[key];
    if ((0, _isArray2.default)(value.data)) {
      normalized[key] = value.data.map(function (item) {
        return item.id;
      });
    } else if ((0, _isObject2.default)(value.data)) {
      normalized[key] = value.data.id;
    }
  });

  return normalized;
};

var normalizeResponse = function normalizeResponse(_ref) {
  var data = _ref.data,
      included = _ref.included;

  var entities = [].concat(((0, _isArray2.default)(data) ? data : [data]).map(normalizeEntity)).concat((included || []).map(normalizeEntity));

  entities = (0, _groupBy2.default)(entities, function (value) {
    return value.type;
  });
  entities = (0, _mapValues2.default)(entities, function (value) {
    return (0, _reduce2.default)(value, function (result, resultValue) {
      var formatResult = result;
      formatResult[resultValue.id] = (0, _camelCaseKeys2.default)(resultValue);
      return formatResult;
    }, {});
  });

  var results = (0, _mapValues2.default)(entities, function (value) {
    return keys(value).map(function (key) {
      return parseInt(key, 10) || key;
    });
  });
  return { results: results, entities: entities };
};

var normalize = function normalize(obj) {
  if (!(0, _isObject2.default)(obj)) {
    throw new Error('Normalize JSON API accepts an object as its input.');
  }
  return normalizeResponse(obj);
};

exports.default = normalize;