 window.addEventListener("load",()=>{
         
     $("#login").on("click",()=>{
        const credentials = {
          "username" : $("#username").value,
          "password" : $("#password").value
        }

        RestApi.post("/api/login",credentials)
          .then((usuario)=> {
            window.location = "/index.html";
            localStorage.user = JSON.stringify(usuario);
           })
          .catch((err)=>console.error(err))

        })
})