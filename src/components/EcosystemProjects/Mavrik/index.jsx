import Alert from 'components/Alerts'
import Card from 'components/Cards/Card'
import LoadingPulse from 'components/LoadingPulse'
import Typography from 'components/Typography'
import { useEffect, useState } from 'react'
import { BiListUl } from 'react-icons/bi'
import { HiOutlineViewGrid } from 'react-icons/hi'
import { getStakedMavriks } from 'utils/Ecosystem/Mavrik'
import TableView from './TableView'
import WithdrawButton from './WithdrawButton'

const Index = ({ walletAddress, isChecking }) => {
  const [data, setData] = useState([])
  const [gridView, setGridView] = useState(true)

  const getStakedData = async () => {
    const getStaked = await getStakedMavriks(walletAddress)
    setData(getStaked)
  }

  useEffect(() => {
    getStakedData()
    // eslint-disable-next-line
  }, [walletAddress])

  return (
    <div>
      <div>
        {
          <Card title='Mavrik - Staking' variant='collapsible'>
            <div className={`${gridView ? 'px-2 mt-2' : ''}`}>
              {Object.keys(data).length > 0 ? (
                <div>
                  {data.status === 200 ? (
                    <div>
                      <div>
                        <div className={`${gridView ? '' : 'px-2 mt-2'} flex items-center justify-between`}>
                          <Typography>Total Staked: {data.data.length}</Typography>
                          <div className='flex items-center gap-1'>
                            <BiListUl onClick={() => setGridView(false)} className='text-white text-2xl cursor-pointer' />
                            <HiOutlineViewGrid onClick={() => setGridView(true)} className='text-white text-xl cursor-pointer' />
                          </div>
                        </div>
                        <div className='border-[1px] border-darkBorder mt-2 '></div>
                        {gridView ? (
                          <div className='max-h-[400px] overflow-y-auto rounded-lg py-2'>
                            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2'>
                              {data.data.map((x, index) => (
                                <Card key={index}>
                                  <div className='p-2'>
                                    <img src={`https://gateway.pinata.cloud/ipfs/bafybeic4w3xslhgvojvlkllkcurlzrny34xcpixmreqqe355jxfpbwdura/${Number(String(x).split('#')[1]) - 1}.png`} alt={x} className='w-full rounded-lg' />
                                    <Typography className='text-sm py-1' color='text-gray-400'>
                                      {x}
                                    </Typography>
                                    {isChecking === true ? null : <WithdrawButton data={data.stakedData[index]} />}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <TableView data={data} isChecking={isChecking} />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='mb-2'>
                      <Alert variant={data.statusCode} text={data.statusText} />
                    </div>
                  )}
                </div>
              ) : (
                <div className='mb-2'>
                  <LoadingPulse />
                </div>
              )}
            </div>
          </Card>
        }
      </div>
    </div>
  )
}

export default Index
