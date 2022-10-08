const http = require('http');
const {readFileSync} = require('fs');
const url = require('url');

http.createServer((request, response) => {
    const header   = {'Cache-Control': 'no-cache, no-store, must-revalidate'};
    const method   = request.method;
    const parsed   = url.parse(request.url,true);
    const pathname = parsed.pathname;

    if(method === 'GET') {
        if(request.url === '/') {
            header['Content-Type'] = 'text/html';
            response.writeHead(200, header);
            response.end(readFileSync('gasket1.html'), 'utf8');
            return;
        }
        switch(pathname.split('.')[1]) {
            case 'ico':
                header['Content-Type'] = 'image/vnd.microsoft.icon';
                response.writeHead(200, header);
                response.end(readFileSync(`.${pathname}`), 'binary');
                break;
            case 'js':
                header['Content-Type'] = 'text/javascript';
                response.writeHead(200, header);
                response.end(readFileSync(`.${pathname}`), 'utf8');
                break;
            case 'glsl':
                header['Content-Type'] = 'text/plain';
                response.writeHead(200, header);
                response.end(readFileSync(`./shaders/${pathname}`), 'utf8');
                break;
            default:
                // get requests with name value pairs
        }
    }
}).listen(80, '0.0.0.0', () => {
    console.log(`server listening for HTTP requests on port 80`);
});
