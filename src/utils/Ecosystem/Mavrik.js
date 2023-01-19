import axios from 'axios'
import { getCoinData } from 'utils/APIs/CoinGeckoAPI'
import { getFloorPrice } from 'utils/APIs/TopazAPI'

export const getStakedMavriksData = async (name) => {
  const options = {
    method: 'POST',
    url: 'https://fullnode.mainnet.aptoslabs.com/v1/tables/0x83ba5b0afac5f19391d56da21ef53683a0dd944b1e3f667b3ba80b87f0dc4655/item',
    headers: { 'Content-Type': 'application/json' },
    data: {
      key_type: '0x3::token::TokenDataId',
      value_type: '0x3::token::TokenData',
      key: {
        creator: '0xf3778cf4d8b6d61ab3d79c804797ef7417e258449d2735b0f405e604b81f7916',
        collection: 'MAVRIK',
        name: name,
      },
    },
  }

  const data = await axios
    .request(options)
    .then((response) => response)
    .catch((error) => error.response)

  return data
}

export const getStakedMavriks = async (walletAddress) => {
  let stakedMavriks = []
  let stakedMavriksData = []

  const data = await axios
    .get(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${walletAddress}/resource/0x389dbbc6884a1d5b1ab4e1df2913a8c1b01251e50aed377554372b2842c5e3ef::tokenstaking::StakedTokenInfo`)
    .then((response) => response)
    .catch((error) => error.response)
  if (data.status === 200) {
    if (data.data.data.hasOwnProperty('staked_nfts')) {
      if (Object.keys(data.data.data.staked_nfts).length > 0) {
        await Promise.all(
          data.data.data.staked_nfts.map(async (x) => {
            const mavrikData = await getStakedMavriksData(x)
            if (mavrikData.status === 200) {
              stakedMavriks.push(x)
              stakedMavriksData.push(mavrikData.data)
            }
          })
        )
        return { status: 200, staked: true, data: stakedMavriks, stakedData: stakedMavriksData }
      } else {
        return { status: 404, statusCode: 'info', statusText: 'User has no staked Mavrik 2' }
      }
    } else {
      return { status: 404, statusCode: 'info', statusText: 'User has no staked Mavrik 1' }
    }
  } else {
    if (data.data.error_code === 'resource_not_found') {
      return { status: 404, statusCode: 'info', statusText: 'User has no staked Mavrik' }
    } else {
      return { status: 404, statusCode: 'error', statusText: 'API connection failed! try again!' }
    }
  }
}

export const getUserStakedMavrikUSD = async (data) => {
  const getMavrikFP = await getFloorPrice('0xf3778cf4d8b6d61ab3d79c804797ef7417e258449d2735b0f405e604b81f7916::MAVRIK')
  const aptFloor = Number(getMavrikFP.data.data.floor) / 10 ** 8
  const getAPTPrice = await getCoinData('aptos')
  const aptPrice = getAPTPrice.data.market_data.current_price.usd
  let getStakedMavrik = null

  if (typeof data === 'string') {
    getStakedMavrik = await getStakedMavriks(data)
  } else {
    getStakedMavrik = data
  }

  if (getStakedMavrik.status === 200 && getStakedMavrik.staked === true) {
    const numberOfMavrik = Object.keys(getStakedMavrik.data).length
    const AptValue = aptFloor * numberOfMavrik
    const usdValue = AptValue * aptPrice
    return usdValue
  } else {
    return 0
  }
}
