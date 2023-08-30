import { ReactNode } from 'react';
import CartHeader from 'src/components/CartHeader';
import RegisterFooter from 'src/components/Footer';

interface Props {
  children: ReactNode;
}

export default function CartLayout({ children }: Props) {
  return (
    <div>
      <CartHeader />
      {children}
      <RegisterFooter />
    </div>
  );
}
