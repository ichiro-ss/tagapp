
export const makeCROSRequest = (request : any) => {
  request.credentials = "include"
  request.headers = {
      "Access-Control-Allow-Credentials": "true",
  } 
  return request
}




