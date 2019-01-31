"USE STRICT"

window.addEventListener("load",function (){
    crearJuego();

    function addToCart (prod){
        const cart = localStorage.cart
        if(!cart){
            const newCart = [prod];
            localStorage.cart = JSON.stringify(newCart)
        } else {
            const cartObj = JSON.parse(cart)
            cartObj.push(prod)
            localStorage.cart = JSON.stringify(cartObj)
        }

    }

    function createRow(juegos){

        const columna = document.createElement("div")
        const card = document.createElement("div")
        const imagen = document.createElement("div")
        const cuerpo = document.createElement("div")
        const titulo = document.createElement("h3")
        const precio = document.createElement("h3")
        const agregar = document.createElement("a")

        const addToCartButton = document.createElement("button")
        addToCartButton.setAttribute("class", "btn btn-primary")
        addToCartButton.innerText = "Agregar al carrito"
        addToCartButton.addEventListener("click",function(){
            addToCart(juegos)
        })

        let img = document.createElement("img");
        img.setAttribute("src","api/file/" + juegos.id);
        img.setAttribute("class", "card-img-top");
        img.setAttribute("alt", juegos.nombre);
        img.setAttribute("style", "width:98%");
        img.setAttribute("id", "imagenJuego");

        columna.setAttribute("class", "col-md-4")

        titulo.setAttribute("class", "panel-heading")
        titulo.innerText = juegos.nombre

        card.setAttribute("class", "panel panel-default")
        card.setAttribute("style", "width: 63%")

        imagen.appendChild(img)
        imagen.setAttribute("style", "height: 320px")

        cuerpo.setAttribute("class", "col-lg-12")
        cuerpo.setAttribute("style", "padding: 0")

        precio.setAttribute("class", "card-text")
        precio.innerText = "$" + juegos.precio

        agregar.appendChild(addToCartButton)

        card.appendChild(titulo)
        card.appendChild(cuerpo)
        card.appendChild(imagen)
        card.appendChild(precio)
        card.appendChild(agregar)

        columna.appendChild(card)

        return columna


    }

    function crearJuego(){
        const tbodyJuegos = $("#prodsJuegos")

        RestApi.get("/api/juegos")
            .then((juegos)=>{
            juegos.forEach((prod)=>{
                tbodyJuegos.appendChild(createRow(prod))
            })
        })
    }

})