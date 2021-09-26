import Modal from 'react-modal'
import React, { useState } from 'react'
import { File, PROPS_NEWPOST } from '../types'
import axios from 'axios'
export default function PostModal({
  modalIsOpen,
  modalStyle,
  setIsOpen,
  mutate,
}) {
  const [preview, setPreview] = useState('')
  const [title, setTitle] = useState('')
  const [image, setImage] = useState<File | null>(null)

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

  return (
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
  )
}
