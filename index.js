const fs = require('fs')
const url = require('url')
const http = require('http')
const enviar = require('./mailer')
const {
    v4: uuidv4
} = require('uuid')
const {
    default: axios
} = require('axios')

http.createServer((req, res) => {
    let {
        correos,
        asunto,
        contenido
    } = url.parse(req.url, true).query
    if (req.url == '/') {
        res.setHeader('content-type', 'text/html')
        fs.readFile('index.html', 'utf8', (err, html) => {
            res.end(html)
        })
    }
    if (req.url.startsWith('/mailing')) {
        if (correos !== '' && asunto !== '' && contenido !== '' && correos.includes(',')) {
            res.setHeader('content-type', 'text/html')
            let euro;
            let uf;
            let dolar;
            let utm;
            axios.get('https://mindicador.cl/api').then((resultado) => {
                uf = resultado.data.uf['valor']
                euro = resultado.data.euro['valor']
                dolar = resultado.data.dolar['valor']
                utm = resultado.data.utm['valor']
                contenido += `\nEl valor del dolar el día de hoy es: ${dolar} \nEl valor del euro el día de hoy es: ${euro}
                \nEl valor de la uf el día de hoy es: ${uf}\nEl valor de la utm el día de hoy es: ${utm}`
                let id = uuidv4().slice(30)

                enviar(correos.split(','), asunto, contenido)
                fs.writeFile(`${id}.txt`, contenido, 'utf8', () => {
                    console.log('Archivo creado correctamente')
                })
            })

            res.write('Correos enviados de forma correcta')
            res.end()
        } else {
            res.setHeader('content-type', 'text/html')
            res.write('Hay que ingresar mas de un solo correo de email')
            res.end()
        }
        res.end();


    }
}).listen(3000)