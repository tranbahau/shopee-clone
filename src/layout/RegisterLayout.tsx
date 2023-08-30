import RegisterFooter from 'src/components/Footer';
import RegisterHeader from 'src/components/RegisterHeader';

interface Props {
  children?: React.ReactNode;
}

export default function RegisterLayout({ children }: Props) {
  return (
    <div>
      <RegisterHeader />
      {children}
      <RegisterFooter />
    </div>
  );
}
