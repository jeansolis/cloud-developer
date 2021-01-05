import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express applicaiton
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get all cars
  app.get( "/cars", ( req: Request, res: Response ) => {
    const { make } = req.query
    let carsList = cars
    if (make){
      carsList = carsList.filter(car => car.make === make)
    }
    res.status(200).send(carsList);
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a specifc car
  // to demonstrate routing parameters
  // > try it {{host}}/cars/:the_name
  app.get( "/cars/:id", 
    ( req: Request, res: Response ) => {
      let { id } = req.params;

      if ( !id ) {
        return res.status(400)
                  .send(`car ID is required`);
      }

      const car = cars.find(car => car.id === parseInt(id))

      if ( !car) {
        return res.status(404)
                  .send(`car not found`);
      }

      return res.status(200)
                .send(car);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a car 
  // to demonstrate req.body
  // > try it by posting { make: 'new car', type: 'theBest', model: 'allpower', cost: 10 } as 
  // an application/json body to {{host}}/persons
  app.post( "/cars", 
    async ( req: Request, res: Response ) => {

      const { make, type, model, cost } = req.body;

      try {
        [make, type, model, cost].forEach(function(field) {
          if (!field) throw new Error(`missing fields`);
        });
      } catch (e) {
        return res.status(400).send(e.message);
      }

      let nextID = cars.reduce((prev, curr) => { 
        if (curr.id > prev) {
        return curr.id
      } else {
        return prev
      }}, 0)
      const newCar = {make, type, model, cost, id: ++nextID}
      cars.push(newCar)
      return res.status(201)
                .send(newCar);
  } );

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();