'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from './hello';

class Hello extends React.Component {
	render () {
		return <h1>Hello React!</h1>
	}
}

React.render(
	<HelloWorld parse="ES6"/>, document.getElementById('app2'),
	<Hello />, document.getElementById('app')
)