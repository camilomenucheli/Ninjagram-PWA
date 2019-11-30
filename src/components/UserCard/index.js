import React from 'react'
import './style.css'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { getId } from '../../services/auth'
import avatarImg from '../../assets/profile-pic.png'

const UserCard = props => {
  const loggedUser = getId()
  const { user = {}, unfollow, follow, isButtonsDisabled } = props
  return (
    <div className="user-card">
      <article key={user._id}>
        <div className="user-info">
          <Link className="action" to={`/profile/${user._id}`}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="user-avatar" />
            ) : (
              <img src={avatarImg} alt="user-avatar" />
            )}
            <strong>{user.username}</strong>
          </Link>
        </div>
        <div className="search-msg-content">{user.msg}</div>
        {loggedUser === user._id ? null : (
          <>
            {user.isFollowing ? (
              <div>
                <button onClick={unfollow} disabled={isButtonsDisabled}>
                  Parar de seguir
                </button>
              </div>
            ) : (
              <div>
                <button onClick={follow} disabled={isButtonsDisabled}>
                  Seguir
                </button>
              </div>
            )}
          </>
        )}
      </article>
    </div>
  )
}

export default withRouter(UserCard)
