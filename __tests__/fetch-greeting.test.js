import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FetchGreeting from '../src/FetchGreeting'
import userEvent from '@testing-library/user-event'


const server = setupServer(
    rest.get('/greeting', (req, res, ctx) =>
        res(ctx.json({ greeting: '1!' }))
    )
)

// запускаем сервер перед выполнением тестов
beforeAll(() => server.listen())
// сбрасываем обработчики к дефолтной реализации после каждого теста
afterEach(() => server.resetHandlers())
// останавливаем сервер после всех тестов
afterAll(() => server.close())


test('-> успешное получение и отображение приветствия', async function () {
    // рендерим компонент
    render(<FetchGreeting url='/greeting' />)

    // имитируем нажатие кнопки для отправки запроса

    // screen привязывает (bind) запросы к document.body

    fireEvent.click(screen.getByText('Получить приветствие'))

    // ждем рендеринга заголовка

    await waitFor(() => screen.getByRole('heading'))

    // текстом заголовка должно быть `Привет!`
    expect(screen.getByRole('heading')).toHaveTextContent('1!')
    // текстом кнопки должно быть `Готово`
    expect(screen.getByRole('button')).toHaveTextContent('Готово')
    // кнопка должна быть заблокированной
    expect(screen.getByRole('button')).toBeDisabled()
})

test('-> обработка ошибки сервера', async () => {
    // после этого сервер в ответ на запрос
    // будет возвращать ошибку со статус-кодом `500`
    server.use(rest.get('/greeting', (req, res, ctx) => res(ctx.status(500))))

    // рендерим компонент
    render(<FetchGreeting url='greeting' />)

    // имитируем нажатие кнопки
    const user = userEvent.setup()
    // если не указать `await`, тогда `Testing Library`
    // не успеет обернуть обновление состояния компонента
    // в `act` и мы получим предупреждение в терминале
    await user.click(screen.getByText('Получить приветствие'))

    // ждем рендеринга сообщения об ошибке
    await waitFor(() => screen.getByRole('alert'))

    // текстом сообщения об ошибке должно быть `Не удалось получить приветствие`
    expect(screen.getByRole('alert')).toHaveTextContent(
        'Не удалось получить приветствие'
    )
    // кнопка не должна быть заблокированной
    expect(screen.getByRole('button')).not.toBeDisabled()
})
