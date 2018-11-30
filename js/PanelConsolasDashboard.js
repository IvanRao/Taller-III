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

function crearConsola(){

    $("#saveConsola").addEventListener("click", function(){

        getBase64($("#fileConsolas").files[0])
            .then((b64) => {
            const consolas = {
                "nombre" : $("#nombre").value,
                "precio" : $("#precio").value,
                "imagenConsola" : b64
            }
            console.log(consolas)

            RestApi.post("/api/consolas", consolas)
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
    $("#id_consola").value = id;

    const div = $("#fotoConsolaEditar");
    const img = document.createElement("img");


    RestApi.get("/api/consolas/" + $("#id_consola").value)
        .then((consolas)=>{
        $("#editar_nombre").value = consolas.nombre;
        $("#editar_precio").value = consolas.precio;

        img.setAttribute("src","api/fileConsolas/" + consolas.id);
        img.setAttribute("class", "img-responsive");
        img.setAttribute("style", "height: 100px");


        div.appendChild(img)

    })
}   

function editarProducto(){

    $("#editarConsola").addEventListener("click", function(){

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

        if($("#fileConsolasEditar").files[0] == null){
            const consolas = {
                "id" : $("#id_consola").value,
                "nombre" : $("#editar_nombre").value,
                "precio" : $("#editar_precio").value,
                "imagenConsola" : null
            }

            RestApi.put("/api/consolas", consolas)
                .then((msj)=>{
                console.log('El producto se edito con éxito')
                $("#cerrarEditar").click();
                abrirPanel();
            })
                .catch((err)=>{
                console.error(err)
            })
        }else{
            getBase64($("#fileConsolasEditar").files[0])
                .then((b64) => {
                const consolas = {
                    "id" : $("#id_consola").value,
                    "nombre" : $("#editar_nombre").value,
                    "precio" : $("#editar_precio").value,
                    "imagenConsola" : b64
                }

                RestApi.put("/api/consolas", consolas)
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

    RestApi.del("/api/consolas/" + id)
        .then((consolas)=>{
        console.log(consolas)
        abrirPanel();
    })
        .catch((err)=>{
        console.error(err)
    })
}



function createRow(consolas){

    const tr = document.createElement("tr")
    const td1 = document.createElement("td")
    const td2 = document.createElement("td")
    const td3 = document.createElement("td")
    const td4 = document.createElement("td")
    const td5 = document.createElement("td")


    const modifyButton =  document.createElement("button") 
    modifyButton.setAttribute("type", "button")
    modifyButton.setAttribute("class", "btn btn-info")
    modifyButton.setAttribute("id", "Modificar")
    modifyButton.setAttribute("data-toggle", "modal")
    modifyButton.setAttribute("data-target", "#ModalEditar")
    modifyButton.setAttribute("style", "margin: 0px 3px 0px 0px")
    modifyButton.innerText = "Modificar"
    modifyButton.addEventListener("click",function(){
        Editar(consolas.id)
    })


    const deleteButton = document.createElement("button")
    deleteButton.setAttribute("type", "button")
    deleteButton.setAttribute("class", "btn btn-danger")
    deleteButton.setAttribute("id", "Eliminar")
    deleteButton.innerText = "Eliminar"
    deleteButton.addEventListener("click",function(){
        eliminarProducto(consolas.id) 
    })

    let img = document.createElement("img");
    img.setAttribute("src","api/fileConsolas/" + consolas.id);
    img.setAttribute("class", "img-responsive");
    img.setAttribute("alt", consolas.nombre);
    img.setAttribute("style", "height: 100px");


    td1.innerText = consolas.id
    td2.innerText = consolas.nombre
    td3.innerText = consolas.precio
    td4.appendChild(img)
    td5.appendChild(modifyButton)
    td5.appendChild(deleteButton)

    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    return tr


}

function abrirPanel(){

    const tbody = $("#consolas")
    RestApi.get("/api/consolas")
        .then((consolas)=>{
        $_removeChilds(tbody)
        consolas.forEach((prod)=>{
            tbody.appendChild(createRow(prod))
        })
    })

}



window.addEventListener("load",function (){    
    abrirPanel();
    crearConsola();
    editarProducto();
})