import { ReactNode } from 'react';
import Header from 'src/components/Header';
import RegisterFooter from 'src/components/Footer';

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <RegisterFooter />
    </div>
  );
}
