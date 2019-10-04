const router = require('express').Router();
const projects = require('../data/helpers/projectModel');

/* curent path is /api/projects/* */

router.use('/:id', validateId);

// Routes

router.route('/')
    // Get all projects
    .get((req, res) => {
        projects.get()
            .then(projects => res.status(200).json(projects))
            .catch(err => res.status(500).json({ error: "failed reading information from db" }))
    })
    // Add new project
    .post(validateProject, ({ newProject }, res) => {
        projects.insert(newProject)
            .then(project => res.status(201).json(project))
            .catch(err => res.status(500).json({ error: `failed creating project` }))
    })

router.route('/:id')
    // Get by ID
    .get(({ project }, res) => {
        res.status(200).json(project);
    })
    // Update by ID
    .put(validateProject, ({ newProject, id }, res) => {
        projects.update(id, newProject)
            .then(project => res.status(201).json(project))
            .catch(err => res.status(500).json({ error: `failed updating project ${id}` }))
    })
    // Delete by ID
    .delete(({ project, id }, res) => {
        projects.remove(id)
            .then(() => res.status(200).json(project))
            .catch(err => res.status(500).json({ error: `failed deleting project ${id} from db` }))
    })

// Get all project actions
router.get('/:id/actions', ({ id }, res) => {
    projects.getProjectActions(id)
        .then(actions => res.status(200).json(actions))
        .catch(err => res.status(500).json({ error: `failed reading actions from db for project ${id}` }))
})

// Define MiddleWare

async function validateId(req, res, next) {
    project = await projects.get(req.params.id);
    if (project) {
        req.id = req.params.id
        req.project = project;
        next();
    } else {
        res.status(404).json({ message: "Project not found" })
    }
}

function validateProject(req, res, next) {
    const { body } = req;
    const { name, description, completed } = body;
    if (name && description) {
        console.log(typeof completed)
        req.newProject = { name, description, completed: completed ? true : false };
        next();
    } else {
        res.send(400).json({ errorMessage: `please provide a ${(!name) ? 'name' : 'description'}` })
    }
}

module.exports = router;