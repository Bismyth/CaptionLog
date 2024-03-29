import React from 'react';
import { ReactComponent as SearchIcon } from '../../icons/search-black-24dp.svg';
import { InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap';
const SearchBar = ({ className, update, value }) => {
    return (
        <InputGroup className={className}>
            <InputGroupAddon addonType="prepend">
                <InputGroupText>
                    <SearchIcon alt="search" />
                </InputGroupText>
            </InputGroupAddon>
            <Input
                placeholder="Search..."
                onChange={(e) => {
                    update(e.target.value);
                }}
                value={value}
                name="search"
            />
        </InputGroup>
    );
};

export default SearchBar;
