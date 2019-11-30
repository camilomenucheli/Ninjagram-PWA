import React from 'react'
import './style.css'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import PostIcon from '../../assets/new.png'
import ProfileIcon from '../../assets/account.png'
import searchIcon from '../../assets/icone-lupa.png'
import { getId } from '../../services/auth'

const Header = () => {
  const loggedId = getId()
  return (
    <header className="header-content">
      <div className="header-content-center">
        <div className="left-slot header-slots">
          <Link to={'/newpost'}>
            <button className="newpost-button">
              <img id="newpost-icon" src={PostIcon} alt="newpost" />
            </button>
          </Link>
          <Link to={'/search'}>
            <button className="search-button">
              <img id="search-icon" src={searchIcon} alt="search" />
            </button>
          </Link>
        </div>
        <div className="center-slot header-slots">
          <Link to={'/home'}>
            <button className="home-button">
              <img id="header-logo" src={Logo} alt="logo" />
            </button>
          </Link>
        </div>
        <div className="right-slot header-slots">
          <Link to={`/profile/${loggedId}`}>
            <button className="action-right">
              <img id="profile-icon" src={ProfileIcon} alt="Profile" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default withRouter(Header)
