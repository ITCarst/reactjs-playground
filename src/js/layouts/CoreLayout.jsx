/*eslint no-unused-vars: ["error", {"args": "none"}]*/
'use strict';

import React, {Component, PropTypes} from 'react';

//components
import Header from '../components/Header'
import Footer from '../components/Footer'

/**
 * Main Class for your app
*/
class CoreLayout extends Component {
	constructor(props, context) {
		super(props, context);
	}	
	render() {
		return (
		     <main>
                <Header />

                <div styleName='main'>
                    {this.props.children}
                </div>

                <Footer />
            </main>
		);
	}
}

export default CoreLayout;
