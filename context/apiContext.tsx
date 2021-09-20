import React, { createContext, useState, useEffect } from 'react'
import { withCookies } from 'react-cookie'
import { MY_PROFILE, PROPS_POST } from '../types'
import axios from 'axios'
export interface CONTEXT_TYPE {
  pofile: MY_PROFILE
  profiles: MY_PROFILE[]
  setProfile: React.Dispatch<React.SetStateAction<MY_PROFILE>>
  setProfiles: React.Dispatch<React.SetStateAction<MY_PROFILE[]>>
}

export const ApiContext = createContext(
  {} as {
    profile: MY_PROFILE
    profiles: MY_PROFILE[]
    setProfile: React.Dispatch<React.SetStateAction<MY_PROFILE>>
    setProfiles: React.Dispatch<React.SetStateAction<MY_PROFILE[]>>
  }
)

const ApiContextProvider = (props) => {
  const [profile, setProfile] = useState<MY_PROFILE>()
  const [profiles, setProfiles] = useState<MY_PROFILE[]>([])
  const [post, setPost] = useState<PROPS_POST[]>([])
  const [editedProfile, setEditedProfile] = useState({ id: '', nickName: '' })

  useEffect(() => {})

  return (
    <ApiContext.Provider
      value={{
        profile,
        profiles,
        setProfile,
        setProfiles,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  )
}

export default ApiContextProvider
