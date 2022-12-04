# polend_protocol

# Tech Stack
React, typescript, solidity 


# Use Cases
Lending - Polend lends users fund through a system known as over-collateralization, which means that users must provide a collateral token so as to be able to borrow an asset. The user can borrow up to a percentage of the amount deposited. 


# Description
Polend is a decentralized liquidity protocol which allows the lending of stable coins. 


## How the system works
The user is required to deposit a token as collateral which will be held in the smart contract. Without this collateral is will be impossible to borrow an asset.
After a collateral has been supplied the user can borrow a certain amount which must be lesser than the collateral deposited.
The collateral deposited is converted to its equivalent in USD using the chainlink priceFeed oracle, this way the stable coin is pegged to the US dollar.
The protocol at moment uses a mint and burn mechanism. When a coin is borrowed the amount borrowed is minted by the stable coin and sent to the users wallet and when the user repays the stable coin is burnt.


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
