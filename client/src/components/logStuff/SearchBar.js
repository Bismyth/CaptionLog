import React from "react";
import searchIcon from "../../icons/search-black-24dp.svg";
import { InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap";
const SearchBar = (props) => {
    return (
        <InputGroup className={props.className}>
            <InputGroupAddon addonType="prepend">
                <InputGroupText>
                    <img src={searchIcon} alt="search" />
                </InputGroupText>
            </InputGroupAddon>
            <Input
                placeholder="Search..."
                onChange={(e) => {
                    props.update(e.target.value);
                }}
                value={props.value}
                name="search"
            />
        </InputGroup>
    );
};

export default SearchBar;
