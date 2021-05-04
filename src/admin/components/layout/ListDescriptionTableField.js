/** @jsx jsx */
import 'react'
import { jsx, css } from '@emotion/core'
import Popover from '@material-ui/core/Popover'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import Button from '@material-ui/core/Button'

const ListDescriptionTableField = ({value}) => {

    return (
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
              <div>
                <div css={trigger_style} {...bindTrigger(popupState)}>
                  {value}
                </div>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                  }}
                >
                  <div css={popup_style}>
                    <pre>
                      {value}
                    </pre>
                    <Button onClick={popupState.close}>
                      Close
                    </Button>
                  </div>
                </Popover>
              </div>
          )}
        </PopupState>
    )
}

export default ListDescriptionTableField

const trigger_style = css`
cursor: pointer;
max-width: 100px;
max-height: 50px;
overflow: hidden;
`

const popup_style = css`
padding: 5px;
`
