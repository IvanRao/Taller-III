// if($("#logout")){
    document.addEventListener('DOMContentLoaded', function () {
        $("#logout").addEventListener("click", function(){

            localStorage.removeItem('user');
            
            RestApi.post("/api/logout")
                .then((msg)=>
                    window.location = "index.html"
                    )
                .catch((err)=>console.error(err))
        })    
    });
// }