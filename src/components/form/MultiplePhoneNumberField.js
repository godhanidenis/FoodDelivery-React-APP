/** @jsx jsx */
import { Component, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { Field, useField, FieldArray } from 'formik'
import { FormikInputField } from './InputField'
import { get, map, values, size, includes } from 'lodash'
import { Button } from './layout/Button'
import { Col } from './layout/Col'
import { Row } from './layout/Row'
import { Separator } from '../layout/Separator'
import { FormikPhoneNumberInputField } from './PhoneNumberInputField'
import { BlueLinkButton } from '../layout/BlueLinkButton'
import { Trans, Translation } from 'react-i18next'
import { Error } from '../layout/Error'
import OldModal from '../OldModal'
import CustomerPhoneBook from '../CustomerPhoneBook'

export const FormikMultiplePhoneNumberField = ({ formik_props, onChange, placeholder, name, label, field, type, checked, enable_phonebook, errors, ...props }) => {

    if ( size(formik_props.values[name]) === 0 ) {
        formik_props.setFieldValue(name, [ {'number': null}])
    } 
    
    const new_index = size(formik_props.values)
    const [ show_address_book_for_index, setAddressBookIsOpen ] = useState(null)

    const onAddPhoneNumber = (arrayHelpers) => {
        arrayHelpers.insert(size(get(formik_props, ["values", name])), {'number': "0031"})
    }

    const onRemovePhoneNumber = (index, arrayHelpers) => {
        arrayHelpers.remove(index)
        if ( onChange ) {
            onChange()
        }
    }

    const onOpenAddressBook = (index, arrayHelpers) => {
        setAddressBookIsOpen(index)
    }

    const onCloseAddressBook = () => {
        setAddressBookIsOpen(null)
    }

    const onSelectFromAddressBook = (address_book_entry, arrayHelpers) => {
        onCloseAddressBook()
        arrayHelpers.replace(show_address_book_for_index, {'number': address_book_entry.number})
    }

    const renderPhoneBookModal = (arrayHelpers) => {
        return (
            <OldModal
                title="Phone Book"
                modal_size="large"
                onCloseModal={onCloseAddressBook} >
              <div>
                <CustomerPhoneBook onSelected={(address_book_entry) => onSelectFromAddressBook(address_book_entry, arrayHelpers)}/>
              </div>
            </OldModal>
        )
    }

    return (
        <Translation>{ (t) => (
            <FieldArray
              name={name}
              render={arrayHelpers => (
                  <div>
                    { show_address_book_for_index !== null && renderPhoneBookModal(arrayHelpers) }
                    {map(get(formik_props, ["values", name], []), function(phone_number, index) {
                        return ( 
                            <div key={index} css={number_row}>
                              <div>
                                <FormikPhoneNumberInputField formik_props={formik_props}
                                                             name={`${name}.${index}.number`}
                                                             onChange={onChange}
                                                             placeholder={placeholder || t("Phone number")}
                                />
                              </div>
                              <div css={icon_container}>
                                <Separator variant="w10" />
                              </div>
                              { includes(get(errors, "destination_phone_numbers"), get(phone_number, "number")) &&
                                <div>
                                  <Error>
                                    <Trans>Invalid phone number</Trans>
                                  </Error>
                                  
                                </div>
                              }
                            </div>
                        )
                    }
                        )}
                    <BlueLinkButton onClick={() => onAddPhoneNumber(arrayHelpers)}>
                      <Trans>Add a fax number</Trans>
                    </BlueLinkButton>
                  </div>
              )}
            />
        )}</Translation>
    )
}

const button_icon = css`
cursor: pointer;
margin-right: 5px;
`

const number_row = css`
margin-bottom: 10px;
align-items: baseline;
display: flex;
`

const icon_container = css`
display: flex;
height: 100%;
`
