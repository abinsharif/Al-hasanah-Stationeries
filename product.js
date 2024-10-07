function displayProducts(filteredProducts) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = ''; // Clear previous content

    filteredProducts.forEach(product => {
        const card = `
            <div class="col-md-4">
                <div class="product-card">
                    <img src="./Images/${product.image}" alt="${product.name}" class="product-image">
                    <h5>${product.name}</h5>
                    <p>Price: ${product.price} tk</p>
                    <a href="./items/${product.link}" class="btn btn-primary">View</a>
                </div>
            </div>
        `;
        productsGrid.insertAdjacentHTML('beforeend', card);
    });
}

function filterProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;

    // Filter by categories selected
    const categories = [];
    document.querySelectorAll('.filter-section input[type="checkbox"]:checked').forEach(checkbox => {
        categories.push(checkbox.value);
    });

    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) &&
            product.price >= minPrice &&
            product.price <= maxPrice &&
            (categories.length === 0 || categories.includes(product.category));
    });

    displayProducts(filteredProducts);
}

// Initial Display of Products
displayProducts(products);

// Event Listeners
document.getElementById('search-bar').addEventListener('input', filterProducts);
document.getElementById('filter-price').addEventListener('click', filterProducts);
document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
});