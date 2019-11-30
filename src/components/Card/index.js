import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import likeIcon from '../../assets/like.png'
import likedIcon from '../../assets/liked.png'
import deleteIcon from '../../assets/delete.png'
import avatarImg from '../../assets/profile-pic.png'

const Card = props => {
  const { post = {}, deletePost, like, deslike } = props
  return (
    <>
      <div className="card-container">
        <div className="publication-card" key={post._id}>
          <div className="card-title">
            <Link className="action" to={`/profile/${post.author}`}>
              <div className="card-avatar">
                {post.avatar_url ? (
                  <img src={post.avatar_url} alt="user-avatar" />
                ) : (
                  <img src={avatarImg} alt="user-avatar" />
                )}
              </div>
              <strong>{post.authorName}</strong>
            </Link>
            <br />
          </div>
          <div className="card-img">
            <img src={post.url} alt="post" />
            <br />
          </div>
          <div className="card-subtitle">
            <div>
              {post.description && (
                <div>
                  <p>
                    <strong>{post.authorName}</strong> {post.description}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="card-buttons">
            <div className="left-action">
              {!post.isPostLiked ? (
                <div className="button" onClick={like}>
                  <img src={likeIcon} alt="like" />
                  <p>{post.countLikes}</p>
                </div>
              ) : (
                <div className="button" onClick={deslike}>
                  <img src={likedIcon} alt="liked" />
                  <p>{post.countLikes}</p>
                </div>
              )}
            </div>
            <div className="right-action">
              {post.isOwner ? (
                <div className="delete-button" onClick={deletePost}>
                  <img src={deleteIcon} alt="delete" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(Card)
