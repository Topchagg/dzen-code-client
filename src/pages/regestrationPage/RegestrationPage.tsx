import { useState } from 'react'

import RegestrationForm from '../../forms/regestrationForm/RegestrationForm'
import EnterForm from '../../forms/enterForm/enterForm'

import './ui/regestrationPage.css'


const RegestrationPage = () => {

    const [isReg,setIsReg] = useState(true)

    return (
        <div className='content-wrapper'>
            <div className="title-wrapper">
                <div className="title l-margin">
                    <span className='is-clickable title' onClick={() => setIsReg(true)}>Reg</span>
                    /
                    <span className='is-clickable title' onClick={() => setIsReg(false)}>Enter</span>
                </div>
            </div>
            <div className="l-margin reg-form-wrapper el-center">
                {isReg &&  <RegestrationForm/> || <EnterForm/>}
            </div>
        </div>
    )
}

export default RegestrationPage