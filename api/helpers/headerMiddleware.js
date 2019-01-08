const accepts = require('accepts');
const { trimEnd } = require('lodash');

const encodingTypes = {
  br: 'br',
  gz: 'gzip',
};

const contentTypes = {
  js: 'application/javascript',
  css: 'text/css',
};

function trident(req, res, next) {
  const ua = req.headers['user-agent'];
  if (/Trident/.test(ua)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');// HTTP 1.1.
    res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
    res.setHeader('Expires', '-1'); // Proxies.
  }
  next();
}

function encodingCheck(req, res, next) {
  const encodings = new Set(accepts(req).encodings());
  const path = req.originalUrl;
  const requestForEncodedBr = path.match(/(\.br)$/);
  if (requestForEncodedBr && !encodings.has('br')) {
    if (encodings.has('gzip')) {
      const newUrl = path.replace(/\.br$/g, '.gz');
      res.redirect(newUrl);
    } else {
      const newUrl = trimEnd(path, /(\.br)$/g);
      res.redirect(newUrl);
    }
  } else {
    next();
  }
}

function setHeaders(res, path) {
  if (/(.*)\.(gz|br)$/.test(path)) {
    const urlSplit = path.split('.');
    const contentEncoding = encodingTypes[urlSplit[urlSplit.length - 1]];
    const contentType = contentTypes[urlSplit[urlSplit.length - 2]];
    res.setHeader('Content-Encoding', contentEncoding);
    res.setHeader('Content-Type', contentType);
  }
}

module.exports = { trident, encodingCheck, setHeaders };
