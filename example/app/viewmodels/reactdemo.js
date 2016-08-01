"use strict";

define(['react'], function (React) {

	var ReactDemoComponent = React.createClass({
		displayName: "ReactDemoComponent",

		render: function render() {
			return React.createElement(
				"div",
				{ "className": "jumbotron" },
				React.createElement(
					"h1",
					null,
					"Hello, world! I am a React Component. Woo!"
				),
				React.createElement(
					"h2",
					null,
					"Here is your prop: ",
					this.props.randomData
				)
			);
		}
	});

	return ReactDemoComponent;
});