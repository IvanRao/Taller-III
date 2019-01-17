"use strict"

function $_removeChilds(elm){
    while(elm.firstChild){
        elm.removeChild(elm.firstChild)
    } 
}

function $(e){
    return $_elm(document.querySelector(e))
}

function getCart(){
    const cart = localStorage.cart
    if(!cart){
        return []
    } else {
        return JSON.parse(cart)
    }
}


function DeleteFromCart(pos){
    let currentCart = getCart()
    currentCart.splice(pos,1)
    localStorage.cart = JSON.stringify(currentCart)
    crearCarrito();

} 

function createRow(product, posicion){
    const tr = document.createElement("tr")
    const td1 = document.createElement("td")
    const td2 = document.createElement("td")
    const td3 = document.createElement("td")

    const deleteProduct = document.createElement("button")
    deleteProduct.innerText = "Eliminar del carrito"
    deleteProduct.addEventListener("click",function(){
        DeleteFromCart(posicion)
    })

    td1.innerText = product.nombre
    td2.innerText = product.precio
    td3.appendChild(deleteProduct)

    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    return tr
}

function crearCarrito(){

    const tbodyCart = $("#cart")
    $_removeChilds(tbodyCart);
    var posicion = 0
    getCart()
        .forEach((prod)=>{

        tbodyCart.appendChild(createRow(prod, posicion))
        posicion++;
    })

}
window.addEventListener("load",function (){
    crearCarrito();
    getCart();
    createRow();
})
