import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MerchantLandingPage from '../containers/MerchantLandingPage';
import Loader from '../../Shared/Loader/components';
import {
    enableHeaderDynamicOpacity,
    disableHeaderDynamicOpacity } from '../../Layout/actions/headerActions';

class Home extends React.Component {

    componentDidMount() {
        this.props.enableHeaderOpacity();
    }

    componentWillUnmount() {
        this.props.disableHeaderOpacity();
    }

    render() {
        const { merchant } = this.props;

        if (Object.getOwnPropertyNames(merchant).length === 0) {
            return (
                <div class="merchant-loader">
                    <Loader loaderClasses="merchant-loader__loader" />
                </div>
            );
        }

        return (
            <MerchantLandingPage
                merchant={merchant}
            />
        );
    }
}

Home.propTypes = {
    merchant: PropTypes.object,
    enableHeaderOpacity: PropTypes.func,
    disableHeaderOpacity: PropTypes.func
};

const mapStateToProps = (store) => ({
    merchant: store.data.merchant
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        enableHeaderOpacity: enableHeaderDynamicOpacity,
        disableHeaderOpacity: disableHeaderDynamicOpacity
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
