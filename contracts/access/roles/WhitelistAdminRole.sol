pragma solidity ^0.5.0;

import "../Roles.sol";
import "../../ownership/Ownable.sol";

/**
 * @title WhitelistAdminRole
 * @dev WhitelistAdmins are responsible for assigning and removing Whitelisted accounts.
 */
contract WhitelistAdminRole is Ownable {
    using Roles for Roles.Role;

    event WhitelistAdminAdded(address indexed account);
    event WhitelistAdminRemoved(address indexed account);

    Roles.Role private _whitelistAdmins;

    constructor () internal {
        _addWhitelistAdmin(msg.sender);
    }

    modifier onlyAdmin() {
        require(isWhitelistAdmin(msg.sender) || isOwner(), "Only Whitelist Admin or Owner");
        _;
    }

    modifier onlyWhitelistAdmin() {
        require(isWhitelistAdmin(msg.sender), "Only Whitelist Admin");
        _;
    }

    function isWhitelistAdmin(address account) public view returns (bool) {
        return _whitelistAdmins.has(account);
    }

    function addWhitelistAdmin(address account) public onlyAdmin {
        _addWhitelistAdmin(account);
    }

    function renounceWhitelistAdmin() public {
        _removeWhitelistAdmin(msg.sender);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        _addWhitelistAdmin(newOwner);
        Ownable.transferOwnership(newOwner);
    }

    function resetWhitelist() public onlyOwner {
        _whitelistAdmins.removeAll(owner());
    }

    function _addWhitelistAdmin(address account) internal {
        _whitelistAdmins.add(account);
        emit WhitelistAdminAdded(account);
    }

    function _removeWhitelistAdmin(address account) internal {
        _whitelistAdmins.remove(account);
        emit WhitelistAdminRemoved(account);
    }
}
