import { ChevronDownIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'
import { millisToHoursAndMinutes } from '../lib/time'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

function Center() {
  const { data: session, status } = useSession()
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  const [color, setColor] = React.useState('')

  const spotifyAPI = useSpotify()

  useEffect(() => {
    return setColor(shuffle(colors).pop() || colors[0])
  }, [playlistId])

  useEffect(() => {
    if (playlistId) {
      spotifyAPI
        .getPlaylist(playlistId)
        .then((data) => setPlaylist(data.body))
        .catch((err) => console.error('Some thing went wrong.!', err))
    }
  }, [spotifyAPI, playlistId])

  const calculateTotalAlbumDuration = () => {
    let totalAlbumDurationInMillis = 0
    playlist?.tracks?.items.forEach(
      (item: any) => (totalAlbumDurationInMillis += item.track.duration_ms)
    )
    return millisToHoursAndMinutes(totalAlbumDurationInMillis)
  }

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex cursor-pointer items-center space-x-2 rounded-full bg-gray-800 p-0 pr-1 font-bold text-white opacity-90 hover:opacity-80"
          onClick={() => signOut()}
        >
          <img
            className="h-10 w-10 rounded-full p-1"
            src={session?.user?.image ?? '/images/avatar.png'}
            alt=""
          />
          <h2 className="w-auto">{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5 pt-1" />
        </div>
      </header>
      <section
        className={`${color} flex h-80 items-end space-x-7 bg-gradient-to-b to-black p-8 text-white`}
      >
        <img
          className="h-56 w-56 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p className="text-sm md:text-base xl:text-sm">PLAYLIST</p>
          <h1 className="text-3xl font-bold md:text-5xl xl:text-7xl">
            {playlist?.name}
          </h1>
          <p className="text-sm md:text-base xl:text-lg">
            {playlist?.owner?.display_name ?? 'Spotify'}
            {playlist?.followers?.total > 0 &&
              ' • ' + playlist?.followers?.total}
            {playlist?.tracks?.items.length > 0 &&
              ' • ' + playlist?.tracks?.items.length + ' Songs'}
            {' • ' + calculateTotalAlbumDuration()}
          </p>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
