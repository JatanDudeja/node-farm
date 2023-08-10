const http = require('http');
const fs = require('fs');
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate')


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

/* Function In replaceTemplate.js file in modules folder and is used as a module in this index.js file */

// const replaceTemplate = (temp, product) => {
//     let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
//     output = output.replace(/{%IMAGE%}/g, product.image)
//     output = output.replace(/{%PRICE%}/g, product.price)
//     output = output.replace(/{%FROM%}/g, product.from)
//     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
//     output = output.replace(/{%QUANTITY%}/g, product.quantity)
//     output = output.replace(/{%DESCRIPTION%}/g, product.description)
//     output = output.replace(/{%ID%}/g, product.id)

//     if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')

//     return output
// }


const server = http.createServer((req, res) => {
    // const pathname = req.url
    const {query, pathname} = url.parse(req.url, true)
    // console.log(query, pathname);
    // const t = url.parse(req.url, true)
    // console.log(pathname, t);

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type' : 'text/html'})
        
        const cardsHtml = dataObj.map(ele => replaceTemplate(tempCard, ele))
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml)

        res.end(output);
    }
    else if (pathname === '/product') {
        res.writeHead(200, {'Content-type' : 'text/html'})

        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)

        res.end(output);
    }
    else if (pathname === '/api') {
        res.writeHead(200, {'Content-type' : 'application/json'})
        res.end(data)

    }
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});


server.listen(8000, '127.0.0.1', () => {
    console.log('Server running on port 8000.')
})

