import { Pages } from "../pages";

export const PUBLIC_ROUTES = [
  {
    id: 1,
    path: '/lessons',
    component: <Pages.Lessons />
  },
  {
    id:2,
    path: '/profile',
    component: <Pages.Profile />
  },
  {
    id:3,
    path: '/',
    component: <Pages.Main />
  },
  {
    id: 4,
    path: '/lesson/:id',
    component: <Pages.LessonMore />
  },
  {
    id: 5, 
    path: '/login',
    component: <Pages.Login />
  },
  {
    id: 6, 
    path: '/test/:id',
    component: <Pages.Testing />
  },
  {
    id: 7,
    path: '/lessons/:subject',
    component: <Pages.LessonsDivided />
  }
]

export const Navlist = [
  {
    id: 1, 
    title: '🏠 Главное',
    path: '/'
  },
  // {
  //   id: 2, 
  //   title: '🧪 Тесты',
  //   path: '/tests/'
  // }, 
  {
    id: 3, 
    title: '📘 Материал', 
    path: '/lessons/'
  },
  {
    id: 4, 
    title: '👤 Профиль',
    path: '/profile/'
  }
]
