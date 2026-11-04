import imgAWS from '~/assets/img/aws.webp';
import imgFigma from '~/assets/img/figma.svg';
import imgGit from '~/assets/img/git.svg';
import imgJava from '~/assets/img/java.svg';
import imgJS from '~/assets/img/js.webp';
import imgMongoDB from '~/assets/img/mongodb.webp';
import imgMUI from '~/assets/img/mui.webp';
import imgMySql from '~/assets/img/mysql.webp';
import imgNestJS from '~/assets/img/nestjs.webp';
import imgNextJS from '~/assets/img/nextjs.webp';
import imgNodeJS from '~/assets/img/nodejs.webp';
import imgReactJS from '~/assets/img/reactjs.webp';
import imgSpring from '~/assets/img/spring.webp';
import imgSqlServer from '~/assets/img/sqlserver.webp';
import imgTailwind from '~/assets/img/tailwind.webp';
import imgTypeScript from '~/assets/img/typescript.webp';

export const skillGroups = [
    {
        name: 'Back-end',
        items: [
            { name: 'NestJS', img: imgNestJS },
            { name: 'Node.js', img: imgNodeJS },
            { name: 'Java', img: imgJava },
            { name: 'Spring', img: imgSpring },
            { name: 'SQL Server', img: imgSqlServer },
            { name: 'MySQL', img: imgMySql },
            { name: 'MongoDB', img: imgMongoDB },
        ],
    },
    {
        name: 'Front-end',
        items: [
            { name: 'Next.js', img: imgNextJS },
            { name: 'JavaScript', img: imgJS },
            { name: 'React', img: imgReactJS },
            { name: 'Tailwind', img: imgTailwind },
            { name: 'MUI', img: imgMUI },
        ],
    },
    {
        name: 'Other',
        items: [
            { name: 'TypeScript', img: imgTypeScript },
            { name: 'Git', img: imgGit },
            { name: 'Figma', img: imgFigma },
            { name: 'AWS', img: imgAWS },
        ],
    },
];
