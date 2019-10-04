const router = require('express').Router();
const actions = require('../data/helpers/actionModel');

/* curent path is /api/actions/* */

router.use('/:id', validateId);

// Routes

router.route('/')
    // Get all actions
    .get((req, res) => {
        actions.get()
            .then(actions => res.status(200).json(actions))
            .catch(err => res.status(500).json({ error: "failed reading information from db" }))
    })
    // Add new action
    .post(validateAction, ({ newAction }, res) => {
        actions.insert(newAction)
            .then(action => res.status(201).json(action))
            .catch(err =>  res.status(500).json({ error: `failed creating action` } ))
    })

router.route('/:id')
    // Get by ID
    .get(({ id }, res) => {
        actions.get(id)
            .then(action => res.status(200).json(action))
            .catch(err => res.status(500).json({ error: `failed reading information about action ${id} from db` }))
    })
    // Update by ID
    .put(validateAction, ({ newAction, id }, res) => {
        actions.update(id, newAction)
            .then(action => res.status(201).json(action))
            .catch(err => res.status(500).json({ error: `failed updating action ${id}` }))
    })
    // Delete by ID
    .delete(({ action, id }, res) => {
        actions.remove(id)
            .then(() => res.status(200).json(action))
            .catch(err => res.status(500).json({ error: `failed deleting action ${id} from db` }))
    })

// Define MiddleWare

async function validateId(req, res, next) {
    action = await actions.get(req.params.id);
    if (action) {
        req.id = req.params.id
        req.action = action;
        next();
    } else {
        res.status(404).json({ message: "action not found" })
    }
}

function validateAction(req, res, next) {
    const { body } = req;
    const { description, completed, project_id, notes } = body;
    if (description && notes && project_id) {
        console.log(typeof completed)
        req.newAction = { project_id, notes, description, completed: completed ? true : false };
        next();
    } else {
        res.send(400).json({ errorMessage: `please provide a ${(!name) ? 'name' : 'description'}` })
    }
}

module.exports = router;