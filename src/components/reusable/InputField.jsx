import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

const InputField = ({ label, id, type="text", value, onChange, required, ...props }) => {
    return (
        <FormControl mb="4" {...props}>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <Input type={type} if={id} value={value} onChange={onChange} required={required}/>
        </FormControl>
    );
};

export default InputField;