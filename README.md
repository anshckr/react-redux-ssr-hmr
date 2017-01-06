# react-redux-starter

Starter kit for react redux application

## Setup

`npm install --dev` to install the necessary dependencies like react, webpack, etc.

## Running

### Dev Environment

* `npm run build-dev` should build your app and watch for changes.
* `npm run start-dev` to start web server at `http://localhost:8080/` and auto reload on changes.

### Prod Environment

* `npm run build` should build your app once.
* `npm run start` to start web server at `http://localhost:8080/`.

## Code Conventions and Guidelines

* Javascript
  * Summary:
    * indentation should be of 4 space char.
    * use upper camelcase for react components and camelcase for other.
    * use single quote in js and double quote in jsx [Quotes Guidelines][3].
  * [Comprehensive code conventions and guidelines][4]
* CSS
  * [BEM - CSS Class Naming Conventions][5]
  * [General CSS Conventions][2]
* HTML - 4 spaces

## Production Environment

* Redux logging can be enabled by setting a cookie `debug` with value `true`.

## Resources

* [Gridle][1] - our CSS Grid System
* [Getting your head around BEM syntax][6]

[1]: http://gridle.org/documentation
[2]: https://github.com/airbnb/css
[3]: https://github.com/airbnb/javascript/tree/master/react#quotes
[4]: https://github.com/airbnb/javascript
[5]: http://getbem.com/
[6]: http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/

## Coding Style

We use ESLint to make sure everyone writes code that follows one standard.

Make sure you run `npm test` to check your code for style errors.

We also use [EditorConfig](http://editorconfig.com/) to keep the behavior of all text editors used by different team members in sync. You will need to set it up for the text editor of your choice to prevent common errors.
