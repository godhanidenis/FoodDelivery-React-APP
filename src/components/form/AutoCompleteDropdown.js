import React, {useState} from 'react'
import { get, size, head, union } from 'lodash'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Field } from 'formik'
import { useDispatch } from 'react-redux'
import { useField } from 'formik'
const ADD_NEW_VALUE = '__add_new__'

export function FormikAutoCompleteDropdown({label, name, onChange, renderAddNew, formik_props, item_list}) {

    const [adding_new, setAddNew] = useState(false)

    const localOnChange = (value) => {
        if ( value === ADD_NEW_VALUE ) {
            setAddNew(true)
        } else {
            formik_props.setFieldValue(name, value)
            formik_props.setFieldTouched(name)
            if ( onChange ) {
                onChange(value)
            }
        }
    }

    const onAdded = (value) => {
        localOnChange(value)
        setAddNew(false)
    }

    const onAddNewCancelled = () => {
        setAddNew(false)
        formik_props.setFieldValue(name, null)
        formik_props.setFieldTouched(name)
    }

    return (
        <>
          { adding_new && renderAddNew({onAdded, onAddNewCancelled}) }

          <Field name={name}>
            {(formik_props) => (
                <AutoCompleteDropdown name={name}
                                      item_list={item_list}
                                      formik_props={formik_props}
                                      onChange={localOnChange}
                                      canAdd={renderAddNew !== undefined}
                                      label={label}
                />
            )}
          </Field>
        </>
    )
}

export function AutoCompleteDropdown({item_list, name, label, onChange, canAdd, formik_props}) {

    const dispatch = useDispatch()
    const [filterValue, setFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState([])
    const { field, meta } = formik_props
    const touched = get(meta, "touched")
    const errors = get(meta, "error")
    let item_list_options = item_list.getAsOptions()

    if ( canAdd ) {
        item_list_options = union(item_list_options, [{value: ADD_NEW_VALUE, label: '+ New ' + label}])
    }

    React.useEffect(() => {
        setLoading(true)
        dispatch(item_list.updateListFilter({auto_complete: null, any_field: filterValue}))
        dispatch(item_list.fetchListIfNeeded()).then( () => setLoading(false) )
    }, [filterValue])

    React.useEffect(() => {
        const initial_value = field.value
        if ( initial_value ) {
            setLoading(true)
            // This assumes that we can do a unique filter on the initial_value field.
            dispatch(item_list.updateListFilter({auto_complete: initial_value, any_field: null}))
            dispatch(item_list.fetchListIfNeeded()).then( () => {
                const obj = head(item_list.getAsOptions())
                if ( obj ) {
                    setFilterValue(get(obj, "label"))
                } else {
                    console.error("Failed to find object", label, initial_value)
                }
                setLoading(false)
            })
        } else {
            setFilterValue("")
        }
    }, [get(field, "value")])

    return (
        <Autocomplete
          style={{ width: "100%" }}
          open={open}
          onOpen={() => {
              setOpen(true)
          }}
          onClose={() => {
              setOpen(false)
          }}
          clearOnBlur={false}
          getOptionSelected={function(option, value) {
              return option.value === get(field, "value")
          }}
          getOptionLabel={(option) => option.label || ""}
          onInputChange={(event, newFilterValue) => {
              setFilterValue(newFilterValue)
          }}
          value={get(field, "value", null)}
          inputValue={filterValue}
          onChange={(evt, newValue) => onChange(get(newValue, "value"))}
          options={item_list_options}
          loading={loading}
          renderInput={function(params) {
              return (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    margin="normal"
                    error={touched && errors}
                    helperText={touched ? Boolean(errors) : ""}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                  />
              )
          }}
        />
    )
}
