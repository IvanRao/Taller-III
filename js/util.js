/**
Borra todos los hijos de un elemento HTML
*/
function $_removeChilds(elm){
    while(elm.firstChild){
        elm.removeChild(elm.firstChild)
    }
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

/**
Busca varios elementos por CSS selector
*/
function $$(e){
    return $_elm(document.querySelectorAll(e))
}

/**
Crea un elemento con propiedades
*/
function _$(tagName,props){
    const elm = document.createElement(tagName)
    if (props){
        for(let prop in props){
            elm.setAttribute(prop,props[prop])
        }
    }
    return $_elm(child)
}

function isLogged(){
    return localStorage.user != null
}

function currentUser(){
    return isLogged() ? JSON.parse(localStorage.user) : null
}

function isAdmin(){
    return isLogged() ? currentUser().role == 1 : false
}

window.addEventListener("load",()=>{

    if(!isAdmin()){
        $$("[data-admin-only]").forEach((elm) => {
            elm.parentNode.removeChild(elm)
        })
    }

    if(!isLogged()){
        $$("[data-logged-only]").forEach((elm) => {
            elm.parentNode.removeChild(elm)
        })
    }

    if(isLogged()){
        $$("[data-not-logged-only]").forEach((elm) => {
            elm.parentNode.removeChild(elm)
        })
    }
})
