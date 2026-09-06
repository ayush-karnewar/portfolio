import { openLink } from "./methods"

const outer = {
    title1:  `Hi, I'm`,
    title2: 'Ayush Karnewar,',
    decrypTexts: [
        'Always a Learner',
        'Insight-Driven Research Mindset',
        'Fantasised in Deep-rooted Sciences',
        'AI for Life Sciences',
        'Building Impactful AI Solutions',
        'Mirror Writer'
    ],
    desciption: `Final Year CSE-AIML student at D.Y. Patil College of Engineering & Technology, Kolhapur. Passionate about AI, prompt engineering, and deep-rooted sciences. Dedicated to creating innovative solutions that bridge technology and real-world applications.`,
    button: {
        label: 'Contact me!',
        onClick: () => openLink('mailto:ayushkarnewar369@gmail.com?subject=Hello')
    }
}

export default outer
