
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/agency/queries';
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams: { state: string; code: string }
}

const SubAccountMainPage = async ({ searchParams }: Props) => {
  const agencyId = await verifyAndAcceptInvitation()

  if (!agencyId) {
    return null;
    // <Unauthorized />
  }

  const user = await getAuthUserDetails()
  if (!user) return

  const getFirstSubaccountWithAccess = user.Permissions.find(
    (permission) => permission.access === true
  )

  if (searchParams.state) {
    const statePath = searchParams.state.split('___')[0]
    const stateSubaccountId = searchParams.state.split('___')[1]
    if (!stateSubaccountId) return null
    // <Unauthorized />
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    )
  }

  if (getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`)
  }

  return null
  //   <Unauthorized />
}

export default SubAccountMainPage
