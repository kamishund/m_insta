import Modal from 'react-modal'
import React, { useState } from 'react'
import { File, PROPS_NEWPOST } from '../types'
import axios from 'axios'
export default function ProModal({
  setModalPro,
  myProf,
  modalStyle,
  myMute,
  comMute,
  modalPro,
}) {
  const [proImage, setProImage] = useState<File | null>(null)
  const [editUser, setEditUser] = useState('')

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
    comMute()
    return res.data
  }

  return (
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
  )
}
