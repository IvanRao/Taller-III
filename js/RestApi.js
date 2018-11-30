class RestApi{

  static restCall(method,path,body){
    if(body){
      body = JSON.stringify(body)
    }
    return fetch(path,{
        method,
        body,
        credentials: 'include'
      })
      .then((resp)=>{
        if(resp.status == 401){
          window.location = "/login.html"
        }
        return resp.text()
      })
      .then((text)=> new Promise((success,fail)=>{
          try{
            const json = JSON.parse(text)
            success(json)
          } catch (err){
            fail(text)
          }
      }))
  }

  static get (path,params){
    const esc = encodeURIComponent;
    const query = Object.keys(params || {})
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
    if(query)
      path=path+"?"+query
    return RestApi.restCall("get",path)
  }

  static post (path,body){
    return RestApi.restCall("post",path,body)
  }

  static put (path,body){
    return RestApi.restCall("put",path,body)
  }

  static del (path,body){
    return RestApi.restCall("delete",path,body)
  }

}
//Utilidad para otener los parametros de la URL
function __getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

const URLParams = __getQueryParams(document.location.search)
