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
              {isChecking === true ? null : <th scope='col' className='border-b border-darkBorder px-6 py-3'></th>}
            </tr>
          </thead>
          <tbody>
            {data.data.map((x, Index) => (
              <tr key={Index} className='w-full cursor-pointer hover:bg-darkBorder'>
                <th className='border-b border-darkBorder px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <img src={`https://gateway.pinata.cloud/ipfs/bafybeic4w3xslhgvojvlkllkcurlzrny34xcpixmreqqe355jxfpbwdura/${Number(String(x).split('#')[1]) - 1}.png`} alt={x} className='rounded-full w-[36px] h-[36px] ' />
                    <Typography className='font-light whitespace-nowrap'>{x}</Typography>
                  </div>
                </th>
                {isChecking === true ? null : (
                  <th className='border-b border-darkBorder px-6 py-4'>
                    <WithdrawButton data={data.stakedData[Index]} />
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
