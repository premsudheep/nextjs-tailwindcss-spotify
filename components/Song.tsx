import React from 'react'
import { useRecoilState } from 'recoil'
import useSpotify from '../hooks/useSpotify'
import { millisToMinutesAndSeconds } from '../lib/time'
import { currentTrackIdState, isPlayingState } from './../atoms/songAtom'

function Song({ order, track }: { order: number; track: any }) {
  const spotifyAPI = useSpotify()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const playSong = () => {
    setCurrentTrackId(track.track.id)
    setIsPlaying(true)
    spotifyAPI.play({
      uris: [track.track.uri],
    })
  }

  return (
    <div
      className="grid cursor-pointer grid-cols-3 rounded-lg py-4 px-5 text-gray-500 hover:bg-gray-900"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track?.track?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p className="w-36 truncate text-white lg:w-64">
            {track?.track?.name}
          </p>
          <p className="w40">{track?.track?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="ml-auto flex w-80 items-center justify-end md:ml-0">
        <p className="hidden w-40 truncate md:inline">
          {track?.track?.album?.name}
        </p>
      </div>

      <div className="ml-auto flex w-72 items-center justify-end md:ml-0">
        <p className="">
          {millisToMinutesAndSeconds(track?.track?.duration_ms)}
        </p>
      </div>
    </div>
  )
}

export default Song
