import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Dotdotdot from 'react-dotdotdot';
import classnames from 'classnames';

import makeSeoFriendly, { removeUrlProtocol } from '../../Shared/utils/urls';

const StoreCategories = ({ categories }) => {
    const makeCategoryListEl = (category, index) => {
        const description = (category.subcategories.length === 1 ?
            category.subcategories[0].name :
            category.subcategories
                .map(cat => cat.name)
                .reduce((prev, next) => `${prev}, ${next}`));

        const categoryImageClasses = classnames({
            'category-image': true,
            'category-image--default': !category.iconImage,
        });

        return (
            <Link
                to={`/cn/${makeSeoFriendly(category.name)}/cid/${category.id}`}
                key={index}
            >
                <div
                    className="store-categories-list__item"
                >
                    <div className={categoryImageClasses}>
                        { category.iconImage ? (
                            <img
                                className="category-image__img"
                                src={removeUrlProtocol(category.iconImage)}
                                alt={category.name}
                            />
                        ) : null }
                    </div>
                    <div className="category-name">
                        <div className="category-name__name">{category.name}</div>
                        <div className="category-name__description" title={description}>
                            <Dotdotdot clamp={2}>{description}</Dotdotdot>
                        </div>
                    </div>
                    <div className="category-next-icon" />
                </div>
            </Link>
        );
    };

    const midIndex = Math.ceil(categories.length / 2);
    const leftList = categories
        .filter((element, index) => ((index + 1) % 2 === 1))
        .map(makeCategoryListEl);
    const rightList = categories
        .filter((element, index) => ((index + 1) % 2 === 0))
        .map(makeCategoryListEl);

    return (
        <nav className="store-categories-list row">
            <div className="gr-6">
                {leftList}
            </div>
            <div className="gr-6">
                {rightList}
            </div>
        </nav>
    );
};

StoreCategories.propTypes = {
    categories: PropTypes.array.isRequired,
};

export default StoreCategories;
