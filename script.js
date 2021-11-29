let jsContent = document.getElementById('js-content')

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

function clearJSContent() {
  jsContent.innerHTML = ""
}

function renderTitle(title) {
  const titleElement = document.createElement('h2')
  titleElement.textContent = title

  jsContent.append(titleElement)
}

function renderProducts(products, title = true) {
  if (products.length === 0) {
    jsContent.innerHTML = '<h6>Sin resultados</h6>'
    return
  }

  if (title) renderTitle('Productos')
  
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
  
  const productsContainer = document.createElement('div')
  productsContainer.className = "d-flex flex-wrap justify-content-around"

  products.forEach(product => productsContainer.append(card(product.name, product.url_image, product.price)));

  jsContent.append(productsContainer)
}

let productsLink = document.getElementById('products-link')

function renderCategories(categories) {
  const categoryElement = (category) => {
    const element = document.createElement('li');
    element.className = "category-li"
    element.dataset.id = category.id
    element.textContent = category.name.toUpperCase()
    return element;
  }
  
  renderTitle('Categorías')

  const categoriesList = document.createElement('ul')

  categories.forEach(category => {
    let categoryEl = categoryElement(category)
    categoryEl.addEventListener('click', (e) => renderCategoryProducts(e.target.dataset.id))
    categoriesList.append(categoryEl)
  });

  jsContent.append(categoriesList)
}

function renderCategoryProducts(categoryId) {
  let category = categories.find(c => c.id == categoryId)
  clearJSContent()
  renderTitle(category.name.toUpperCase())
  const categoryProducts = products.filter(product => product.category.id === category.id)
  renderProducts(categoryProducts, false)
}

function addEventListeners() {
  let queryInput = document.getElementById('query-input')
  let searchForm = document.getElementById('search-form')
  let productsLink = document.getElementById('products-link')
  let categoriesLink = document.getElementById('categories-link')
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let query = queryInput.value
    if (query) fetchProducts(queryInput.value).then(products => {
      clearJSContent()
      renderProducts(products)
    })
  })
  
  queryInput.addEventListener('input', () => {
    let query = queryInput.value
    if (query === "") fetchProducts().then(products => {
      clearJSContent()
      renderProducts(products)
    })
  })

  productsLink.addEventListener('click', () => {
    clearJSContent()
    renderProducts(products)
  })
    
  categoriesLink.addEventListener('click', () => {
    clearJSContent()
    renderCategories(categories)
  })

}

let products
let categories


Promise.all([fetchProducts(), fetchCategories()]).then(([fetchedProducts, fetchedCategories]) => {
  products = fetchedProducts
  categories = fetchedCategories
  addEventListeners()
  renderProducts(products)
})

