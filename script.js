async function fetchProducts(query = '') {
  let url = (query === '') ? 'http://127.0.0.1:3000/products' : `http://127.0.0.1:3000/products/?query=${query}`
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const response = await fetch(url, {header: headers});
  return response.json()
}

function renderProducts(products) {
  const card = (name, url_image='./assets/no-image.jpg', price) => {
    if ((url_image === "") || (url_image === null)) {
      url_image = './assets/no-image.jpg'
    }
    const element = document.createElement('div');
    element.className = 'card d-flex flex-column justify-content-end align-items-center m-4';
    element.style ='width: 18rem';
    element.innerHTML = `
      <img src="${url_image}" class="card-img-top mt-2 mb-4" alt="${name}">
      <div class="d-flex flex-column justify-content-around align-items-center m-4">
        <h5>${name}</h5>
        <p>${price}</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    `;
    return element;
  }
  
  let content = document.getElementById('content')
  content.innerHTML = ""
  products.forEach(product => {
    content.append(card(product.name, product.url_image, product.price))
  });
}

let queryInput = document.getElementById('query')
let searchButton = document.querySelector('form.d-flex')
searchButton.addEventListener('submit', (e) => {
  e.preventDefault();
  let query = queryInput.value
  if (query) fetchProducts(queryInput.value).then(products => renderProducts(products))
})

fetchProducts().then(products => renderProducts(products))