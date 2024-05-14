## ShoppingCart

Health session is here, get more fresh fruits into your fridge using ShoppingCart. ShoppingCart is a online fresh market fruit store, user is able to add the desired amount of fruit to the shopping cart, update the shopping cart and checkout at the end.

## Project Goals

This project is part of an evaluation for a 2 weeks frontend JS, HTML, CSS bootcamp.
One of the concept taught is the MVC(Model View Controller) architecture design.
Model is used to manage data and restful APIs, 
View is used to manage the elements in the view port, such as deleting/creating dom element (DOM manipulation),
while Controller allow user to interact with web page, and connects the interaction between Model and View.

In this ShoppingCart project, we use json-server as the backend database, JavaScript as the client and server, 
and the UI using HTML and CSS. Other than exploring MVC architecture design, concepts and knowlegde such as Pagination, APIs, doing request, response data structure 
, CRUD properties and much more is being explored and learnt.

In the ShoppingCart app, user can update the ammount for the desired item, add it to cart, remove it as desire, and checkout cart item.

## Dependencies

`node.js`

install node.js on your device by using either:

[nvm](https://github.com/nvm-sh/nvm)

or

[node](https://nodejs.org/en/download)

## Installation

1. install npm packages

```
npm init -y
npm install live-server
npm install -g json-server
npm install npm-run-all --save-dev
```

2. set up json server for mock db, add this 3 lines to `package.json` under `"scripts"`

```
"json-server": "json-server --watch db.json"
"live-server": "live-server --ignore=./db.json ."
"start": "npm run json-server & npm run live-server"
```

now your script should look like

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "json-server": "json-server --watch db.json",
    "live-server": "live-server --ignore=./db.json .",
    "start": "npm run json-server & npm run live-server",
    "dev": "npm-run-all --parallel json-server live-server"
  }
```

## Start local server

To start the local server for `todolist` app, use

windows:
`npm run dev`

macOS:
`npm run start`
