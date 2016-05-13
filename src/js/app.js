/*eslint no-unused-vars: ["error", {"args": "none"}]*/
'use strict';

global.__DEV__  = true;
global.__PROD__ = false;

import React        from 'react';
import ReactDOM     from 'react-dom';
import { Router, Route, browserHistory, IndexRoute} from 'react-router';
import FastClick    from 'fastclick';

//start importing your components
import AppConstants from './constants/AppConstants'
import CoreLayout	from './layouts/CoreLayout'
import MainLayout	from './layouts/MainLayout'
import HomeView		from './components/HomeView'
import AboutView 	from './components/AboutView'
import PageNotFound from './components/NotFoundView';


//Executes on loaded content or DOM complete events
function run() {
	ReactDOM.render(   
        <Router history={ browserHistory }>
        	<Route path='/' component={CoreLayout}>
		      	<IndexRoute component={HomeView} />
		      	<Route path='/about' component={AboutView} />
		      	<Route path='*' component={PageNotFound} />
		  	</Route>
            <Route path="*" component={ PageNotFound }/>
        </Router>,
		document.getElementById('app')
	);
}

//Run the application when both DOM is ready and page content is loaded
Promise.all([
    new Promise((resolve, reject) => {
        //non IE browsers
        if (window.addEventListener) {
            window.addEventListener('DOMContentLoaded', resolve);
        } else {
            window.attachEvent('onload', resolve);
        }
    }).then( (val) => {
        // Make taps on links and buttons work fast on mobiles
        FastClick.attach(document.body);
    })
//when the DOM is ready call the run fn    
]).then( (ev) => {
    if (AppConstants.LoadedStates.includes(document.readyState) && document.body) run()
    else window.addEventListener('DOMContentLoaded', run, false);
});