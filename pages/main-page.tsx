import Layout from '../components/Layout'
import axios from 'axios'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import React, { useState, useEffect } from 'react'
import { MY_PROFILE, PROPS_POST, File } from '../types'
import Like from '../components/Like'

import { filProfImg, filProfName } from '../lib/func'
import PostModal from '../components/PostModal'
import ProModal from '../components/ProModal'

const fetcher = async (url) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}${url}`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  })
  return res.data
}

// modalstyle
const modalStyle = {
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  content: {
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '10%',
  },
}

const MainPage: React.FC = () => {
  const { data: allPost, mutate } = useSWR<PROPS_POST[]>(
    '/api/post/',
    fetcher,
    {}
  )
  const { data: myProf, mutate: myMute } = useSWR<MY_PROFILE>(
    '/api/myprofile/',
    fetcher,
    {}
  )
  const { data: prof, mutate: proMute } = useSWR<MY_PROFILE[]>(
    '/api/profile/',
    fetcher,
    {}
  )
  const { data: comment, mutate: comMute } = useSWR(
    '/api/comment/',
    fetcher,
    {}
  )
  const [modalIsOpen, setIsOpen] = useState(false)
  const [modalPro, setModalPro] = useState(false)
  const [proImage, setProImage] = useState<File | null>(null)
  const [editUser, setEditUser] = useState('')
  const router = useRouter()

  const fetchAsyncDletePost = async (postId: number) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/post/${postId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    )
    mutate()
    comMute()
    return res.data
  }

  useEffect(() => {
    mutate()
    proMute()
    myMute()
    comMute()
  }, [])

  return (
    <>
      <header className="h-20 bg-gray-600 flex flex-wrap items-center justify-between text-white">
        <h1 className="ml-4 font-semibold">
          <button
            onClick={() => {
              localStorage.removeItem('localJWT')
              router.push('/')
            }}
          >
            INSTA
          </button>
        </h1>
        <button
          className=""
          onClick={() => {
            setIsOpen(true)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <button className="mr-4" onClick={() => setModalPro(true)}>
          <img
            className="w-14 h-14 object-cover rounded-full"
            src={
              myProf && myProf[0].img !== null
                ? myProf[0].img
                : `${process.env.NEXT_PUBLIC_RESTAPI_URL}/media/avatars/default.png`
            }
            alt=""
          />
        </button>
      </header>
      <Layout title="main-page">
        {allPost?.map((post) => (
          <div
            className="max-w-lg w-full mb-14 border-2 pb-2 mt-4"
            key={post.id}
          >
            <div className="h-14 bg-gray-600 flex flex-wrap w-full items-center">
              <img
                className="w-10 h-10 object-cover rounded-full ml-3"
                src={prof && filProfImg(prof, post.userPost)}
                alt=""
              />
              <p className="ml-2">{filProfName(prof, post.userPost)}</p>
              {myProf && myProf[0].userProfile == post.userPost && (
                <button
                  className="ml-auto mr-3"
                  onClick={() => fetchAsyncDletePost(post.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
            <img className="w-full h-80 object-cover" src={post.img} alt="" />
            <div className="text-xl mt-2 mb-2 ml-2">{post.title}</div>
            {/* いいね */}
            <Like
              myProf={myProf}
              post={post}
              mutate={mutate}
              comMute={comMute}
              prof={prof}
              comment={comment}
            />
          </div>
        ))}
      </Layout>
      <PostModal
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        mutate={mutate}
        modalStyle={modalStyle}
      />
      <ProModal
        setModalPro={setModalPro}
        modalPro={modalPro}
        myProf={myProf}
        comMute={comMute}
        modalStyle={modalStyle}
        myMute={myMute}
      />
    </>
  )
}

export default MainPage
