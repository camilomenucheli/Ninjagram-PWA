import React from 'react'
import './styles.css'
import { withRouter } from 'react-router'
import errorImg from '../../assets/error.png'

const Err = props => {
  const { error } = props
  return (
    <div className="error">
      <strong>{error}</strong>
      <img src={errorImg} alt="Imagem erro" />
    </div>
  )
}

export default withRouter(Err)
