/*eslint no-unused-vars: ["error", {"args": "none"}]*/
'use strict';
import React, {Component, PropTypes} from 'react';


class MainLayout extends Component {
    render() {
        return (
            <div>
                HEADER
                <div styleName='main'>
                    {children}
                </div>
                FOOTER
            </div>
        );
    }
}

MainLayout.propTypes = {
  children: PropTypes.element
};

export default MainLayout;

