import { PricingTable } from '@clerk/nextjs'

function Pricing () {
  return (
    <div className='mt-20'>
        <h2 className='font-bold text-3xl my-5 items-center text-center '>Pick Your 🤖AI ✈️Travel Agent Plans</h2>
      <div className=' w-150 m-auto items-center text-center object-cover border-s-primary rounded-3xl'>
        <PricingTable />
      </div>
    </div>
  )
}

export default Pricing
