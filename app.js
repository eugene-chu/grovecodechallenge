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

const { promisify } = require('util');
const axios = require('axios');

const getData = async (id = undefined) => {
  let APIurl = 'https://code-challenge-i2hz6ik37a-uc.a.run.app/orders';
  if(typeof id !== 'undefined'){
    APIurl += `/${id}`;
  }
  let data;
  await axios.get(APIurl).then(res => {
    // console.log(res);
    if(res.status !== 200){
      console.log('Status Code response 400');
      return data = null;
    }
    return data = res.data;
  }).catch(err => {
    console.log(`Error occur when calling the API. There error is: ${err}`)
    return data = null;

  })
  return data;
};

const main = async () => {
  let data = await getData();
  // console.log(data);
  data.forEach(order => {
    console.log(`Order: ${order.id}\nCustomer Name: ${order.shipping_name}`);
  });
}

main();