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

const response2 = {
    "meta": {
      "count": 2,
      "links": {
        "self": "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=JFK&destinationLocationCode=CAN&departureDate=2023-08-01&returnDate=2023-08-20&adults=1&nonStop=false&currencyCode=USD&max=2"
      }
    },
    "data": [
      {
        "type": "flight-offer",
        "id": "1",
        "source": "GDS",
        "instantTicketingRequired": false,
        "nonHomogeneous": false,
        "oneWay": false,
        "lastTicketingDate": "2023-07-23",
        "lastTicketingDateTime": "2023-07-23",
        "numberOfBookableSeats": 9,
        "itineraries": [
          {
            "duration": "PT21H35M",
            "segments": [
              {
                "departure": {
                  "iataCode": "JFK",
                  "terminal": "1",
                  "at": "2023-08-01T00:05:00"
                },
                "arrival": {
                  "iataCode": "IST",
                  "at": "2023-08-01T16:45:00"
                },
                "carrierCode": "TK",
                "number": "12",
                "aircraft": {
                  "code": "77W"
                },
                "operating": {
                  "carrierCode": "TK"
                },
                "duration": "PT9H40M",
                "id": "1",
                "numberOfStops": 0,
                "blacklistedInEU": false
              },
              {
                "departure": {
                  "iataCode": "IST",
                  "at": "2023-08-01T18:20:00"
                },
                "arrival": {
                  "iataCode": "CAN",
                  "terminal": "2",
                  "at": "2023-08-02T09:40:00"
                },
                "carrierCode": "TK",
                "number": "72",
                "aircraft": {
                  "code": "77W"
                },
                "operating": {
                  "carrierCode": "TK"
                },
                "duration": "PT10H20M",
                "id": "2",
                "numberOfStops": 0,
                "blacklistedInEU": false
              }
            ]
          },
          {
            "duration": "PT29H15M",
            "segments": [
              {
                "departure": {
                  "iataCode": "CAN",
                  "terminal": "2",
                  "at": "2023-08-20T05:00:00"
                },
                "arrival": {
                  "iataCode": "IST",
                  "at": "2023-08-20T11:25:00"
                },
                "carrierCode": "TK",
                "number": "73",
                "aircraft": {
                  "code": "77W"
                },
                "operating": {
                  "carrierCode": "TK"
                },
                "duration": "PT11H25M",
                "id": "3",
                "numberOfStops": 0,
                "blacklistedInEU": false
              },
              {
                "departure": {
                  "iataCode": "IST",
                  "at": "2023-08-20T18:40:00"
                },
                "arrival": {
                  "iataCode": "JFK",
                  "terminal": "1",
                  "at": "2023-08-20T22:15:00"
                },
                "carrierCode": "TK",
                "number": "11",
                "aircraft": {
                  "code": "77W"
                },
                "operating": {
                  "carrierCode": "TK"
                },
                "duration": "PT10H35M",
                "id": "4",
                "numberOfStops": 0,
                "blacklistedInEU": false
              }
            ]
          }
        ],
        "price": {
          "currency": "USD",
          "total": "2113.85",
          "base": "1297.00",
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
          "grandTotal": "2113.85"
        },
        "pricingOptions": {
          "fareType": [
            "PUBLISHED"
          ],
          "includedCheckedBagsOnly": true
        },
        "validatingAirlineCodes": [
          "TK"
        ],
        "travelerPricings": [
          {
            "travelerId": "1",
            "fareOption": "STANDARD",
            "travelerType": "ADULT",
            "price": {
              "currency": "USD",
              "total": "2113.85",
              "base": "1297.00"
            },
            "fareDetailsBySegment": [
              {
                "segmentId": "1",
                "cabin": "ECONOMY",
                "fareBasis": "PV3XPC",
                "brandedFare": "PS",
                "class": "P",
                "includedCheckedBags": {
                  "quantity": 2
                }
              },
              {
                "segmentId": "2",
                "cabin": "ECONOMY",
                "fareBasis": "PV3XPC",
                "brandedFare": "PS",
                "class": "P",
                "includedCheckedBags": {
                  "quantity": 2
                }
              },
              {
                "segmentId": "3",
                "cabin": "ECONOMY",
                "fareBasis": "PV3XPC",
                "brandedFare": "PS",
                "class": "P",
                "includedCheckedBags": {
                  "quantity": 2
                }
              },
              {
                "segmentId": "4",
                "cabin": "ECONOMY",
                "fareBasis": "PV3XPC",
                "brandedFare": "PS",
                "class": "P",
                "includedCheckedBags": {
                  "quantity": 2
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
        "lastTicketingDate": "2023-07-23",
        "lastTicketingDateTime": "2023-07-23",
        "numberOfBookableSeats": 9,
        "itineraries": [
          {
            "duration": "PT21H35M",
            "segments": [
              {
                "departure": {
                  "iataCode": "JFK",
                  "terminal": "1",
                  "at": "2023-08-01T00:05:00"
                },
                "arrival": {
                  "iataCode": "IST",
                  "at": "2023-08-01T16:45:00"
                },
                "carrierCode": "TK",
                "number": "12",
                "aircraft": {
                  "code": "77W"
                },
                "operating": {
                  "carrierCode": "TK"
                },
                "duration": "PT9H40M",
                "id": "1",
                "numberOfStops": 0,
                "blacklistedInEU": false
              },
              {
                "departure": {
                  "iataCode": "IST",
                  "at": "2023-08-01T18:20:00"
                },
                "arrival": {
                  "iataCode": "CAN",
                  "terminal": "2",
                  "at": "2023-08-02T09:40:00"
                },
                "carrierCode": "TK",
                "number": "72",
                "aircraft": {
                  "code": "77W"
                },
                "operating": {
                  "carrierCode": "TK"
                },
                "duration": "PT10H20M",
                "id": "2",
                "numberOfStops": 0,
                "blacklistedInEU": false
              }
            ]
          },
          {
            "duration": "PT42H20M",
            "segments": [
              {
                "departure": {
                  "iataCode": "CAN",
                  "terminal": "2",
                  "at": "2023-08-20T05:00:00"
                },
                "arrival": {
                  "iataCode": "IST",
                  "at": "2023-08-20T11:25:00"
                },
                "carrierCode": "TK",
                "number": "73",
                "aircraft": {
                  "code": "77W"
                },
                "operating": {
                  "carrierCode": "TK"
                },
                "duration": "PT11H25M",
                "id": "5",
                "numberOfStops": 0,
                "blacklistedInEU": false
              },
              {
                "departure": {
                  "iataCode": "IST",
                  "at": "2023-08-21T07:45:00"
                },
                "arrival": {
                  "iataCode": "JFK",
                  "terminal": "1",
                  "at": "2023-08-21T11:20:00"
                },
                "carrierCode": "TK",
                "number": "3",
                "aircraft": {
                  "code": "333"
                },
                "operating": {
                  "carrierCode": "TK"
                },
                "duration": "PT10H35M",
                "id": "6",
                "numberOfStops": 0,
                "blacklistedInEU": false
              }
            ]
          }
        ],
        "price": {
          "currency": "USD",
          "total": "2113.85",
          "base": "1297.00",
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
          "grandTotal": "2113.85"
        },
        "pricingOptions": {
          "fareType": [
            "PUBLISHED"
          ],
          "includedCheckedBagsOnly": true
        },
        "validatingAirlineCodes": [
          "TK"
        ],
        "travelerPricings": [
          {
            "travelerId": "1",
            "fareOption": "STANDARD",
            "travelerType": "ADULT",
            "price": {
              "currency": "USD",
              "total": "2113.85",
              "base": "1297.00"
            },
            "fareDetailsBySegment": [
              {
                "segmentId": "1",
                "cabin": "ECONOMY",
                "fareBasis": "PV3XPC",
                "brandedFare": "PS",
                "class": "P",
                "includedCheckedBags": {
                  "quantity": 2
                }
              },
              {
                "segmentId": "2",
                "cabin": "ECONOMY",
                "fareBasis": "PV3XPC",
                "brandedFare": "PS",
                "class": "P",
                "includedCheckedBags": {
                  "quantity": 2
                }
              },
              {
                "segmentId": "5",
                "cabin": "ECONOMY",
                "fareBasis": "PV3XPC",
                "brandedFare": "PS",
                "class": "P",
                "includedCheckedBags": {
                  "quantity": 2
                }
              },
              {
                "segmentId": "6",
                "cabin": "ECONOMY",
                "fareBasis": "PV3XPC",
                "brandedFare": "PS",
                "class": "P",
                "includedCheckedBags": {
                  "quantity": 2
                }
              }
            ]
          }
        ]
      }
    ],
    "dictionaries": {
      "locations": {
        "CAN": {
          "cityCode": "CAN",
          "countryCode": "CN"
        },
        "IST": {
          "cityCode": "IST",
          "countryCode": "TR"
        },
        "JFK": {
          "cityCode": "NYC",
          "countryCode": "US"
        }
      },
      "aircraft": {
        "333": "AIRBUS A330-300",
        "77W": "BOEING 777-300ER"
      },
      "currencies": {
        "USD": "US DOLLAR"
      },
      "carriers": {
        "TK": "TURKISH AIRLINES"
      }
    }
  }

module.exports = {
    response, response2
}