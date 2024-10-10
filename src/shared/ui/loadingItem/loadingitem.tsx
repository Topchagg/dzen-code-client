import { motion } from 'framer-motion'

import './ui/loadingitem.css'


const LoadingItem = () => {
    return (
        <div className='loading-item-wrapper'>
            <motion.div
            animate={{scale:[1,1.5,1],opacity:1,rotate:360}}
            transition={
                {repeatType:'loop',
                repeat:Infinity,
                duration:0.75,
                ease:'linear'
            }
            }
            className="loading-item">

            </motion.div>
        </div>
    )
}

export default LoadingItem