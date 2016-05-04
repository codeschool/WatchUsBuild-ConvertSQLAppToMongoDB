# MongoDB Watch Us Build

*We changed the name of this series to "Watch Us Build," so you may see an occasional reference to its former name ("Soup to Bits") in this repository.*

This is the repo for the [MongoDB Watch Us Build episode](https://www.codeschool.com/screencasts/convert-a-javascript-sql-app-to-mongodb) that uses a simplified version of [JavaScript.com](https://www.javascript.com/).

## Installing NVM

Install NVM (`$ brew install nvm` and follow instructions)

```bash
nvm install 4.2.1
nvm use 4.2.1
npm install -g gulp
npm install
```

This app authenticates with GitHub, so you'll need to create a [GitHub Application](https://github.com/settings/applications/new) and set ENVs for `GH_CLIENT_ID` and `GH_CLIENT_SECRET`.

## Running

Run the application with `$ npm start`. You can also set the environment variables at start time. Here's an example:

```bash
$ GH_CLIENT_ID=myid GH_CLIENT_SECRET=mysecret npm start
```

For debugging all the things, run `DEBUG=* npm start`.

### Building Assets

To build assets locally, you'll need to install Bower dependencies and run these Gulp tasks:

```bash
$ bower install
$ gulp sass
$ gulp javascript
```

Remember to re-run these tasks after pulling or changing branches.
