"use client"

import CustomModal from '@/components/agency/custom-modal'
import SubscriptionFormWrapper from '@/components/agency/forms/subscription-form/subscription-form-wrapper'
import { useModal } from '@/components/agency/modal-provider'
import { PricesList } from '@/lib/agency/types'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

type Props = {
  prices: PricesList['data']
  customerId: string
  planExists: boolean
}

const SubscriptionHelper = ({ customerId, planExists, prices }: Props) => {
  const { setOpen } = useModal()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  useEffect(() => {
    if (plan)
      setOpen(
        <CustomModal
          title="Upgrade Plan!"
          subheading="Get started today to get access to premium features"
        >
          <SubscriptionFormWrapper
            planExists={planExists}
            customerId={customerId}
          />
        </CustomModal>,
        async () => ({
          plans: {
            defaultPriceId: plan ? plan : '',
            plans: prices,
          },
        })
      )
  }, [plan, setOpen, prices, customerId, planExists])

  return <div></div>
}

export default SubscriptionHelper
