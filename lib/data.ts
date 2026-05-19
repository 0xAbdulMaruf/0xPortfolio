import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'abdulmaruf9024@gmail.com',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi MaruF, I am reaching out to you because...',

    oldPortfolio: '',
    upworkProfile: '',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/0xAbdulMaruf' },
    { name: 'instagram', url: 'https://www.instagram.com/_0xmaruf' },
];

export const MY_STACK = {
    security: [
        {
            name: 'Web Application Security',
            icon: '/logo/web-security.svg',
        },
        {
            name: 'Reconnaissance',
            icon: '/logo/recon.svg',
        },
        {
            name: 'Exploitation',
            icon: '/logo/exploit.svg',
        },
        {
            name: 'Vulnerability Analysis',
            icon: '/logo/vuln.svg',
        },
        {
            name: 'Penetration Testing',
            icon: '/logo/pentest.svg',
        },
    ],
    tools: [
        {
            name: 'Nmap',
            icon: '/logo/nmap.svg',
        },
        {
            name: 'Burp Suite',
            icon: '/logo/burp.svg',
        },
        {
            name: 'Metasploit',
            icon: '/logo/metasploit.svg',
        },
        {
            name: 'Wireshark',
            icon: '/logo/wireshark.svg',
        },
    ],
    programming: [
        {
            name: 'Python',
            icon: '/logo/python.svg',
        },
        {
            name: 'Bash',
            icon: '/logo/bash.svg',
        },
        {
            name: 'SQL',
            icon: '/logo/sql.svg',
        },
    ],
    platforms: [
        {
            name: 'Kali Linux',
            icon: '/logo/kali.svg',
        },
        {
            name: 'Ubuntu',
            icon: '/logo/ubuntu.svg',
        },
    ],
};

export const PROJECTS: IProject[] = [];

export const MY_EXPERIENCE = [
    {
        title: 'Cybersecurity Student',
        company: 'Computer Science Program',
        duration: '2023 - Present',
    },
    {
        title: 'Bug Hunter',
        company: 'Independent Security Researcher',
        duration: '2024 - Present',
    },
];

export const CTF_WRITEUPS = [
    {
        title: 'TryHackMe - Blue',
        platform: 'TryHackMe',
        difficulty: 'Easy',
        category: 'Windows',
        description: 'Room focused on EternalBlue exploit (MS17-010). Gained initial access via SMB vulnerability and escalated to SYSTEM.',
        link: '#',
    },
    {
        title: 'HackTheBox - Lame',
        platform: 'HackTheBox',
        difficulty: 'Easy',
        category: 'Linux',
        description: 'Exploited Samba username map script vulnerability (CVE-2007-2447) to gain root access on the target machine.',
        link: '#',
    },
    {
        title: 'TryHackMe - Kenobi',
        platform: 'TryHackMe',
        difficulty: 'Medium',
        category: 'Linux',
        description: 'Enumerated Samba shares, exploited ProFTPD mod_copy, and used path privilege escalation via SUID binary.',
        link: '#',
    },
    {
        title: 'PicoCTF - Web Gauntlet',
        platform: 'PicoCTF',
        difficulty: 'Medium',
        category: 'Web',
        description: 'Bypassed multiple SQL injection filters across several rounds to extract the flag from a login form.',
        link: '#',
    },
];

export const CVE_LIST = [
    {
        id: 'CVE-2024-52316',
        title: 'Apache Tomcat - Authentication Bypass via Jakarta Authentication',
        severity: 'Critical',
        cvss: '9.8',
        description: 'Authentication bypass when using Jakarta Authentication (formerly JASPIC) with certain configurations. If a system property is not set, attackers can bypass authentication entirely on affected Tomcat versions.',
        status: 'Published',
    },
    {
        id: 'CVE-2024-38286',
        title: 'Apache Tomcat - DoS via TLS Handshake Manipulation',
        severity: 'High',
        cvss: '8.1',
        description: 'Denial of service vulnerability through TLS handshake manipulation causing out-of-memory errors. Affects Apache Tomcat 9.0.0-M1 to 9.0.89, 10.1.0-M1 to 10.1.19, and 11.0.0-M1 to 11.0.0-M15.',
        status: 'Published',
    },
    {
        id: 'CVE-2024-34750',
        title: 'Apache Tomcat - HTTP/2 Stream Error Handling',
        severity: 'High',
        cvss: '7.5',
        description: 'HTTP/2 handling error causing request mix-ups or timeouts under high concurrency. Improper stream reset handling leads to misrouted responses between concurrent connections.',
        status: 'Published',
    },
    {
        id: 'CVE-2024-27876',
        title: 'phpMyAdmin - SQL Injection via Crafted Parameters',
        severity: 'Medium',
        cvss: '5.4',
        description: 'SQL injection vulnerability through specially crafted request parameters. Authenticated users can manipulate queries to access or modify data beyond their authorized scope.',
        status: 'Published',
    },
    {
        id: 'CVE-2025-24489',
        title: 'phpMyAdmin - XSS in Transformation Feature',
        severity: 'Medium',
        cvss: '5.4',
        description: 'Cross-site scripting vulnerability in the transformation feature affecting phpMyAdmin 4.x branch. Attackers can inject malicious code through transformation configuration parameters.',
        status: 'Published',
    },
];

export const HUNTING_REPORTS = [
    {
        title: 'Stored XSS in User Profile',
        platform: 'HackerOne',
        severity: 'Medium',
        bounty: '$500',
        description: 'Discovered stored XSS vulnerability in user profile bio field that executed on every page visit by other users.',
        link: '#',
    },
    {
        title: 'IDOR in API Endpoint',
        platform: 'Bugcrowd',
        severity: 'High',
        bounty: '$1,000',
        description: 'Insecure Direct Object Reference in account management API allowing access to other users\' sensitive data by modifying user ID parameter.',
        link: '#',
    },
    {
        title: 'Authentication Bypass via Race Condition',
        platform: 'HackerOne',
        severity: 'Critical',
        bounty: '$2,500',
        description: 'Race condition in password reset flow allowing account takeover by exploiting timing window in token validation.',
        link: '#',
    },
];
