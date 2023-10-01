let containerCatalogo = document.getElementById("catalogo")
let carritoCount = document.getElementById("carritoCount")
let modalBodyCarrito = document.getElementById("modal-bodyCarrito")
let botonCarrito = document.getElementById("botonCarrito")
let buscador = document.getElementById("buscador")
let coincidenciasDiv = document.getElementById("coincidencias")
let mostrarTodos = document.getElementById("mostrarTodos")

function ratingToStars(rating) {
    // Crear un string vacío para almacenar las estrellas rellenas.
    let stars = '';

    // Iterar sobre el valor de rating para agregar una estrella rellena por cada punto.
    for (let i = 0; i < rating; i++) {
        stars += '<div class="bi-star-fill"></div>';
    }

    // Devolver el string con las estrellas rellenas.
    return stars;
}

function showPrice(articulo) {
    // Validar que el artículo tenga un descuento.
    if (articulo.discount <= 0) {
        return `$${articulo.precio}`;
    }

    let offer = articulo.precio - articulo.discount

    return `
      <span class="text-muted text-decoration-line-through">$${articulo.precio}</span>
      $${offer}
    `;
}

function mostrarCatalogoDOM(array) {
    //resetear el container
    containerCatalogo.innerHTML = ""

    //for of: para recorrer un array posición a posición
    for (let articulo of array) {
        let articuloNuevoDiv = document.createElement("div")
        const stars = ratingToStars(articulo.rating)
        const price = showPrice(articulo);

        articuloNuevoDiv.id = `"${articulo.id}"`
        articuloNuevoDiv.className = "card h-100 my-1 mx-1"
        articuloNuevoDiv.innerHTML =
            `<!-- Sale badge-->
        <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">${articulo.discount > 0 ? 'Oferta' : ''}</div>
        <!-- Product image-->
        <img class="card-img-top img-fluid article-img" src="./assets/img/${articulo.image}" alt="${articulo.titulo}" />
        <!-- Product details-->
        <div class="card-body p-4">
            <div class="text-center">
                <!-- Product name-->
                <h5 class="fw-bolder">${articulo.titulo}</h5>
                <h7 class="">${articulo.category}</h7>
                <!-- Product reviews-->
                <div class="d-flex justify-content-center small text-warning mb-2">
                ${stars}
                </div>
                <!-- Product price-->
                ${price}
            </div>
        </div>
        <!-- Product actions-->
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center"><a id="agregarBtn${articulo.id}" class="btn btn-outline-dark mt-auto" href="#">Agregar al carrito</a></div>
        </div>`

        containerCatalogo.append(articuloNuevoDiv)
        let agregarBtn = document.getElementById(`agregarBtn${articulo.id}`)
        console.log(agregarBtn)
        agregarBtn.addEventListener("click", () => {
            agregarAlCarrito(articulo)
        })
    }
}

function agregarAlCarrito(elemento) {
    let articleAdded = productosCarrito.find((article) => article.id == elemento.id)

    articleAdded == undefined ?
        (
            //pusheo al array carrito:
            productosCarrito.push(elemento),
            //setStorage
            localStorage.setItem("carrito", JSON.stringify(productosCarrito)),
            Toastify({
                text: `El article ${elemento.titulo} ha sido sumado al carrito`,
                duration: 2000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, green, greenyellow)",
                },
            }).showToast()) :
        Toastify({
            text: `El article ${elemento.titulo} ya existe en el carrito`,
            duration: 2500,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, red, orange)",
                color: "black",
                fontWeight: "bold"
            },
        }).showToast()
        mostrarCantidadCarrito()
}

function mostrarCantidadCarrito(){
    carritoCount.innerHTML = `${productosCarrito.length}`
}

function cargarProductosCarrito(array){
    modalBodyCarrito.innerHTML = ""
    array.forEach(
        (productoCarrito) => {
            modalBodyCarrito.innerHTML += `
            <div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">
                 <img class="card-img-top" height="300px" src="./assets/img/${productoCarrito.image}" alt="">
                 <div class="card-body">
                        <h4 class="card-title">${productoCarrito.titulo}</h4>
                         <p class="card-text">$${productoCarrito.precio}</p> 
                         <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                 </div>    
            </div>
            `}
    )
    //segundo for each quiero adjuntar evento eliminar
    array.forEach(
        (productoCarrito) => {
            //similar let btnBorrar = document.getElementById(`botonEliminar${productoCarrito.id}`)
            //capturar nodo sin guardarlo en variable:
            document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click", () =>{
                //borrar del DOM
                let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
                cardProducto.remove()
                //borrar del array
                let posicion = array.indexOf(productoCarrito)
                array.splice(posicion, 1)
                //borrar del storage
                localStorage.setItem("carrito", JSON.stringify(array))
                //actualizamos el total
                calcularTotal(array) 
                mostrarCantidadCarrito()
            })
        }
    )
    calcularTotal(array)    
}

function calcularTotal(array){
    //function con spread (no necesariamente debe ser así)
    
    const totalReduce = array.reduce(
        //dos parámetros: funcion e inicio de valor del acumulador
        //atención que si su carrito maneja cantidad, debe ser precio *cantidad
        (acumulador, article)=>
        {return acumulador + article.precio},
        0
    )
    totalReduce > 0 ? precioTotal.innerHTML = `<strong>El total de su compra es: ${totalReduce}</strong>` : precioTotal.innerHTML = `No hay productos en el carrito` 
    return totalReduce
}

function ordenarMayorMenor(array){
    //copiar array: 
    let arrayMayorMenor = array.concat()
    
     arrayMayorMenor.sort(
        (par1,par2) => par2.precio - par1.precio
    )
    mostrarCatalogoDOM(arrayMayorMenor)
}

function ordenarMenorMayor(ar){
    let arrMenor = ar.concat()
    arrMenor.sort(
        //menor a mayor
        (a, b) => a.precio - b.precio
    )
    mostrarCatalogoDOM(arrMenor)
}

function ordenarAlfabeticamenteTitulo(array){
    let ordenadoAlf = array.concat()
    ordenadoAlf.sort(
        (a,b) => {
            if(a.titulo > b.titulo){
                return 1
            }
            if(a.titulo < b.titulo){
                return -1
            }
            //no es ni mayor ni menor
            return 0
        }
    )
    mostrarCatalogoDOM(ordenadoAlf)
}

function buscarPorTitulo(buscado,array){
    let coincidencias = array.filter(
        (article) => {
            return article.titulo.toLowerCase().includes(buscado.toLowerCase())
        }
    )
    coincidencias.length > 0 ? 
    (mostrarCatalogoDOM(coincidencias), coincidenciasDiv.innerHTML ="") : 
    (mostrarCatalogoDOM(array), coincidenciasDiv.innerHTML = `<h3>No hay coincidencias con su búsqueda, este es nuestro catálogo completo</h3>`) 
}

function buscarPorCategory(buscar,array){
    let coincidencias = array.filter(
        (article) => {
            return article.category.includes(buscar)
        }
    )
    coincidencias.length > 0 ? 
    (mostrarCatalogoDOM(coincidencias), coincidenciasDiv.innerHTML ="") : 
    (mostrarCatalogoDOM(array), coincidenciasDiv.innerHTML = `<h3>No hay coincidencias con su búsqueda, este es nuestro catálogo completo</h3>`) 
}

//EVENTOS PROYECTO:
botonCarrito.addEventListener("click", () => {
    cargarProductosCarrito(productosCarrito)
})

mostrarTodos.addEventListener("click", () => {
    mostrarCatalogoDOM(catalogo)
})


buscador.addEventListener("input", () => {
    buscarPorTitulo(buscador.value, catalogo)
})

selectOrden.addEventListener("change", () => {
    switch(selectOrden.value){
        case "1":
            ordenarMayorMenor(catalogo)
        break
        case "2":
            ordenarMenorMayor(catalogo)
        break
        case "3":
            ordenarAlfabeticamenteTitulo(catalogo)
        break
        default:
            mostrarCatalogoDOM(catalogo)
        break
    }
})

// Extraemos todas las categorias del catalogo
const categorias = catalogo.map((article) => article.category);

// Usamos el método Set() para agrupar las categorías
const categoriasAgrupadas = new Set(categorias);

// Convertimos categoriasAgrupadas en un array
const categoriasArray = Array.from(categoriasAgrupadas);

console.log(categoriasArray);

// Usamos el método map() para generar los elementos li
const elementosLi = categoriasArray.map((categoria) => {
    // Generamos el elemento li
    const li = document.createElement("li")
    li.classList.add("dropdown-item")
    li.textContent = categoria
    li.href = "#!"
    li.onclick = () => {
        buscarPorCategory(categoria, catalogo)
    }

    // Devolvemos el elemento li
    return li
})

// Agregamos los elementos al menú desplegable
const menuCategorias = document.querySelector("#menu-categorias");

for (const li of elementosLi) {
  menuCategorias.appendChild(li);
}

//CÓDIGO
mostrarCatalogoDOM(catalogo)
mostrarCantidadCarrito()