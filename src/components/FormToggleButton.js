/** @jsx jsx */
import { Component } from 'react'
import { connect } from 'react-redux'
import { jsx, css } from '@emotion/core'

class FormToggleButton extends Component {

    constructor() {
        super()
        this.onClick = this.onClick.bind(this)
    }

    onClick(event) {
        const {input: { onChange }, input} = this.props
        if(onChange) {
            onChange(!input.value)
        }
    }

    setLabel() {
        const { input, on_label, off_label } = this.props
        
        let label
        if (input.value) {
            label = on_label || "on"
        } else {
            label = off_label || "off"
        }
        
        return label
    }
    
    render() {
        const { input } = this.props

        const label = this.setLabel()
        
        return (
            <div onClick={this.onClick} css={ container }>
              { input.value ?
                <div className="toggle-button__input" css={ enabled }>
                  <div className="toggle-button__label" css={ label_container }>{label}</div>
                </div>
                :
                <div className="toggle-button__input" css={ disabled }>
                  <div className="toggle-button__label" css={ label_container }>{label}</div>
                </div>
              }
            </div>
        )
    }
}

function mapStateToProps(state, props) {
    return {}
}

export default connect(mapStateToProps)(FormToggleButton)

const container = css`
height: 45px;
`

const enabled = css`
position: relative;
display: inline-block;
height: 15px;
width: 33px;
border-radius: 150px;
cursor: pointer;
transition: all 0.3s ease;
vertical-align: middle;
margin: 0 18px;
background: #44a6f4;
&:after {
    position: absolute;
    left: -2px;
    top: -2px;
    display: block;
    width: 19px;
    height: 19px;
    border-radius: 150px;
    background: #CECECF;
    box-shadow: 0 0 1.5px 0 rgba(0, 0, 0, 0.12), 0 1.5px 1.5px 0 rgba(0, 0, 0, 0.24);
    content: '';
    transition: all 0.3s ease;
    left: 15px;
    background: #1d84d5;
}
`

const disabled = css`
position: relative;
display: inline-block;
height: 15px;
width: 33px;
background: #b0bec5;
border-radius: 150px;
cursor: pointer;
transition: all 0.3s ease;
vertical-align: middle;
margin: 0 18px;
&:after {
    position: absolute;
    left: -2px;
    top: -2px;
    display: block;
    width: 19px;
    height: 19px;
    border-radius: 100px;
    background: #CECECF;
    box-shadow: 0 0 1.5px 0 rgba(0, 0, 0, 0.12), 0 1.5px 1.5px 0 rgba(0, 0, 0, 0.24);
    content: '';
    transition: all 0.3s ease;

}
`

const label_container = css`
display: inline-block;
margin: 18px 0;
`
