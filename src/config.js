const URI = '172.31.50.56';
var config = {
    API_ROOT: 'http://' + URI + ':8771',
    EMA_ROOT: 'http://'+URI+':8773',
    ACC_ROOT: 'http://'+URI+':8772',
    defaultAxiosHeaders: (headers) => {
        return {
            ...headers,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        }
    },
}

export default config
