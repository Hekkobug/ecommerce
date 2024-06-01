const userRouter = require('./user')
const productRouter = require('./product')
const {errHandler,notFund} = require('../middlewares/errHandler')
const initRoutes = (app) => {
    app.use('/api/user',userRouter)
    app.use('/api/product', productRouter)


    
    app.use(notFund)
    app.use(errHandler)
}

module.exports = initRoutes