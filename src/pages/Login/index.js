import React, { Component } from 'react'
import './styles.css'
import ninjagramLogo from '../../assets/logo.png'
import { Link, withRouter } from 'react-router-dom'
import api from '../../services/api'
import { login } from '../../services/auth'

class SingIn extends Component {
  state = {
    email: '',
    passwd: '',
    error: ''
  }

  handleSingIn = async e => {
    e.preventDefault()
    const { email, passwd } = this.state
    if (!email || !passwd) {
      this.setState({ error: 'Preencha email e senha para logar' })
    } else {
      try {
        const response = await api.post('/users/auth', { email, passwd })
        login(response.data)
        this.props.history.push('/home')
      } catch (err) {
        this.setState({
          error: 'Houve um problema com o login, verifique o email e senha' + err
        })
      }
    }
  }

  render() {
    return (
      <div className="login-container">
        <div className="center-content">
          <div className="logo-container">
            <img src={ninjagramLogo} alt="Ninjagram logo" />
          </div>
          <div className="form-content">
            <form className="login-form" onSubmit={this.handleSingIn}>
              {this.state.error && <p className="login-warn">{this.state.error}</p>}
              <input
                required
                type="email"
                onChange={e => this.setState({ email: e.target.value })}
                placeholder="Email"
              />
              <input
                required
                type="password"
                onChange={e => this.setState({ passwd: e.target.value })}
                placeholder="Senha"
              />
              <button type="submit">Entrar</button>
            </form>
            <div className="navigation-options">
              <p>
                Novo por aqui? <Link to="/newaccount">Criar conta</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(SingIn)
