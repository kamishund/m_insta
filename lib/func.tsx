import axios from 'axios'
import { profileEnd } from 'console'
import { MY_PROFILE, PROPS_NEWPOST } from '../types'

export const filProfImg = (prof: MY_PROFILE[], id: number) => {
  const filted = prof?.filter((pro) => {
    return id == pro.userProfile
  })
  return filted && filted[0]?.img !== null
    ? filted[0]?.img
    : `${process.env.NEXT_PUBLIC_RESTAPI_URL}/media/avatars/default.png`
}
//投稿に紐づいているidからニックネームを抽出
export const filProfName = (prof: MY_PROFILE[], id: number) => {
  const filted = prof?.filter((pro) => {
    return id == pro.userProfile
  })

  return filted
    ? filted[0]?.nickName
    : `${process.env.NEXT_PUBLIC_RESTAPI_URL}/media/defaul.jpg`
}
