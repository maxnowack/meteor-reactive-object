# meteor-reactive-object [![Build Status](https://travis-ci.org/maxnowack/meteor-reactive-object.svg?branch=master)](https://travis-ci.org/maxnowack/meteor-reactive-object)
Makes an object reactive using es6 proxies

### Installation
````bash
  $ npm install --save meteor-reactive-object
````

### Usage

````es6
import { Tracker } from 'meteor/tracker'
import reactiveObject, { isSupported } from 'meteor-reactive-object'

if (!isSupported()) throw new Error('ES6 proxies are not supported by your environment!')
const obj = reactiveObject() // reactiveObject(intitialValue: object = {}, options: object = { recursive: true, compare: (a, b) => a === b })

Tracker.autorun(() => {
  console.log(obj.foo)
})

obj.foo = 'bar'
````

## License
Licensed under MIT license. Copyright (c) 2017 Max Nowack

## Contributions
Contributions are welcome. Please open issues and/or file Pull Requests.

## Maintainers
- Max Nowack ([maxnowack](https://github.com/maxnowack))
