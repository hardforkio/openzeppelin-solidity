const { shouldBehaveLikePublicRole } = require('../../behaviors/access/roles/PublicRole.behavior');
const WhitelistAdminRoleMock = artifacts.require('WhitelistAdminRoleMock');
const { shouldFail } = require('openzeppelin-test-helpers');

const ADDRESSES = [
  '0x38F0183C02040fF2C76841c0De3eDf02d6fd4124',
  '0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c',
  '0x034082875c5c0f5005271be3fc09b1a8332509Bd',
  '0x962f7A7146CA5527fB9BF92491da675F3d2De0d8',
  '0x4906cb897a7583e4c7571E3925c9460182fdf4c8',
  '0x388B93c535B5C3CCDB14770516d7CAf5590eD009',
  '0x75cBeF7675Ae9CFba5c935f5034E11A8a0863E64',
  '0xf9f1CBa474698d50466115Ccc3a3c027b5CbACC8',
  '0xc664a3AB2089609ff3A00296D747D461A5e239A7',
  '0x1062602168948351eBeFc926e8D5Cd16c49FF895',
  '0x6Df8BcaEFd1458Cf44dadC5272FD7e647bA12b0b',
  '0x20B197f808368b3C5776BaF557bA8902350C68dd',
  '0x9960918D4812bBC6A43fdA064CbE0Aa02b518D8B',
  '0xA614C6905C8D77D322460E9B5Bd61544821BbCFe',
  '0x94268A04181F0Fa4749834AC16532092Ec9c39aB',
  '0x00ea947F671175055d9287ce0d581F67aA0b886f',
  '0x5E4D8c3978ae30B3083bbEc7431Bbd49d5ff0E77',
  '0xa30a26c630293F9dE3f35cDA36B24b5daeB69d01',
  '0x3eA44e564D176c46ae29c549055012159494Ee48',
  '0x9f2eC7D17A344E8326bCfaeA62d8Ac7D500b1348',
  '0x768522fDF347c4aC88D4d78663710e3B98d5973C',
  '0xB93c495880457A70A523cb702e8Eded3d11089ea',
];

contract('WhitelistAdminRole', function ([_, whitelistAdmin, otherWhitelistAdmin, ...otherAccounts]) {
  beforeEach(async function () {
    this.contract = await WhitelistAdminRoleMock.new({ from: whitelistAdmin });
    await this.contract.addWhitelistAdmin(otherWhitelistAdmin, { from: whitelistAdmin });
  });

  shouldBehaveLikePublicRole(whitelistAdmin, otherWhitelistAdmin, otherAccounts, 'whitelistAdmin');
});

contract('WhitelistAdminRole', function ([whitelistAdmin, otherWhitelistAdmin, ...otherAccounts]) {
  it('removes role from all other accounts but the whitelister', async () => {
    const contract = await WhitelistAdminRoleMock.new({ from: whitelistAdmin });
    await contract.addWhitelistAdmin(otherWhitelistAdmin, { from: whitelistAdmin });
    await contract.addWhitelistAdmin(otherAccounts[0], { from: whitelistAdmin });
    await contract.resetWhitelist({ from: whitelistAdmin });
    await shouldFail.reverting(contract.onlyWhitelistAdminMock({ from: otherWhitelistAdmin }));
    await shouldFail.reverting(contract.onlyWhitelistAdminMock({ from: otherAccounts[0] }));
    await contract.onlyWhitelistAdminMock({ from: whitelistAdmin });
  });

  it('Transferring ownership should also add to whitelist', async () => {
    const contract = await WhitelistAdminRoleMock.new({ from: whitelistAdmin });
    await contract.transferOwnership(otherWhitelistAdmin, { from: whitelistAdmin });
    await contract.onlyWhitelistAdminMock({ from: otherWhitelistAdmin });
  });
});

const add19Admins = async contract => {
  const addressesPromise = ADDRESSES.slice(0, 19).map(address => contract.addWhitelistAdmin(address));
  await Promise.all(addressesPromise);
};

contract('WhitlistAdminRole', function ([deployer]) {
  it('should not be possible to add more than 20 admins', async () => {
    const contract = await WhitelistAdminRoleMock.new({ from: deployer });

    add19Admins(contract);

    await shouldFail.reverting(contract.addWhitelistAdmin(ADDRESSES[19], { from: deployer }));
    await shouldFail.reverting(contract.addWhitelistAdmin(ADDRESSES[20], { from: deployer }));
  });
});
