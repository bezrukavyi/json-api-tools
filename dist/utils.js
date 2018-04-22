'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _normalizr = require('./normalizr');

var _normalizr2 = _interopRequireDefault(_normalizr);

var _transform = require('lodash/transform');

var _transform2 = _interopRequireDefault(_transform);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var keys = Object.keys;

var initialState = {
  byId: [],
  allIds: []
};

var transformEntities = function transformEntities(state, data, callback) {
  var normalizedData = (0, _normalizr2.default)(data);

  var transformedEntities = (0, _transform2.default)(normalizedData.entities, function (result, entities, name) {
    return result[name] = callback(state, entities, name);
  }, {});

  return _extends({}, state, transformedEntities);
};

var complementEntities = function complementEntities(state, entities, name) {
  var stateEntities = state[name] || initialState;

  return _extends({}, stateEntities, {
    byId: _extends({}, stateEntities.byId, complementGroupEntities(state, entities)),
    allIds: (0, _uniq2.default)([].concat(_toConsumableArray(stateEntities.allIds), _toConsumableArray(keys(entities))))
  });
};

var complementGroupEntities = function complementGroupEntities(state, entities) {
  return (0, _transform2.default)(entities, function (result, entity, id) {
    return result[id] = _extends({}, (0, _get2.default)(state, entity.type + '.byId.' + entity.id), entity);
  }, {});
};

var sliceEnities = function sliceEnities(state, entities, name) {
  var stateEntities = state[name] || initialState;

  return _extends({}, stateEntities, {
    byId: (0, _pickBy2.default)(stateEntities.byId, function (_ref) {
      var id = _ref.id;
      return !keys(entities).map(Number).includes(Number(id));
    }),
    allIds: (0, _uniq2.default)((0, _filter2.default)(stateEntities.allIds, function (id) {
      return !keys(entities).map(Number).includes(Number(id));
    }))
  });
};

var clearEnities = function clearEnities(state, names) {
  return (0, _pickBy2.default)(state, function (value, key) {
    return !names.includes(key);
  });
};

var insert = function insert(state, data) {
  return transformEntities(state, data, complementEntities);
};
var slice = function slice(state, data) {
  return transformEntities(state, data, sliceEnities);
};
var clear = function clear(state, names) {
  return clearEnities(state, names);
};

exports.default = {
  transform: transformEntities,
  insert: insert,
  slice: slice,
  clear: clear
};