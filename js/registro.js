"use strict"

function $(e){
  return $_elm(document.querySelector(e))
}

/**
Le asigna funciones utiles a un elemento HTML
*/
function $_elm(elm){
  if(!elm) return elm
  elm.add = (child) => elm.appendChild(child)
  elm.on = (eType,handler) => elm.addEventListener(eType,handler)
  elm.empty = () => $_removeChilds(elm)
  return elm
}

/**
Busca un elemento por CSS selector
*/
function $(e){
  return $_elm(document.querySelector(e))
}



function crearRegistro(){
    
    $("#crear_usuario").addEventListener("click", function(){
        
        const user = {
            "username" : $("#usuario").value,
            "pass" : $("#contraseña").value
        }
        
        console.log(user);
        
        RestApi.post("/api/user", user)
        .then((msg)=>{
            $("#cerrar").click();
            console.log(msg)
        })
                                         
    })
        
        
        
        
}

window.addEventListener("load", function(){
    crearRegistro()
})