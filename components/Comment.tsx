import axios from 'axios'
import { filProfImg, filProfName } from '../lib/func'

export default function Comment({
  comment,
  post,
  myProf,
  mutate,
  comMute,
  prof,
  // filProfImg,
  // filProfName,
}) {
  const fetchAsyncDleteComment = async (id: number) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/comment/${id}`,
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

  if (!comment) {
    return null
  }
  return (
    <div>
      {/* coment */}
      {comment &&
        comment
          .filter((coms) => {
            return coms.post === post.id
          })
          .map((com) => (
            <div className="flex flex-wrap items-center mb-3">
              {
                <img
                  className="w-10 h-10 object-cover rounded-full ml-3"
                  src={filProfImg(prof, com.userComment)}
                  alt=""
                />
              }
              <p className="ml-2 mr-2">
                @{filProfName(prof, com.userComment)}:{com.text}
              </p>
              {myProf && myProf[0].userProfile == com.userComment && (
                <button
                  className="ml-auto mr-3"
                  onClick={() => fetchAsyncDleteComment(com.id)}
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
          ))}
    </div>
  )
}
