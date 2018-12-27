'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
// const API_KEY = require('./apiKey');
// const request = require('request');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-details', (req, res) => {

    const dst = req.body.queryResult.parameters.Destination;
    const src = req.body.queryResult.parameters.Source;
    const vh_type = req.body.queryResult.parameters.Vehicle;

    var options = {method: 'GET',
        url: 'http://52.221.70.49:5032/api/v1/lanesearch',
        qs: 
        { 
         source: src,
         destination:dst ,
         vehicletype: vh_type,
         bodytype: 'Open%20Body',
         payloadcapacity: '40%20Ton',
         searchdate: '2018-27-12' 
        }
    };
    http.get(options, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const trux = JSON.parse(completeResponse);
            dataToSend += `From ${src}  to ${dst} of vehicle type ${vh_type} the rate of turx is ${trux.values.trux_assured_rate} and the average rate is ${trux.values.average_rate}`;

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-movie-details'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-details'
        });
    });
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});
