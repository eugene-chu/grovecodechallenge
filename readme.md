# Grove Code Challenge

## Getting Started
1. Fork and cloning the repo
2. cd into the directory and run `npm install`.
3. run `npm start` to start the app

## Code Challenge
>> Build a solution to provide the subtotal, taxes, and total for an order accounting for the quantities of each item in the order and the taxes associated with the city of the customer. All data is provide from an external API.

## Solution

This app makes a call to the API endpoint for all the availabe data at initial run time, and save those data. Each order data is calculated when the order number is asked for. If the order number is not inside the app, the app will make another call to the API and look for that data. If the data is there, it saves it to the app and continues as normal. If it is not there, it will produce an error message, letting the user know it is not there. The app ends when the user stops it.

## List of valid order ids:

- dub23
- dub49
- dub55
- sfg26
- sfg34
- sfg47
- txr20
- txr56