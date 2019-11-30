import React, { Component } from 'react'
import './styles.css'
import { withRouter } from 'react-router-dom'
import Header from '../../components/Header'
import ProfileIcon from '../../assets/account.png'
import Err from '../../components/Error'
import api from '../../services/api'
import { logout } from '../../services/auth'
import FileInput from '../../components/FileInput'

class EditProfile extends Component {
  state = {
    user: {},
    error: '',
    upFile: null,
    newUsername: '',
    newEmail: '',
    newBio: '',
    msg: '',
    isOwner: false
  }

  componentDidMount() {
    const { id } = this.props.match.params
    this.loadUser(id)
  }

  onLogout = history => {
    logout()
    history.push('/')
  }

  isOwner = async id => {
    const response = await api.get(`/users/${id}`)
    if (response.data.profileOwner) {
      this.setState({ isOwner: true })
    } else {
      this.setState({ isOwner: false })
    }
  }

  loadUser = async id => {
    try {
      const response = await api.get(`/users/${id}`)
      if (response.data.user) {
        this.setState({ user: response.data.user })
        await this.isOwner(id)
      } else {
        alert('Seu perfil não foi encontrado')
        this.onLogout(this.props.history)
      }
    } catch (err) {
      this.setState({ error: 'Aconteceu um erro ao carregar seu perfil, tente novamente.' })
    }
  }

  updateUser = async e => {
    const { user, newEmail, newUsername, newBio, upFile } = this.state
    if (!newEmail || !newUsername) {
      this.setState({ error: 'Os campos Email e Username são obrigatorios' })
    }
    if (user.username === newEmail) {
      this.setState({ error: 'Digite um username diferente do seu atual' })
      alert(this.state.error)
    }
    if (user.email === newEmail) {
      this.setState({ error: 'Digite um email diferente do seu atual' })
      alert(this.state.error)
    }
    if (upFile) {
      const data = new FormData()
      data.append('file', upFile)
      if (newEmail) {
        data.append('email', newEmail)
      }
      if (newUsername) {
        data.append('username', newUsername)
      }
      if (newBio) {
        data.append('bio', newBio)
      }
      e.preventDefault()
      await api.put(`/users/${user._id}`, data)
      this.props.history.push(`/profile/${user._id}`)
    } else {
      await api.put(`/users/${user._id}`, { newEmail, newUsername, newBio })
      this.props.history.push(`/profile/${user._id}`)
    }
  }

  render() {
    const { user, error, isOwner } = this.state
    const { username, email, bio, avatar_url } = user
    return (
      <div className="edit-container">
        <Header />
        <form className="content-center" onSubmit={this.updateUser}>
          {isOwner ? (
            error ? (
              <Err error={error} />
            ) : (
              <>
                <div className="edit-header">
                  <div className="edit-owner">
                    <strong>{username}</strong>
                  </div>
                  <div className="user-info">
                    <div className="edit-img-container">
                      {user.avatar_url ? (
                        <FileInput
                          className="file-input"
                          ico={avatar_url}
                          hidden
                          id="file-input"
                          type="file"
                          onChange={e => this.setState({ upFile: e.target.files[0] })}
                        />
                      ) : (
                        <FileInput
                          className="file-input"
                          ico={ProfileIcon}
                          hidden
                          id="file-input"
                          type="file"
                          onChange={e => this.setState({ upFile: e.target.files[0] })}
                        />
                      )}
                    </div>
                    <div className="counter-div">
                      <div className="username input-control">
                        <p>Username:</p>
                        <input
                          required
                          className="input"
                          id="username-input"
                          type="text"
                          defaultValue={username}
                          onChange={e => this.setState({ newUsername: e.target.value })}
                        />
                        {console.log(username)}
                      </div>
                      <div className="username input-control">
                        <p>Email:</p>
                        <input
                          required
                          className="input"
                          id="email-input"
                          type="text"
                          defaultValue={email}
                          onChange={e => this.setState({ newEmail: e.target.value })}
                        />
                      </div>
                      <div className="username input-control">
                        <p>Biografia:</p>
                        <textarea
                          className="input"
                          id="bio-input"
                          type="text"
                          defaultValue={bio}
                          onChange={e => this.setState({ newBio: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="buttons-container">
                    <button id="edit-button" type="submit">
                      Salvar
                    </button>
                    <button
                      onClick={() => this.props.history.push(`/profile/${user._id}`)}
                      id="logout-button"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </>
            )
          ) : (
            <> </>
          )}
        </form>
      </div>
    )
  }
}

export default withRouter(EditProfile)
