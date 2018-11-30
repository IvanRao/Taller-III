window.addEventListener("load",()=>{

    $("#login").on("click",()=>{
        const credentials = {
            "username" : $("#username").value,
            "password" : $("#password").value
        }

        RestApi.post("/api/login",credentials)
            .then((usuario)=> {
            localStorage.user = JSON.stringify(usuario);
            window.location = "/index.html";

        })
            .catch((err)=>console.error(err))

    })
})