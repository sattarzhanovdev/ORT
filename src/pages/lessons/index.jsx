import React from 'react'
import { API } from '../../api'
import s from './lessons.module.scss'
import { useNavigate } from 'react-router-dom'

const Lessons = () => {
  const [lessons, setLessons] = React.useState([])
  const [subjects, setSubjects] = React.useState([])
  

  React.useEffect(() => {
    API.getLessons().then(res => {
      setLessons(res.data)
      // const result = res.data.filter(lesson => lesson.subject === 'математика')
    })

    API.getSubjects().then(res => {
      setSubjects(res.data)
    })
  }, [])

  const navigate = useNavigate()
  
  return (
    <div className={s.container}>
      <h1 className={s.subjectTitle}>Уроки</h1>
      <p className={s.subtitle}>
        Сейчас мы едем до вашего пункта назначения, готовьтесь получать
      </p>

      {subjects?.map(subject => {
  const subjectLessons = lessons.filter(lesson => lesson.subject === subject.id)

  return (
    <div key={subject.id} className={s.subjectBlock}>
      <h1 className={s.subjectTitle}>📘 {subject.name}</h1>
      <p className={s.subtitle}>
        Сейчас мы едем до вашего пункта назначения, готовьтесь получать
      </p>

      <div className={s.list}>
        {subjectLessons.map((lesson, idx) => (
          <div key={lesson.id} className={s.card}>
            <h2 className={s.lessonTitle}>Урок {idx + 1}: {lesson.title}</h2>
            <p className={s.description}>
              Сейчас мы едем до вашего пункта назначения, готовьтесь получать
            </p>
            <div className={s.buttonGroup}>
              <button
                className={s.primaryBtn}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                Перейти к уроку
              </button>
              <button
                className={s.secondaryBtn}
                onClick={() => navigate(`/testing/${lesson.id}`)}
              >
                Перейти к тесту
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})}
    </div>
  )
}

export default Lessons