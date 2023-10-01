class Article {
    constructor(id, titulo, marca, category, precio, discount, rating, image) {
        this.id = id,
        this.titulo = titulo,
        this.marca = marca,
        this.category = category,
        this.precio = precio,
        this.discount = discount,
        this.rating = rating,
        this.image = image
    }

    //métodos en class se declaran por fuera del constructor
    mostrarInfoLArticle() {
        console.log(`${this.id} ${this.titulo}  ${this.precio}`)
    }

    exponerEnCatalogo() {
        console.log(`${this.id} ${this.titulo}  ${this.precio}`)
    }
}

//Instanciación de objetos: 
const article1 = new Article(1, "FIDEOS TIRABUZON", "LUCCHETTI", "Arroz y pastas secas", 727, 10, 3, "fideos.jpg")
const article2 = new Article(2, "ACEITE DE GIRASOL", "NATURA", "Aceites vinagres y acetos", 620, 0, 3, "aceite.jpg")
const article3 = new Article(3, "ARROZ PARBOIL", "GALLO", "Arroz y pastas secas", 977, 5, 3, "arroz.jpg")
const article4 = new Article(4, "ATUN ENTERO AL NATURAL", "GOMES DA COSTA", "Conservas de pescado", 1400, 10, 3, "atun.jpg")
const article5 = new Article(5, "Dulce de Leche", "Manfrey", "Dulces", 581, 1, 3, "dulce-de-leche.jpg")
const article6 = new Article(6, "GALLETAS SONRISAS", "BAGLEY", "Galletas", 350, 5, 3, "galletas.jpg")

let catalogo = []
if (localStorage.getItem("catalogo")) {

    for (let article of JSON.parse(localStorage.getItem("catalogo"))) {
        let articuloStorage = new Article(article.id, article.titulo, article.marca, article.category, article.precio, article.discount, article.rating,  article.image)
        catalogo.push(articuloStorage)
    }

} else {
    //no existe seteamos porprimera vez
    console.log("seteamos por primera vez")
    catalogo.push(article1, article2, article3, article4, article5, article6)
    localStorage.setItem("catalogo", JSON.stringify(catalogo))
}

let productosCarrito = JSON.parse(localStorage.getItem("carrito")) ?? []
console.log(productosCarrito)