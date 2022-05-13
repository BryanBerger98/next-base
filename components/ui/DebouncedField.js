import { Field } from "formik"
import React, { useCallback, useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

export default function DebouncedField(props) {

    const [innerValue, setInnerValue] = useState('');

    useEffect(() => {
        if (props.value) {
          setInnerValue(props.value);
        } else {
          setInnerValue('');
        }
      }, [props.value, setInnerValue]);

    const debouncedHandleOnChange = useDebouncedCallback(
      (event) => {
        if (props.onChange) {
          props.onChange(event);
        }
      },
      250
    );

    const handleOnChange = useCallback((event) => {
        event.persist();
        const newValue = event.currentTarget.value;
        setInnerValue(newValue);
        debouncedHandleOnChange(event);
      }, [debouncedHandleOnChange, setInnerValue]);

  return (
    <Field
      {...props}
      value={innerValue}
      onChange={handleOnChange}
    />
  )
}