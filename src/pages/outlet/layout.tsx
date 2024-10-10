import { Outlet } from "react-router-dom";

import Header from "../../sections/header/header";

const Layout = () => {
    return (
        <>  
            <Header/>
            <Outlet/>
        </>
    )
}

export default Layout