import React, { useEffect, useState } from "react";
import c from "./full.module.scss";

const FullTest = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    setSubjects([
      { id: 1, name: "Математика", description: "Подготовка к тесту по математике" },
      { id: 2, name: "Логика", description: "Проверка логического мышления" },
      { id: 3, name: "Кыргыз тили", description: "Тест по кыргызскому языку" },
      { id: 4, name: "Русский язык", description: "Тест по русскому языку" },
      { id: 5, name: "Английский язык", description: "Тест по английскому языку" },
      { id: 6, name: "История Кыргызстана", description: "Исторические вопросы" },
    ]);
  }, []);

  return (
    <div className={c.page}>
      <h1 className={c.heading}>Предметы ОРТ</h1>

      {subjects.map((s) => (
        <div key={s.id} className={c.subjectBlock}>
          <h2 className={c.subjectName}>{s.name}</h2>
          <p className={c.subjectDesc}>{s.description}</p>
          <div className={c.btnRow}>
            <a className={c.btn} href={`/tests/${s.id}`}>Перейти к тесту</a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FullTest;