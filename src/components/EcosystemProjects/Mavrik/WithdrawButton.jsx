import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AptosClient } from 'aptos'
import Button from 'components/Button'
import { MAINNET_NODE_URL } from 'config'
import { useToast } from 'hooks/useToast'
import { useState } from 'react'

const WithdrawButton = ({ data }) => {
  const { signAndSubmitTransaction } = useWallet()
  const [isLoading, setIsLoading] = useState(Boolean)
  const toast = useToast()

  const aptosClient = new AptosClient(MAINNET_NODE_URL, { WITH_CREDENTIALS: false })

  const collection = 'MAVRIK'
  const creator = '0xf3778cf4d8b6d61ab3d79c804797ef7417e258449d2735b0f405e604b81f7916'

  const withdrawMavrik = async () => {
    setIsLoading(true)
    const payload = {
      arguments: ['0x389dbbc6884a1d5b1ab4e1df2913a8c1b01251e50aed377554372b2842c5e3ef', creator, collection, data.name, 0, 1],
      function: '0x389dbbc6884a1d5b1ab4e1df2913a8c1b01251e50aed377554372b2842c5e3ef::tokenstaking::unstake_token',
      type: 'entry_function_payload',
      type_arguments: ['0x389dbbc6884a1d5b1ab4e1df2913a8c1b01251e50aed377554372b2842c5e3ef::EONcoin::EONCoin'],
    }
    try {
      const response = await signAndSubmitTransaction(payload)
      const txResult = await aptosClient.waitForTransactionWithResult(response.hash)
      if (txResult.success === true) {
        toast('success', 'Transaction Confirmd', `You have successfully claimed ${data.name} and EON tokens`, response.hash)
      } else {
        toast('error', 'bruh', txResult.success, response.hash)
      }
    } catch (error) {
      if (error === 'The user rejected the request') {
        toast('error', 'The user rejected the request', '')
      } else {
        toast('error', error, '')
      }
    }
    setIsLoading(false)
  }

  return (
    <div className='mt-2'>
      <Button onClick={() => withdrawMavrik()} loading={isLoading} className='font-light'>
        WITHDRAW
      </Button>
    </div>
  )
}

export default WithdrawButton
