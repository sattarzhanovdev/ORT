import React from 'react'
import c from './main.module.scss'
import { API } from '../../api'
import { useNavigate } from 'react-router-dom'

const Main = () => {
  const [ lessons, setLessons ] = React.useState(null)
  const [ subjects, setSubjects ] = React.useState(null)

  React.useEffect(() => {
    API.getLessons()
      .then(res => setLessons(res.data))

    API.getSubjects()
      .then(res => setSubjects(res.data))
  }, [])


  const user = JSON.parse(localStorage.getItem('user'))

  const navigate = useNavigate()

  return (
    <div className={c.wrapper}>
      <header className={c.header}>
        <h2>Добрый день, <strong>{user[0].full_name}</strong></h2>
      </header>
{/* 
      <section className={c.mainBlock}>
        <div className={c.title}>Основное</div>
        <div className={c.card}>
          <p>Сейчас вы на <strong>6 этапе подготовки</strong></p>
          <ul>
            <li>📊 4.8 Ваша средняя оценка</li>
            <li>🧩 Осталось пройти 12 модулей</li>
            <li>📚 Пройдено 4 модуля</li>
          </ul>
          <button>Продолжить уроки</button>
        </div>
      </section> */}
{/* 
      <section className={c.sections}>
        <div className={c.title}>Разделы</div>
        <div className={c.slider}>
          <div className={c.card}>
            <img src="/cube.png" alt="icon" />
            <h3>Уроки</h3>
            <p>14 разделов</p>
            <button>Перейти</button>
          </div> */}
          {/* добавь ещё карточки: Тесты, Материалы... */}
        {/* </div> */}
      {/* </section> */}

      <section className={c.subjects}>
        <div className={c.title}>Обучение</div>

        {/* Пример предмета */}

        {
          subjects && subjects.map(item => (
            <div className={c.subjectCard}>
              <h3>{item.name}: основное</h3>
              {/* <div className={c.progressBar}>
                <div className={c.progress} style={{ width: '20%' }}></div>
              </div> */}
              <div className={c.stats}>
                {/* <span>30 тестов</span> */}
                <span>{lessons?.filter(value => value.subject === item.id).length} уроков</span>
              </div>
              <button onClick={() => navigate(`/lessons/${item.id}`)}>Продолжить уроки</button>
            </div>
          ))
        }

        {/* Повтори блоки под другие предметы... */}
      </section>
    </div>
  )
}

export default Main