import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API } from '../../api'
import c from './lesson.module.scss'

const LessonMore = () => {
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)

  useEffect(() => {
    API.getLesson(id).then(res => setLesson(res.data))
  }, [id])

  const navigate = useNavigate()

  if (!lesson) return <div className={c.loading}>Загрузка...</div>

  return (
    <div className={c.wrapper}>
      <h1 className={c.title}>📘 Урок {lesson.id}: {lesson.title}</h1>
      <p className={c.subtitle}>
        {lesson.description}
      </p>

      <video controls className={c.video}>
        <source src={lesson.video} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

      <h1 className={c.title}>Дополнительно</h1>
      <div className={c.images}>
        {
          lesson?.images.map(item => (
            <div key={item.id} className={c.imageItem}>
              <img src={item.image} alt={item.caption} />
              <p>{item.caption}</p>
            </div>
          ))
        }
      </div>



      <div className={c.buttons}>
        {/* <button className={c.primaryBtn}>Перейти к PDF файлу</button> */}
        <button className={c.secondaryBtn} onClick={() => navigate(`/test/${lesson?.id}/`)}>Перейти к тесту</button>
      </div>
    </div>
  )
}

export default LessonMore