import React, { Component } from 'react'
import './styles.css'
import cameraIcon from '../../assets/new.png'

class FileInput extends Component {
  constructor(props) {
    super(props)
    this.inputFile = React.createRef()

    this.state = {
      imgPreview: ''
    }
  }

  readURL = input => {
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = e => {
        this.setState({ imgPreview: e.target.result })
      }
      reader.readAsDataURL(input.files[0])
    } else {
      let img = input.value
      this.setState({ imgPreview: img })
    }
  }

  onInputChange = event => {
    this.readURL(this.inputFile.current)
    this.props.onChange(event)
  }

  render() {
    const { id, onChange, ...rest } = this.props
    const { ico } = this.props
    return (
      <div className="file-input-container">
        <label className="input-button" htmlFor={id}>
          {this.state.imgPreview ? (
            <img id="loaded-img" src={this.state.imgPreview} alt="File Preview" />
          ) : ico ? (
            <img id="img-button" src={ico} alt="Camera Icon" />
          ) : (
            <img id="img-button" src={cameraIcon} alt="Camera Icon" />
          )}
        </label>
        <input id={id} ref={this.inputFile} onChange={this.onInputChange} {...rest} />
      </div>
    )
  }
}

export default FileInput
