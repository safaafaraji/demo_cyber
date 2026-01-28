class EncryptionService {
    encrypt(data) {
        // Mock
        return Buffer.from(data).toString('base64');
    }

    decrypt(data) {
        return Buffer.from(data, 'base64').toString('ascii');
    }
}

module.exports = new EncryptionService();
