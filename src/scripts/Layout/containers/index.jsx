import React, { PropTypes } from 'react';
import classnames from 'classnames';

class Layout extends React.Component {
    constructor() {
        super();
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        if (!this.props.children) {
            return null;
        }

        const containerClasses = classnames({
            container: true
        });

        return (
            <div
                className={containerClasses}
            >
                {this.props.children}
            </div>
        );
    }
}

Layout.propTypes = {
    children: PropTypes.object.isRequired
};

export default Layout;
