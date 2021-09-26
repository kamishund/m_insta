import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { PROPS_LIKED } from '../types'
import Comment from './Comment'
import CommentInput from './CommentInput'

export default function Like({ post, myProf, mutate, comMute, prof, comment }) {
  const [comOpen, setComOpen] = useState(false)

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
      comMute()
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
    comMute()
    return res.data
  }
  return (
    <>
      <div className="flex flex-wrap items-center pl-3 mb-3">
        <input
          type="checkbox"
          checked={post?.liked?.some(
            (like) => like === (myProf && myProf[0]?.userProfile)
          )}
          onChange={() =>
            handlerLiked({
              id: post.id,
              title: post.title,
              current: post.liked,
              new: myProf[0] && myProf[0].userProfile,
            })
          }
        />
        <p className="ml-3 mr-4">like:{post?.liked?.length}</p>
        <button onClick={() => setComOpen(!comOpen)}>
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
      {comOpen && (
        <Comment
          comment={comment}
          post={post}
          prof={prof}
          myProf={myProf}
          mutate={mutate}
          comMute={comMute}
        />
      )}
      {comOpen && (
        <CommentInput
          postId={post.id}
          comMute={comMute}
          mutate={mutate}
          prof={prof}
          myProf={myProf}
        />
      )}
    </>
  )
}
