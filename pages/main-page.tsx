import Auth from '../components/Auth'
import Layout from '../components/Layout'
import axios from 'axios'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import React, { useState, useEffect, useContext } from 'react'
import {
  MY_PROFILE,
  PROPS_NEWPOST,
  PROPS_POST,
  File,
  PROPS_LIKED,
} from '../types'
import Modal from 'react-modal'
import { nextTick } from 'process'

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
  const [modalIsOpen, setIsOpen] = useState(false)
  const [modalPro, setModalPro] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [proImage, setProImage] = useState<File | null>(null)
  const [editUser, setEditUser] = useState('')
  const [preview, setPreview] = useState('')
  const router = useRouter()

  const handlerEditPicture = () => {
    const fileInput = document.getElementById('imageInput')
    fileInput?.click()
  }

  //投稿に紐づいているidからプロフィール画像を抽出
  const filProfImg = (id: number) => {
    const filted = prof?.filter((pro) => {
      return id == pro.userProfile
    })
    return filted[0]?.img !== null
      ? filted[0]?.img
      : `${process.env.NEXT_PUBLIC_RESTAPI_URL}/media/avatars/default.png`
  }
  //投稿に紐づいているidからニックネームを抽出
  const filProfName = (id: number) => {
    const filted = prof?.filter((pro) => {
      return id == pro.userProfile
    })

    return filted
      ? filted[0]?.nickName
      : `${process.env.NEXT_PUBLIC_RESTAPI_URL}/media/defaul.jpg`
  }

  const fetchAsyncCreatePost = async (newPost: PROPS_NEWPOST) => {
    const uploadData = new FormData()
    uploadData.append('title', newPost.title)
    newPost.img && uploadData.append('img', newPost.img, newPost.img.name)
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/post/`,
      uploadData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    )
    setIsOpen(false)
    setImage(null)
    setTitle('')
    setPreview('')
    mutate()
    return res.data
  }

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
    return res.data
  }

  const fetchAsyncChangeProfile = async (userNum: number) => {
    const uploadData = new FormData()
    uploadData.append('nickName', editUser)
    proImage && uploadData.append('img', proImage, proImage.name)
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/profile/${userNum}/`,
      uploadData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    )
    setModalPro(false)
    setProImage(null)
    setEditUser('')
    myMute()
    return res.data
  }

  const handlerLiked = async (liked: PROPS_LIKED) => {
    const currentLiked = liked.current
    const uploadData = new FormData()

    let isOverlapped = false
    currentLiked.forEach((current) => {
      if (current === liked.new) {
        isOverlapped = true
      } else {
        uploadData.append('liked', String(current))
      }
    })

    if (!isOverlapped) {
      uploadData.append('liked', String(liked.new))
    } else if (currentLiked.length === 1) {
      uploadData.append('title', liked.title)
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/post/${liked.id}/`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      )
      mutate()
      return res.data
    }
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/post/${liked.id}/`,
      uploadData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    )
    mutate()
    return res.data
  }

  useEffect(() => {
    mutate()
    proMute()
    myMute()
  }, [])

  return (
    <>
      <header className="h-20 bg-gray-600 flex items-center justify-between text-white">
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
          <div className="max-w-lg w-full" key={post.id}>
            <div className="h-14 bg-gray-600 flex w-full items-center">
              <img
                className="w-10 h-10 object-cover rounded-full ml-3"
                src={prof ? filProfImg(post.userPost) : ''}
                alt=""
              />
              <p className="ml-2">{filProfName(post.userPost)}</p>
              {myProf ? (
                myProf[0].userProfile == post.userPost && (
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
                )
              ) : (
                <></>
              )}
            </div>
            <img className="w-full h-80 object-cover" src={post.img} alt="" />
            <div>{post.title}</div>
            <div>
              <input
                type="checkbox"
                checked={post.liked.some(
                  (like) => like === (myProf && myProf[0]?.userProfile)
                )}
                onChange={() =>
                  handlerLiked({
                    id: post.id,
                    title: post.title,
                    current: post.liked,
                    new: myProf ? myProf[0].userProfile : '',
                  })
                }
              />
              like:{post.liked.length}
            </div>
          </div>
        ))}
      </Layout>
      <Modal isOpen={modalIsOpen} style={modalStyle}>
        <button
          onClick={() => {
            setIsOpen(false)
            setPreview('')
          }}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mb-10"
        >
          閉じる
        </button>
        <div>
          <input
            className="mb-5"
            type="text"
            placeholder="Please enter caption"
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />{' '}
          <input
            type="file"
            className="mb-5"
            id="imageInput"
            onChange={(e) => {
              setImage(e.target.files![0])
              const { files } = e.target
              setPreview(window.URL.createObjectURL(files[0]))
            }}
          />
          <div className="max-w-lg w-full">
            <img src={preview} className="w-full h-80 object-cover" />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mb-10"
            disabled={!title || !image}
            onClick={async () =>
              fetchAsyncCreatePost({ title: title, img: image })
            }
          >
            送信
          </button>
        </div>
      </Modal>

      {/* profileedit */}
      <Modal isOpen={modalPro} style={modalStyle} ariaHideApp={false}>
        <button
          onClick={() => {
            setModalPro(false)
          }}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mb-10"
        >
          閉じる
        </button>
        <div>
          <p className="font-semibold text-xl">
            ニックネーム：{myProf ? myProf[0].nickName : ''}
          </p>
          <input
            className="mb-5"
            type="text"
            value={editUser}
            placeholder="新しいニックネーム"
            onChange={(e) => setEditUser(e.target.value)}
          />
          <br /> <p className="font-semibold text-xl">プロフィール画像</p>
          <input
            type="file"
            className="mb-5"
            id="imageInput"
            onChange={(e) => {
              setProImage(e.target.files![0])
            }}
          />
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mb-10"
            disabled={!editUser}
            onClick={async () =>
              fetchAsyncChangeProfile(myProf ? myProf[0].id : '')
            }
          >
            送信
          </button>
        </div>
      </Modal>
    </>
  )
}

export default MainPage
