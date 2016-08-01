define(['durandal/viewEngine',
	'plugins/router',
	'jquery',
	'knockout',
	'react',
	'reactDOM'],
function(viewEngine, router, $, ko, React, ReactDOM) {
	var reactDurandal = {};

	// Do some checks to ensure we have jQuery, knockout, React, and ReactDOM;
	if (!$) {
		$ = window.$;
	}
	if (!ko) {
		ko = window.ko;
	}
	if (!React) {
		React = window.React;
	}
	if (!ReactDOM) {
		ReactDOM = window.ReactDOM;
	}
	if (!$ || !ko || !React || !ReactDOM) {
		throw new Error("You need jQuery, knockout, React and ReactDOM for the react-durandal " +
			"library to function.");
	}

	// Add a custom binding for React components. This allows for more flexibility to simply drop in
	// react components into existing Durandal viewmodels rather than needing to write React
	// viewmodels from scratch.
	// Takes a single param: Component (React Component) (required) - this is an actual React
	//		component instance.
	// Optionally, pass in a props object as a sibling binding.
	// Usage:
	// <div data-bind="react: ReactComponent, props: { info: model().property }"></div>
	function addKoHooks() {
		ko.bindingHandlers.react = {
			init: function() {
				return { controlsDescendantBindings: true };
			},
			update: function(el, valueAccessor, allBindings) {
				var Component = ko.unwrap(valueAccessor());
				var props = ko.toJS(allBindings.get('props'));
				props.onChange = function(newValue) {
					if (props.value && ko.isObservable(props.value)) {
						props.value(newValue);
					}
				};
				ReactDOM.render(React.createElement(Component, props), el);
			}
		};
	}

	// Create a placeholder view. This prevents Durandal from throwing up a "view not found" message
	// before we can replace it with our React component. It also also makes it slightly easier to
	// hook into.
	var placeholderEl = $('<div/>');
	var placeholderViewName = 'views/reactviewplaceholder';
	placeholderEl.attr('data-view', placeholderViewName);
	// The default view convention for Durandal looks for a Require-processed view, so we need to
	// add the appropriate prefix and extension to get it to find our placeholder
	var placeholderViewRequireString = 'text!' + placeholderViewName + '.html';
	viewEngine.putViewInCache(placeholderViewRequireString, placeholderEl[0]);

	// Insert our React component into the view!
	function composeReact(routeConfig, props) {
		var routeId = routeConfig.moduleId.replace("/","");
		var insertionElement = $('#' + routeId)[0];
		if (!insertionElement) {
			$("[data-view='" + placeholderViewName + "']").replaceWith("<div id='" + routeId
				+ "'></div>");
			insertionElement = $('#' + routeId)[0];
		}
		// Get the actual component class by requiring it.
		var component = require(routeConfig.moduleId);
		ReactDOM.render(React.createElement(component, props), insertionElement);
	}

	// Callback for "router:route:activating" Durandal Router event. When we activate a viewmodel
	// that is a React component, we want to be able to send the component the route activation data
	// without needing to modify the component to hook into the Durandal lifecycle by adding
	// activate, deactivate, etc.
	function onActivatingCallback(instance, instruction, router) {
		if (!!instruction.config.react) {
			var props = this;
			var route = instruction.config.route;
			var routeParamRegex = /:\w*/g;
			instance.viewUrl = placeholderViewName;
			instance.activate = function() {
				// Any route params are passed in as individual arguments. Props, however,
				// need to be an object. But we also want to associate the correct route
				// params with the right props.
				var args = Array.prototype.slice.call(arguments);
				var routeParams = route.match(routeParamRegex);
				routeParams.forEach(function(param, index) {
					// remove the semicolon via substr to get the proper param name
					props[param.substr(1)] = args[index];
				});
			};
		}
	}

	// Callback for "router:navigation:composition-complete". This is where we want to actually do
	// the insertion of the instantiated React component into the DOM.
	function onCompositionCompleteCallback(instance, instruction, router) {
		var props = this;
		if (!!instruction.config.react) {
			composeReact(instruction.config, props);
		}
	}

	// Simple API: just initialize the library and start using React components! Woo!
	reactDurandal.initialize = function() {
		addKoHooks();
		// Hook into Durandal router by wrapping the buildNavigationModel function. That way, when
		// the routes are built, we automatically add the necessary hooks to get the React
		// components into the app.
		var originalBuildNavigationModelFn = router.buildNavigationModel;
		var props = {};
		router.buildNavigationModel = function(defaultOrder) {
			var builtRouter = originalBuildNavigationModelFn.call(router, defaultOrder);
			builtRouter.on("router:route:activating", onActivatingCallback.bind(props))
				.on("router:navigation:composition-complete",
					onCompositionCompleteCallback.bind(props));
			return router;
		};
	};

	return reactDurandal;
});