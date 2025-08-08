import React from 'react'
import c from './testing.module.scss'
import { useParams } from 'react-router-dom'
import { API } from '../../api'

const Testing = () => {
  const { id } = useParams()
  const [test, setTest] = React.useState(null)
  const [currentTab, setCurrentTab] = React.useState(0)
  const [answers, setAnswers] = React.useState({})
  const [isFinished, setIsFinished] = React.useState(false)

  React.useEffect(() => {
    API.getLesson(id).then(res => setTest(res.data))
  }, [id])

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const handleNext = () => {
    if (currentTab < test.questions.length - 1) {
      setCurrentTab(currentTab + 1)
    } else {
      setIsFinished(true)
    }
  }

  if (!test) return <div className={c.loading}>Загрузка...</div>

  if (test.questions.length === 0) {
    return (
      <div className={c.wrapper}>
        <h2 className={c.title}>🧪 Тест: {test.title}</h2>
        <p className={c.noTest}>Тест пока не добавлен.</p>
      </div>
    )
  }

  const correctCount = test.questions.reduce((acc, question) => {
    const selectedId = answers[question.id]
    const correctAnswer = question.answers.find(a => a.is_correct)
    if (selectedId === correctAnswer?.id) acc += 1
    return acc
  }, 0)

  const total = test.questions.length
  const percent = Math.round((correctCount / total) * 100)

  return (
    <div className={c.wrapper}>
      <h2 className={c.title}>🧪 Тест: {test.title}</h2>

      {!isFinished && (
        <>
          <div className={c.tabs}>
            {test.questions.map((q, idx) => (
              <button
                key={q.id}
                className={`${c.tab} ${idx === currentTab ? c.active : ''}`}
                onClick={() => setCurrentTab(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className={c.questionCard}>
            <h3>{test.questions[currentTab].text}</h3>
            <ul className={c.answers}>
              {test.questions[currentTab].answers.map(answer => (
                <li
                  key={answer.id}
                  className={`${c.answer} ${
                    answers[test.questions[currentTab].id] === answer.id
                      ? c.selected
                      : ''
                  }`}
                  onClick={() =>
                    handleAnswerSelect(test.questions[currentTab].id, answer.id)
                  }
                >
                  {answer.text}
                </li>
              ))}
            </ul>

            <button className={c.nextBtn} onClick={handleNext}>
              {currentTab === test.questions.length - 1
                ? 'Завершить тест'
                : 'Следующий'}
            </button>
          </div>
        </>
      )}

      {isFinished && (
        <div className={c.results}>
          <h3>📊 Результаты:</h3>

          <div className={c.summary}>
            <p><strong>Правильных ответов:</strong> {correctCount} / {total}</p>
            <p><strong>Процент знания:</strong> {percent}%</p>
          </div>

          {test.questions.map((question, idx) => {
            const selectedId = answers[question.id]
            const correctAnswer = question.answers.find(a => a.is_correct)
            const selectedAnswer = question.answers.find(a => a.id === selectedId)
            const isCorrect = selectedId === correctAnswer?.id

            return (
              <div key={question.id} className={c.resultItem}>
                <h4>{idx + 1}. {question.text}</h4>
                <p>
                  <strong>Ваш ответ:</strong>{' '}
                  <span className={isCorrect ? c.correctText : c.incorrectText}>
                    {selectedAnswer?.text || 'Не выбран'}
                  </span>
                </p>
                {!isCorrect && (
                  <p>
                    <strong>Правильный ответ:</strong>{' '}
                    <span className={c.correctText}>{correctAnswer?.text}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Testing