import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import PropTypes from 'prop-types';

export const FlatPickr = (props) => {
  const { value, placeholder, options, onChange } = props;
  const [picker, setPicker] = useState(new Date());

  useEffect(() => {
    if (value) {
      setPicker(value);
    }
  }, [value]);

  return (
    <Flatpickr
      value={value === '' ? '' : picker}
      className="form-control"
      placeholder={placeholder}
      onChange={([date]) => {
        setPicker(date);
        onChange(date); // Call the parent's onChange method
      }}
      options={options ? options : { dateFormat: 'Y-m-d' }}
    />
  );
};

// ** PropTypes
FlatPickr.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

// ** Default Props
FlatPickr.defaultProps = {
  placeholder: 'Select Date',
  value: '',
  options: { dateFormat: 'Y-m-d' }
};
