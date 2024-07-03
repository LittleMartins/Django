const validateForm = () => {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const contacto = document.getElementById("contacto").value;
    const pedido = document.getElementById("pedido").value;
    const razon = document.getElementById("razon").value;
    const imagen = document.getElementById("imagen").value;

    let hasError = false;

    if (nombre === "") {
        document.getElementById("nombreError").innerHTML = "Por favor, ingresa tu nombre";
        hasError = true;
    } else {
        document.getElementById("nombreError").innerHTML = "";
    }

    if (apellido === "") {
        document.getElementById("apellidoError").innerHTML = "Por favor, ingresa tu apellido";
        hasError = true;
    } else {
        document.getElementById("apellidoError").innerHTML = "";
    }

    if (contacto === "") {
        document.getElementById("contactoError").innerHTML = "Por favor, ingresa tu número de contacto";
        hasError = true;
    } else if (!/^\d+$/.test(contacto)) { // Validación de números usando expresión regular
        document.getElementById("contactoError").innerHTML = "Por favor, ingresa solo números";
        hasError = true;
    } else {
        document.getElementById("contactoError").innerHTML = "";
    }

    if (pedido === "") {
        document.getElementById("pedidoError").innerHTML = "Por favor, ingresa tu número de pedido";
        hasError = true;
    } else if (!/^\d+$/.test(pedido)) { // Validación de números usando expresión regular
        document.getElementById("pedidoError").innerHTML = "Por favor, ingresa solo números";
        hasError = true;
    } else {
        document.getElementById("pedidoError").innerHTML = "";
    }

    if (razon === "") {
        document.getElementById("razonError").innerHTML = "Por favor, ingresa la razón de tu devolución";
        hasError = true;
    } else {
        document.getElementById("razonError").innerHTML = "";
    }

    if (imagen === "") {
        document.getElementById("imagenError").innerHTML = "Por favor, adjunta una imagen";
        hasError = true;
    } else {
        document.getElementById("imagenError").innerHTML = "";
    }

    return !hasError;
};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});

cards.addEventListener('click', e => {
    addCarrito(e);
});

items.addEventListener('click', e => {
    btnAccion(e);
});

const fetchData = async () => {
    try {
        const res = await fetch('productos.json');
        const data = await res.json();
        pintarCard(data);
    } catch (error) {
        console.log(error);
    }
};

const pintarCard = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title;
        templateCard.querySelector('p').textContent = item.precio;
        templateCard.querySelector('img').setAttribute('src', item.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id = item.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

const setCarrito = item => {
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('.btn-dark').dataset.id,
        talla: item.querySelector('.form-select').value,
        cantidad: 1
    };

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = { ...producto };
    pintarCarrito();
};

const pintarCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.talla;
        templateCarrito.querySelectorAll('td')[2].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });

    items.appendChild(fragment);

    pintarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const pintarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="6">Carrito vacío - comience a comprar!</th>
        `;
        return;
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () => {
        carrito = {};
        pintarCarrito();
    });
};

const btnAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;

        carrito[e.target.dataset.id] = { ...producto };
        pintarCarrito();
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }

    e.stopPropagation();
};

const pagarBtn = document.getElementById('pagar');

pagarBtn.addEventListener('click', () => {
    const carritoArray = Object.values(carrito);
    localStorage.setItem('carrito', JSON.stringify(carritoArray)); // Guardar el carrito como array en el localStorage

    // Redirigir a la página de pagar.html
    window.location.href = 'pagar.html';
});
