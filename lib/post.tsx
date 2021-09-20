import axios from 'axios'
import fetch from 'node-fetch'
import { PROPS_POST } from '../types'

export const fetchAsyncGetMyProf = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/myprofile/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  )
  console.log(res.data[0])
  return res.data[0]
}

export const fetchAsyncGetProfs = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/profile/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  )
  console.log(res.data)
  return res.data
}

export const fetchAsyncPosts = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/profile/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  )
  console.log(res.data)
  return res.data
}

export async function getAllPostsData() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/post/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  )
  console.log(res.data)
  return res.data
}

// export async function getAllPostsData() {
//     const res = await fetch(
//       new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
//     );
//     const posts = await res.json();
//     const filteredPosts = posts.sort(
//       (a, b) => new Date(b.created_at) - new Date(a.created_at)
//     );
//     return filteredPosts;
//   }
