import Auth from '../components/Auth'
import Layout from '../components/Layout'
import axios from 'axios'
import useSWR from 'swr'
import React, { useState, useEffect, useContext } from 'react'
import { ApiContext } from '../context/apiContext'
import {
  fetchAsyncGetMyProf,
  getAllPostsData,
  fetchAsyncGetProfs,
} from '../lib/post'
import { MY_PROFILE, PROPS_POST } from '../types'

const fetcher = async (url) => {
  const res = await axios.get(url, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  })
  console.log(res.data)
  return res.data
}

const Myfetcher = async (url) => {
  const res = await axios.get(url, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  })
  console.log(res.data)
  return res.data
}

const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/post/`
const apiUrlProfiles = `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/profile/`
const apiUrlMyProfile = `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/myprofile/`

const MainPage: React.FC = () => {
  const { data: allPost, mutate } = useSWR<PROPS_POST[]>(apiUrl, fetcher, {})
  const { data: myProf, mutate: myMute } = useSWR<MY_PROFILE>(
    apiUrlMyProfile,
    Myfetcher,
    {}
  )
  const { data: prof, mutate: proMute } = useSWR<MY_PROFILE[]>(
    apiUrlProfiles,
    Myfetcher,
    {}
  )

  useEffect(() => {
    mutate()
    myMute()
    proMute()
  }, [])

  return (
    <Layout>
      <p>main</p>
      {allPost?.map((post) => (
        <>
          <p>{post.id}</p>
        </>
      ))}

      <p>{myProf[0]?.nickName}</p>
    </Layout>
  )
}

export default MainPage
