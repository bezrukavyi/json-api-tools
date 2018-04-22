## Json Api Transform
Suitable tools for transform [json api](http://jsonapi.org/) response

## Installation
    npm install json-api-transform --save

## Usage
In ```reducer.js```

```javascript
import { insert, clear, slice } from 'json-api-transform'

const reducer = (state = {}, { type, entityTypes, payload }) => {
  switch (type) {
    case 'FETCH_ANY_ENTITY_SUCCESS':
    case 'FETCH_ANY_ENTITIES_SUCCESS':
    case 'UPDATE_ANY_ENTITY_SUCCESS':
    case 'CREATE_ANY_ENTITY_SUCCESS': {
      return insert(state, payload.data)
    }
    case 'DESTROY_ANY_ENTITY_SUCCESS': {
    case 'DESTROY_ANY_ENTITIES_SUCCESS': {
      return slice(state, payload.data)
    }
    case 'CLEAR_ANY_ENTITIES': {
      return clear(state, entityTypes)
    }
    default:
      return state
  }
}

export default reducer
```

All functions are **immutable**

### Insert to state
`insert` will return new state with response entities

### Slice from state
`slice` will return new state without response entities

### Clear state
`clear` will return new state without entities by special types

### Custom transform function

```javascript
import { transform } from 'json-api-transform'

const transformerFunction = (state, currentEntitiesArray, currentEntitiesTypeString) => {
  return state
}

myCustomTransform = (state, data) => transform(state, data, transformerFunction)
```

`transformerFunction` is function that takes 3 arguments:

1. `state` - default object
2. `entities` - array of normalized objects
3. `type` - type(string) of current entities 

All data from response will be normalized by `normalizr` function. Example:

```javascript
import { normalizr } from 'json-api-transform'

data = {
  "data":[
    {
      "id":"1",
      "type":"projects",
      "attributes":{
        "title":"Project 1",
      },
      "relationships":{
        "tasks":{
          "data":[
            {
              "id":"1",
              "type":"tasks"
            }
          ]
        }
      }
    }
  ],
  "included":[
    {
      "id":"1",
      "type":"tasks",
      "attributes":{
        "title":"Task 1.1",
        "project-id":1
      }
    }
  ]
}

normalizedData = normalizr(data)
```

Return next

```json
{
  "entities":{
    "projects":{
      "byId":{
        "1":{ "id":"1", "type":"projects", "title":"Project 1", "tasks":["1"] }
      },
      "allIds":["1"]
    },
    "tasks":{
      "byId":{
        "1":{ "id":"1", "type":"tasks", "title":"Task 1.1", "projectId":1 }
      },
      "allIds":["1"]
    }
  }
}
```

## License

The components is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
