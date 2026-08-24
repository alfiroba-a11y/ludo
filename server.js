const http = require('http');
const fs = require('fs');
const path = require('path');

const candidates = [
  path.join(__dirname, 'outputs', 'ludostake-site'),
  path.join(__dirname, 'ludostake-site'),
  path.join(__dirname, 'public'),
  __dirname
];
const root = candidates.find(folder => fs.existsSync(path.join(folder, 'index.html')));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8' };

http.createServer((req, res) => {
  if (!root) return res.writeHead(500).end('index.html is missing from the deployment.');
  const requested = req.url === '/' ? 'index.html' : req.url.split('?')[0].replace(/^\//, '');
  const file = path.resolve(root, requested);
  if (!file.startsWith(root)) return res.writeHead(403).end('Forbidden');
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(data);
  });
}).listen(process.env.PORT || 10000);
