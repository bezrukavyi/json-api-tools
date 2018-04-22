import isObject from 'lodash/isObject'
import reduce from 'lodash/reduce'
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import camelCase from 'lodash/camelCase'

const camelCaseKeys = (object) => {
  if (!isObject(object)) return object
  if (isArray(object)) return object.map(camelCaseKeys)

  return reduce(object, (memo, value, key) => {
    if (isPlainObject(value) || isArray(value)) {
      value = camelCaseKeys(value)
    }
    memo[camelCase(key)] = value
    return memo
  }, {})
}

export default camelCaseKeys
