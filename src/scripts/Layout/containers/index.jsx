import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const mapStateToProps = (state) => ({
    merchant: state.data.merchant
});

const mapDispatchToProps = (dispatch) => ({
    bindActionCreators({
        fetchSuperStoreMerchant
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
