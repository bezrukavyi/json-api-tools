import normalizr from './normalizr'

import transform from 'lodash/transform'
import pickBy from 'lodash/pickBy'
import filter from 'lodash/filter'
import uniq from 'lodash/uniq'
import get from 'lodash/get'

const keys = Object.keys

const initialState = {
  byId: [],
  allIds: [],
}

const transformEntities = (state, data, callback) => {
  const normalizedData = normalizr(data)

  const transformedEntities = transform(normalizedData.entities, (result, entities, name) => {
    return result[name] = callback(state, entities, name)
  }, {})

  return { ...state, ...transformedEntities }
}

const complementEntities = (state, entities, name) => {
  const stateEntities = state[name] || initialState

  return {
    ...stateEntities,
    byId: { ...stateEntities.byId, ...complementGroupEntities(state, entities) },
    allIds: uniq([...stateEntities.allIds, ...keys(entities)])
  }
}

const complementGroupEntities = (state, entities) => {
  return transform(entities, (result, entity, id) => {
    return result[id] = {
      ...get(state, `${entity.type}.byId.${entity.id}`),
      ...entity
    }
  }, {})
}

const sliceEnities = (state, entities, name) => {
  const stateEntities = state[name] || initialState

  return {
    ...stateEntities,
    byId: pickBy(stateEntities.byId, ({ id }) => !keys(entities).map(Number).includes(Number(id))),
    allIds: uniq(filter(stateEntities.allIds, (id) => !keys(entities).map(Number).includes(Number(id)))),
  }
}

const clearEnities = (state, names) => {
  return pickBy(state, (value, key) => !names.includes(key))
}

const insert = (state, data) => transformEntities(state, data, complementEntities)
const slice = (state, data) => transformEntities(state, data, sliceEnities)
const clear = (state, names) => clearEnities(state, names)

export default {
  transform: transformEntities,
  insert,
  slice,
  clear,
}
