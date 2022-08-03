import { useRouter } from 'next/router'
import Donation from '../../components/Donation/Donation';

export default function Stream () {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <Donation streamerId={id} />
  )
}