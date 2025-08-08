import React from 'react'
import c from './footer.module.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import { Navlist } from '../../utils'

const Footer = () => {
  const path = useLocation().pathname
  const navigate = useNavigate()
  return (
    <footer className={c.nav}>
      {
        Navlist.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={item.path === path ? c.active : ''}
          >
            {item.title}
          </button>
        ))
      }
    </footer>
  )
}

export default Footer