import React, {useEffect, useState} from 'react';
import '../index.css'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hooks";

export const AuthPage = () => {
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {
        console.log('error', error)
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {
                ...form
            })
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className='row'>
                <div className="col s6 offset-s3">
                    <h1>Сокращение ссылок</h1>
                    <div className="card blue-grey darken-1" style={{marginTop: '5rem'}}>
                        <div className="card-content white-text">
                            <span className="card-title center-align" style={{fontWeight: 'bold'}}>Авторизация</span>
                            <div>
                                <div className="input-field">
                                    <input
                                        placeholder="Введите email"
                                        id="email"
                                        type="text"
                                        name="email"
                                        className="yellow-input"
                                        onChange={changeHandler}
                                    />
                                    <label htmlFor="email">Email</label>
                                </div>

                                <div className="input-field">
                                    <input
                                        placeholder="Введите пароль"
                                        id="password"
                                        type="password"
                                        name="password"
                                        className="yellow-input"
                                        onChange={changeHandler}
                                    />
                                    <label htmlFor="email">Пароль</label>
                                </div>
                            </div>
                        </div>
                        <div className="card-action center-align">
                            <button
                                type='submit'
                                className='btn yellow darken-4'
                                style={{marginRight: 20}}
                                disabled={loading}>
                                Войти
                            </button>

                            <button
                                type='submit'
                                className='btn yellow darken-4'
                                onClick={registerHandler}
                                disabled={loading}>
                                Регистрация
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}