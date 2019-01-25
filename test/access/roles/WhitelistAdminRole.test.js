const { shouldBehaveLikePublicRole } = require('../../behaviors/access/roles/PublicRole.behavior');
const WhitelistAdminRoleMock = artifacts.require('WhitelistAdminRoleMock');
const { shouldFail } = require('openzeppelin-test-helpers');

contract('WhitelistAdminRole', function ([_, whitelistAdmin, otherWhitelistAdmin, ...otherAccounts]) {
  beforeEach(async function () {
    this.contract = await WhitelistAdminRoleMock.new({ from: whitelistAdmin });
    await this.contract.addWhitelistAdmin(otherWhitelistAdmin, { from: whitelistAdmin });
  });

  shouldBehaveLikePublicRole(whitelistAdmin, otherWhitelistAdmin, otherAccounts, 'whitelistAdmin');
  it('removes role from all other accounts but the whitelister', async function () {
    await this.contract.resetWhitelist({ from: whitelistAdmin });
    await shouldFail.reverting(this.contract.onlyWhitelistAdminMock({ from: otherWhitelistAdmin }));
    await this.contract.onlyWhitelistAdminMock({ from: whitelistAdmin });
  });
  it('Transferring ownership should also add to whitelist', async function () {
    const contract = await WhitelistAdminRoleMock.new({ from: whitelistAdmin });
    await contract.transferOwnership(otherWhitelistAdmin, { from: whitelistAdmin });
    await contract.onlyWhitelistAdminMock({ from: otherWhitelistAdmin });
  });
});
