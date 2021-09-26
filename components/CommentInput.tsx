import React, { useState, useEffect, useContext } from 'react'
import { filProfImg } from '../lib/func'
import axios from 'axios'
export default function CommentInput({
  myProf,
  prof,
  comMute,
  postId,
  mutate,
}) {
  const [sendComment, setSendComment] = useState('')

  const postComment = async (id: number) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/comment/`,
      { text: sendComment, post: id },
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    )
    setSendComment('')
    comMute()
    mutate()
    return res.data
  }

  return (
    <>
      <div className="flex flex-wrap items-center">
        <input
          className="text-black rounded-full h-6  ml-2"
          type="text"
          value={sendComment}
          onChange={(e) => setSendComment(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded ml-2"
          onClick={() => {
            postComment(postId)
          }}
          disabled={!sendComment}
        >
          send
        </button>
      </div>
    </>
  )
}
