import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Wajahat Ali',
  description: 'Get in touch with Wajahat Ali. Send a message to discuss opportunities or collaborations.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
