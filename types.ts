
/*apicontext*/
export interface MY_PROFILE {
    id: number;
    nickName: string;
    userProfile: number;
    created_on:string;
    img:string;
  }

  export interface PROFILES {
    profiles:MY_PROFILE[];
  }

/*Post.tsx*/
export interface PROPS_POST {
    created_on:string
    id: number
    img: string
    liked: number[]
    0: number
    length: number
    title: string
    userPost: number

  }