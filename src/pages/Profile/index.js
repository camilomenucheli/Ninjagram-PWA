import React, { Component } from 'react'
import './styles.css'
import { withRouter } from 'react-router-dom'
import Header from '../../components/Header'
import Card from '../../components/Card'
import avatarImg from '../../assets/profile-pic.png'
import Err from '../../components/Error'
import api from '../../services/api'
import { logout } from '../../services/auth'

class Profile extends Component {
  state = {
    user: {},
    posts: [],
    error: '',
    countFollowers: 0,
    countFollowing: 0,
    isOwner: false,
    isFollowing: false
  }

  componentDidMount() {
    const { id } = this.props.match.params
    this.loadUser(id)
  }

  componentWillUpdate(props) {
    if (this.props.match.params.id !== props.match.params.id) {
      this.loadUser(props.match.params.id)
    }
  }

  countFollow = async id => {
    const response = await api.get(`/follow/count/${id}`)
    this.setState({
      countFollowing: response.data.following.length,
      countFollowers: response.data.followers.length
    })
  }

  isFollowing = async () => {
    const { user } = this.state
    const response = await api.post('/follow/isfollowing', { user_id: user._id })

    if (response.data.length) {
      this.setState({ isFollowing: true })
    } else {
      this.setState({ isFollowing: false })
    }
  }

  isOwner = async id => {
    const response = await api.get(`/users/${id}`)
    if (response.data.profileOwner) {
      this.setState({ isOwner: true })
    } else {
      this.setState({ isOwner: false })
    }
  }

  onLogout = history => {
    logout()
    history.push('/')
  }

  loadUser = async id => {
    try {
      const response = await api.get(`/users/${id}`)
      if (response.data.user) {
        this.setState({ user: response.data.user })
        await this.isOwner(id)
        if (!this.state.isOwner) {
          await this.isFollowing()
        }
        await this.countFollow(id)

        this.loadPost()
      } else {
        alert('Seu perfil não foi encontrado')
        this.onLogout(this.props.history)
      }
    } catch (err) {
      this.setState({ error: 'Aconteceu um erro ao carregar seu perfil, tente novamente.' })
    }
  }

  loadPost = async () => {
    try {
      const { id } = this.props.match.params
      const response = await api.get(`/posts/profile/${id}`)
      if (response.data.length) {
        response.data.forEach(item => {
          item.countLikes = item.likes.length
        })
        this.setState({ posts: response.data })
      } else {
        this.setState({ error: 'Não há publicações no momento' })
      }
    } catch (error) {
      this.setState({
        error: 'Erro ao carregar feed.'
      })
    }
  }

  like = async id => {
    try {
      const response = await api.post(`/posts/${id}/like`)

      if (response.data) {
        this.setState(state => {
          const posts = state.posts.map(post => {
            if (post._id === id) {
              return { ...post, isPostLiked: true, countLikes: post.countLikes + 1 }
            }
            return post
          })
          return { posts }
        })
      }
    } catch (error) {
      this.setState({ error: `${error.response.data.error}` })
    }
  }

  deslike = async id => {
    try {
      const response = await api.post(`/posts/${id}/deslike`)

      if (response.data) {
        this.setState(state => {
          const posts = state.posts.map(post => {
            if (post._id === id) {
              return { ...post, isPostLiked: false, countLikes: post.countLikes - 1 }
            }
            return post
          })
          return { posts }
        })
      }
    } catch (error) {
      this.setState({ error: `${error.response.data.error}` })
    }
  }

  deletePost = async id => {
    try {
      await api.delete(`/posts/${id}`)
      window.location.reload()
    } catch (error) {
      this.setState({ error: `${error.response.data.error}` })
    }
  }

  follow = async user_id => {
    try {
      //deve-se passar apenas o user_id de quem será seguido, o id de quem está logado deve ser passado pelo header
      const response = await api.post(`/follow/`, { user_id })
      if (response.data.msg) {
        this.setState({ isFollowing: true })
      }
    } catch {
      this.setState({ msg: 'Aconteceu um erro ao seguir, tente novamente.' })
    }
  }

  unfollow = async user_id => {
    try {
      const response = await api.post(`/follow/delete`, { user_id })
      if (response.data.msg) {
        this.setState({ isFollowing: false })
      }
    } catch {
      this.setState({
        msg: 'Aconteceu um erro ao seguir, tente novamente.'
      })
    }
  }

  render() {
    const { history } = this.props
    const { posts, user, error, isOwner, isFollowing, countFollowers, countFollowing } = this.state
    return (
      <div className="profile-container">
        <Header />
        <div className="content-center">
          <div className="profile-header">
            <div className="profile-owner">
              <strong>{user.username}</strong>
            </div>
            <div className="user-info">
              <div className="avatar-container">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="user-avatar" />
                ) : (
                  <img src={avatarImg} alt="user-avatar" />
                )}
              </div>
              <div className="counter-div">
                <div className="publications-counter">
                  <p className="counter">{posts.length}</p>
                  <p className="description">Posts</p>
                </div>
                <div className="followers-counter">
                  <p className="counter">{countFollowers}</p>
                  <p className="description">Seguidores</p>
                </div>
                <div className="following-counter">
                  <p className="counter">{countFollowing}</p>
                  <p className="description">Seguindo</p>
                </div>
              </div>
            </div>
            {user.bio ? (
              <div className="bio-counter">
                <strong>Bio:</strong>
                <p>{user.bio}</p>
              </div>
            ) : null}
            {isOwner ? (
              <div className="buttons-container">
                <button id="edit-button" onClick={() => history.push(`/edit/${user._id}`)}>
                  Editar Perfil
                </button>
                <button onClick={() => this.onLogout(history)} id="logout-button">
                  Sair
                </button>
              </div>
            ) : (
              <div className="buttons-container">
                {isFollowing ? (
                  <button id="following-button" onClick={() => this.unfollow(user._id)}>
                    Parar de seguir
                  </button>
                ) : (
                  <button id="follow-button" onClick={() => this.follow(user._id)}>
                    Seguir
                  </button>
                )}
              </div>
            )}
          </div>
          {error ? (
            <Err error={error} />
          ) : (
            <>
              <div className="publications-container">
                {posts.map(post => (
                  <Card
                    post={post}
                    deletePost={() => this.deletePost(post._id)}
                    like={() => this.like(post._id)}
                    deslike={() => this.deslike(post._id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Profile)
