import { Layout } from '@/components/layout/Layout';
import { TransactionsPage } from '@/components/transactions/TransactionsPage';
import { requireAuth } from '@/lib/session';
import { NextPage } from 'next';

export const getServerSideProps = requireAuth();

const Transactions: NextPage = () => {
  return (
    <Layout>
      <TransactionsPage />
    </Layout>
  );
};

export default Transactions;
