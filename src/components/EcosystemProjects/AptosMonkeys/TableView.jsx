import React from 'react'
import Typography from 'components/Typography'
import moment from 'moment'
import WithdrawButton from './WithdrawButton'

const TableView = ({ data, isChecking }) => {
  const calculateStakedTime = (timestamp) => {
    const currentDate = moment()
    const stakedTime = moment(timestamp / 1000)
    var a = moment(String(currentDate.toString()))
    var b = moment(String(stakedTime.toString()))
    return a.diff(b, 'hours')
  }

  return (
    <div>
      <div className='overflow-y-auto'>
        <table className='border-collapse table-auto w-full text-sm text-left bg-darkCard'>
          <thead className='text-gray-500 text-xs uppercase'>
            <tr>
              <th scope='col' className='border-b border-darkBorder px-6 py-3 whitespace-nowrap'>
                NAME
              </th>
              <th scope='col' className='border-b border-darkBorder px-6 py-3 whitespace-nowrap'>
                EARNED
              </th>
              <th scope='col' className='border-b border-darkBorder px-6 py-3 whitespace-nowrap'>
                TIME STAKED
              </th>
              <th scope='col' className='border-b border-darkBorder px-6 py-3 whitespace-nowrap'>
                STAKED
              </th>
              {isChecking === true ? null : <th scope='col' className='border-b border-darkBorder px-6 py-3 whitespace-nowrap'></th>}
            </tr>
          </thead>
          <tbody>
            {data.data.map((x, Index) => (
              <tr key={Index} className='w-full cursor-pointer hover:bg-darkBorder'>
                <th className='border-b border-darkBorder px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <img
                      src={`https://ipfs.io/ipfs/bafybeig6bepf5ci5fyysxlfefpjzwkfp7sarj6ed2f5a34kowgc6qenjfa/${String(x.token_id.token_data_id.name).split('#')[1]}.png`}
                      alt={x.token_id.token_data_id.name}
                      className='rounded-full w-[36px] h-[36px] '
                    />
                    <Typography className='font-light whitespace-nowrap'>{String(x.token_id.token_data_id.name).replace('AptosMonkeys', '').replace('#', '')}</Typography>
                  </div>
                </th>
                <th className='border-b border-darkBorder px-6 py-4'>
                  <Typography className='font-light whitespace-nowrap'>{Number(calculateStakedTime(x.start_time) * 0.04).toFixed(2)} SEEDZ</Typography>
                </th>
                <th className='border-b border-darkBorder px-6 py-4'>
                  <Typography className='font-light whitespace-nowrap'>{calculateStakedTime(x.start_time)}h</Typography>
                </th>
                <th className='border-b border-darkBorder px-6 py-4'>
                  <Typography className='font-light whitespace-nowrap'>{moment(x.start_time / 1000).format('DD/MM/YYYY HH:mm')}</Typography>
                </th>
                {isChecking === true ? null : (
                  <th className='border-b border-darkBorder px-6 py-4'>
                    <WithdrawButton data={x} />
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
