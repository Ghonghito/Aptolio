import { AptosClient } from 'aptos'
import axios from 'axios'
import { MAINNET_NODE_URL } from 'config'
import moment from 'moment'
import { getCoinData } from 'utils/APIs/CoinGeckoAPI'
import { getFloorPrice } from 'utils/APIs/TopazAPI'

const aptosClient = new AptosClient(MAINNET_NODE_URL, { WITH_CREDENTIALS: false })

const TAVERN_CONTRACT_ADDRESS = '0xcfe80c7cfae84f1b66cd2dc65db923360acaaaa6042d9ac7c389c09e033be60e'
const TOKENS_HANDLE = '0xbb2d726882ca4baddf55a5c90f3c4d6a7cd2b6ba48366f2a8d5855c1ba03211'
const START_TS_HANDLE = '0x1683c737da487d28dbfb18f192eb330e2ee8c8a7bd150270f7cfa70b31d5ba18'

export const checkTavern = async (address) => {
  const { data } = await aptosClient.getAccountResource(TAVERN_CONTRACT_ADDRESS, `${TAVERN_CONTRACT_ADDRESS}::levels::TavernAdmin`)
  const secondsToLevel = data.seconds_to_level

  const options = {
    method: 'POST',
    url: `https://fullnode.mainnet.aptoslabs.com/v1/tables/${TOKENS_HANDLE}/item`,
    headers: { 'Content-Type': 'application/json' },
    data: {
      key_type: 'address',
      value_type: 'vector<0x3::token::TokenId>',
      key: address,
    },
  }

  const stakedBruhs = await axios.request(options).catch((error) => error.response)
  if (Object.keys(stakedBruhs).length > 0) {
    if (stakedBruhs.status === 200) {
      if (!stakedBruhs.data.hasOwnProperty('error_code')) {
        const getTimestamps = await Promise.all(
          stakedBruhs.data?.map(async (x) => [
            x.token_data_id.name,
            await aptosClient.getTableItem(START_TS_HANDLE, {
              key: x,
              key_type: '0x3::token::TokenId',
              value_type: 'u64',
            }),
          ])
        )

        const startTimesMap = getTimestamps.reduce((prev, curr) => {
          try {
            prev[curr[0]] = new Date(parseInt(curr[1]) * 1000)
          } catch {
            prev[curr[0]] = null
          }
          return prev
        }, {})

        var stakedData = []

        stakedBruhs.data.forEach((token) => {
          const secondsPassed = (new Date() - new Date(startTimesMap[token.token_data_id.name])) / 1000
          const numLevels = (secondsPassed / secondsToLevel).toFixed(0)
          const progress = (((secondsPassed % secondsToLevel) / secondsToLevel) * 100).toFixed(3)
          stakedData.push({ progress: progress, level: numLevels, tokens: { name: token.token_data_id.name, property: token.property_version, stakedAt: moment(startTimesMap[token.token_data_id.name]).format('DD/MM/YYYY HH:mm') } })
        })
        return { status: 200, staked: true, statusText: '', data: stakedData }
      } else {
        return { status: stakedBruhs.status, statusCode: 'info', staked: false, statusText: stakedBruhs.data.error_code === 'table_item_not_found' ? 'User has no staked Bruh Bears' : stakedBruhs.data.error_code }
      }
    } else {
      return { status: stakedBruhs.status, statusCode: 'info', staked: false, statusText: stakedBruhs.data.error_code === 'table_item_not_found' ? 'User has no staked Bruh Bears' : stakedBruhs.data.error_code }
    }
  }
}

export const getUserStakedBearsUSD = async (data) => {
  const getBearsFP = await getFloorPrice('0x43ec2cb158e3569842d537740fd53403e992b9e7349cc5d3dfaa5aff8faaef2::Bruh Bears')
  const aptFloor = Number(getBearsFP.data.data.floor) / 10 ** 8
  const getAPTPrice = await getCoinData('aptos')
  const aptPrice = getAPTPrice.data.market_data.current_price.usd

  let getStakedBears = null
  if (typeof data === 'string') {
    getStakedBears = await checkTavern(data)
  } else {
    getStakedBears = data
  }

  if (getStakedBears.status === 200 && getStakedBears.staked === true) {
    const numberOfBears = getStakedBears.data.length
    const AptValue = aptFloor * numberOfBears
    const usdValue = AptValue * aptPrice
    return usdValue
  } else {
    return 0
  }
}
