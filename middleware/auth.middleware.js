const jwt =require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split('')[1] //"Bearer TOKEN (catch token)

        if (!token){
            res.status(401).json({
                message : 'Нет авторизации'
            })
        }
        req.user = jwt.verify(token, config.get('jwtSecret'))
        next()
    } catch (err) {
        res.status(401).json({message: 'Не авторизирован'})
    }
}