let cart = {};

// Selecione todos os botões "Add to Cart"
const addToCartButtons = document.querySelectorAll('[data-test^="add-to-cart"]');
const cartCountDisplay = document.getElementById('cart-count');
const checkoutButton = document.getElementById('checkout-button');
const cartIcon = document.getElementById('cart_icon');
const cartContainer = document.getElementById('cart-container');

// Função para atualizar o contador do carrinho
function updateCartCount() {
    const itemCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    cartCountDisplay.innerText = itemCount;
}

// Função para alternar o estado do carrinho
function toggleCart(button) {
    const productId = button.getAttribute('id');
    const productName = button.closest('.inventory_item').querySelector('.inventory_item_name').innerText;
    const productPrice = parseFloat(button.closest('.inventory_item').querySelector('.inventory_item_price').innerText.replace('$', ''));
    const productImage = button.closest('.inventory_item').querySelector('.inventory_item_img img').src;

    if (!cart[productId]) {
        cart[productId] = { name: productName, price: productPrice, quantity: 0, image: productImage };
    }

    if (button.innerHTML === 'Add to cart') {
        cart[productId].quantity += 1;
        button.innerHTML = 'Remove from cart';
        button.classList.add('btn_remove');
    } else {
        cart[productId].quantity -= 1;
        if (cart[productId].quantity === 0) {
            delete cart[productId];
            button.innerHTML = 'Add to cart';
            button.classList.remove('btn_remove');
        }
    }

    updateCartCount();
}

// Adiciona ouvintes de evento de clique a todos os botões "Add to Cart"
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => toggleCart(button));
});

// Função de checkout
function checkout() {
    if (Object.keys(cart).length === 0) {
        alert('Your cart is empty.');
        return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// Adiciona um ouvinte de evento de clique ao botão de checkout
checkoutButton.addEventListener('click', checkout);

// Exibe o dropdown do carrinho ao clicar no ícone do carrinho
cartIcon.addEventListener('click', () => {
    const dropdown = cartContainer.querySelector('.cart-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Lógica para o checkout.html

document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    const cartItemsContainer = document.getElementById('cart-items');

    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        const cart = JSON.parse(localStorage.getItem('cart')) || {};

        Object.keys(cart).forEach(productId => {
            const item = cart[productId];
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
    }

    displayCartItems();

    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const zipCode = document.getElementById('zip').value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/; // Ajuste conforme necessário
        const zipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

        let valid = true;
        let errorMessage = '';

        if (!name || !address || !email || !phone || !zipCode) {
            errorMessage = 'All fields are required.';
            valid = false;
        } else if (!emailRegex.test(email)) {
            errorMessage = 'Invalid email address.';
            valid = false;
        } else if (!phoneRegex.test(phone)) {
            errorMessage = 'Invalid phone number. Must be between 10 and 15 digits.';
            valid = false;
        } else if (!zipCodeRegex.test(zipCode)) {
            errorMessage = 'Invalid zip code. Must be 5 digits or 5-4 digits.';
            valid = false;
        }

        if (valid) {
            alert('Order placed successfully!');
            checkoutForm.reset();
            localStorage.removeItem('cart');
            cartItemsContainer.innerHTML = '';
        } else {
            alert(errorMessage);
        }
    });
});
