# Development instructions

## Branches

The project is developed in `master` branch.
New feature or fix should come with a pull request from a fork.
You can make a pull request from either your `master` branch or from a feature branch.

Developing the next major version goes in a separate branch made from `master`.

## Running development server and watches

Your Gulp needs to be at least v.3.9.0

Install all npm dependencies:

```sh
npm install
```

The style sheet of the style guide itself could be used as test data.
Start watching UI code changes in lib/app and build the app using the style guides style sheets:

```sh
gulp dev
```

## Running tests

Run all the tests and JSHint linting with

```sh
npm test
```

Node module tests are ran with Mocha, UI related tests with Karma & PhantomJS.

## Coding convention

This project follows Airbnb [JavaScript coding convention](https://github.com/airbnb/javascript) (with a few changes).
The checking is injected into the testing process,
so you can see in Travis respond to your pull-request
if your files follow the convention.

To be able to check during development, please

* run `$ gulp jshint`
* use [pre-commit hook](https://github.com/SC5/sc5-configurations/tree/master/.githooks/pre-commit)

## How to release

1. Check that all the needed pull requests are merged
1. Make sure that your clone fetched all the tags which exist in the SC5 repository
1. Rebase your `master` branch against SC5
1. Create `release/x.y.z` branch from `master`  with the number of upcoming version and switch to it
1. Increment the package number in `package.json`
1. Run `gulp publish`
1. Check the `CHANGELOG_LATEST.md` file. You can remove not needed items or rename them.
1. Prepend the contents of the edited `CHANGELOG_LATEST.md` to `CHANGELOG.md`.
1. Commit changes
1. Make a pull request from your release branch into `master` of SC5 organization
1. Once your pull request is merged, rebase `master` on your computer against SC5: 1) `git fetch upstream` 2) `git
   rebase upstream/master`
1. Run `npm publish`
1. Create a versioning tag in GitHub. Insert the `CHANGELOG_LATEST.md` content as a description of this versioning tag.

## Landing page

[Landing page](http://styleguide.sc5.io/) source code is stored in `./site` directory.

Ton run the development server:

```sh
gulp website
```

To deploy server to production:

```sh
gulp website:deploy
```
