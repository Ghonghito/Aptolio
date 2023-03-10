import Card from 'components/Cards/Card'
import Input from 'components/Input'
import { useToast } from 'hooks/useToast'
import { AiOutlineSearch } from 'react-icons/ai'
import { convertNameToAddress } from 'utils/APIs/AptosAPI'

const Index = () => {
  const toast = useToast()

  const checkAddress = async () => {
    const walletAddress = document.getElementById('aptosAddress').value
    if (walletAddress !== '') {
      if (String(walletAddress).endsWith('.apt')) {
        const getAddress = await convertNameToAddress(walletAddress)
        if (getAddress.status === true && getAddress.hasOwnProperty('address')) {
          window.location = `/address/${getAddress.address}`
        } else {
          toast('error', 'Not Found', 'Invalid or not registered')
        }
      } else if (String(walletAddress).length > 60) {
        window.location = `/address/${walletAddress}`
      } else {
        toast('error', 'Wallet address or .apt name is incorrect')
      }
    } else {
      toast('error', 'Enter an APTOS wallet address or .apt name')
    }
  }

  return (
    <div className='w-full md:w-[450px]'>
      <Card>
        <div className='flex items-center gap-1 p-1'>
          <Input onKeyDown={(e) => e.key === 'Enter' && checkAddress()} id='aptosAddress' placeholder='APTOS Wallet Address or .apt name' />
          <div onClick={() => checkAddress()} className='group border-[1px] border-darkBorder p-2 rounded-lg cursor-pointer duration-200 hover:bg-primary'>
            <AiOutlineSearch className='duration-200 text-2xl text-primary  group-hover:text-darkBackground' />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Index
