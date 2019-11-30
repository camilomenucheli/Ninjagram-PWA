import React, { Component } from 'react'
import './style.css'
import { withRouter } from 'react-router-dom'
import Header from '../../components/Header'
import UserCard from '../../components/UserCard'
import Err from '../../components/Error'
import api from '../../services/api'

class Search extends Component {
  state = {
    username: '',
    users: [],
    error: '',
    msg: '',
    isSearchDisabled: false,
    isButtonsDisabled: false
  }

  search = async () => {
    this.setState({ isSearchDisabled: true })
    const response = await api.get(`/follow/index`)
    const following = response.data
    const { username } = this.state
    if (username) {
      try {
        const response = await api.post(`/users/search`, { username })
        if (response.data.msg) {
          this.setState({ users: [], msg: response.data.msg, isSearchDisabled: false })
        } else {
          this.setState({ error: '' })
          response.data.forEach(indexr => {
            following.forEach(indexf => {
              if (indexr._id === indexf.user_id) {
                indexr.isFollowing = true
              }
            })
          })
          this.setState({ users: response.data, isSearchDisabled: false, msg: response.data.msg })
        }
      } catch (err) {
        this.setState({
          users: [],
          error: 'Aconteceu um erro ao buscar, tente novamente.',
          isSearchDisabled: false
        })
      }
    } else {
      this.setState({ isSearchDisabled: false, error: 'Digite um username' })
    }
  }

  follow = async user_id => {
    try {
      const response = await api.post(`/follow/`, { user_id })
      if (response.data.msg) {
        this.setState(state => {
          const users = state.users.map(item => {
            if (item._id === user_id) {
              return { ...item, isFollowing: true }
            }
            return item
          })

          return { users }
        })
      }
    } catch {
      this.setState({ msg: 'Aconteceu um erro ao seguir, tente novamente.' })
    }
  }

  unfollow = async user_id => {
    try {
      const response = await api.post(`/follow/delete`, { user_id })
      if (response.data.msg) {
        this.setState(state => {
          const users = state.users.map(item => {
            if (item._id === user_id) {
              return { ...item, isFollowing: false }
            }
            return item
          })

          return { users }
        })
      } else {
      }
    } catch {
      this.setState({ msg: 'Aconteceu um erro ao parar de seguir, tente novamente' })
    }
  }

  render() {
    const { users, error, msg } = this.state
    return (
      <div className="search-container">
        <Header />
        <div className="search-content">
          <div className="input-control">
            <input
              type="text"
              onChange={e =>
                this.setState({
                  username: e.target.value
                })
              }
              placeholder="Digite um username"
            />
            <button disabled={this.state.isSearchDisabled} onClick={this.search}>
              Buscar
            </button>
          </div>
          {error ? (
            <Err error={error} />
          ) : (
            <>
              {users.map(user => (
                <UserCard
                  user={user}
                  msg={msg}
                  follow={() => this.follow(user._id)}
                  unfollow={() => this.unfollow(user._id)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Search)
