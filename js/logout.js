window.addEventListener("load", function(){
    RestApi.post("/api/logout")
        .then((msg)=>{
        localStorage.removeItem('user');
        window.location = "/login.html";
    })
        .catch((err)=>console.error(err))
})