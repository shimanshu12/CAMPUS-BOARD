import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

export default function Navbar({ theme, onToggleTheme }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        CampusBoard
      </Link>

      {user && (
        <div className="navbar-right">
          <NotificationBell userId={user.id} />
          <Link to="/profile">Profile</Link>
          <button type="button" className="btn btn-secondary" onClick={onToggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button type="button" className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
