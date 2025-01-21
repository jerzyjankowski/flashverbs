# Backlog
- verbs for other languages than italian
- refactor, styled components, split into comopnents, etc.
- english version of polish translations
- learning verb conjugation (all 6 versions) in different learning type
- card in questions has different type than card in configs (initialized learning fields can be mandatory)
- passing time visible in card's background working as a bar getting smaller (~10s per flashcard)

# Run app on Android

one command:
```npm run android```
or those steps:

remove android folder
run commands:
```
npm run build
ionic capacitor add android
npx cap open android
```
Android Studio will run. After loading time run app on connected Android phone.

# Versions

## 0.2.2
- counting rounds in same speed (how many times all cards were asked about at minimum + 1)
- coloring border and header to darkred in case of last card in round

## 0.2.1
- added icons and splashscreen
  - https://enappd.com/blog/icon-splash-in-ionic-react-capacitor-apps/114/
- added 'NEW' category
- height fixes for iOS chrome: 100dvh instead 100vh, white background buttons to keep height (?)
- clicking Italian answer card goes through conjugation
- 
## 0.2.0
- better android app creation (package.json script)
- start menu configuration
  - cards pool: all, irregular, saved, test
  - max number of cards: 10/20/30/all
  - question type: from native or to native
  - questioning speed: all unlearnt questions asked the same number of time or fully randomized - still keeping 3 questions distance
- clock for questions time
- saving and loading current set of unlearnt questions

## 0.1.1
- ionic, capacitor, android app
  https://medium.com/how-to-react/convert-your-existing-react-js-app-to-android-or-ios-app-using-the-ionic-capacitor-a127deda75bd
  https://capacitorjs.com/docs/getting-started - "npm i -D @capacitor/cli"
- 
## 0.1.0
- config with 140 italian verbs with presentIndicative conjugation splitted in regular groups and irregular group
- starting lesson with 10/20/30/all random flashcards
- displaying flashcard (question on top, answer below)
- header with number of turns and flashcards left
- footer to display answer or react on answer (learnt and removed from current pool, or next)
- clicking answer displays conjugation
- clicking question opens settings (restart questions learnt field, reverse question pl->it or it->pl)
- started Backlog and versions in README



// TODO: clean-up:
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
