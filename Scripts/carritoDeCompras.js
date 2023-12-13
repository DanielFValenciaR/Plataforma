const urlCarrito = new URL("http://localhost:3000/carrito-de-compras");
// const iconCart = $(".icon-cart");
const contador = $(".iconCartSpan");
const containerCart = $(".container-cart");
const precioTotal = $(".precio-total");
const precioProducto = $(".product-price");

// let idProducto = "";
let idApi = "";

let productosCart = localStorage.getItem('Cart');

let contadorCart = [];

$(document).ready(function () {
    if (productosCart) {
        contadorCart = JSON.parse(productosCart);
        contador.text(contadorCart.length); 
    }

    let idProducto;

    async function fetchCart(url) {
        let res = await fetch(url);
        let data = await res.json();
        console.log(data);

        let totalPrecio = 0;

        $.each(contadorCart, function (index, cart) {
            let producto = data.find(item => item.id === cart.idProducto);
            idApi = cart.idProducto;
            
            let precioProducto = producto.price * cart.cantidad;
            totalPrecio += precioProducto;

            containerCart.append(`
                <section class="container-info">
                    <img src="${producto.image}">
                    <button class="btn-cerrar">
                        ❌
                    </button>
                    <h3 class="product-title">${producto.title}</h3>
                    <hr>
                    <div class="container-price">
                        <h4 class="product-price">Precio: $${producto.price}</h4>
                        <div class="container-buttons">
                            <button class="btn-less" data-id="${producto.id}">
                                -
                            </button>
                            <span class="contador" data-id="${producto.id}">
                                ${cart.cantidad}
                            </span>
                            <button class="btn-more" data-id="${producto.id}">
                                +
                            </button>
                        </div>
                    </div>
                </section> 
            `);

            $(".container-info").on("click", `.btn-less[data-id="${producto.id}"], .btn-more[data-id="${producto.id}"]`, (event) => {
                let tipo = event.target.classList.contains('btn-more') ? "mas" : "menos";
                idProducto = $(event.target).data('id');
                cambiarCantidad(idProducto, tipo);
            });

            precioTotal.text("$ " + totalPrecio);

            // $(".container-info").on("click", (event) => {
            //     let posicionClick = $(event.target);
            //     if (posicionClick.hasClass('btn-less') || posicionClick.hasClass('btn-more')) {
            //         let tipo = "menos";
            //         let idProducto = posicionClick.data('id');
            //         // idProducto = cart.idProducto;
            //         // idProducto = $('.btn-less').data('id');
            //         console.log(idProducto);
            //         if (posicionClick.hasClass('btn-more')) {
            //             tipo = "mas";
            //             // idProducto = $('.btn-more').data('id');
            //         }
            //         cambiarCantidad(idProducto, tipo);

            //         let cantidadProducto = contadorCart.find(item => item.idProducto === idProducto).cantidad;
            //         $(`.contador[data-id="${idProducto}"]`).text(cantidadProducto);
            //     };
            // });


            const cambiarCantidad = (id, tipo) => {
                let positionCart = contadorCart.findIndex((value) => value.idProducto === id);
                if (positionCart >= 0) {
                    switch (tipo) {
                        case "mas":
                            // El producto está en el carrito, incrementa la cantidad.
                            contadorCart[positionCart].cantidad += 1;
                            break;
                        default:
                            if (contadorCart[positionCart].cantidad > 1) {
                                contadorCart[positionCart].cantidad -= 1;
                            }
                            break;
                    };
                };
                // Actualizar el precio total después de cambiar la cantidad
                let totalPrecio = contadorCart.reduce((total, item) => {
                    let producto = data.find(producto => producto.id === item.idProducto);
                    return total + (producto.price * item.cantidad);
                }, 0);

                $(`.contador[data-id="${id}"]`).text(contadorCart[positionCart].cantidad);

                precioTotal.text("$ " + totalPrecio);

                localStorage.setItem("Cart", JSON.stringify(contadorCart));
            };
        });
    };
    fetchCart(`https://fakestoreapi.com/products/${idApi}`);
});