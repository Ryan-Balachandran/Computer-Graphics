const http = require('http');
const {readFileSync} = require('fs');
const url = require('url');
const path = require('path');

http.createServer((request, response) => {
    const header   = {'Cache-Control': 'no-cache, no-store, must-revalidate'};
    const method   = request.method;
    const parsed   = url.parse(request.url,true);
    const pathname = parsed.pathname;

    if(method === 'GET') 
    {
        if(request.url === '/') 
        {
            header['Content-Type'] = 'text/html';
            response.writeHead(200, header);
            response.end(readFileSync('gasket1.html'), 'utf8');
            return;
        }
        switch(pathname.split('.')[1]) 
        {
            case 'ico':
                header['Content-Type'] = 'image/vnd.microsoft.icon';
                response.writeHead(200, header);
                const base = path.resolve('.');
                const target = path.resolve(base, pathname);
                const relative = path.relative(base, target);
                if (relative.startsWith('..') || path.isAbsolute(relative)) {
                    response.writeHead(400, header);
                    response.end();
                    break;
                }
                response.end(readFileSync(target), 'binary');
                break;
            case 'js':
                header['Content-Type'] = 'text/javascript';
                response.writeHead(200, header);
                const baseJs = path.resolve('.');
                const targetJs = path.resolve(baseJs, pathname);
                const relativeJs = path.relative(baseJs, targetJs);
                if (relativeJs.startsWith('..') || path.isAbsolute(relativeJs)) {
                    response.writeHead(400, header);
                    response.end();
                    break;
                }
                response.end(readFileSync(targetJs), 'utf8');
                break;
            case 'glsl':
                header['Content-Type'] = 'text/plain';
                response.writeHead(200, header);
                const baseGlsl = path.resolve('./shaders');
                const targetGlsl = path.resolve(baseGlsl, pathname);
                const relativeGlsl = path.relative(baseGlsl, targetGlsl);
                if (relativeGlsl.startsWith('..') || path.isAbsolute(relativeGlsl)) {
                    response.writeHead(400, header);
                    response.end();
                    break;
                }
                response.end(readFileSync(targetGlsl), 'utf8');
                break;
            default:
                // get requests with name value pairs
        }
    }
}).listen(80, '0.0.0.0', () => {
    console.log(`server listening for HTTP requests on port 80`);
});
