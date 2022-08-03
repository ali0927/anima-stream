import Donation from "../components/Donation/Donation";
import StreamList from "../components/StreamList/StreamList";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <StreamList />
    </div>
  );
}
