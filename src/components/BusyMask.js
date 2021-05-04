/** @jsx jsx */
import { Component } from 'react';
import { jsx, css, Global } from '@emotion/core'
import { default_theme as theme } from 'emotion/theme'
import loading_icon from '../images/loading.gif'

class BusyMask extends Component {

    
    componentDidMount() {
        const mask = document.getElementById('mask')
        mask.classList.add('disable-app')
        const msg_container = document.getElementById('msg_container')
        msg_container.classList.add('disable-app')
        const msg = document.getElementById('msg')
        msg.classList.add('disable-app')
    }
    
    render() {
        return (
            <div>
              <Global styles={ global } />
              <div css={mask} id="mask" className="mask">
              </div>
              <div css={msg_container} id="msg_container" className="msg_container">
                <div css={msg} id="msg" className="msg">
                  <img alt="loading" src={ loading_icon } css={ icon } />
                </div>
              </div>
            </div>
        )
    }
}
export default BusyMask

const global = css`
.mask.disable-app {
	opacity: 0.9;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: step-end;
	animation-duration: 1s;
}

.msg_container.disable-app {
	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: step-end;
	animation-duration: 0s;
}

.msg.disable-app {
	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: step-end;
	animation-duration: 1s;
}

@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 0.9;
	}
}
`

const mask = css`
width: 100vw;
height: 100vw;
background-color: lightgrey;
opacity: 0;
height: 99%;
position: fixed;
top: 0px;
left: 0px;
z-index: 998;
`

const msg_container = css`
width: 100vw;
height: 100vw;
background-color: transparent;
height: 99%;
position: fixed;
top: 0px;
left: 0px;
z-index: 999;
text-align: center;
display: flex;
justify-content: center;
opacity: 0;
`

const msg = css`
opacity: 1.0;
border-radius: 25px;
position: absolute;
padding: 20px;
margin-top: 40vh;
background-color: ${theme.colors.white};
opacity: 0;
`

const icon = css`
opacity: 1;
`
