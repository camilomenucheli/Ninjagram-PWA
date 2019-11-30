import React, { Component } from 'react'
import './styles.css'
import Header from '../../components/Header'
import Card from '../../components/Card'
import Err from '../../components/Error'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'
import { getId } from '../../services/auth'

class Home extends Component {
  state = {
    posts: [],
    error: '',
    loggedUser: getId(),
    following: []
  }

  async componentDidMount() {
    await this.loadPost()
  }

  loadPost = async () => {
    try {
      const response = await api.get('/posts/index')
      if (response.data.length) {
        response.data.forEach(item => {
          item.countLikes = item.likes.length
        })
        this.setState({ posts: response.data })
      } else {
        this.setState({ error: 'Não há publicações no momento' })
      }
    } catch (error) {
      this.setState({ error: `Erro ao carregar feed. ${error}` })
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

  render() {
    const { posts, error } = this.state
    return (
      <div className="main-container">
        <Header />
        <div className="home-container">
          <div className="publications-container">
            {error ? (
              <Err error={error} />
            ) : (
              posts.map(post => (
                <>
                  <Card
                    post={post}
                    like={() => this.like(post._id)}
                    deslike={() => this.deslike(post._id)}
                  />
                </>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home)
