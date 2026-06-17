const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');
const searchProductForm = document.querySelector('#search-product-form');
const searchIdInput = document.querySelector('#search-id');

const API_URL = 'http://18.219.142.220:3000/products';

// Função separada para renderizar itens
function renderProducts(productsToRender) {
  productList.innerHTML = '';

  const productsArray = Array.isArray(productsToRender)
    ? productsToRender
    : [productsToRender];

  productsArray.forEach((product) => {
    if (!product || !product.name) return;

    const li = document.createElement('li');
    li.innerHTML = `<strong>[ID: ${product.id}] ${product.name}</strong> - $${product.price} <br> 
                    <small>${product.description || 'Sem descrição'}</small><br><br>`;

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductForm.style.display = 'block';
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description || '';
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

//BUSCAR TODOS (Read)
async function fetchProducts() {
  const response = await fetch(API_URL);
  const products = await response.json();
  renderProducts(products);
}

//BUSCA POR ID (Search)
searchProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = searchIdInput.value;
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (response.ok) {
      const product = await response.json();
      renderProducts(product);
    } else {
      productList.innerHTML = '<li>Produto não encontrado.</li>';
    }
  } catch (error) {
    console.error('Erro na busca:', error);
  }
});

document.querySelector('#clear-search').addEventListener('click', () => {
  searchProductForm.reset();
  fetchProducts();
});

//ADICIONAR (Create)
addProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;

  await addProduct(name, price, description);
  addProductForm.reset();
  await fetchProducts();
});

async function addProduct(name, price, description) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, price, description }),
  });
  return response.text();
}

//ATUALIZAR (Update)
updateProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value;
  const price = updateProductPrice.value;
  const description = updateProductDescription.value;

  await updateProduct(id, name, price, description);
  updateProductForm.reset();
  updateProductForm.style.display = 'none';
  await fetchProducts();
});

async function updateProduct(id, name, price, description) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, price, description }),
  });
  return response.text();
}

document.querySelector('#cancel-update').addEventListener('click', () => {
  updateProductForm.reset();
  updateProductForm.style.display = 'none';
});

// DELETAR (Delete)
async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.text();
}

// Inicializa a aplicação buscando todos os produtos
fetchProducts();
