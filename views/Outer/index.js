import React from 'react'
import Gooery from '../../components/GooeryAnimation'
import DecryptText from '../../components/DecryptText'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const AIAvatar = dynamic(() => import('../../components/AIAvatar'), { ssr: false })


const Outer = ({ data: {
    title1,
    title2,
    decrypTexts,
    desciption,
    button
} }) => {
    return (
        <div className='ai-outer'>
            <div className='container'>
                <div className='ai-outer-container d-flex justify-content-between align-items-center'>
                    <div className='ai-outer-text'>
                        <div className='ai-outer-heading'>
                            {title1}
                        </div>
                        <div className='ai-outer-heading'>
                            {title2}
                        </div>
                        <div className='ai-outer-heading2'>
                            <DecryptText
                                values={decrypTexts}
                                delay={5000}
                            />
                        </div>
                        <div className='ai-outer-description'>
                            {desciption}
                        </div>
                        <div className='ai-outer-contact'>
                            <button onClick={button?.onClick} className='ai-button'>
                                {button?.label}
                            </button>
                        </div>
                    </div>
                    <div className='ai-outer-right'>
                        <AIAvatar />
                    </div>
                </div>
            </div>
            <div className='ai-outer-gooery'>
                <Gooery />
            </div>
        </div>
    )
}

Outer.propTypes = {}

export default Outer