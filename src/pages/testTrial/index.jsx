import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import c from "./trial.module.scss";

// Если baseURL не задан глобально:
// axios.defaults.baseURL = "http://127.0.0.1:8000/api";

const LETTERS = ["A", "B", "C", "D"];
const KG = { A: "А", B: "Б", C: "В", D: "Г" };
const TEST_DURATION_MS = 30 * 60 * 1000; // 30 минут

export default function TestTrial() {
  const { id } = useParams();                         // /tests/:id
  const keyAns = `testAnswers:${id}`;
  const keyDeadline = `testDeadline:${id}`;

  // ====== данные теста ======
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // ====== ответы пользователя ======
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(keyAns) || "{}"); }
    catch { return {}; }
  });

  // ====== таймер ======
  const [now, setNow] = useState(Date.now());
  const deadlineRef = useRef(null);

  // ====== попап результата ======
  // Показываем ТОЛЬКО после завершения/истечения времени
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState(null); // {correct, wrong, empty, spentMs, mistakes[], error?}

  // ---------- загрузка теста ----------
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true); setErr(null);
        // Если на бэке защищённые ответы — добавь ?with_answers=true и авторизацию
        const { data } = await axios.get(`/tests/${id}/`, { signal: controller.signal });
        setTest(data);
      } catch (e) {
        if (!axios.isCancel(e)) {
          setErr(e?.response?.data?.detail || e.message || "Ошибка загрузки");
        }
      } finally { setLoading(false); }
    })();
    return () => controller.abort();
  }, [id]);

  // ---------- инициализация/восстановление дедлайна ----------
  useEffect(() => {
    const saved = localStorage.getItem(keyDeadline);
    const savedNum = saved ? Number(saved) : NaN;

    // валидация сохранённого дедлайна (защита от мусора)
    const validSaved =
      Number.isFinite(savedNum) &&
      savedNum > Date.now() - TEST_DURATION_MS &&
      savedNum < Date.now() + TEST_DURATION_MS * 100;

    const deadline = validSaved ? savedNum : Date.now() + TEST_DURATION_MS;
    deadlineRef.current = deadline;
    localStorage.setItem(keyDeadline, String(deadline));
  }, [keyDeadline]);

  // ---------- тиканье таймера + автосохранение ----------
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);

    const persist = () => {
      try { localStorage.setItem(keyAns, JSON.stringify(answers)); } catch {}
      if (deadlineRef.current) {
        localStorage.setItem(keyDeadline, String(deadlineRef.current));
      }
    };

    window.addEventListener("beforeunload", persist);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) persist();
    });

    return () => {
      clearInterval(tick);
      window.removeEventListener("beforeunload", persist);
    };
  }, [answers, keyAns, keyDeadline]);

  // дополнительное сохранение на каждое изменение
  useEffect(() => {
    try { localStorage.setItem(keyAns, JSON.stringify(answers)); } catch {}
  }, [answers, keyAns]);

  const msLeft = Math.max(0, (deadlineRef.current || 0) - now);
  const isOver = msLeft <= 0;

  // карта правильных ответов: { [qNumber]: 'A'|'B'|'C'|'D' }
  const correctMap = useMemo(() => {
    const map = {};
    (test?.pages || []).forEach((p) => {
      (p.answers || []).forEach((a) => {
        if (a?.question_number && a?.correct_option) {
          map[a.question_number] = a.correct_option;
        }
      });
    });
    return map;
  }, [test]);

  const totalQuestions = useMemo(() => {
    const k = Object.keys(correctMap).length;
    if (k) return k;
    if (!test?.pages) return 0;
    // запасной случай без correct_option
    let n = 0;
    for (const p of test.pages) {
      if (Array.isArray(p.question_numbers)) n += p.question_numbers.length;
      else if (Array.isArray(p.answers)) n += p.answers.length;
    }
    return n;
  }, [test, correctMap]);

  const filled = Object.values(answers).filter(Boolean).length;

  const select = (qNumber, letter) => {
    if (isOver) return; // блокируем после истечения времени
    setAnswers((s) => ({ ...s, [qNumber]: s[qNumber] === letter ? undefined : letter }));
  };

  const fmtTime = (ms) => {
    const total = Math.ceil(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ---------- подсчёт результата + показ попапа ----------
  const openResultPopup = () => {
    if (!Object.keys(correctMap).length) {
      setResult({
        correct: 0,
        wrong: 0,
        empty: Math.max(0, totalQuestions - filled),
        mistakes: [],
        spentMs: TEST_DURATION_MS - msLeft,
        error: "Бэкенд не передал правильные ответы (answers.correct_option).",
      });
      setShowModal(true);
      return;
    }

    let correct = 0, wrong = 0, empty = 0;
    const mistakes = [];
    for (const q of Object.keys(correctMap).map(Number).sort((a,b)=>a-b)) {
      const u = answers[q];
      if (!u) { empty++; continue; }
      if (u === correctMap[q]) correct++;
      else { wrong++; mistakes.push({ q, chosen: u, correct: correctMap[q] }); }
    }

    setResult({ correct, wrong, empty, mistakes, spentMs: TEST_DURATION_MS - msLeft });
    setShowModal(true);
  };

  // автооткрытие попапа когда время вышло
  useEffect(() => { if (isOver) openResultPopup(); /* eslint-disable-next-line */ }, [isOver]);

  // Полная очистка и рестарт (новые 30 минут)
  const restart = () => {
    try { localStorage.removeItem(keyAns); } catch {}
    try { localStorage.removeItem(keyDeadline); } catch {}
    setAnswers({});
    const newDeadline = Date.now() + TEST_DURATION_MS;
    deadlineRef.current = newDeadline;
    localStorage.setItem(keyDeadline, String(newDeadline));
    setShowModal(false);
    setResult(null);
  };

  if (loading) return <div className={c.state}>Загрузка…</div>;
  if (err) return <div className={c.stateErr}>Ошибка: {err}</div>;
  if (!test) return null;

  return (
    <div className={c.wrap}>
      {/* верхняя панель */}
      <header className={c.header}>
        <h2>{test.title || `Тест #${id}`}</h2>
        <div className={c.stats}>Отмечено: {filled}/{totalQuestions}</div>
        <div className={`${c.timer} ${msLeft < 5 * 60 * 1000 ? c.timerWarn : ""} ${isOver ? c.timerOver : ""}`}>
          {isOver ? "Время вышло" : fmtTime(msLeft)}
        </div>
        <button className={c.secondary} onClick={openResultPopup}>Завершить и проверить</button>
      </header>

      {/* страницы с фото + кружочки */}
      <div className={c.pages}>
        {(test.pages || [])
          .sort((a,b)=>a.page_number-b.page_number)
          .map((p) => {
            // откуда брать номера вопросов
            const qNums =
              Array.isArray(p.question_numbers) && p.question_numbers.length
                ? p.question_numbers
                : Array.isArray(p.answers)
                  ? p.answers.map(a => a.question_number)
                  : [];

            return (
              <section key={p.id} className={c.card}>
                <div className={c.imgBox}>
                  <img src={p.image} alt={`Стр. ${p.page_number}`} loading="lazy" />
                </div>

                <div className={c.grid}>
                  {qNums.map((q) => (
                    <div key={q} className={c.row}>
                      <div className={c.qnum}>{q}</div>
                      <div className={c.opts}>
                        {LETTERS.map((L) => {
                          const active = answers[q] === L;
                          return (
                            <button
                              key={L}
                              className={`${c.opt} ${active ? c.active : ""} ${isOver ? c.disabled : ""}`}
                              onClick={() => select(q, L)}
                              disabled={isOver}
                              aria-pressed={active}
                              title={`Вопрос ${q}: ${KG[L]}`}
                            >
                              <span className={c.circle} />
                              <span className={c.letter}>{KG[L]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
      </div>

      {/* POPUP результата — ТОЛЬКО после завершения/таймера */}
      {showModal && (
        <div className={c.modalBackdrop} role="dialog" aria-modal="true">
          <div className={c.modal}>
            <h3 className={c.modalTitle}>Результат</h3>

            {result?.error && <div className={c.alert}>{result.error}</div>}

            <div className={c.kpis}>
              <div className={c.kpi}>
                <span className={c.kpiLabel}>Правильных</span>
                <span className={c.kpiValueOk}>{result?.correct ?? 0}</span>
              </div>
              <div className={c.kpi}>
                <span className={c.kpiLabel}>Неправильных</span>
                <span className={c.kpiValueBad}>{result?.wrong ?? 0}</span>
              </div>
              <div className={c.kpi}>
                <span className={c.kpiLabel}>Без ответа</span>
                <span className={c.kpiValue}>{result?.empty ?? 0}</span>
              </div>
              <div className={c.kpi}>
                <span className={c.kpiLabel}>Время</span>
                <span className={c.kpiValue}>{fmtTime(result?.spentMs ?? 0)}</span>
              </div>
            </div>

            {result?.mistakes?.length > 0 && (
              <div className={c.mistakes}>
                <div className={c.mistakesTitle}>Ошибки</div>
                <ul>
                  {result.mistakes.map(({ q, chosen, correct }) => (
                    <li key={q}>
                      <b>#{q}</b>: ваш ответ{" "}
                      <span className={c.bad}>{KG[chosen] || chosen}</span>,
                      правильно{" "}
                      <span className={c.ok}>{KG[correct] || correct}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={c.modalActions}>
              <button className={c.secondary} onClick={() => setShowModal(false)}>Закрыть</button>
              <button className={c.primary} onClick={restart}>Начать заново</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}