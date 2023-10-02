
import { db } from '@/lib/db'


import { CompanionSearchInput } from '@/components/ai/companion/companion-search-input'
import CompanionCategory from '@/components/ai/companion/companion-category'
import { Companions } from '@/components/ai/companion/companions';

interface CompanionPageProps {
  searchParams: {
      categoryId: string;
      name: string;
  }
} 

const CompanionPage = async ({
  searchParams
}: CompanionPageProps) => {

  const data = await db.companion.findMany({
    where: {
      category: {
        id: searchParams.categoryId,
      },
      name: {
        search: searchParams.name
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    }
  })

  const categories = await db.category.findMany()
  

  return (
    <div className="h-full p-4 space-y-2">
      <CompanionSearchInput />
      <CompanionCategory data={categories} />
      <Companions data={data}/>
    </div>
  )
}

export default CompanionPage