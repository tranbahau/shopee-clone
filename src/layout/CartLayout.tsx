import { ReactNode } from 'react';
import CartHeader from 'src/components/CartHeader';
import RegisterFooter from 'src/components/RegisterFooter';

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
