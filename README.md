# Durandal-React

Use React.js in Durandal.js.

The library is designed in such a way that you don't need to modify your React components to fit into the Durandal activation lifecycle, decreasing the friction of migration.

## Installation
Right now, the package is not npm published, so either fork/clone the repo, or add the git repo to your package.json directly.

## Running the example app
Clone, `npm install`, and `npm run gulp`. This starts an express server. Go to `localhost:4000/example` to view the app. 

## Overview

Note: this library assumes are doing JSX transpiling for your React components during a build step. The library does not do on-the-fly transpiling of `.jsx` files. [Facebook has deprecated that usage](https://facebook.github.io/react/blog/2015/06/12/deprecatedcating-jstransform-and-react-tools.html).

This library provides two routes for using React components in Durandal:

1. A custom knockout binding
2. Via the native router

## Using the Knockout binding

This is the more straightforward approach if you don't want to migrate entire viewmodels over to React immediately.

```html
<div data-bind="react: YourReactComponent, props: { someIntegerProp: '6' }"></div>
```

In your viewmodel, you'll need to either write your React component inside there (_highly_ not recommended) or import it as a dependency, then include it in your viewmodel's return object.

## Using the native router

This library hooks into Durandal's view engine, routing, and activation lifecycle in order to provide seamless integration of React viewmodels with minimal configuration. Since Durandal uses Require.js, it assumes that your React components are wrapped in an AMD `define`. See `reactdemo.js` in the example app. You may want to have this performed in a build step along with the JSX transpilation to increase your component reusability.

In your Require.js config, add React, ReactDOM, and this library to your list of paths, e.g.,
```javascript
requirejs.config({
    paths: {
        // ...
        'react': '../lib/react',
        'reactDOM': '../lib/react-dom',
        'durandalReact': '../../src/durandal-react'
        // ...
    }
});
```

In your Durandal entrance point, inject `durandalReact`. In the `app.start().then` promise, simply add `durandalReact.initialize();`.

In your route configuration, all you have to do is add `react: true` to any viewmodels that are React components, e.g.,  
```javascript
router.map([
    // ...
    {
        route: ':someId/myReactComponent',
        moduleId: 'viewmodels/myreactcomponent',
        title: 'My React Component',
        nav: true,
        react: true
    }
]).buildNavigationModel();
```

As the above example shows, you can also specify route params. This activation data will automatically be converted to props and mapped into an object!

For the above route, if you navigate to `#23/myReactComponent`, the props object will be `{ someId: 23 }`. This means that you may not need to modify your React components to fit into the Durandal lifecycle, increasing their usability across projects, or reducing migration costs when you move away from Durandal.


