# Event Scheduler App
A simple app that allows you to schedule events. While being able to start and run both frontend and backend is not 
required it is recommended as it will allow you to see the application in action and may help you debug.

This app consists of a SpringBoot backend and a React frontend leveraging Material UI.

## Requirements
#### Backend
- Java 11+
#### Frontend
- Node 16+  
- NPM 8+  

## Starting the Events UI
> Before your first run will need to run NPM Install from the events-ui directory
```bash
cd events-ui
npm install
```

All commands should be run in the root directory of the project.

### `npm --prefix events-ui start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm --prefix events-ui test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm --prefix events-ui run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Starting the Events API
All commands should be run in the root directory of the project.

### `./gradlew bootRun`
Runs the app.  
The API will be accessible at [http://localhost:8080](http://localhost:8080) 
there is a [postman project](events-api.postman_collection.json) as well as sample [curl requests](curl.text) 

### `./gradlew test`
This will run all java tests and report the result

### `./gradlew build`
Builds the app for production to the `build` folder.\