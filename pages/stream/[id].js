import { useRouter } from 'next/router'
import Donation from '../../components/Donation/Donation';
import StreamView from '../../components/Stream/StreamView';

export default function Stream () {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <StreamView streamerId={id} />
  )
}