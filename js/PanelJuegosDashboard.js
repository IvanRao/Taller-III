"use strict"

function $_removeChilds(elm){
    while(elm.firstChild){
        elm.removeChild(elm.firstChild)
    } 
}

function $(e){
    return $_elm(document.querySelector(e))
}


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}



function crearJuego(){

    $("#saveJuego").addEventListener("click", function(){

        getBase64($("#fileJuegos").files[0])
            .then((b64) => {
            const juegos = {
                "nombre" : $("#nombre").value,
                "precio" : $("#precio").value,
                "consolas_id" : $("#consolaSelectCrear").value,
                "imagen" : b64
            }
            console.log(juegos)

            RestApi.post("/api/juegos", juegos)
                .then((msj)=>{
                console.log('El producto se creó con éxito')
                $("#cerrar").click();
                abrirPanel();
            })
                .catch((err)=>{
                console.error(err)
            })
        })
    })
}

function Editar(id){
    $("#id_juego").value = id;

    RestApi.get("/api/juegos/" + $("#id_juego").value)
        .then((juegos)=>{
        $("#editar_nombre").value = juegos.nombre;
        $("#editar_precio").value = juegos.precio;
        $("[data-consola-select]").value = juegos.consolas_id.nombre;

    })
}   


function editarProducto(){

    $("#editarJuego").addEventListener("click", function(){

        /*getBase64($("#fileEditar").files[0])
            .then((b64) => {
                const juegos = {
                    "id" : $("#id_juego").value,
                    "nombre" : $("#editar_nombre").value,
                    "precio" : $("#editar_precio").value,
                    "imagen" : b64
                }

            console.log(juegos)

            RestApi.put("/api/juegos", juegos)
                .then((msj)=>{
                console.log('El producto se editó con éxito')
                $("#cerrar").click();
                abrirPanel();
            })
                .catch((err)=>{
                console.error(err)
            })

        })*/

        if($("#fileJuegosEditar").files[0] == null){
            const juegos = {
                "id" : $("#id_juego").value,
                "nombre" : $("#editar_nombre").value,
                "precio" : $("#editar_precio").value,
                "consolas_id" : $("#consolaSelectEditar").value,
                "imagen" : null
            }

            RestApi.put("/api/juegos", juegos)
                .then((msj)=>{
                console.log('El producto se edito con éxito')
                $("#cerrarEditar").click();
                abrirPanel();
            })
                .catch((err)=>{
                console.error(err)
            })
        }else{
            getBase64($("#fileJuegosEditar").files[0])
                .then((b64) => {
                const juegos = {
                    "id" : $("#id_juego").value,
                    "nombre" : $("#editar_nombre").value,
                    "precio" : $("#editar_precio").value,
                    "consolas_id" : $("#consolaSelectEditar").value,
                    "imagen" : b64
                }

                RestApi.put("/api/juegos", juegos)
                    .then((msj)=>{
                    console.log('El producto se edito con éxito')
                    $("#cerrarEditar").click();
                    abrirPanel();
                })
                    .catch((err)=>{
                    console.error(err)
                })

            })

        }
    })

}

/*const juegos = {
            "id" : $("#id_juego").value,
            "nombre" : $("#editar_nombre").value,
            "precio" : $("#editar_precio").value,
            "consolas_id" : $("#consolaSelectEditar").value
        }

        RestApi.put("/api/juegos", juegos)
            .then((msj)=>{
            console.log('El producto se edito con éxito')
            $("#cerrarEditar").click();
            abrirPanel();
        })
            .catch((err)=>{
            console.error(err)
        })*/


/*if($("#file").files[0] == null){
             const producto = {
                    "id" : localStorage.idProductoEditar,
                    "nombre" : $("#nombre").value,
                    "precio" : $("#precio").value,
                    "imagen" : null
                }

                RestApi.put("/api/producto", producto)

                .then((msg)=>{
                    console.log(msg)
                }).catch((err)=>console.error(err))
        }else{
            getBase64($("#file").files[0])
            .then((b64) => {
                const producto = {
                    "id" : localStorage.idProductoEditar,
                    "nombre" : $("#nombre").value,
                    "precio" : $("#precio").value,
                    "imagen" : b64
                }

                RestApi.put("/api/producto", producto)

                .then((msg)=>{
                    console.log(msg)
                }).catch((err)=>console.error(err))

            }).catch((err)=>console.error(err))


        }*/                              



function eliminarProducto(id){

    RestApi.del("/api/juegos/" + id)
        .then((juegos)=>{
        console.log(juegos)
        abrirPanel();
    })
        .catch((err)=>{
        console.error(err)
    })
}



function createRow(juegos){

    const tr = document.createElement("tr")
    const td1 = document.createElement("td")
    const td2 = document.createElement("td")
    const td3 = document.createElement("td")
    const td4 = document.createElement("td")
    const td5 = document.createElement("td")
    const td6 = document.createElement("td")

    const modifyButton =  document.createElement("button") 
    modifyButton.setAttribute("type", "button")
    modifyButton.setAttribute("class", "btn btn-info")
    modifyButton.setAttribute("id", "Modificar")
    modifyButton.setAttribute("data-toggle", "modal")
    modifyButton.setAttribute("data-target", "#ModalEditar")
    modifyButton.setAttribute("style", "margin: 0px 3px 0px 0px")
    modifyButton.innerText = "Modificar"
    modifyButton.addEventListener("click",function(){
        Editar(juegos.id)
    })


    const deleteButton = document.createElement("button")
    deleteButton.setAttribute("type", "button")
    deleteButton.setAttribute("class", "btn btn-danger")
    deleteButton.setAttribute("id", "Eliminar")
    deleteButton.innerText = "Eliminar"
    deleteButton.addEventListener("click",function(){
        eliminarProducto(juegos.id) 
    })

    let img = document.createElement("img");
    img.setAttribute("src","api/file/" + juegos.id);
    img.setAttribute("class", "img-responsive");
    img.setAttribute("alt", juegos.nombre);
    img.setAttribute("style", "height: 100px");


    td1.innerText = juegos.id
    td2.innerText = juegos.nombre
    td3.innerText = juegos.precio
    td4.innerText = juegos.consolas_id.nombre
    td5.appendChild(img)    
    td6.appendChild(modifyButton)
    td6.appendChild(deleteButton)

    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    tr.appendChild(td6)
    return tr


}

function abrirPanel(){

    const tbody = $("#juegos")
    RestApi.get("/api/juegos")
        .then((juegos)=>{
        $_removeChilds(tbody)
        juegos.forEach((prod)=>{
            tbody.appendChild(createRow(prod))
        })
    })

}

function addConsolasOption(select,consola){
    const opt = document.createElement("option")
    opt.setAttribute("value",consola.id)
    opt.innerText = consola.nombre
    select.appendChild(opt)
}

function cargarSelectConsolas(){
    const consolaSelects = $$("[data-consola-select]")
    RestApi.get("/api/consolas")
        .then((consolas)=>{
        consolas.forEach((c) => {
            consolaSelects.forEach((select)=>{
                addConsolasOption(select,c)
            })
        }) 
    })
}

window.addEventListener("load",function (){    
    abrirPanel();
    crearJuego();
    editarProducto();
    cargarSelectConsolas();
})