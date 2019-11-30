import React, { Component } from 'react'
import './styles.css'
import Header from '../../components/Header'
import Card from '../../components/Card'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'

class Post extends Component {
  state = {
    posts: [],
    error: ''
  }

  componentDidMount() {
    this.loadPost()
  }

  loadPost = async () => {
    try {
      const response = (await api.get('/posts')) || {}
      if (response.data.length === 0) {
        this.setState({ error: 'Não há publicações no momento' })
      } else {
        this.setState({ posts: response.data })
      }
    } catch (error) {
      this.setState({ error: 'Erro ao carregar feed.' })
    }
  }

  render() {
    return (
      <div className="post-container">
        <Header />
        <Card />
      </div>
    )
  }
}

export default withRouter(Post)
