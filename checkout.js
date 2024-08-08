document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    if (Object.keys(cart).length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        let cartItemsHtml = '<ul>';
        let total = 0;
        for (let productId in cart) {
            const item = cart[productId];
            cartItemsHtml += `<li>${item.name} - $${item.price} x ${item.quantity}</li>`;
            total += item.price * item.quantity;
        }
        cartItemsHtml += `</ul><p>Total: $${total.toFixed(2)}</p>`;
        cartItemsContainer.innerHTML = cartItemsHtml;
    }

    const checkoutForm = document.getElementById('checkout-form');
    const mensagensErro = document.querySelectorAll('.mensagem-erro');
    const mensagemErroGeral = document.getElementById("mensagem-erro");

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const camposValidos = validarCampos();

        if (camposValidos) {
            exibirMensagemSucesso();
            resetForm();
            localStorage.removeItem('cart');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            exibirMensagemErro();
        }
    });

    function validarCampos() {
        let todosValidos = true;

        const validacoes = [
            { id: "zip", regex: /^\d{5}(-\d{4})?$/, mensagem: "Zip Code must be 5 digits or in the format 12345-6789." },
            { id: "phone", regex: /^\+?[0-9]{7,15}$/, mensagem: "Phone Number must be 7-15 digits long." },
            { id: "email", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, mensagem: "Email must be a valid endereço de email." }
        ];

        validacoes.forEach(campo => {
            const input = document.getElementById(campo.id);
            const valor = input.value.trim();
            const mensagemErro = document.getElementById(`${campo.id}-erro`);

            if (!campo.regex.test(valor)) {
                input.style.borderColor = "red";
                if (mensagemErro) {
                    mensagemErro.textContent = campo.mensagem;
                    mensagemErro.style.display = "block";
                }
                todosValidos = false;
            } else {
                input.style.borderColor = "initial";
                if (mensagemErro) {
                    mensagemErro.style.display = "none";
                }
            }

            // Adiciona um evento input para cada campo
            input.addEventListener('input', () => {
                input.style.borderColor = "initial";
                if (mensagemErro) {
                    mensagemErro.style.display = "none";
                }
            });
        });

        return todosValidos;
    }

    function exibirMensagemErro() {
        mensagemErroGeral.style.display = "block";
        esconderMensagens();
    }

    function exibirMensagemSucesso() {
        document.getElementById("mensagem-sucesso").style.display = "block";
        esconderMensagens();
    }

    function esconderMensagens() {
        setTimeout(function () {
            mensagemErroGeral.style.display = "none";
            document.getElementById("mensagem-sucesso").style.display = "none";
        }, 2000);
    }

    function resetForm() {
        checkoutForm.reset();
        mensagensErro.forEach(mensagem => mensagem.style.display = "none");
        const campos = checkoutForm.querySelectorAll('input');
        campos.forEach(campo => campo.style.borderColor = "initial");
    }
});
