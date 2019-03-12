pragma solidity ^0.4.24;

import "../access/roles/ConverterRole.sol";

contract ConverterRoleMock is ConverterRole {
    function removeConverter(address account) public {
        _removeConverter(account);
    }

    function onlyConverterMock() public view onlyConverter {
    }

    // Causes a compilation error if super._removeConverter is not internal
    function _removeConverter(address account) internal {
        super._removeConverter(account);
    }
}
