import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API } from '../../api'
import c from './lessons.module.scss'

const LessonsDivided = () => {
  const { subject } = useParams()
  const [lessons, setLessons] = React.useState([])
  const navigate = useNavigate()

  React.useEffect(() => {
    API.getLessons().then(res => {
      const filteredLessons = res.data.filter(
        lesson => lesson.subject === Number(subject)
      )
      setLessons(filteredLessons)
    })
  }, [subject])

  return (
    <div className={c.wrapper}>
      <h2 className={c.title}>📚 Уроки по выбранному предмету</h2>

      {lessons.length === 0 ? (
        <p className={c.empty}>Уроки не найдены</p>
      ) : (
        lessons.map(lesson => (
          <div key={lesson.id} className={c.card}>
            <h3 className={c.lessonTitle}>{lesson.title}</h3>
            <p className={c.description}>{lesson.description}</p>

            {/* <div className={c.images}>
              {lesson.images.map(img => (
                <div key={img.id} className={c.imageItem}>
                  <img src={img.image} alt={img.caption} />
                  <p>{img.caption}</p>
                </div>
              ))}
            </div> */}

            <div className={c.buttons}>
              <button onClick={() => navigate(`/lesson/${lesson.id}`)}>Перейти к уроку</button>
              <button onClick={() => navigate(`/test/${lesson.id}`)}>Перейти к тесту</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default LessonsDivided