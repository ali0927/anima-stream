import StreamList from "../components/StreamList/StreamList";
import Appbar from '../components/Appbar';
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <div className="container mx-auto my-10">
      <Appbar />
      <StreamList />
    </div>
  );
}
