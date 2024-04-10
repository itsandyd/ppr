'use client'

import CustomModal from '@/components/agency/custom-modal'
import SubAccountDetails from '@/components/agency/forms/subaccount-details'
import { useModal } from '@/components/agency/modal-provider'
import { Button } from '@/components/ui/button'

import { Agency, AgencySidebarOption, SubAccount, User } from '@prisma/client'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

type Props = {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[]
              SideBarOption: AgencySidebarOption[]
            })
        )
      | null
  }
  id: string
  className: string
}

const CreateSubaccountButton = ({ className, id, user }: Props) => {
    const { setOpen } = useModal();
    const agencyDetails = user.Agency
  
    if (!agencyDetails) return toast.error('Agency not found');
  
    return (
      <Button
        className={twMerge('w-full flex gap-4', className)}
        onClick={() => {
          console.log('Opening modal'); // Debugging line
          setOpen(
            <CustomModal
              title="Create a Subaccount"
            subheading="You can switch between"
            >
              <SubAccountDetails
                agencyDetails={agencyDetails}
                userId={user.id}
                userName={user.name || ''}
              />
            </CustomModal>
          );
        }}
      >
        <PlusCircleIcon size={15} />
        Create Sub Account
      </Button>
    );
  };

export default CreateSubaccountButton
