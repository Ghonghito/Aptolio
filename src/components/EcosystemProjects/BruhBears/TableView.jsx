import React from 'react'
import Typography from 'components/Typography'
import WithdrawButton from './WithdrawButton'

const TableView = ({ data, isChecking }) => {
  return (
    <div>
      <div className='overflow-y-auto'>
        <table className='border-collapse table-auto w-full text-sm text-left bg-darkCard'>
          <thead className='text-gray-500 text-xs uppercase'>
            <tr>
              <th scope='col' className='border-b border-darkBorder px-6 py-3'>
                NAME
              </th>
              <th scope='col' className='border-b border-darkBorder px-6 py-3'>
                LEVEL
              </th>
              <th scope='col' className='border-b border-darkBorder px-6 py-3'>
                PROGRESS
              </th>
              <th scope='col' className='border-b border-darkBorder px-6 py-3'>
                STAKED
              </th>
              {isChecking === true ? null : <th scope='col' className='border-b border-darkBorder px-6 py-3'></th>}
            </tr>
          </thead>
          <tbody>
            {data.data.map((x, Index) => (
              <tr key={Index} className='w-full cursor-pointer hover:bg-darkBorder'>
                <th className='border-b border-darkBorder px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <img src={`https://bafybeih6hezn7yyabgunclxhi5xa2sbfd6gnnc6un3lilcufq5yyywlpqm.ipfs.nftstorage.link/${String(x.tokens.name).split('#')[1]}.png`} alt={x.tokens.name} className='rounded-full w-[36px] h-[36px] ' />
                    <Typography className='font-light whitespace-nowrap'>{String(x.tokens.name).replace('Bruh Bear', '').replace('#', '')}</Typography>
                  </div>
                </th>
                <th className='border-b border-darkBorder px-6 py-4'>
                  <Typography className='font-light'>{x.level}</Typography>
                </th>
                <th className='border-b border-darkBorder px-6 py-4'>
                  <Typography className='font-light'>{x.progress}%</Typography>
                </th>
                <th className='border-b border-darkBorder px-6 py-4'>
                  <Typography className='font-light whitespace-nowrap'>{x.tokens.stakedAt}</Typography>
                </th>
                {isChecking === true ? null : (
                  <th className='border-b border-darkBorder px-6 py-4'>
                    <WithdrawButton data={x.tokens} />
                  </th>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableView
