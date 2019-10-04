const express = require('express');
const router = express.Router();
const projectsRouter = require('./routes/projects');
const actionsRouter = require('./routes/actions');
const cors = require('cors');

router.use(cors());
// Global MiddleWare
router.use(express.json());
router.use(express.urlencoded());
router.use(logger)

function logger(req, res, next) {
    console.log(`${(new Date()).toString()}: ${req.method} request -> ${req.path}`);
    next();
};

// Routing

router.use('/projects', projectsRouter)
router.use('/actions', actionsRouter)

module.exports = router