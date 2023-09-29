import { CourseCategory, Course } from "@prisma/client";

import { CourseCard } from "./course-card";

type CourseWithProgressWithCategory = Course & {
  courseCategory: CourseCategory | null; // changed from 'category' to 'courseCategory'
  courseChapter: { id: string }[]; // changed from 'chapters' to 'courseChapter'
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({
  items
}: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.courseChapter.length} // changed from 'chapters' to 'courseChapter'
            price={item.price!}
            progress={item.progress}
            courseCategory={item.courseCategory?.name!} // changed from 'category' to 'courseCategory'
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  )
}