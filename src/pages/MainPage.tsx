import CommentariesPage from "./commentariesPage/commentariesPage"
import RegestrationPage from "./regestrationPage/RegestrationPage"


import {useJwtStore } from "../zustand/zustand"
import { useEffect } from "react"

const MainPage = () => {

    const setJwt = useJwtStore((state:any) => state.setJwt)
    const jwt = useJwtStore((state:any) => state.jwt)

    useEffect(() => {
        const jwt = localStorage.getItem("jwt")
        if (jwt) {
            setJwt(jwt)
        }
    },[])

  
    return (
        <>  
            {jwt && <CommentariesPage/> || <RegestrationPage/>}
        </>
    )
}

export default MainPage