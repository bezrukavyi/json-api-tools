'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var camelCaseKeys = function camelCaseKeys(object) {
  if (!(0, _isObject2.default)(object)) return object;
  if ((0, _isArray2.default)(object)) return object.map(camelCaseKeys);

  return (0, _reduce2.default)(object, function (memo, value, key) {
    if ((0, _isPlainObject2.default)(value) || (0, _isArray2.default)(value)) {
      value = camelCaseKeys(value);
    }
    memo[(0, _camelCase2.default)(key)] = value;
    return memo;
  }, {});
};

exports.default = camelCaseKeys;