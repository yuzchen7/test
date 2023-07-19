require('dotenv').config();
const Amadeus = require('amadeus');
const axios = require('axios');

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
    console.log('setEmission');

    if (flight.emissions > 0) {
        return;
    }

    // console.log('flight.emissions : ', flight);
    // console.log('flight.cabin : ', flight.cabin);

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
        );
        const responsedata = response.data.flightEmissions[0];
        if (flight.cabin.toLowerCase() === 'economy') {
            flight.emissions = responsedata.emissionsGramsPerPax.economy;
            // console.log('flight.emissions', flight)
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
}

async function flightsFilter(org, arri, oneway, flightdata) {
    const final = [];
    flightdata.forEach(ticketData => {
        const segments = ticketData.itineraries[0].segments;
        const origin_airport = segments[0].departure.iataCode;
        const final_airport = segments[segments.length - 1].arrival.iataCode;

        if (origin_airport !== org || final_airport !== arri) {
            return;
        }

        const newdata = {};
        newdata.type = ticketData.type;
        newdata.oneWay = oneway;
        newdata.origin_airport = origin_airport;
        newdata.arrival_airport = final_airport;
        const departure_segments = segments;
        newdata.tickets = {};

        newdata.total_departure_duration = ticketData.itineraries[0].duration;
        newdata.tickets.departure_ticket = segmentsFilter(departure_segments);

        const segmentDetails = ticketData.travelerPricings[0].fareDetailsBySegment;
        // console.log(segmentDetails)
        for (var i = 0; i < segments.length; i++) { //set cabin for each departure_ticket
            newdata.tickets.departure_ticket[i].cabin = segmentDetails[i].cabin;
        }

        // newdata.tickets.departure_ticket.forEach(async (ticket) => {
        //     await setEmission(ticket,ticket.departure.time);
        // });
        async function setEmissions(tickets) {
            for (const ticket of tickets) {
                await setEmission(ticket, ticket.departure.time);
            }
        }
        await setEmissions(newdata.tickets.departure_ticket);
        // for (const ticket of newdata.tickets.departure_ticket) {
        //     await setEmission(ticket, ticket.departure.time);
        // }

        if (!oneway) {
            const return_segments = ticketData.itineraries[1].segments;
            newdata.total_return_duration = ticketData.itineraries[1].duration;
            newdata.tickets.return_ticket = segmentsFilter(return_segments);
            for (var i = newdata.tickets.departure_ticket.length; i < segmentDetails.length; i++) {
                newdata.tickets.return_ticket[i - newdata.tickets.departure_ticket.length].cabin = segmentDetails[i].cabin;
                // newdata.cabin.return_cabin.push(segmentDetails[i].cabin);
            }
        }

        newdata.total_price = {
            total: ticketData.price.total,
            currency: ticketData.price.currency
        }

        final.push(newdata);
    });
    return final;
}

function segmentsFilter(segments) {
    const return_segments = [];
    segments.forEach(element => {
        const way = {
            departure: {
                iataCode: element.departure.iataCode,
                time: element.departure.at.replace('T', ' ')
            },
            arrival: {
                iataCode: element.arrival.iataCode,
                time: element.arrival.at.replace('T', ' ')
            },
            flight: {
                carrierCode: element.carrierCode,
                number: element.number,
            },
            flight_number: element.carrierCode + ' ' + element.number,
            duration: element.duration.substring(2),
            cabin: undefined
        }
        return_segments.push(way);
    });
    return return_segments;
}

const response = [
    {
        "type": "flight-offer",
        "id": "1",
        "source": "GDS",
        "instantTicketingRequired": false,
        "nonHomogeneous": false,
        "oneWay": false,
        "lastTicketingDate": "2023-07-21",
        "lastTicketingDateTime": "2023-07-21",
        "numberOfBookableSeats": 9,
        "itineraries": [
            {
                "duration": "PT14H20M",
                "segments": [
                    {
                        "departure": {
                            "iataCode": "SYD",
                            "terminal": "0",
                            "at": "2023-08-02T06:55:00"
                        },
                        "arrival": {
                            "iataCode": "DPS",
                            "terminal": "D",
                            "at": "2023-08-02T10:20:00"
                        },
                        "carrierCode": "ID",
                        "number": "6006",
                        "aircraft": {
                            "code": "738"
                        },
                        "operating": {
                            "carrierCode": "ID"
                        },
                        "duration": "PT6H25M",
                        "id": "3",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    },
                    {
                        "departure": {
                            "iataCode": "DPS",
                            "terminal": "D",
                            "at": "2023-08-02T14:00:00"
                        },
                        "arrival": {
                            "iataCode": "DMK",
                            "terminal": "0",
                            "at": "2023-08-02T17:15:00"
                        },
                        "carrierCode": "ID",
                        "number": "7637",
                        "aircraft": {
                            "code": "738"
                        },
                        "operating": {
                            "carrierCode": "ID"
                        },
                        "duration": "PT4H15M",
                        "id": "4",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    }
                ]
            }
        ],
        "price": {
            "currency": "EUR",
            "total": "345.86",
            "base": "222.00",
            "fees": [
                {
                    "amount": "0.00",
                    "type": "SUPPLIER"
                },
                {
                    "amount": "0.00",
                    "type": "TICKETING"
                }
            ],
            "grandTotal": "345.86"
        },
        "pricingOptions": {
            "fareType": [
                "PUBLISHED"
            ],
            "includedCheckedBagsOnly": true
        },
        "validatingAirlineCodes": [
            "GP"
        ],
        "travelerPricings": [
            {
                "travelerId": "1",
                "fareOption": "STANDARD",
                "travelerType": "ADULT",
                "price": {
                    "currency": "EUR",
                    "total": "345.86",
                    "base": "222.00"
                },
                "fareDetailsBySegment": [
                    {
                        "segmentId": "3",
                        "cabin": "ECONOMY",
                        "fareBasis": "XOWAU",
                        "class": "X",
                        "includedCheckedBags": {
                            "weight": 20,
                            "weightUnit": "KG"
                        }
                    },
                    {
                        "segmentId": "4",
                        "cabin": "ECONOMY",
                        "fareBasis": "XIDOW",
                        "class": "X",
                        "includedCheckedBags": {
                            "weight": 20,
                            "weightUnit": "KG"
                        }
                    }
                ]
            }
        ]
    },
    {
        "type": "flight-offer",
        "id": "2",
        "source": "GDS",
        "instantTicketingRequired": false,
        "nonHomogeneous": false,
        "oneWay": false,
        "lastTicketingDate": "2023-08-02",
        "lastTicketingDateTime": "2023-08-02",
        "numberOfBookableSeats": 9,
        "itineraries": [
            {
                "duration": "PT14H15M",
                "segments": [
                    {
                        "departure": {
                            "iataCode": "SYD",
                            "terminal": "1",
                            "at": "2023-08-02T11:35:00"
                        },
                        "arrival": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-02T16:50:00"
                        },
                        "carrierCode": "PR",
                        "number": "212",
                        "aircraft": {
                            "code": "333"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT8H15M",
                        "id": "1",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    },
                    {
                        "departure": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-02T19:20:00"
                        },
                        "arrival": {
                            "iataCode": "BKK",
                            "at": "2023-08-02T21:50:00"
                        },
                        "carrierCode": "PR",
                        "number": "732",
                        "aircraft": {
                            "code": "320"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT3H30M",
                        "id": "2",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    }
                ]
            }
        ],
        "price": {
            "currency": "EUR",
            "total": "348.22",
            "base": "239.00",
            "fees": [
                {
                    "amount": "0.00",
                    "type": "SUPPLIER"
                },
                {
                    "amount": "0.00",
                    "type": "TICKETING"
                }
            ],
            "grandTotal": "348.22"
        },
        "pricingOptions": {
            "fareType": [
                "PUBLISHED"
            ],
            "includedCheckedBagsOnly": true
        },
        "validatingAirlineCodes": [
            "PR"
        ],
        "travelerPricings": [
            {
                "travelerId": "1",
                "fareOption": "STANDARD",
                "travelerType": "ADULT",
                "price": {
                    "currency": "EUR",
                    "total": "348.22",
                    "base": "239.00"
                },
                "fareDetailsBySegment": [
                    {
                        "segmentId": "1",
                        "cabin": "ECONOMY",
                        "fareBasis": "EOBAU",
                        "class": "E",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    },
                    {
                        "segmentId": "2",
                        "cabin": "ECONOMY",
                        "fareBasis": "EOBAU",
                        "class": "E",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    }
                ]
            }
        ]
    }
]

const finalData = flightsFilter('SYD', 'BKK', true, response);
console.log('finalData :', finalData[0].tickets);

/*
    {
        "type": "flight-offer",
        oneWay,
        origin_airport,
        arrival_airport,
        cabin,
        itineraries: [
            departure_ticket : [
                {
                    departure : {
                        iataCode, time
                    },
                    arrival : {
                        iataCode, time
                    },
                    flight : {
                        carrierCode: 'PR', number: '212'
                    }
                    flight_number,
                    duration
                }, ....
            ]
        ],
        total_departure_duration,
        total_return_duration
    }
*/

const response2 = [
    {
        "type": "flight-offer",
        "id": "1",
        "source": "GDS",
        "instantTicketingRequired": false,
        "nonHomogeneous": false,
        "oneWay": false,
        "lastTicketingDate": "2023-08-02",
        "lastTicketingDateTime": "2023-08-02",
        "numberOfBookableSeats": 5,
        "itineraries": [
            {
                "duration": "PT14H15M",
                "segments": [
                    {
                        "departure": {
                            "iataCode": "SYD",
                            "terminal": "1",
                            "at": "2023-08-02T11:35:00"
                        },
                        "arrival": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-02T16:50:00"
                        },
                        "carrierCode": "PR",
                        "number": "212",
                        "aircraft": {
                            "code": "333"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT8H15M",
                        "id": "1",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    },
                    {
                        "departure": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-02T19:20:00"
                        },
                        "arrival": {
                            "iataCode": "BKK",
                            "at": "2023-08-02T21:50:00"
                        },
                        "carrierCode": "PR",
                        "number": "732",
                        "aircraft": {
                            "code": "320"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT3H30M",
                        "id": "2",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    }
                ]
            },
            {
                "duration": "PT16H15M",
                "segments": [
                    {
                        "departure": {
                            "iataCode": "BKK",
                            "at": "2023-08-03T13:30:00"
                        },
                        "arrival": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-03T18:00:00"
                        },
                        "carrierCode": "PR",
                        "number": "731",
                        "aircraft": {
                            "code": "333"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT3H30M",
                        "id": "5",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    },
                    {
                        "departure": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-03T22:10:00"
                        },
                        "arrival": {
                            "iataCode": "SYD",
                            "terminal": "1",
                            "at": "2023-08-04T09:45:00"
                        },
                        "carrierCode": "PR",
                        "number": "211",
                        "aircraft": {
                            "code": "333"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT8H35M",
                        "id": "6",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    }
                ]
            }
        ],
        "price": {
            "currency": "EUR",
            "total": "521.78",
            "base": "322.00",
            "fees": [
                {
                    "amount": "0.00",
                    "type": "SUPPLIER"
                },
                {
                    "amount": "0.00",
                    "type": "TICKETING"
                }
            ],
            "grandTotal": "521.78"
        },
        "pricingOptions": {
            "fareType": [
                "PUBLISHED"
            ],
            "includedCheckedBagsOnly": true
        },
        "validatingAirlineCodes": [
            "PR"
        ],
        "travelerPricings": [
            {
                "travelerId": "1",
                "fareOption": "STANDARD",
                "travelerType": "ADULT",
                "price": {
                    "currency": "EUR",
                    "total": "521.78",
                    "base": "322.00"
                },
                "fareDetailsBySegment": [
                    {
                        "segmentId": "1",
                        "cabin": "ECONOMY",
                        "fareBasis": "TBAU",
                        "class": "T",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    },
                    {
                        "segmentId": "2",
                        "cabin": "ECONOMY",
                        "fareBasis": "TBAU",
                        "class": "T",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    },
                    {
                        "segmentId": "5",
                        "cabin": "ECONOMY",
                        "fareBasis": "TBAU",
                        "class": "T",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    },
                    {
                        "segmentId": "6",
                        "cabin": "FIRST",
                        "fareBasis": "TBAU",
                        "class": "T",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    }
                ]
            }
        ]
    },
    {
        "type": "flight-offer",
        "id": "2",
        "source": "GDS",
        "instantTicketingRequired": false,
        "nonHomogeneous": false,
        "oneWay": false,
        "lastTicketingDate": "2023-08-02",
        "lastTicketingDateTime": "2023-08-02",
        "numberOfBookableSeats": 5,
        "itineraries": [
            {
                "duration": "PT16H35M",
                "segments": [
                    {
                        "departure": {
                            "iataCode": "SYD",
                            "terminal": "1",
                            "at": "2023-08-02T11:35:00"
                        },
                        "arrival": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-02T16:50:00"
                        },
                        "carrierCode": "PR",
                        "number": "212",
                        "aircraft": {
                            "code": "333"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT8H15M",
                        "id": "3",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    },
                    {
                        "departure": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-02T21:40:00"
                        },
                        "arrival": {
                            "iataCode": "BKK",
                            "at": "2023-08-03T00:10:00"
                        },
                        "carrierCode": "PR",
                        "number": "740",
                        "aircraft": {
                            "code": "321"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT3H30M",
                        "id": "4",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    }
                ]
            },
            {
                "duration": "PT16H15M",
                "segments": [
                    {
                        "departure": {
                            "iataCode": "BKK",
                            "at": "2023-08-03T13:30:00"
                        },
                        "arrival": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-03T18:00:00"
                        },
                        "carrierCode": "PR",
                        "number": "731",
                        "aircraft": {
                            "code": "333"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT3H30M",
                        "id": "5",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    },
                    {
                        "departure": {
                            "iataCode": "MNL",
                            "terminal": "2",
                            "at": "2023-08-03T22:10:00"
                        },
                        "arrival": {
                            "iataCode": "SYD",
                            "terminal": "1",
                            "at": "2023-08-04T09:45:00"
                        },
                        "carrierCode": "PR",
                        "number": "211",
                        "aircraft": {
                            "code": "333"
                        },
                        "operating": {
                            "carrierCode": "PR"
                        },
                        "duration": "PT8H35M",
                        "id": "6",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                    }
                ]
            }
        ],
        "price": {
            "currency": "EUR",
            "total": "521.78",
            "base": "322.00",
            "fees": [
                {
                    "amount": "0.00",
                    "type": "SUPPLIER"
                },
                {
                    "amount": "0.00",
                    "type": "TICKETING"
                }
            ],
            "grandTotal": "521.78"
        },
        "pricingOptions": {
            "fareType": [
                "PUBLISHED"
            ],
            "includedCheckedBagsOnly": true
        },
        "validatingAirlineCodes": [
            "PR"
        ],
        "travelerPricings": [
            {
                "travelerId": "1",
                "fareOption": "STANDARD",
                "travelerType": "ADULT",
                "price": {
                    "currency": "EUR",
                    "total": "521.78",
                    "base": "322.00"
                },
                "fareDetailsBySegment": [
                    {
                        "segmentId": "3",
                        "cabin": "ECONOMY",
                        "fareBasis": "TBAU",
                        "class": "T",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    },
                    {
                        "segmentId": "4",
                        "cabin": "ECONOMY",
                        "fareBasis": "TBAU",
                        "class": "T",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    },
                    {
                        "segmentId": "5",
                        "cabin": "ECONOMY",
                        "fareBasis": "TBAU",
                        "class": "T",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    },
                    {
                        "segmentId": "6",
                        "cabin": "ECONOMY",
                        "fareBasis": "TBAU",
                        "class": "T",
                        "includedCheckedBags": {
                            "weight": 30,
                            "weightUnit": "KG"
                        }
                    }
                ]
            }
        ]
    }
]

// flightsFilter('SYD', 'BKK', false, response2);