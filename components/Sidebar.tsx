import { useState, useEffect } from 'react'
import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  LogoutIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import { useRecoilState } from 'recoil'
import { playlistIdState } from '../atoms/playlistAtom'

function Sidebar() {
  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
  const spotifyApi = useSpotify()
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => setPlaylists(data.body.items))
    }
  }, [session, spotifyApi])

  return (
    <div className="hidden h-screen overflow-y-scroll border-r border-gray-900 p-5 pb-36 text-xs text-gray-400 scrollbar-hide sm:max-w-[12rem] md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="space-y-4 font-bold">
        <img className="w-25 -ml-4 h-20" src="spotify-logo.png" alt="" />
        {/* <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <LogoutIcon className="h-5 w-5" />
          <p>Logout</p>
        </button> */}
        <button className="flex items-center space-x-3 font-bold hover:text-white">
          <HomeIcon className="h-6 w-6" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-3 font-bold hover:text-white">
          <SearchIcon className="h-6 w-6" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-3 font-bold hover:text-white">
          <LibraryIcon className="h-6 w-6" />
          <p>Your Library</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-500" />

        <button className="flex items-center space-x-3 font-bold hover:text-white">
          <PlusCircleIcon className="h-6 w-6" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-3 font-bold hover:text-white">
          <HeartIcon className="h-6 w-6" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-3 font-bold hover:text-white">
          <RssIcon className="h-6 w-6" />
          <p>Your episodes</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-500" />

        {/* Playlist..... */}

        {playlists.map((playlist) => (
          <p
            className="cursor-pointer hover:text-white"
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
