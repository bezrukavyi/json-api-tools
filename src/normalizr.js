import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import reduce from 'lodash/reduce'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import camelCase from 'lodash/camelCase'

import camelCaseKeys from './camelCaseKeys'

const keys = Object.keys

const normalizeEntity = (entity) => {
  const normalized = {
    id: entity.id,
    type: camelCase(entity.type),
  }

  keys(entity.attributes || []).forEach((key) => {
    normalized[key] = entity.attributes[key]
  })

  keys(entity.relationships || []).forEach((key) => {
    const value = entity.relationships[key]
    if (isArray(value.data)) {
      normalized[key] = value.data.map((item) => item.id)
    } else if (isObject(value.data)) {
      normalized[key] = value.data.id
    }
  })

  return normalized
}

const normalizeResponse = ({ data, included }) => {
  let entities = []
    .concat((isArray(data) ? data : [data]).map(normalizeEntity))
    .concat((included || []).map(normalizeEntity))

  entities = groupBy(entities, (value) => value.type)
  entities = mapValues(entities, (value) =>
    reduce(value, (result, resultValue) => {
      const formatResult = result
      formatResult[resultValue.id] = camelCaseKeys(resultValue)
      return formatResult
    }, {})
  )

  const results = mapValues(entities, (value) =>
    keys(value).map((key) => parseInt(key, 10) || key)
  )
  return { results, entities }
}

const normalize = (obj) => {
  if (!isObject(obj)) {
    throw new Error('Normalize JSON API accepts an object as its input.')
  }
  return normalizeResponse(obj)
}

export default normalize
