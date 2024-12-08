import React from "react";

const CheckboxField = ({ label, name, options, value, handleChange }) => {
  const handleCheckboxChange = (e) => {
    const { checked, value: checkboxValue } = e.target;
    const updatedValues = checked
      ? [...value, checkboxValue]
      : value.filter((val) => val !== checkboxValue);
    handleChange({ target: { name, value: updatedValues } });
  };

  return (
    <div>
      <label>{label}</label>
      {options.map((option) => (
        <div key={option}>
          <input
            type="checkbox"
            name={name}
            value={option}
            checked={value.includes(option)}
            onChange={handleCheckboxChange}
          />
          <label>{option}</label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxField;
