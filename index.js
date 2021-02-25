const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const config = require('./common/config.js')

const PageRouter = require('./views/pages/routes')
const GrubhubRouter = require('./views/grubhub/routes')
const Constants = require('./views/grubhub/constants')
const Utils = require('./views/grubhub/utils')

require('dotenv').config()
const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
    res.header('Access-Control-Expose-Headers', 'Content-Length')
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    } else {
        return next()
    }
})

app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
PageRouter.config(app)
GrubhubRouter.config(app)

setInterval(Utils.refreshBearerToken, Constants.TOKEN_REFRESH_INTERVAL)

app.listen(process.env.PORT || config.port, () => console.log('app listening at port %s', config.port))
