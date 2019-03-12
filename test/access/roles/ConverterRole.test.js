const { shouldBehaveLikePublicRole } = require('../../access/roles/PublicRole.behavior');
const shouldFail = require('../../helpers/shouldFail');
const ConverterRoleMock = artifacts.require('ConverterRoleMock');

contract('ConverterRole', function ([_, converterAdmin, converter, ...otherAccounts]) {
  beforeEach(async function () {
    this.contract = await ConverterRoleMock.new({ from: converterAdmin });
    await this.contract.addConverter(converter, { from: converterAdmin });
  });

  shouldBehaveLikePublicRole(converterAdmin, converter, otherAccounts, 'converter');

  it('removes role from all other accounts but the converterAdmin', async function () {
    await this.contract.resetConverters({ from: converterAdmin });
    await shouldFail.reverting(this.contract.onlyConverterMock({ from: converter }));
    await this.contract.onlyConverterMock({ from: converterAdmin });
  });
  it('adds a second converter role by the converterAdmin', async function () {
    await this.contract.resetConverters({ from: converterAdmin });
    await this.contract.addConverter(converter, { from: converterAdmin });
    await shouldFail.reverting(this.contract.onlyConverterMock({ from: otherAccounts[0] }));
    await this.contract.onlyConverterMock({ from: converter });
    await this.contract.onlyConverterMock({ from: converterAdmin });
  });
});
