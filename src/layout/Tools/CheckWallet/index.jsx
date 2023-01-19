import AddressSearchBar from 'components/AddressSearchBar'
import AptoadsStaking from 'components/EcosystemProjects/Aptoads'
import AptosMonkeysJungle from 'components/EcosystemProjects/AptosMonkeys'
import BruhBearsTaverns from 'components/EcosystemProjects/BruhBears'
import MavrikStaking from 'components/EcosystemProjects/Mavrik'
import TotalBalance from 'components/Portfolio/TotalBalance'
import { checkJungle } from 'utils/Ecosystem/AptosMonkeys'
import { getUserStakedAptoads } from 'utils/Ecosystem/Aptoads'
import { getStakedMavriks } from 'utils/Ecosystem/Mavrik'
import { checkTavern } from 'utils/Ecosystem/BruhTavern'
import { NFTTable, StatisticCard, TokenTable, Transactions } from 'components/Portfolio'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getWalletAPTBalance, getWalletNftBalance, getWalletNFTsCount, getWalletTokensBalance, getWalletTransactionsCount } from 'utils/APIs/AptosAPI'

const Index = () => {
  const location = useLocation()
  const { pathname } = location
  const walletAddress = pathname.split('/').slice(1)[1]
  const [isLoading, setIsLoading] = useState(true)
  const [userAPTBalance, setUserAPTBalance] = useState([])
  const [userTokens, setUserTokens] = useState([])
  const [userNFTs, setUserNFTs] = useState([])
  const [userTXsCount, setUserTXsCount] = useState([])
  const [userNftsCount, setUserNFtsCount] = useState([])
  const [monkeysList, setMonkeyList] = useState([])
  const [toadList, setToadList] = useState([])
  const [mavrikList, setMavrikList] = useState([])
  const [bruhList, setBruhList] = useState([])

  const getWalletData = async () => {
    if (walletAddress !== undefined) {
      setIsLoading(true)
      document.getElementById('aptosAddress').value = walletAddress
      setUserAPTBalance([])
      setUserTXsCount([])
      setUserTokens([])
      setUserNFTs([])
      setMonkeyList([])
      setToadList([])
      setMavrikList([])
      setBruhList([])

      const getNftsCount = await getWalletNFTsCount(walletAddress)
      const getWalletAPT = await getWalletAPTBalance(walletAddress)
      const getTxsCount = await getWalletTransactionsCount(walletAddress)
      const getTokens = await getWalletTokensBalance(walletAddress)
      const getNFTs = await getWalletNftBalance(walletAddress, 100, 0, getNftsCount?.data?.data?.current_token_ownerships_aggregate?.aggregate?.count)

      const getJungleData = await checkJungle(walletAddress)
      const getToadsData = await getUserStakedAptoads(walletAddress)
      const getMavrikData = await getStakedMavriks(walletAddress)
      const getBruhData = await checkTavern(walletAddress)

      setUserAPTBalance(getWalletAPT)
      setUserTokens(getTokens)
      setUserNFTs(getNFTs)
      setUserTXsCount(getTxsCount)
      setUserNFtsCount(getNftsCount)

      setMonkeyList(getJungleData)
      setToadList(getToadsData)
      setMavrikList(getMavrikData)
      setBruhList(getBruhData)

      setIsLoading(false)
    }
  }

  useEffect(() => {
    getWalletData()
    return () => {
      console.log('STOP')
    }
    // eslint-disable-next-line
  }, [walletAddress])

  return (
    <div>
      <div className='flex items-center justify-center mb-3'>
        <AddressSearchBar />
      </div>
      {walletAddress !== undefined && (
        <div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols3 lg:grid-cols-5 gap-2'>
            <TotalBalance walletAddress={walletAddress} aptBalance={userAPTBalance} nftBalances={userNFTs} tokensBalance={userTokens} stakedAptoads={toadList} stakedMonkeys={monkeysList} stakedMavriks={mavrikList} stakedBruhs={bruhList} />
            <StatisticCard title='APT Balance' data={userAPTBalance} isLoading={isLoading} />
            <StatisticCard title='Tokens' data={userTokens} isLoading={isLoading} />
            <StatisticCard title='NFTs' data={userNftsCount} isLoading={isLoading} />
            <StatisticCard title='Transactions' data={userTXsCount} isLoading={isLoading} />
          </div>
          <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
              <div className='flex flex-col gap-2'>
                <TokenTable tokensBalance={userTokens} isChecking={true} />
                <AptosMonkeysJungle stakedList={monkeysList} isChecking={true} />
                <AptoadsStaking stakedList={toadList} isChecking={true} />
              </div>
              <div className='flex flex-col gap-2'>
                <NFTTable data={userNFTs} isChecking={true} />
                <BruhBearsTaverns stakedList={bruhList} isChecking={true} />
                <MavrikStaking stakedList={mavrikList} isChecking={true} />
              </div>
            </div>
            <div className='mt-2'>
              <Transactions walletAddress={walletAddress} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Index
