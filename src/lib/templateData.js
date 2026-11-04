import imgLCN from '~/assets/img/lcn.webp';
import img2TMovies from '~/assets/img/2tmovies.webp';
import imgThiepHong from '~/assets/img/thiephong.webp';

// `stack` is shown as tags on the card; `meta` replaces the team line for products without one.
export const dataProject = [
    {
        name: 'Thiệp Hồng — online wedding invitations',
        title: 'Thiệp Hồng',
        badge: 'New',
        tagline: 'Online wedding invitations, shared in one link.',
        summary:
            'Wedding invitations for Vietnamese couples: pick a template, tell your story, then share one link over Zalo, Messenger or QR.',
        stack: ['70+ templates', 'RSVP & wishes', 'QR gifting', 'VI / EN'],
        meta: 'Live · thiephong.net',
        description:
            'Thiệp Hồng is an online wedding invitation platform for Vietnamese couples. Choose a template, add your names, date, venue, wedding photos, music and schedule, and every change shows up in the live preview. Share a single link over Zalo, Messenger or a QR code; guests open it on their phone without installing anything, confirm attendance, leave wishes and send wedding gifts by QR, while the couple follows every reply in one place. Designing is free; you pay once when you send the invitation.',
        img: imgThiepHong,
        type: ['Web'],
        url: 'https://thiephong.net/vi',
        src: [],
        demo: '',
    },
    {
        name: 'Online messaging apps',
        title: 'LCN Messenger',
        tagline: 'Realtime chat for web and mobile.',
        summary: 'Realtime chat for web and mobile: find friends and message them one-to-one or in groups.',
        stack: ['Node.js', 'Socket.io', 'MongoDB', 'React', 'React Native'],
        description:
            'This is an application that allows users to connect and communicate with each other online. Users can send messages to each other individually or in groups.',
        img: imgLCN,
        member: 5,
        type: ['Mobile', 'Web'],
        position: ['Team leader', 'Fullstack Developer', 'Designer'],
        technology: [
            { type: 'Back-end', detail: ['NodeJS', 'ExpressJS', 'Socket.io', 'JWT', 'AWS S3', 'MongoDB'] },
            { type: 'Front-end', detail: ['ReactJS', 'React Native', 'TailwindCSS', 'Redux toolkit'] },
            { type: 'Deploy', detail: ['Netlify', 'Heroku'] },
        ],
        src: [
            { type: 'Mobile', url: 'https://github.com/TrongPhan1011/N14-Mobile-Social-Network' },
            { type: 'Web', url: 'https://github.com/TrongPhan1011/N14-Web-Social-Network' },
            { type: 'API', url: 'https://github.com/TrongPhan1011/n14-lcn-api' },
            { type: 'Socket', url: 'https://github.com/TrongPhan1011/socket-n14-lcn' },
        ],
        demo: 'https://www.youtube.com/watch?v=yD5aMQEhnis&',
    },
    {
        name: '2TMovies online movie ticket booking and management system',
        title: '2TMovies',
        tagline: 'Movie ticket booking and cinema management.',
        summary: 'Online movie ticket booking for customers, plus a desktop app that lets theater staff run the cinema.',
        stack: ['Java', 'Spring Boot', 'MySQL', 'React', 'Electron'],
        description:
            'This is a system that allows customers to book and pay for movie tickets online through the website, and an application that enables theater staff to manage theater information.',
        img: img2TMovies,
        member: 2,
        type: ['Desktop app', 'Web'],
        position: ['Team leader', 'Fullstack Developer', 'Designer'],
        technology: [
            { type: 'Back-end', detail: ['Java', 'Spring boot', 'JWT', 'AWS S3', 'MySQL'] },
            {
                type: 'Front-end',
                detail: ['ReactJS', 'ElectronJS', 'TailwindCSS', 'Material UI', 'QR code', 'Redux toolkit'],
            },
            { type: 'Deploy', detail: ['Netlify', 'Heroku'] },
        ],
        src: [],
        demo: '',
    },
];
