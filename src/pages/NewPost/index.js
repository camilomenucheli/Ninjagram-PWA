import React, { Component } from 'react'
import './styles.css'
import { withRouter } from 'react-router-dom'
import api from '../../services/api'
import Header from '../../components/Header'
import FileInput from '../../components/FileInput'
import { getId } from '../../services/auth'

class NewPost extends Component {
  state = {
    title: '',
    description: '',
    author: getId(),
    msg: '',
    error: '',
    upFile: null,
    isButtonDisabled: false
  }

  createNewPost = async e => {
    const { description, author, upFile } = this.state
    const data = new FormData()
    data.append('file', upFile)
    data.append('description', description)
    data.append('author', author)
    e.preventDefault()
    if (!author) {
      this.setState({ error: 'Preencha os campos solicitados' })
    } else {
      try {
        this.setState({ msg: 'Enviando...', isButtonDisabled: true })
        await api.post('/posts', data)
        this.props.history.push('/home')
      } catch (err) {
        this.setState({
          error: 'Ocorreu um erro na criação do post',
          msg: '',
          isButtonDisabled: false
        })
      }
    }
  }

  render() {
    return (
      <div className="newpost-container">
        <Header />
        <div className="center-content">
          <form
            className="newpost-form"
            encType="multipart/form-data"
            onSubmit={this.createNewPost}
          >
            {this.state.error && <p className="newpost-warn">{this.state.error}</p>}
            <FileInput
              required
              hidden
              id="file-input"
              type="file"
              onChange={e => this.setState({ upFile: e.target.files[0] })}
            />
            <input
              id="description-input"
              type="text"
              onChange={e => this.setState({ description: e.target.value })}
              placeholder="Descrição"
            />
            {this.state.msg && <p className="newpost-msg">{this.state.msg}</p>}
            <button id="send" type="submit" disabled={this.state.isButtonDisabled}>
              Enviar
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(NewPost)
