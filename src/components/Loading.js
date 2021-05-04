/** @jsx jsx */
import { Component } from 'react';
import { jsx, css } from '@emotion/core'

class Loading extends Component {

    render() {
        const { msg } = this.props
        return (
            <div css={container}>{msg || "Loading"}</div>
        )
    }
}

export default Loading

const container = css`
background-color: #fff;
color: #000;
min-height: 50px;
`

