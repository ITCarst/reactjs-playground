'use strict';


import React from 'react';

class HiAgain extends React.component {
	render() {
		return <div>this.displayName</div>;		
	}
	displayName() {
		this.displayName = "Hi Again Message";
	}
} 

export default HiAgain;