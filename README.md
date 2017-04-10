# meteor-reactive-object [![Build Status](https://travis-ci.org/maxnowack/meteor-reactive-object.svg?branch=master)](https://travis-ci.org/maxnowack/meteor-reactive-object)
Makes an object reactive using es6 proxies

### installation
````bash
  $ npm install --save meteor-reactive-object
````

### usage

````es6
import { Tracker } from 'meteor/tracker'
import reactiveObject, { isSupported } from 'meteor-reactive-object'

if (!isSupported()) throw new Error('ES6 proxies are not supported by your environment!')
const obj = reactiveObject() // pass an object to define a initial value

Tracker.autorun(() => {
  console.log(obj.foo)
})

obj.foo = 'bar'
````
