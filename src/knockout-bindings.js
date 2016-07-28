	/* Custom binding for React components: http://www.intelligiblebabble.com/making-reactjs-and-knockoutjs-play-nice
	  e.g.,
	  <div data-bind="react: ReactComponent, props: { info: model().property }"></div>
	*/
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

	ko.bindingHandlers.muiDatePicker = {
		init: function() {
			return { controlsDescendantBindings: true };
		},
		update: function(el, valueAccessor) {
			var props = ko.unwrap(valueAccessor());
			if (!props.value) {
				throw new Error("The reactDatePicker must be passed in a 'value' prop");
			}
			var ref = ReactDOM.render(React.createElement(reactmui.mui.DatePicker, props), el);
			props.onChange = function(nil, newDate) {
				props.value(newDate);
				ref.setDate(newDate);
			};
		}
	};