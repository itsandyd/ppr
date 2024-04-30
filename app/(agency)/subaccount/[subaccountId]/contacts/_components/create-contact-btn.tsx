'use client'

import CustomModal from '@/components/agency/custom-modal'
import ContactUserForm from '@/components/agency/forms/contact-user-form'
import { useModal } from '@/components/agency/modal-provider'
import { Button } from '@/components/ui/button'

import React from 'react'

type Props = {
  subaccountId: string
}

const CreateContactButton = ({ subaccountId }: Props) => {
  const { setOpen } = useModal()

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal
        title="Create Or Update Contact information"
        subheading="Contacts are like customers."
      >
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>
    )
  }

  return <Button onClick={handleCreateContact}>Create Contact</Button>
}

export default CreateContactButton
