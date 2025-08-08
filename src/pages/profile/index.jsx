import React from 'react'
import c from './profile.module.scss'

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className={c.wrapper}>
      <h1 className={c.title}>👤 Профиль пользователя</h1>

      <div className={c.info}>
        <p><strong>Имя пользователя:</strong> {user[0].username}</p>
        <p><strong>Имя:</strong> {user[0].full_name}</p>
        <p><strong>Email:</strong> {user[0].email}</p>
        <p><strong>Номер телефона:</strong> {user[0].phone_number}</p>
      </div>

      <div className={c.buttons}>
        <button
          className={c.logout}
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}
        >
          Выйти
        </button>

        <button className={c.link} onClick={() => window.location.href = '/'}>
          На главную
        </button>

        <button className={c.link} onClick={() => window.location.href = '/lessons'}>
          К урокам
        </button>
      </div>
    </div>
  )
}

export default Profile