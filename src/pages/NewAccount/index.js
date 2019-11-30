import React, { Component } from 'react'
import './styles.css'
import ninjagramLogo from '../../assets/logo.png'
import { Link, withRouter } from 'react-router-dom'
import api from '../../services/api'

class NewAccount extends Component {
  state = {
    username: '',
    email: '',
    passwd: '',
    cPasswd: '',
    error: ''
  }

  handleSingUp = async e => {
    e.preventDefault()
    const { username, email, passwd, cPasswd } = this.state
    if (!username || !email || !passwd || !cPasswd) {
      this.setState({ error: 'Preencha todos os dados para se cadastrar' })
    } else if (passwd !== cPasswd) {
      this.setState({ error: 'As senhas não correspondem' })
    } else {
      try {
        await api.post('/users/create', { username, email, passwd })
        this.props.history.push('/')
      } catch (err) {
        this.setState({ error: 'Ocorreu um erro' })
      }
    }
  }

  render() {
    return (
      <div className="new-account-container">
        <div className="center-content">
          <div className="logo-container">
            <img src={ninjagramLogo} alt="Ninjagram logo" />
          </div>
          <div className="form-content">
            <form className="new-account-form" onSubmit={this.handleSingUp}>
              {this.state.error && <p className="login-warn">{this.state.error}</p>}
              <input
                required
                type="text"
                onChange={e => this.setState({ username: e.target.value })}
                placeholder="Nome de usuário"
              />
              <input
                required
                type="email"
                onChange={e => this.setState({ email: e.target.value })}
                placeholder="Endereço de email"
              />
              <input
                required
                type="password"
                onChange={e => this.setState({ passwd: e.target.value })}
                placeholder="Senha"
              />
              <input
                required
                type="password"
                onChange={e => this.setState({ cPasswd: e.target.value })}
                placeholder="Confirmar Senha"
              />
              <button type="submit">Cadastrar</button>
            </form>
            <div className="navigation-options">
              <p>
                Já possui conta? <Link to="/">Faça login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(NewAccount)
