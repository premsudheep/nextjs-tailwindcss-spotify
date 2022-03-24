import React from 'react'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song'

function Songs() {
  const playlist = useRecoilValue(playlistState)

  console.log(playlist)

  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {playlist?.tracks?.items.map((item, i): any => (
        <Song key={i} order={i} track={item} />
      ))}
    </div>
  )
}

export default Songs
