import React, { useState, useEffect } from 'react'
import Card from 'components/Cards/Card'
import Typography from 'components/Typography'
import Alert from 'components/Alerts'
import LoadingPulse from 'components/LoadingPulse'
import ReceiveButton from './components/ReceiveButton'
import SendButton from './components/SendButton'
import MobileView from './MobileView'
import { shortAddress } from 'utils/Helpers'
import { getTokenLogo } from './Helper'

const Index = ({ tokensBalance }) => {
  const [zeroBalanceTokens, setZeroBalanceTokens] = useState(false)
  const [newTokenBalance, setNewTokenBalnace] = useState([])

  var tokens = Array(tokensBalance)

  useEffect(() => {
    if (zeroBalanceTokens === true) {
      setNewTokenBalnace([])
      setNewTokenBalnace(a => [...a, tokensBalance])
      if (Object.keys(tokens[0]).length > 0) {
        if (tokens[0].status === 200) {
          if (tokens[0].data.data.current_coin_balances.length > 0) {
            // eslint-disable-next-line
            tokens = Array([])
            tokensBalance.data.data.current_coin_balances.forEach((x) => {
              if (x.amount > 0) {
                tokens.push(x)
              }
            })
          }
        }
      }
      setNewTokenBalnace({ status: 200, data: { data: { current_coin_balances: tokens.slice(1) } } })
    } else {
      setNewTokenBalnace(tokensBalance)
    }
  }, [zeroBalanceTokens, tokensBalance])

  return (
    <div>
      {Object.keys(newTokenBalance).length > 0 && (
        <div>
          {newTokenBalance.status === 200 && (
            <div className='flex items-center gap-1 mb-2 px-2'>
              <Typography>Hide Zero Balances</Typography>
              <div className='flex items-center'>
                <input
                  checked={zeroBalanceTokens}
                  onChange={() => setZeroBalanceTokens(!zeroBalanceTokens)}
                  type='checkbox'
                  className='w-4 h-4' />
              </div>
            </div>
          )}
        </div>
      )}
      <Card title='Tokens' variant='collapsible'>
        <div className='hidden md:block md:overflow-y-auto'>
          {Object.keys(newTokenBalance).length > 0 ? (
            <div>
              {newTokenBalance.status === 200 ? (
                <div>
                  {newTokenBalance.data.data.current_coin_balances.length > 0 ? (
                    <div>
                      <table className='border-collapse table-auto w-full text-sm text-left bg-darkCard'>
                        <thead className='text-gray-500 text-xs uppercase'>
                          <tr>
                            <th scope='col' className='border-b border-darkBorder px-6 py-3'>
                              #
                            </th>
                            <th scope='col' className='border-b border-darkBorder px-6 py-3'>
                              Name
                            </th>
                            <th scope='col' className='border-b border-darkBorder px-6 py-3'>
                              Balance
                            </th>
                            <th scope='col' className='border-b border-darkBorder px-6 py-3'>
                              Coin Type
                            </th>
                            <th scope='col' className='border-b border-darkBorder px-6 py-3'>

                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {newTokenBalance.data.data.current_coin_balances.map((x, Index) => (
                            <tr key={Index} className='w-full cursor-pointer hover:bg-darkBorder'>
                              <th className='border-b border-darkBorder px-6 py-4'>
                                <Typography className='font-light text-gray-500'>{Index + 1}</Typography>
                              </th>
                              <th className='border-b border-darkBorder px-6 py-4'>
                                <div className='flex items-center gap-2'>
                                  <img
                                    src={getTokenLogo(x.coin_info.coin_type)}
                                    alt='Logo'
                                    className='rounded-full w-[36px] h-[36px] ' />
                                  <div className='flex flex-col'>
                                    <Typography className='font-light whitespace-nowrap'>{x.coin_info !== null ? x.coin_info.name : '-'}</Typography>
                                    <Typography className='font-light whitespace-nowrap text-sm ' color='text-gray-500'>{x.coin_info !== null ? x.coin_info.symbol : '-'}</Typography>
                                  </div>
                                </div>
                              </th>
                              <th className='border-b border-darkBorder px-6 py-4'>
                                {x.coin_info !== null ? (
                                  <Typography className='font-light'>
                                    {Number(Number(x.amount) / 10 ** x.coin_info.decimals).toFixed(8)}
                                  </Typography>
                                ) : (
                                  <Typography className='font-light'>
                                    -
                                  </Typography>
                                )}
                              </th>
                              <th className='border-b border-darkBorder px-6 py-4'>
                                <div className='flex'>
                                  <div className='bg-[#192C32] px-3 py-1 rounded-lg'>
                                    <Typography className='font-light'>{x.coin_info !== null ? shortAddress(x.coin_info.coin_type, 6) : '-'}</Typography>
                                  </div>
                                </div>
                              </th>
                              <th className='border-b border-darkBorder px-6 py-4'>
                                <div className='flex flex-row gap-2'>
                                  <SendButton data={x} disabled={x.amount === 0 ? true : false} />
                                  <ReceiveButton data={x} />
                                </div>
                              </th>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className='p-3'>
                      <Alert variant='warning' text='You have no tokens' />
                    </div>
                  )}
                </div>
              ) : (
                <div className='p-3'>
                  <Alert variant='error' text='API connection failed! try again!' />
                </div>
              )}
            </div>
          ) : (
            <div className='p-3'>
              <LoadingPulse />
            </div>
          )}
        </div>
        <div className='flex md:hidden'>
          <MobileView data={newTokenBalance} />
        </div>
      </Card>
    </div>
  )
}

export default Index