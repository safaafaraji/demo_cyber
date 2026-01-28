const mongoose = require('mongoose');
const User = require('../../models/User.model');
const Lab = require('../../models/Lab.model');
const LabCategory = require('../../models/LabCategory.model');
const { hashPassword } = require('../../utils/hashHelper.util');
require('dotenv').config({ path: '../../.env' });

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cyber-range');

    // Clear DB
    await User.deleteMany({});
    await Lab.deleteMany({});
    await LabCategory.deleteMany({});

    // Seed Categories
    const webCat = await LabCategory.create({ name: 'Web Security', description: 'Web vulnerabilities' });
    const netCat = await LabCategory.create({ name: 'Network Security', description: 'Network protocol attacks' });
    const cryptoCat = await LabCategory.create({ name: 'Cryptography', description: 'Encryption weaknesses' });
    const forenCat = await LabCategory.create({ name: 'Forensics', description: 'Digital investigation' });

    // Seed User
    const hashedPassword = await hashPassword('admin123');
    await User.create({
        username: 'admin',
        email: 'safaafaraji01@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        stats: { labsCompleted: 5, points: 1250 }
    });

    // Seed Labs
    const labs = [
        {
            name: 'SQL Injection Basic',
            description: 'Learn how to exploit a basic SQL injection vulnerability in a login form to bypass authentication.',
            difficulty: 'easy',
            category: webCat._id,
            dockerImage: 'cyber-range/sqli-basic',
            points: 100,
            flag: 'FLAG-SQLI-EASY-123'
        },
        {
            name: 'XSS Reflected',
            description: 'Execute malicious JavaScript in a victim\'s browser by reflecting input back to the page.',
            difficulty: 'easy',
            category: webCat._id,
            dockerImage: 'cyber-range/xss-reflected',
            points: 100,
            flag: 'FLAG-XSS-REFLECT-999'
        },
        {
            name: 'Command Injection',
            description: 'Exploit a vulnerable web shell to execute arbitrary system commands on the server.',
            difficulty: 'medium',
            category: webCat._id,
            dockerImage: 'cyber-range/cmd-injection',
            points: 250,
            flag: 'FLAG-CMD-INJ-555'
        },
        {
            name: 'FTP Bruteforce',
            description: 'Crack weak FTP passwords using dictionary attacks.',
            difficulty: 'easy',
            category: netCat._id,
            dockerImage: 'cyber-range/ftp-weak',
            points: 150,
            flag: 'FLAG-FTP-BRUTE-111'
        },
        {
            name: 'Telnet Weak Auth',
            description: 'Intercept and decode unencrypted Telnet traffic to find credentials.',
            difficulty: 'medium',
            category: netCat._id,
            dockerImage: 'cyber-range/telnet-sniff',
            points: 200,
            flag: 'FLAG-TELNET-CLEAR-222'
        },
        {
            name: 'Weak RSA',
            description: 'Recover the private key from a public key generated with weak prime numbers.',
            difficulty: 'hard',
            category: cryptoCat._id,
            dockerImage: 'cyber-range/weak-rsa',
            points: 500,
            flag: 'FLAG-RSA-WEAK-777'
        },
        {
            name: 'Memory Dump Analysis',
            description: 'Analyze a RAM dump to find hidden processes and passwords.',
            difficulty: 'expert',
            category: forenCat._id,
            dockerImage: 'cyber-range/mem-dump',
            points: 1000,
            flag: 'FLAG-MEM-DUMP-888'
        }
    ];

    await Lab.insertMany(labs);

    console.log('Database seeded!');
    process.exit();
}

seed();
