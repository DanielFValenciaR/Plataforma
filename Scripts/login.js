const contenedor = $('#container');
const registroBtn = $('#register');
const loginBtn = $('#login');
const selectMunicipio = $('#selectMunicipio');
const urlApi = "https://api-colombia.com/api/v1/City";

const urlLogin = new URL("http://localhost:3000/usuario/login");
const urlCreacionUsuario = new URL("http://localhost:3000/usuario");


registroBtn.on('click', () => {
    contenedor.addClass("active");
});

loginBtn.on('click', () => {
    contenedor.removeClass("active");
});

//Funcion para llamar una api de manera asincrona
async function fetchGet(url, callback) {
    let res = await fetch(url);
    let data = await res.json();
    callback(data);
}

$(document).ready(function() {
    //Llamamos la funcion para traer las ciuadades al select con jquery
    fetchGet(urlApi, function (data) {
        $.each(data, function (index, ciudad) {
            selectMunicipio.append($("<option>", {
                value: ciudad.id,
                text: ciudad.name
            }));
        });
    });
});


//Mostrar un alert del login con la conexion a la base de datos
$("#btnIniciar").on('click', function (event) {
    event.preventDefault();
    
    const usuario= $("#usuario").val();
    const password= $("#contrasena").val();

    if (usuario !="" && password !=""){
        (async () => {
            const rawResponse = await fetch(urlLogin, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({usuario: usuario, password: password})
            });

            const content = await rawResponse.json();

            if (content.sucess === true) {
                $("#btnIniciar").on('click', function (event) {
                    event.preventDefault();
                    $('modal').modal('hide')
                }
                );

                /*alert("Acceso concedido");*/
                limpiarLogin();
                window.location.href = "../Views/listaProductos.html";
            } else {
                alert("Acceso denegado");
                limpiarLogin();
            }
        })();
    }else{
        alert("Llene su usuario y contraseña para poder ingresar"); 
    }
});

//Crear un usuario con el formulario de html
$("#btnRegistrar").on('click', function (event) {
    event.preventDefault();

    const nombre = $("#textNombre").val();
    const correo = $("#textEmail").val();
    const telefono = $("#textTelefono").val();
    const usuario = $("#textUsuario").val();
    const password = $("#textContrasena").val();
    const municipio = $("#selectMunicipio option:selected").text();

    let validar = true;
    let campos = "";

    const camposValidar = [
        { valor: nombre, nombre: "nombre" },
        { valor: correo, nombre: "correo" },
        { valor: telefono, nombre: "telefono" },
        { valor: usuario, nombre: "usuario" },
        { valor: password, nombre: "password" },
        { valor: municipio, nombre: "municipio" },
    ];

    camposValidar.forEach(campo => {
        if (campo.valor === null || campo.valor === "") {
            validar = false;
            campos += campo.nombre + ", ";
        }
    });
    
    if (validar === true) {
        (async () => {
            const rawResponse = await fetch(urlCreacionUsuario, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombreCompleto: nombre, email: correo, telefono: telefono, usuario: usuario, password: password, municipio: municipio })
            });

            const content = await rawResponse.json();

            if (content.message === 2) {
                alert("El usuario ya se encuentra registrado. Por favor, elige otro nombre de usuario.");
            } else {
                if (content.sucess === true) {
                    alert("Usuario creado exitosamente!");
                    limpiarCreacionUsuario();
                } else {
                    alert("No pudo ser creado el usuario");
                }
            }
        })();
    } else {
        alert(`Hay un campo vacío, no se puede continuar. Llene los campos: ${campos}`);
    }
})


function limpiarLogin() {
    $("#usuario").val('');
    $("#contrasena").val('');
}

function limpiarCreacionUsuario() {
    $("#textNombre").val("");
    $("#textEmail").val("");
    $("#textTelefono").val("");
    $("#textUsuario").val("");
    $("#textContrasena").val("");
    $("#selectMunicipio").val("");
}

