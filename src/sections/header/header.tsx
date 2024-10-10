import { useJwtStore } from '../../zustand/zustand'

import './header.css'


const Header = () => {

    const setJwt = useJwtStore((state:any) => state.setJwt)
    const jwt = useJwtStore((state:any) => state.jwt)

    const handleOnLogout = () => {
        setJwt('')
        localStorage.clear()
    }

    return (
        <header className="header">
            <div className="title content-wrapper is-clickable" onClick={() => handleOnLogout()}>
                {jwt && <>Logout</>}
            </div>
        </header>
    )
}

export default Header