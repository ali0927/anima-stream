import Link from 'next/link'
import { Streamers } from "../../lib/dummy";
import { shortAddr } from '../../lib/utils';

const StreamList = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-10">
      {Streamers.map((streamer, idx) => 
        <Link href={`/stream/${idx}`}>
          <div key={idx} className="border rounded p-4 space-y-4 cursor-pointer">
            <h1 className="text-2xl">{streamer.title}</h1>
            <div className="flex flex-col">
              <span>{`Steramer: ${streamer.name}`}</span>
              <span>{`Description: ${streamer.description}`}</span>
              <span>{`Streamer's Wallet: ${shortAddr(streamer.wallet)}`}</span>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default StreamList;