import React, { useCallback, useEffect, useState } from 'react'
import useSpotify from './../hooks/useSpotify'
import { useSession } from 'next-auth/react'
import { currentTrackIdState, isPlayingState } from './../atoms/songAtom'
import { useRecoilState } from 'recoil'
import useSongInfo from './../hooks/useSongInfo'
import spotifyAPI from './../lib/spotify'
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid'
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import { debounce } from 'lodash'

function Player() {
  const soptifyAPI = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)

  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyAPI.getMyDevices().then((data: any) => {
        console.log(data)
      })
      spotifyAPI.getMyCurrentPlayingTrack().then((data) => {
        console.log(`Now playing: ${data?.body?.item?.name}`)
        setCurrentTrackId(data?.body?.item?.id)

        spotifyAPI.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data?.body?.is_playing)
        })
      })
    }
  }

  const handlePlayPause = () => {
    spotifyAPI.getMyCurrentPlaybackState().then((data) => {
      if (data?.body?.is_playing) {
        spotifyAPI.pause()
        setIsPlaying(false)
      } else {
        spotifyAPI.play()
        setIsPlaying(true)
      }
    })
  }

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyAPI.setVolume(volume).catch((err) => console.error(err))
    }, 500),
    []
  )

  useEffect(() => {
    if (spotifyAPI.getAccessToken() && !currentTrackId) {
      // Fetch the song info
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyAPI, session])

  console.log(`songInfo ${songInfo}`)

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  return (
    <div className="text-xs- grid h-24 grid-cols-3 bg-gradient-to-b from-gray-900 to-black px-2 text-white md:px-4 md:text-base">
      {/* left */}
      <div className="flex items-center space-x-4">
        {songInfo && (
          <>
            <img
              className="hidden h-14 w-14 md:inline"
              src={songInfo?.album?.images?.[0]?.url}
              alt=""
            />
            <div>
              <h3 className="text-gray-200">{songInfo?.name}</h3>
              <p className="text-sm text-gray-400">
                {songInfo?.artists?.[0]?.name}
              </p>
            </div>
          </>
        )}
      </div>
      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          // onClick={() => {spotifyAPI.skipToPrevious()}} -- API Not working.
          className="button"
        />

        {isPlaying ? (
          <PauseIcon className="button h-10 w-10" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="button h-10 w-10" onClick={handlePlayPause} />
        )}

        <FastForwardIcon
          // onClick={() => {spotifyAPI.skipToNext()}} -- API Not working.
          className="button"
        />

        <ReplyIcon className="button" />
      </div>
      {/* Right */}

      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <VolumeDownIcon
          className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  )
}

export default Player
