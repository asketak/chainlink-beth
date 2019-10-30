let EventFactory = artifacts.require('EventFactory')
let PredictEvent = artifacts.require('PredictEvent')
let LinkToken = artifacts.require('LinkToken')
let Oracle = artifacts.require('Oracle')

module.exports = (deployer, network) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Oracle contract
  if (!network.startsWith('live')) {
    deployer.deploy(Shared);
    deployer.link(Shared, EventFactory);
    deployer.deploy(PredictEvent);
    deployer.link(PredictEvent, EventFactory);
    deployer.deploy(EventFactory);
    // deployer.deploy(LinkToken).then(() => {
    //   return deployer.deploy(Oracle, LinkToken.address).then(() => {
    //     return deployer.deploy(EventFactory, LinkToken.address)
    //   })
    // })
  } else {
    // For live networks, use the 0 address to allow the ChainlinkRegistry
    // contract automatically retrieve the correct address for you
    deployer.deploy(EventFactory, '0x0000000000000000000000000000000000000000')
  }
}
