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
  let data = await getData();
  data.forEach(order => {
    console.log(`Order: ${order.id}\nCustomer Name: ${order.shipping_name}`);
  });
}

main();

async function getData (id = undefined) {
  let APIurl = 'https://code-challenge-i2hz6ik37a-uc.a.run.app/orders';
  if(typeof id !== 'undefined'){
    APIurl += `/${id}`;
  }
  let data;
  await axios.get(APIurl).then(res => {
    if(res.status !== 200){
      console.log('Status Code response 400');
      return data = null;
    }
    data = res.data;
  }).catch(err => {
    console.log(`Error occur when calling the API. There error is: ${err}`)
    return data = null;
  })
  return data;
};