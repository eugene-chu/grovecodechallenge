// Start
// Get and save the data from API.
// Prompt user
// Respond to prompt
// -- Display the specific order
// -- exit
// Continue to prompt until exit
// exit

const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Which order do you want to see? (\'exit\' to stop) '
})

let allOrders = new Map();
async function initOrders() {
  let resOrders = await getOrder();
  if (resOrders === null) {
    console.error('There was an error retrieving orders from API');
    process.exit(0);
  }
  for (item of resOrders) {
    allOrders.set(item.id, item);
  }
}

initOrders();

rl.prompt();
rl.on('line', async (input) => {
  console.log();
  let order = null;
  input = input.trim().toLowerCase();
  if (input.toLowerCase() == 'exit') {
    console.log('Goodbye');
    rl.close();
  }

  if (allOrders.has(input)) order = allOrders.get(input);

  if (order === null) {
    order = await getOrder(input);
    if (order === null) {
      console.log('Order does not exit\n');
    } else {
      allOrders.set(order.id, order);
    }
  }
  if (order !== null) {
    await printOrder(order);
  }
  rl.prompt();
}).on('close', () => process.exit(0));

// Returns the list of orders. 
// If no id is provided, returns all the orders.
// Otherwise, return the one order (or null if it cannot be found)
async function getOrder(id = undefined) {
  let APIurl = 'https://code-challenge-i2hz6ik37a-uc.a.run.app/orders';

  return await getData(APIurl, id);
};

// Returns the list of cities.
// If no zip is provided, returns all the cities.
// Otherwise, return one city (or null if it cannot be found)
async function getCity(zip = undefined) {
  let APIurl = 'https://code-challenge-i2hz6ik37a-uc.a.run.app/cities';

  return await getData(APIurl, zip);
};

// Returns the list of data from API. Returns all data if no param is given. Otherwise, return the param specific item (or null if not found)
async function getData(APIurl, param) {
  if (typeof param !== 'undefined') APIurl += `/${param}`;
  let returndata;
  await axios.get(APIurl)
    .then(res => res.status == 200 ? returndata = res.data : returndata = null)
    .catch(err => {
      console.error(`Error occured when calling the API. The error is: ${err}`);
      returndata = null;
  })
  return returndata;
}

// Prints out the result based on the order information
async function printOrder(orderInfo) {
  let cityTax = await getCity(orderInfo.zip_code);
  let subTot = calSubTot(orderInfo.order_items);
  let taxes = calTax(orderInfo.order_items, cityTax.tax_rate);

  console.log(`Order: ${orderInfo.id}`);
  console.log(`Customer Name: ${orderInfo.shipping_name}`);
  console.log(`Subtotal: ${subTot}`);
  console.log(`Taxes: ${taxes}`);
  console.log(`Total: ${(subTot + taxes).toFixed(2)}\n`);
}

// Returns the subtotal (in decimals) from the list of items
function calSubTot(items) {
  // I noticed the API was inconsistance about sending the order as array or not. Hence the following line ensures items is an array
  if (!Array.isArray(items)) items = [items];
  let subTot = 0;
  for (const item of items) {
    subTot += (item.price * item.quantity);
  }
  return subTot/100;
}


// Returns the tax amount (in decimals) from the list of items (only selecting taxable items) from the selected tax rate
function calTax(items, taxRate) {
  // See line 99
  if (!Array.isArray(items)) items = [items];
  let taxes = 0;
  for (const item of items) {
    if (item.taxable) {
      taxes += (item.price * item.quantity);
    }
  }
  taxes = taxes/100 * taxRate/100;
  return Number(taxes.toFixed(2));
}

module.exports = {
  getOrder,
  getCity,
  printOrder,
  calSubTot,
  calTax
}