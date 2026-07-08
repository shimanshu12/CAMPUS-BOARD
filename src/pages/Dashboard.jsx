import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotices } from '../hooks/useNotices'
import { useRealtimeNotices } from '../hooks/useRealtimeNotices'
import Navbar from '../components/Navbar'
import NoticeForm from '../components/NoticeForm'
import NoticeCard from '../components/NoticeCard'

export default function Dashboard({ theme, onToggleTheme }) {
  const { user } = useAuth()
  const { notices, setNotices, loading, addNotice, deleteNotice } = useNotices()
  const [animatedNoticeCount, setAnimatedNoticeCount] = useState(0)

  useEffect(() => {
    const target = notices.length
    if (target === animatedNoticeCount) return

    const duration = 550
    const stepCount = Math.min(Math.abs(target - animatedNoticeCount), 30)
    const stepTime = Math.max(15, Math.floor(duration / (stepCount || 1)))
    let current = animatedNoticeCount
    const direction = target > current ? 1 : -1

    const timer = setInterval(() => {
      current += direction
      if ((direction > 0 && current >= target) || (direction < 0 && current <= target)) {
        setAnimatedNoticeCount(target)
        clearInterval(timer)
      } else {
        setAnimatedNoticeCount(current)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [notices.length, animatedNoticeCount])

  // keeps `notices` state live-synced with DB changes from any user
  useRealtimeNotices(setNotices)

  const handleDelete = async (id) => {
    await deleteNotice(id)
    // no need to manually update state here - the realtime DELETE
    // subscription in useRealtimeNotices will remove it from state
  }

  return (
    <div>
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <div className="page-container">
        <div className="dashboard-hero">
          <div>
            <p className="hero-eyebrow">Welcome back, {user.email}</p>
            <h2>Keep your campus community connected.</h2>
            <p className="hero-copy">
              Share announcements, stay informed, and manage your profile from one
              streamlined notice board.
            </p>
          </div>

          <div className="hero-summary">
            <span>{animatedNoticeCount} notices</span>
            <span>{user.email}</span>
          </div>
        </div>

        <NoticeForm onAdd={addNotice} userId={user.id} />

        {loading ? (
          <p>Loading notices...</p>
        ) : notices.length === 0 ? (
          <p>No notices yet. Be the first to post!</p>
        ) : (
          <div className="notice-list">
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                currentUserId={user.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
