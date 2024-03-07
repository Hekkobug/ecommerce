const userRouter = require('./user')
const {errHandler,notFund} = require('../middlewares/errHandler')
const initRoutes = (app) => {
    app.use('/api/user',userRouter)
    app.use(notFund)
    app.use(errHandler)
}

module.exports = initRoutes