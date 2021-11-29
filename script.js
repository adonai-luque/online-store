function fetchProducts(query = '') {
  let url = (query === '') ? 'https://adonailuque-online-store-api.herokuapp.com/products' : `https://adonailuque-online-store-api.herokuapp.com/products/?query=${query}`
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let products = fetch(url, {header: headers})
    .then(response => response.json())
  return products
}

function fetchCategories() {
  let url = 'https://adonailuque-online-store-api.herokuapp.com/categories'
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  let categories = fetch(url, {header: headers})
    .then(response => response.json())
  return categories
}

const renderProducts = (products) => {
  
  let content = document.getElementById('content')
  content.innerHTML = ""

  if (products.length === 0) content.innerHTML = "Sin resultados"
  
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
        <p>$ ${price}</p>
        <a href="#" class="btn btn-primary">Agregar al carrito</a>
      </div>
    `;
    return element;
  }
  
  
  products.forEach(product => {
    content.append(card(product.name, product.url_image, product.price))
  });
}

function addEventListeners() {
  let queryInput = document.getElementById('query-input')
  let searchForm = document.getElementById('search-form')
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let query = queryInput.value
    if (query) fetchProducts(queryInput.value).then(products => renderProducts(products))
  })
  
  queryInput.addEventListener('input', () => {
    let query = queryInput.value
    if (query === "") fetchProducts().then(products => renderProducts(products))
  })
}


Promise.all([fetchProducts(), fetchCategories()]).then(([products, categories]) => {
  addEventListeners()
  renderProducts(products)
  console.log(categories)
})

