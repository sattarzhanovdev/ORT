import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { PUBLIC_ROUTES } from '../utils'

const MainRoutes = () => {
  return (
    <div>
      <Routes>
        {
          PUBLIC_ROUTES.map(item => (
            <Route
              key={item.id}
              path={item.path}
              element={item.component}
            />
          ))
        }
      </Routes>
    </div>
  )
}

export default MainRoutes