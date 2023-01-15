import Card from 'components/Cards/Card'
import LoadingPulse from 'components/LoadingPulse'
import Typography from 'components/Typography'
import { useEffect, useState } from 'react'
import { BiDollar } from 'react-icons/bi'
import { convertAptToUSD, getTokensPrice } from 'utils/APIs/CoinGeckoAPI'
import { getNFTsUsdValue } from 'utils/APIs/TopazAPI'
import { getUserStakedAptoadsUSD } from 'utils/Ecosystem/Aptoads'
import { getUserStakedMonkeysUSD } from 'utils/Ecosystem/AptosMonkeys'
import { getUserStakedBearsUSD } from 'utils/Ecosystem/BruhTavern'
import { getUserStakedMavrikUSD } from 'utils/Ecosystem/Mavrik'

const Index = ({ walletAddress, aptBalance, nftBalances, tokensBalance }) => {
  const [isLoading, setIsLoading] = useState(Boolean)
  const [totalUsd, setTotalUsd] = useState(0)

  const getPrices = async () => {
    setIsLoading(true)

    const aptUSD = await convertAptToUSD(aptBalance)
    const nftsUSD = await getNFTsUsdValue(nftBalances)
    const tokensUSD = await getTokensPrice(tokensBalance)

    const getStakedToadsUSD = await getUserStakedAptoadsUSD(walletAddress)
    const getStakedMonkeysUSD = await getUserStakedMonkeysUSD(walletAddress)
    const getStakedBearsUSD = await getUserStakedBearsUSD(walletAddress)
    const getStakedMavrikUSD = await getUserStakedMavrikUSD(walletAddress)
    const usdValue = nftsUSD + tokensUSD + aptUSD + getStakedToadsUSD + getStakedMonkeysUSD + getStakedBearsUSD + getStakedMavrikUSD
    setTotalUsd(usdValue)

    setIsLoading(false)
  }

  useEffect(() => {
    getPrices()
    // eslint-disable-next-line
  }, [nftBalances, tokensBalance])

  return (
    <div>
      <Card>
        <div className='p-2'>
          <div className='flex justify-between items-center'>
            <div>
              <Typography color='text-gray-600 text-sm'>Total Balance</Typography>
              {!isLoading ? (
                <div>
                  <Typography className='text-2xl'>${totalUsd.toLocaleString('en-US')}</Typography>
                </div>
              ) : (
                <div>
                  <LoadingPulse />
                </div>
              )}
            </div>
            <div className='w-12 h-12 bg-darkBackground rounded-lg border-[1px] border-primary/20 flex items-center justify-center'>
              <BiDollar className='text-white text-2xl font-bold' />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Index
