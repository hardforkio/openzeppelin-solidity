pragma solidity ^0.5.0;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping (address => bool) bearer;
        address[] potentialBearers;
    }

    /**
     * @dev give an account access to this role
     */
    function add(Role storage role, address account) internal {
        require(account != address(0));
        require(!has(role, account));

        role.bearer[account] = true;
        role.potentialBearers.push(account);
    }

    /**
     * @dev remove an account's access to this role
     */
    function remove(Role storage role, address account) internal {
        require(account != address(0));
        require(has(role, account));

        role.bearer[account] = false;
    }

    /**
     * @dev remove access to this role for all other accounts
     */
    function removeAll(Role storage role, address account) internal {
        require(account != address(0));
        require(has(role, account));
        for (uint i = 0; i < role.potentialBearers.length; i++) {
            role.bearer[role.potentialBearers[i]] = false;

        }
        role.potentialBearers.length = 0;
        add(role, account);
    }

    /**
     * @dev check if an account has this role
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0));
        return role.bearer[account];
    }
}
