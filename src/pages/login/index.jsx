import React from 'react'
import { useForm } from 'react-hook-form'
import { API } from '../../api'
import { useNavigate } from 'react-router-dom'
import c from './login.module.scss'

const Login = () => {
  const { handleSubmit, register, reset } = useForm()
  const [error, setError] = React.useState('')

  const navigate = useNavigate()

  const handleLogin = (data) => {
    API.login(data)
      .then(res => {
        localStorage.setItem('token', res.data.token)
        API.getUsers().then(user => {
          localStorage.setItem('user', JSON.stringify(user.data))
          setError('')
          navigate('/')
        })
      })
      .catch(() => setError('Неверный логин или пароль'))
  }

  return (
    <div className={c.container}>
      <form onSubmit={handleSubmit(handleLogin)} className={c.form}>
        <h2 className={c.title}>Вход в аккаунт</h2>

        <input
          type="text"
          {...register('username', { required: true })}
          placeholder="Имя пользователя"
          className={c.input}
        />

        <input
          type="password"
          {...register('password', { required: true })}
          placeholder="Пароль"
          className={c.input}
        />

        {error && <p className={c.error}>{error}</p>}

        <button type="submit" className={c.button}>
          Войти
        </button>
      </form>
    </div>
  )
}

export default Login