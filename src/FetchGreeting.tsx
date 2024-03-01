import { useState } from 'react'
import axios from 'axios'

// пропом компонента является адрес конечной точки
// для получения приветствия от сервера
const FetchGreeting = ({ url }) => {
    // состояние приветствия
    const [greeting, setGreeting] = useState('')
    // состояние ошибки
    const [error, setError] = useState(null)
    // состояние нажатия кнопки
    const [btnClicked, setBtnClicked] = useState(false)

    // метод для получения приветствия от сервера
    const fetchGreeting = (url) =>
        axios
            .get(url)
            // если запрос выполнен успешно
            .then((res) => {
                const { data } = res
                const { greeting } = data
                setGreeting(greeting)
                setBtnClicked(true)
            })
            // если возникла ошибка
            .catch((e) => {
                setError(e)
            })

    // текст кнопки
    const btnText = btnClicked ? 'Готово' : 'Получить приветствие'

    return (
        <div>
            <button onClick={() => fetchGreeting(url)} disabled={btnClicked}>
                {btnText}
            </button>
            {/* если запрос выполнен успешно */}
            {greeting && <h1>{greeting}</h1>}
            {/* если возникла ошибка */}
            {error && <p role='alert'>Не удалось получить приветствие</p>}
        </div>
    )
}

export default FetchGreeting
