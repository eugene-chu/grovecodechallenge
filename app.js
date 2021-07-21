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

let orders;
async function initOrders() {
  orders = await getOrder();
  if(orders === null){
    console.error('There was an error retrieving orders from API');
    process.exit(0);
  }
}

initOrders();

rl.prompt();
rl.on('line', async (input) => {
  console.log();
  let order = null;
  input = input.trim().toLowerCase();
  if(input.toLowerCase() == 'exit'){
    console.log('Goodbye');
    rl.close();
  }

  for(e of orders){
    if(e.id == input){
      order = e;
      break;
    }
  }

  if(order === null){
    order = await getOrder(input);
    if(order === null){
      console.log('Order does not exit\n');
    } else {
      orders = [...orders, order]
    }
  }
  if(order !== null){
    await printOrder(order);
  }
  rl.prompt();
}).on('close', () => process.exit(0));

async function getOrder(id = undefined) {
  let APIurl = 'https://code-challenge-i2hz6ik37a-uc.a.run.app/orders';

  return await getData(APIurl, id);
};

async function getCity(zip = undefined) {
  let APIurl = 'https://code-challenge-i2hz6ik37a-uc.a.run.app/cities';

  return await getData(APIurl, zip);
};

async function getData(APIurl, param){
  if(typeof param !== 'undefined') APIurl += `/${param}`;
  let returndata;
  await axios.get(APIurl)
    .then(res => res.status == 200 ? returndata = res.data : returndata = null)
    .catch(err => {
      console.error(`Error occured when calling the API. The error is: ${err}`);
      returndata = null;
  })
  return returndata;
}

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

function calSubTot(items){
  if(!Array.isArray(items)) items = [items];
  let subTot = 0;
  for(const item of items){
    subTot += (item.price * item.quantity);
  }
  return subTot/100;
}

function calTax(items, taxRate){
  if(!Array.isArray(items)) items = [items];
  let taxes = 0;
  for(const item of items){
    if(item.taxable){
      taxes += (item.price * item.quantity);
    }
  }
  taxes = taxes/100 * taxRate/100;
  return Number(taxes.toFixed(2));
}