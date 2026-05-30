
import React from 'react'
import GitHub from '../SVGs/GitHub'
import Instagram from '../SVGs/Instagram'
import LinkedIn from '../SVGs/LinkedIn'
import Twitter from '../SVGs/Twitter'

const SideElementsItem = ({ items, position }) => {
    return (
        <div className={`ai-side-elements-container ai-side-elements-${position}`} >
            {(items || []).map((item, i) => (
                <div key={i} className='ai-side-elements-item'>
                    {item}
                </div>
            ))}
            <div className='ai-side-elements-line' />
        </div>
    )
}

const socialLinks = {
    github: 'https://github.com/Copper369/',
    instagram: 'https://www.instagram.com/ayush.apk_?igsh=YWVwajlqcGxxNTJy',
    twitter: 'https://x.com/copperrr369',
    linkedin: 'https://www.linkedin.com/in/ayush-karnewar-016460289/',
}

const MobileSocialLinks = () => (
    <div className='ai-mobile-social-links'>
        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GitHub width={22} height={22} />
        </a>
        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram width={22} height={22} />
        </a>
        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter width={22} height={22} />
        </a>
        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedIn width={22} height={22} />
        </a>
    </div>
)

const SideElements = ({ data: {
    emailButton,
    phoneButton,
    handleIconClick,
} }) => {
    return (
        <>
            {/* Desktop sidebar — hidden on mobile */}
            <div className='ai-side-elements'>
                {/* left side  */}
                <SideElementsItem
                    position="left"
                    items={[
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" key="GitHub" aria-label="GitHub">
                            <GitHub width={20} height={20} />
                        </a>,
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" key="Instagram" aria-label="Instagram">
                            <Instagram width={20} height={20} />
                        </a>,
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" key="Twitter" aria-label="Twitter">
                            <Twitter width={20} height={20} />
                        </a>,
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" key="LinkedIn" aria-label="LinkedIn">
                            <LinkedIn width={20} height={20} />
                        </a>,
                    ]}
                />

                {/* right side  */}
                <SideElementsItem
                    position="right"
                    items={[
                        <a
                            href="mailto:ayushkarnewar369@gmail.com?subject=Hey%20Ayush!%20Happy%20to%20Connect!&body=Hey%20Ayush!%0A%0AHappy%20to%20connect!%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20get%20in%20touch.%0A%0A%5BYour%20message%20here%5D%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D"
                            key="website"
                            className='ai-side-elements-text'
                            style={{ textDecoration: 'none' }}
                            onClick={(e) => {
                                e.preventDefault();
                                const mailto = 'mailto:ayushkarnewar369@gmail.com?subject=Hey%20Ayush!%20Happy%20to%20Connect!&body=Hey%20Ayush!%0A%0AHappy%20to%20connect!%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20get%20in%20touch.%0A%0A%5BYour%20message%20here%5D%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D';
                                const gmail = 'https://mail.google.com/mail/?view=cm&to=ayushkarnewar369@gmail.com&su=Hey%20Ayush!%20Happy%20to%20Connect!&body=Hey%20Ayush!%0A%0AHappy%20to%20connect!%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20get%20in%20touch.%0A%0A%5BYour%20message%20here%5D%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D';
                                window.open(mailto, '_self');
                                setTimeout(() => {
                                    window.open(gmail, '_blank');
                                }, 500);
                            }}
                        >
                            {emailButton?.label}
                        </a>,
                    ]}
                />
            </div>

            {/* Mobile social links — only visible on mobile */}
            <MobileSocialLinks />
        </>
    )
}

SideElements.propTypes = {}

export default SideElements