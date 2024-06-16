import imgLCN from '~/assets/img/lcn.png';
import img2TMovies from '~/assets/img/2tmovies.png';

export const dataProject = [
    {
        name: 'Online messaging apps',
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
