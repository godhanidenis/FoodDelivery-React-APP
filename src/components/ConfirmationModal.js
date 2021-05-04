/** @jsx jsx */
import { Component } from 'react'
import { jsx, css } from '@emotion/core'
import { connect } from 'react-redux'
import { CONFIRMATION_MODAL_KEY } from 'actions/ui'
import { Modal } from './layout/Modal'
import { Button } from './layout/Button'
import { clearActiveModal, getActiveModal, getModalParams } from 'actions/ui'
import { ButtonBar } from './layout/ButtonBar'
import { Separator } from './layout/Separator'

class ConfirmationModal extends Component {
    onClose = () => {
        const { dispatch, is_active } = this.props
        if ( is_active ) {
            dispatch(dispatch(clearActiveModal()))
        }
    }

    onConfirm = () => {
        const { onConfirmed } = this.props
        this.onClose()
        if ( onConfirmed ) {
            onConfirmed()
        }
    }
    
    render() {
        const { is_active, text, heading, can_cancel } = this.props
        if ( ! is_active ) {
            return null
        }

        return (
            <Modal title={heading}
                   onCloseModal={this.onClose}
            >
              <div css={confirm_text}>
                {text}
                <Separator variant="h20" />
                <ButtonBar>
                  { can_cancel && 
                    <Button variant="danger" onClick={this.onClose}>
                      Cancel
                    </Button>
                  }
                  <Button variant="success" onClick={this.onConfirm}>
                    Confirm
                  </Button>
                </ButtonBar>
              </div>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    const { text, onConfirmed, heading, can_cancel } = getModalParams(state)
    const is_active = getActiveModal(state) === CONFIRMATION_MODAL_KEY
    return {
        text,
        onConfirmed,
        is_active,
        can_cancel: can_cancel !== false,
        heading: heading || "Confirm"
    }
}

export default connect(mapStateToProps)(ConfirmationModal)

const confirm_text = css`

padding: 10px;

`
