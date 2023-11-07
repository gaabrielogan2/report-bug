let cartCount = 0;
// Selecione o botão "Add to Cart"
const addToCartButton = document.getElementById('add-to-cart-sauce-labs-backpack');

// Selecione o elemento que exibirá a quantidade no carrinho
const cartCountDisplay = document.getElementById('cart-count');

// Adicione um ouvinte de evento de clique ao botão
addToCartButton.addEventListener('click', () => {
  // Incremente o contador do carrinho
  cartCount++;
  // Atualize o texto de exibição do carrinho
  cartCountDisplay.innerText = cartCount;
});
function toggleCart(button) {
    if (button.innerHTML === 'Add to cart') {
        button.innerHTML = 'Remove from cart';
        button.classList.add('btn_remove');
    } else {
        button.innerHTML = 'Add to cart';
        button.classList.remove('btn_remove');
    }
}
