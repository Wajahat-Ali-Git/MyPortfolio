import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience | Wajahat Ali',
  description: 'Work history and professional experience of Wajahat Ali as a Software Engineer.',
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
