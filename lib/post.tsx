import axios from 'axios'
import { PROPS_NEWPOST } from '../types'

// export const fetchAsyncCreatePost = async (newPost: PROPS_NEWPOST) => {
//   const uploadData = new FormData()
//   uploadData.append('title', newPost.title)
//   newPost.img && uploadData.append('img', newPost.img, newPost.img.name)
//   const res = await axios.post(
//     `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/post/`,
//     uploadData,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `JWT ${localStorage.localJWT}`,
//       },
//     }
//   )
//   return res.data
// }
