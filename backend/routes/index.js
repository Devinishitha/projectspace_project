import express from 'express';
import joi from 'joi';
import mongoose from 'mongoose';
import Project from '../models/index.js';

const api = express.Router();

api.get('/projects', async (req, res) => {
    try {
        const data = await Project.find({}, { task: 0, __v: 0, updatedAt: 0 });
        return res.send(data);
    } catch (error) {
        return res.send(error);
    }
});

api.get('/project/:id', async (req, res) => {
    if (!req.params.id) res.status(422).send({ data: { error: true, message: 'Id is required' } });
    try {
        const data = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }).sort({ order: 1 });
        return res.send(data);
    } catch (error) {
        return res.send(error);
    }
});

api.post('/project', async (req, res) => {
    const projectSchema = joi.object({
        title: joi.string().min(3).max(200).required(),
        description: joi.string().required(),
    });

    const { error, value } = projectSchema.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error);

    try {
        const data = await new Project(value).save();
        res.send({ data: { title: data.title, description: data.description, updatedAt: data.updatedAt, _id: data._id } });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(422).send({ data: { error: true, message: 'Title must be unique' } });
        } else {
            return res.status(500).send({ data: { error: true, message: 'Server error' } });
        }
    }
});

api.put('/project/:id', async (req, res) => {
    const projectSchema = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = projectSchema.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error);

    try {
        const data = await Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { ...value }, { upsert: true });
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

api.delete('/project/:id', async (req, res) => {
    try {
        const data = await Project.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

// Task-related routes
api.post('/project/:id/task', async (req, res) => {
    if (!req.params.id) return res.status(500).send('Server error');

    const taskSchema = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = taskSchema.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error);

    try {
        const [{ task }] = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { "task.index": 1 }).sort({ 'task.index': 1 });

        let countTaskLength = [task.length, task.length > 0 ? Math.max(...task.map(o => o.index)) : task.length];

        const data = await Project.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            { $push: { task: { ...value, stage: "Requested", order: countTaskLength[0], index: countTaskLength[1] + 1 } } }
        );
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

api.get('/project/:id/task/:taskId', async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send('Server error');

    try {
        let data = await Project.find(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            {
                task: {
                    $filter: {
                        input: "$task",
                        as: "task",
                        cond: {
                            $in: ["$$task._id", [mongoose.Types.ObjectId(req.params.taskId)]]
                        }
                    }
                }
            }
        );
        if (data[0].task.length < 1) return res.status(404).send({ error: true, message: 'Record not found' });
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

api.put('/project/:id/task/:taskId', async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send('Server error');

    const taskSchema = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = taskSchema.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error);

    try {
        const data = await Project.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id), task: { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.taskId) } } },
            { $set: { "task.$.title": value.title, "task.$.description": value.description } }
        );
        return res.send(data);
    } catch (error) {
        return res.send(error);
    }
});

api.delete('/project/:id/task/:taskId', async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send('Server error');

    try {
        const data = await Project.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            { $pull: { task: { _id: mongoose.Types.ObjectId(req.params.taskId) } } }
        );
        return res.send(data);
    } catch (error) {
        return res.send(error);
    }
});

api.put('/project/:id/todo', async (req, res) => {
    let todo = [];

    for (const key in req.body) {
        for (const index in req.body[key].items) {
            req.body[key].items[index].stage = req.body[key].name;
            todo.push({ name: req.body[key].items[index]._id, stage: req.body[key].items[index].stage, order: index });
        }
    }

    todo.map(async (item) => {
        await Project.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id), task: { $elemMatch: { _id: mongoose.Types.ObjectId(item.name) } } },
            { $set: { "task.$.order": item.order, "task.$.stage": item.stage } }
        );
    });

    res.send(todo);
});

export default api;
