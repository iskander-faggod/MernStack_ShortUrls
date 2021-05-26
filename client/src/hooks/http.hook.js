import {useState, useCallback} from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false) //состояние загрузки
    const [error, setError] = useState(null) //состояние ошибки

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try{
            if(body){
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, {
                method, body, headers
            }) //получение информации с сервера
            const data = await response.json() //приводим значение response к формату JSON

            //если запрос не отработал
            if (!response.ok){
                throw new Error(data.message ||'Something went wrong')
            }
            setLoading(false)
            return data

        } catch (err){
            setLoading(false)
            setError(err.message)
            throw err
        }
    },[])

    const clearError = useCallback(()=>{
        setError(null)
    },[])

    return {
        loading,
        request,
        error,
        clearError
    }
}