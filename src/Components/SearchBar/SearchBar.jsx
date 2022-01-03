import React from 'react';
import Input from '@material-ui/core/Input';

const SearchBar = ({ keyword, onChange, placeholder, className }) => {
    return (
        <Input
            value={keyword}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={className}
        />
    );
}

export default SearchBar