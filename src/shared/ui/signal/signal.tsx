import { FC } from "react"

import './ui/signal.css'

const Signal: FC<{ isError: boolean, message: string,callBack:Function }> = (props) => {

    const signalStyles = props.isError ? "error-signal signal" : "other-signal signal"



    return (
        <div className={signalStyles}>
            <div className="call-back-function-pont-caller is-clickable" onClick={() => props.callBack()}>
                X
            </div>
            <div className="text-center">
                {props.message}
            </div>
        </div>
    )
}

export default Signal