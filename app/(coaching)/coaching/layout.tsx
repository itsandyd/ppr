import { Nunito } from 'next/font/google'

const font = Nunito({ 
  subsets: ['latin'], 
});

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
