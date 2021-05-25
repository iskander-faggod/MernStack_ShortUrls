const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Invalid email').normalizeEmail().isEmail(),
        check('password', 'Invalid password').isLength({
            min: 6
        }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Please enter a valid data'
                })
            }
            const {email, password} = req.body //с фронтенда забираем
            const candidate = await User.findOne({
                email
            }) //ищем юзера по почте
            if (candidate) {
                return res.status(400).json({
                    message: 'You have already registered'
                })
            } //уже зарегестрирован

            const hashedPassword = await bcrypt.hash(password, 'secret')
            const user = new User({
                email, password: hashedPassword
            }) //хешируем пароль и создаем нового юзера

            await user.save().then(() => {
                res.status(201).json({
                    message: 'You have registered'
                })
            }) //сохраняем юзера в бд

        } catch (err) {
            if (err) throw err
            res.status(500).json({
                message: 'Something went wrong with registration'
            })
        }
    })
// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Please enter a valid data'
                })
            }

            const {email, password} = req.body
            const user = await User.findOne({
                email
            })
            if (!user) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'User not found'
                })
            }
            const isMatch = await bcrypt.compare(password, user.password) //пароль с фронтенда и пароль с базы
            if (!isMatch) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid password'
                })
            }

            const token = jwt.sign(
                {userId: user.id}, //что будет зашифровано
                config.get('jwtSecret'), //секретный ключ
                {expiresIn: '1h'} // через сколько токен перестанет работать
            )

            res.json({
                token,
                userId: user.id
            })


        } catch (err) {
            if (err) throw err
            res.status(500).json({
                message: 'Something went wrong with login'
            })
        }
    })


module.exports = router