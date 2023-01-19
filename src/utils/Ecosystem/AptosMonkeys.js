import axios from 'axios'
import { getFloorPrice } from 'utils/APIs/TopazAPI'
import { getCoinData } from 'utils/APIs/CoinGeckoAPI'

export const checkJungle = async (walletAddress) => {
  var monkeysList = []
  var stakedMonkeys = []

  const getData = await axios(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${walletAddress}/resource/0xde220d873e4f5eab5859f368b86fca00fa6fd395279cf54a7d7a5020cb527391::safari::WalletAdventures`)
    .then((response) => response)
    .catch((error) => error.response)
  if (getData.status === 200) {
    if (getData.data.data.hasOwnProperty('adventure_ids')) {
      monkeysList.push(getData.data.data.adventure_ids)
      await Promise.all(
        monkeysList[0].map(async (x) => {
          const options = {
            method: 'POST',
            url: 'https://fullnode.mainnet.aptoslabs.com/v1/tables/0x4e2e038e37fdd1660e1889a6a313bd19b71207a3fce34e810364a238bf672fd2/item',
            headers: { 'Content-Type': 'application/json' },
            data: {
              key_type: '0x1::guid::ID',
              value_type: '0xde220d873e4f5eab5859f368b86fca00fa6fd395279cf54a7d7a5020cb527391::safari::Adventure<0x5d410456c28307fd31439c1658b5e6b41f4ba868d63e03598c1ddb4a7b29449::asset::SeedzCoin>',
              key: { addr: walletAddress, creation_num: x.creation_num },
            },
          }

          const getStakedMonkeys = await axios.request(options).catch((error) => error.response)
          if (Object.keys(getStakedMonkeys).length > 0) {
            if (getStakedMonkeys.status === 200) {
              if (getStakedMonkeys.data.active === true) {
                stakedMonkeys.push(getStakedMonkeys.data)
              }
            } else {
              return { status: 404, statusCode: 'error', statusText: 'API connection failed! try again! 2', data: stakedMonkeys }
            }
          }
        })
      )
      return { status: 200, staked: true, data: stakedMonkeys }
    } else {
      return { status: 200, statusCode: 'warning', statusText: 'User has no staked Aptos Monkeys! 1', data: stakedMonkeys }
    }
  } else {
    return {
      status: getData.data.error_code === 'resource_not_found' ? 200 : 404,
      statusCode: getData.data.error_code === 'resource_not_found' ? 'info' : 'error',
      statusText: getData.data.error_code === 'resource_not_found' ? 'User has no staked Aptos Monkeys' : getData.data.error_code,
      data: stakedMonkeys,
    }
  }
}

export const getUserStakedMonkeysUSD = async (data) => {
  const getMonkeysFP = await getFloorPrice('0xf932dcb9835e681b21d2f411ef99f4f5e577e6ac299eebee2272a39fb348f702::Aptos Monkeys')
  const aptFloor = Number(getMonkeysFP.data.data.floor) / 10 ** 8
  const getAPTPrice = await getCoinData('aptos')
  const aptPrice = getAPTPrice.data.market_data.current_price.usd
  let getStakedMonkeys = null
  if (typeof data === 'string') {
    getStakedMonkeys = await checkJungle(data)
  } else {
    getStakedMonkeys = data
  }

  if (getStakedMonkeys.status === 200 && getStakedMonkeys.staked === true) {
    const numberOfMonkeys = getStakedMonkeys.data.length
    const AptValue = aptFloor * numberOfMonkeys
    const usdValue = AptValue * aptPrice
    return usdValue
  } else {
    return 0
  }
}
