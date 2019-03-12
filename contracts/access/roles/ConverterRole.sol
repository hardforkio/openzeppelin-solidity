pragma solidity ^0.4.24;

import "../Roles.sol";
import "../../ownership/Ownable.sol";
/**
 * @title ConverterRole
 * @dev Converters are responsible for closing and converting a period accounts.
 */
contract ConverterRole is Ownable {
    using Roles for Roles.Role;

    event ConverterAdded(address indexed account);
    event ConverterRemoved(address indexed account);

    Roles.Role private _converters;

    constructor () internal {
        _addConverter(msg.sender);
    }

    modifier onlyConverter() {
        require(isConverter(msg.sender));
        _;
    }

    modifier onlyAdmin() {
        require(isConverter(msg.sender) || isOwner());
        _;
    }

    function isConverter(address account) public view returns (bool) {
        return _converters.has(account);
    }

    function addConverter(address account) public onlyAdmin {
        _addConverter(account);
    }

    function renounceConverter() public {
        _removeConverter(msg.sender);
    }

    function resetConverters() public onlyOwner {
        _converters.removeAll(owner());
    }

    function _addConverter(address account) internal {
        _converters.add(account);
        emit ConverterAdded(account);
    }

    function _removeConverter(address account) internal {
        _converters.remove(account);
        emit ConverterRemoved(account);
    }
}
