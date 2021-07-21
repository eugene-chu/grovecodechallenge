const { getOrder, getCity, printOrder, calSubTot, calTax } = require('./app.js');

async function tests(){
  let orders, order, cities, city, subTot, taxes;

  console.log(`Checking getOrder() without param`);
  orders = await getOrder();
  console.log(`Expect result's length to be 8. Actual: ${orders.length}`);

  console.log('\nChecking getOrder() with valid order ID. Order ID used is sfg47');
  order = await getOrder('sfg47');
  console.log(`Expect result's order id to be sfg47. Actual: ${order.id}`);

  console.log('\nChecking getOrder() with invalid order ID. Order ID used is \'sfg46\'');
  console.log('Expect an error message from getOrder(), with interal 500 error');
  order = await getOrder('sfg46');
  console.log(`Expect result to be null. Actual: ${order}`);

  console.log('\nChecking getOrder() with valid order ID, but there is a 500 internal error. Order ID used is \'txr56\'');
  console.log('Expect an error message from getOrder(), with internal 500 error');
  order = await getOrder('txr56');

  console.log('\nChecking getCity() without param');
  cities = await getCity();
  console.log(`Expect result to be an object and not an array. Actual: typeof ${typeof cities} & isArray: ${Array.isArray(cities)}`);
  console.log(`Expect result to have 4 items inside. Actual: ${Object.keys(cities).length}`);

  console.log('\nChecking getCity() with valid zip code. Zip code used is \'27705\'');
  city = await getCity('27705');
  console.log(`Expect result's name to be Durham. Actual: ${city.name}`);

  console.log('\nChecking getCity() with invalid zip code. Zip code used is \'12345\'');
  console.log('Expect an error message from getCity, with internal 500 error');
  city = await getCity('12345');
  console.log(`Expect result to be null. Actual: ${city}`);

  console.log('\nChecking calSubTot for order with multiple items. Order ID used is \'txr20\'');
  order = await getOrder('txr20');
  subTot = calSubTot(order.order_items);
  console.log(`Expect the result to be 20.96. Actual: ${subTot}`);

  console.log('\nChecking calSubTot() for order with one item. Order ID used is \'sfg47\'');
  order = await getOrder('sfg47');
  subTot = calSubTot(order.order_items);
  console.log(`Expect result to be 9.98. Actual: ${subTot}`);

  console.log('\nChecking calTax() for order with taxable items. Order ID used is \'sfg26\'');
  order = await getOrder('sfg26');
  city = await getCity('94107');
  taxes = calTax(order.order_items, city.tax_rate);
  console.log(`Expect result to be 0.87. Actual: ${taxes}`);

  console.log('\nChecking calTax() for order with both taxable and non-taxable items. Order ID used is \'sfg34\'');
  order = await getOrder('sfg34');
  taxes = calTax(order.order_items, city.tax_rate);
  console.log(`Expect result to be 0.94. Actual: ${taxes}`);

  console.log('\nChecking calTax() for order with no taxable items. Order ID used is \'dub23\'');
  city = await getCity('27705')
  taxes = calTax(orders[5].order_items, city.tax_rate);
  console.log(`Expect result to be 0. Actual: ${taxes}`);

  console.log('\nChecking printOrder(), without non-taxable goods. Order ID used is \'dub49\'');
  order = await getOrder('dub49');
  console.log('Expect the result to be:\n\nOrder: dub49\nCustomer Name: Brendan McKay\nSubtotal: 14.97\nTaxes: 0.97\nTotal: 15.94');
  console.log('\nResults:\n');
  await printOrder(order);

  console.log('\nChecking printOrder(), with non-taxable goods. Order ID used is \'dub23\'');
  console.log('Expect the result to be:\n\nOrder: dub23\nCustomer Name: Chris Ellis\nSubtotal: 7.98\nTaxes: 0\nTotal: 7.98');
  console.log('\nResults:\n');
  await printOrder(orders[5]);

  process.exit(0);
}

tests();