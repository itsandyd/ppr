
import InfoBar from '@/components/agency/infobar'
import Sidebar from '@/components/agency/sidebar'
import { getAuthUserDetails, getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/agency/queries'
import { currentUser } from '@clerk/nextjs'
import { AgencyRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  params: { subaccountId: string }
}

const SubaccountLayout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation()
  if (!agencyId) return null
//   <Unauthorized />
  const user = await currentUser()
  if (!user) {
    return redirect('/')
  }

  let notifications: any = []

//   if (!user.privateMetadata.role) {
//     return null
//     // <Unauthorized />
//   } else {
//     const allPermissions = await getAuthUserDetails()
//     const hasPermission = allPermissions?.Permissions.find(
//       (permissions) =>
//         permissions.access && permissions.subAccountId === params.subaccountId
//     )
//     if (!hasPermission) {
//       return null
//     //   <Unauthorized />
//     }?

//     const allNotifications = await getNotificationAndUser(agencyId)

//     if (
//       user.privateMetadata.role === 'AGENCY_ADMIN' ||
//       user.privateMetadata.role === 'AGENCY_OWNER'
//     ) {
//       notifications = allNotifications
//     } else {
//       const filteredNoti = allNotifications?.filter(
//         (item) => item.subAccountId === params.subaccountId
//       )
//       if (filteredNoti) notifications = filteredNoti
//     }
//   }

  return (
    <div className="h-full overflow-hidden">
      <Sidebar
        id={params.subaccountId}
        type="subaccount"
      />

      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          agencyRole={user.privateMetadata.agencyRole as AgencyRole}
          subAccountId={params.subaccountId as string}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  )
} 

export default SubaccountLayout
