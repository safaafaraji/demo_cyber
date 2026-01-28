const LabManager = require('../services/core/LabManager.service');

const getLabs = async (req, res, next) => {
    try {
        const labs = await LabManager.getAllLabs();
        // Ideally we should augment labs with "completed" status for the user
        // ensuring we don't leak the flag
        res.json(labs);
    } catch (error) {
        next(error);
    }
};

const createLab = async (req, res, next) => {
    try {
        const lab = await LabManager.createLab(req.body);
        res.status(201).json(lab);
    } catch (error) {
        next(error);
    }
};

const getLabById = async (req, res, next) => {
    try {
        const lab = await LabManager.getLabById(req.params.id);
        if (!lab) return res.status(404).json({ message: 'Lab not found' });
        res.json(lab);
    } catch (error) {
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await LabManager.getAllCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

const verifyFlag = async (req, res, next) => {
    try {
        const { flag } = req.body;
        const result = await LabManager.verifyFlag(req.user._id, req.params.id, flag);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLabs,
    createLab,
    getLabById,
    getCategories,
    verifyFlag
};
