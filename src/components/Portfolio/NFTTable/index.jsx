import Alert from 'components/Alerts'
import Card from 'components/Cards/Card'
import LoadingPulse from 'components/LoadingPulse'
import Typography from 'components/Typography'
import { useState } from 'react'
import { BiListUl } from 'react-icons/bi'
import { HiOutlineViewGrid } from 'react-icons/hi'
import NFTCard from './components/NFTCard'
import TableView from './components/NFTTable'

const Index = ({ data, isChecking }) => {
  const [gridView, setGridView] = useState(true)
  return (
    <div>
      <Card title='NFTs' variant='collapsible'>
        <div className={`${gridView ? 'p-3' : ''}`}>
          {Object.keys(data).length > 0 ? (
            <div>
              {!data.hasOwnProperty('status') ? (
                <div className={`${isChecking ? 'max-h-[500px] overflow-y-auto rounded-lg' : ''}`}>
                  <div>
                    <div className={`${gridView ? '' : 'p-3'} flex items-center justify-between`}>
                      <Typography>Total NFTs: {data.length}</Typography>
                      <div className='flex items-center gap-1'>
                        <BiListUl onClick={() => setGridView(false)} className='text-white text-2xl cursor-pointer' />
                        <HiOutlineViewGrid onClick={() => setGridView(true)} className='text-white text-xl cursor-pointer' />
                      </div>
                    </div>
                    <div className='border-[1px] border-darkBorder mt-2 mb-2'></div>
                    {gridView ? (
                      <div>
                        <NFTCard data={data} isChecking={isChecking} />
                      </div>
                    ) : (
                      <div>
                        <TableView data={data} isChecking={isChecking} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <Alert variant={data.statusCode} text={data.errorText} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <LoadingPulse />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Index
