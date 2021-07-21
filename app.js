// Start
// Get and save the data from API.
// Prompt user
// Respond to prompt
// -- Display the specific order
// -- Display orders in specific zip code
// -- Display all orders
// -- exit
// Continue to prompt until exit
// exit

const axios = require('axios');

async function main () {
  let orders = await getOrder();
  if(orders === null){
    console.error('There was an error retrieving orders from API');
    return;
  }
  orders.forEach(order => {
    console.log(`Order: ${order.id}\nCustomer Name: ${order.shipping_name}`);
    debugger;
  });
}

main();

async function getOrder(id = undefined) {
  let APIurl = 'https://code-challenge-i2hz6ik37a-uc.a.run.app/orders';

  return await getData(APIurl, id);
};

async function getCity(zip = undefined) {
  let APIurl = 'https://code-challenge-i2hz6ik37a-uc.a.run.app/cities';

  return await getData(APIurl, zip);
};

async function getData(APIurl, param){
  if(typeof para !== 'undefined') APIurl += `/${param}`;
  let returndata;
  await axios.get(APIurl)
    .then(res => res.status === 200 ? returndata = res.data : returndata = null)
    .catch(err => {
      console.error(`Error occured when calling the API. The error is: ${err}`);
      returndata = null;
  })
  return returndata;
}