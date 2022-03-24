import React, { useEffect, useState } from 'react'
import useSpotify from './useSpotify'
import { useRecoilState } from 'recoil'
import { currentTrackIdState } from '../atoms/songAtom'

function useSongInfo() {
  const spotifyAPI = useSpotify()
  const [currentIdTrack, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState)
  const [songInfo, setSongInfo] = useState(null)

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyAPI.getAccessToken()}`,
            },
          }
        )
          .catch((error) => {})
          .then((res: any) => res.json())
        setSongInfo(trackInfo)
      }
    }
    fetchSongInfo()
  }, [currentIdTrack, spotifyAPI])

  return songInfo
}

export default useSongInfo
