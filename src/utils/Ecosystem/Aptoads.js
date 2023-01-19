import axios from 'axios'
import { getCoinData } from 'utils/APIs/CoinGeckoAPI'
import { getFloorPrice } from 'utils/APIs/TopazAPI'
import { INDEXER } from 'config'

export const getUserToads = async (address) => {
  const data = JSON.stringify({
    query: `query GetUserTokens($owner_address: String) {
      current_token_ownerships_aggregate(
        where: {collection_name: {_eq: "Aptos Toad Overload"}, owner_address: {_eq: $owner_address}, creator_address: {_eq: "0x74b6b765f6710a0c24888643babfe337241ad1888a55e33ed86f389fe3f13f52"}, amount: {_eq: "0"}}
        order_by: {name: asc, last_transaction_version: desc}
        distinct_on: name
        offset: 0
        limit: 100
      ) {
        nodes {
          name
          last_transaction_version
        }
      }
    } `,
    variables: { owner_address: address },
  })

  const json = await axios.post(INDEXER, data).catch((error) => error.response)
  return json
}

export const getUserStakedHandle = async (address) => {
  const json = await axios(`https://fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/resource/0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::TokensStaked`)
    .then((response) => response)
    .catch((error) => error)
  return json
}

export const getUserStakedAptoads = async (address) => {
  const getToads = await getUserToads(address)
  const getHandle = await getUserStakedHandle(address)
  var stakedToads = []

  if (Object.keys(getToads).length > 0) {
    if (getToads.status === 200) {
      if (Object.keys(getToads.data.data.current_token_ownerships_aggregate.nodes).length > 0) {
        if (Object.keys(getHandle).length > 0) {
          if (getHandle.status === 200) {
            if (Object.keys(getHandle.data.data.tokens_staked).length > 0) {
              await Promise.all(
                getToads.data.data.current_token_ownerships_aggregate.nodes.map(async (x) => {
                  const options = {
                    method: 'POST',
                    url: `https://fullnode.mainnet.aptoslabs.com/v1/tables/${getHandle.data.data.tokens_staked.handle}/item`,
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                      key_type: '0x3::token::TokenId',
                      value_type: '0x1f03a48de7dc0a076d275ebdeb0d80289b5a84a076dbf44fab69f38946de4115::steak::TokenStake',
                      key: {
                        token_data_id: {
                          collection: 'Aptos Toad Overload',
                          creator: '0x74b6b765f6710a0c24888643babfe337241ad1888a55e33ed86f389fe3f13f52',
                          name: x.name,
                        },
                        property_version: '0',
                      },
                    },
                  }
                  const data = await axios
                    .request(options)
                    .then((response) => response)
                    .catch((error) => error.response)

                  if (data.status !== 404) {
                    stakedToads.push(data.data)
                  }
                })
              )
              return stakedToads
            } else {
              return { status: 200, statusId: 'info', statusText: 'User has no staked Toads. 1' }
            }
          } else {
            return { status: 404, statusId: 'error', statusText: 'API connectionFailed! try again!' }
          }
        }
      } else {
        return { status: 200, statusId: 'info', statusText: 'User has no staked Toads.' }
      }
    } else {
      return { status: 404, statusId: 'error', statusText: 'API connectionFailed! try again!' }
    }
  }
}

export const getUserStakedAptoadsUSD = async (data) => {
  const getToadsFP = await getFloorPrice('0x74b6b765f6710a0c24888643babfe337241ad1888a55e33ed86f389fe3f13f52::Aptos Toad Overload')
  const aptFloor = Number(getToadsFP.data.data.floor) / 10 ** 8
  const getAPTPrice = await getCoinData('aptos')
  const aptPrice = getAPTPrice.data.market_data.current_price.usd
  let getStakedToads = null
  if (typeof data === 'string') {
    getStakedToads = await getUserStakedAptoads(data)
  } else {
    getStakedToads = data
  }
  if (!getStakedToads.hasOwnProperty('status')) {
    const numberOfToads = getStakedToads.length
    const AptValue = aptFloor * numberOfToads
    const usdValue = AptValue * aptPrice
    return usdValue
  } else {
    return 0
  }
}
