require('dotenv').config();
const Amadeus = require('amadeus');
const axios = require('axios');
const {response, response2} = require('./data.js');
// console.log(process.env.AMADUES_CLIENT_ID + ", " + process.env.AMADUES_CLIENT_SECRET)


var amadeus = new Amadeus({
    clientId: process.env.AMADUES_CLIENT_ID,
    clientSecret: process.env.AMADUES_CLIENT_SECRET
});

const DateJs = require('./util/datejs');

/*
flight : {
  departure: { iataCode: 'MNL', time: '2023-08-02 19:20:00' },
  arrival: { iataCode: 'BKK', time: '2023-08-02 21:50:00' },
  flight: { carrierCode: 'PR', number: '732' },
  flight_number: 'PR 732',
  duration: '3H30M',
  cabin: 'ECONOMY'
}
departureDate : 2023-08-02
*/
async function setEmission(flight, departureDate) {
    if (flight.emissions > 0) {
        return;
    }
    try {
        const dateJs = new DateJs(departureDate);
        const response = await axios.post(
            'https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions',
            {
                'flights': [
                    {
                        'origin': flight.departure.iataCode,
                        'destination': flight.arrival.iataCode,
                        'operating_carrier_code': flight.flight.carrierCode,
                        'flight_number': flight.flight.number,
                        'departure_date': {
                            'year': dateJs.year(),
                            'month': dateJs.month(),
                            'day': dateJs.day()
                        }
                    },
                ]
            },
            {
                params: {
                    'key': process.env.TRAVEK_IMPACT_MODEL
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).catch(error => {
            console.log(error);
            throw error;
        });
        const responsedata = response.data.flightEmissions[0];
        if (!responsedata.emissionsGramsPerPax) {
            flight.emissions = -1;
        } else if (flight.cabin.toLowerCase() === 'economy') {
            flight.emissions = responsedata.emissionsGramsPerPax.economy;
        } else if (flight.cabin.toLowerCase() === 'premium_economy') {
            flight.emissions = responsedata.emissionsGramsPerPax.premiumEconomy;
        } else if (flight.cabin.toLowerCase() === 'business') {
            flight.emissions = responsedata.emissionsGramsPerPax.business;
        } else if (flight.cabin.toLowerCase() === 'first') {
            flight.emissions = responsedata.emissionsGramsPerPax.first;
        } else {
            flight.emissions = -1;
        }
    } catch (error) {
        throw error;
    }

    return response
}

/*
flight :  {
  departure_location: 'IST',
  arrival_location: 'JFK',
  carrier_code: 'TK',
  flight_number: '11',
  cabin_class: 'ECONOMY'
}
*/
async function emissions(flight, departureDate) {
    if (flight.emissions > 0) {
        return;
    }
    console.log('Emissions flight : ', flight);
    try {
        const dateJs = new DateJs(departureDate);
        const response = await axios.post(
            'https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions',
            {
                'flights': [
                    {
                        'origin' : flight.departure_location,
                        'destination' : flight.arrival_location,
                        'operating_carrier_code' : flight.carrier_code,
                        'flight_number' : flight.flight_number,
                        'departure_date' : {
                            'year' : dateJs.year(), 
                            'month' : dateJs.month(), 
                            'day' : dateJs.day()
                        }
                    },
                ]
            },
            {
                params: {
                    'key': process.env.TRAVEK_IMPACT_MODEL
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).catch(error => {
            console.log(error);
            throw error;
        });
        const responsedata = response.data.flightEmissions[0];
        console.log('emission re -> ', responsedata);
        if (!responsedata.emissionsGramsPerPax) {
            flight.emissions = -1;
        } else if (flight.cabin_class.toLowerCase() === 'economy') {
            flight.emissions = responsedata.emissionsGramsPerPax.economy;
        } else if (flight.cabin_class.toLowerCase() === 'premium_economy') {
            flight.emissions = responsedata.emissionsGramsPerPax.premiumEconomy;
        } else if (flight.cabin_class.toLowerCase() === 'business') {
            flight.emissions = responsedata.emissionsGramsPerPax.business;
        } else if (flight.cabin_class.toLowerCase() === 'first') {
            flight.emissions = responsedata.emissionsGramsPerPax.first;
        } else {
            flight.emissions = -1;
        }
    } catch (error) {
        throw error;
    }

    return response
}

async function flightsFilter(org, arri, oneway, flightdata, locations) {


    const filteredFlights = filterOriginFlights(flightdata, org, arri);

     

    const populateWithEmissions =  filteredFlights.map(async ticketData => {
        const segments = ticketData.itineraries[0].segments;
        const origin_airport = segments[0].departure.iataCode;
        const final_airport = segments[segments.length - 1].arrival.iataCode;

        const newdata = {};
        newdata.type = ticketData.type;
        newdata.oneWay = oneway;
        newdata.origin_airport = origin_airport;
        newdata.arrival_airport = final_airport;
        const departure_segments = segments;
        newdata.tickets = {};

        newdata.total_departure_duration = ticketData.itineraries[0].duration;
        newdata.tickets.departure_ticket = segmentsFilter(departure_segments, locations);

        const segmentDetails = ticketData.travelerPricings[0].fareDetailsBySegment;

        for (var i = 0; i < segments.length; i++) { //set cabin for each departure_ticket
            newdata.tickets.departure_ticket[i].cabin = segmentDetails[i].cabin;
        }

        for (const ticket of newdata.tickets.departure_ticket) {
            // await setEmission(ticket, ticket.departure.time)
            await emissions({
                    departure_location : ticket.departure.iataCode,
                    arrival_location : ticket.arrival.iataCode,
                    carrier_code : ticket.flight.carrierCode,
                    flight_number : ticket.flight.number,
                    cabin_class : ticket.cabin
                }, ticket.departure.time)
        }

        console.log('completed promise.all')
        if (!oneway) {
            const return_segments = ticketData.itineraries[1].segments;
            newdata.total_return_duration = ticketData.itineraries[1].duration;
            newdata.tickets.return_ticket = segmentsFilter(return_segments, locations);
            for (var i = newdata.tickets.departure_ticket.length; i < segmentDetails.length; i++) {
                newdata.tickets.return_ticket[i - newdata.tickets.departure_ticket.length].cabin = segmentDetails[i].cabin;
            }

            for (const ticket of newdata.tickets.return_ticket) {
                // await setEmission(ticket, ticket.departure.time)

                await emissions({
                    departure_location : ticket.departure.iataCode,
                    arrival_location : ticket.arrival.iataCode,
                    carrier_code : ticket.flight.carrierCode,
                    flight_number : ticket.flight.number,
                    cabin_class : ticket.cabin
                }, ticket.departure.time);
            }
        }

        newdata.total_price = {
            total: ticketData.price.total,
            currency: ticketData.price.currency
        }
        return newdata;

    })
    return Promise.all(populateWithEmissions);
}

function segmentsFilter(segments, locations) {
    return segments.map(element => {
        return {
            departure: {
                iataCode: element.departure.iataCode,
                time: element.departure.at.replace('T', ' '),
                location : {
                    ... locations[element.departure.iataCode]
                } 
            },
            arrival: {
                iataCode: element.arrival.iataCode,
                time: element.arrival.at.replace('T', ' '),
                location : {
                    ... locations[element.departure.iataCode]
                } 
            },
            flight: {
                carrierCode: element.carrierCode,
                number: element.number,
            },
            flight_number: element.carrierCode + ' ' + element.number,
            duration: element.duration.substring(2),
            cabin: undefined
        }
    });
}


function filterOriginFlights(flightdata, org, arri) {
    const filteredFlights = flightdata.filter(ticketData => {
        const segments = ticketData.itineraries[0].segments;
        const origin_airport = segments[0].departure.iataCode;
        const final_airport = segments[segments.length - 1].arrival.iataCode;

        return origin_airport == org || final_airport == arri
    })
    return filteredFlights;
}


// (async function test() {
//     let result = await flightsFilter('SYD', 'BKK', true, response.data, response.dictionaries.locations)
//     console.log(result)

//     for(let r of result) {
//         console.log(r.tickets.departure_ticket)
//     }
//     return result;

// })()

(async function test() {
    let result = await flightsFilter('SYD', 'CAN', false, response2.data, response2.dictionaries.locations)
    // console.log(result);

    for(let r of result) {
        console.log(r.tickets)
    }
    return result;

})()
 