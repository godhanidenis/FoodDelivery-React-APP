/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Nav } from './Nav'
import CardInfoText from './CardInfoText'

export const CardHeader = ({ title, left_child, right_child, sub_text, ...props }) => {

    return (
        <div>
          <div css={container}>

            <Nav className="mr-auto" css={nav_style}>
              { title &&
                <div css={title_style}>
                  <h1>{title}</h1>
                </div>
              }
              { left_child }
            </Nav>

            <Nav className="ml-auto" css={nav_style}>
              { right_child }
            </Nav>

          </div>

          { sub_text &&
            <CardInfoText>
              {sub_text}
            </CardInfoText>
          }
        </div>
    )
}

const container = css`
display: flex;
`
const title_style = css`
margin-right: 20px;
`

const nav_style = css`
align-items: center;
`
