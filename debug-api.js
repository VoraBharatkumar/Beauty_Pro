import http from 'http';

http.get('http://localhost:3000/api/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    if (result.products && result.products.length > 0) {
      console.log('First product:');
      console.log('Name:', result.products[0].name);
      console.log('image field:', result.products[0].image);
      console.log('images field:', JSON.stringify(result.products[0].images, null, 2));
    }
    console.log('Total products:', result.products?.length);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});

