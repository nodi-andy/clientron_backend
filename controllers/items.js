import mongoose from 'mongoose'

import ItemModel from '../models/ItemModel.js'
import RequestModel from '../models/RequestModel.js'
import User from '../models/userModel.js'


export const getItem = async (req, res) => { 
    const { id, creator } = req.query
    console.log("Get item: " + id);

    try {
        let query = { _id: mongoose.Types.ObjectId(id) };

        if (creator) {
          query.creator = creator;
        }

        const item = await ItemModel.findOne(query).populate({
            path: 'requests',
            match: { state: 'open' }
        });
        console.log("Got item: " + JSON.stringify(item));
        res.status(200).json(item);
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(404).json({ message: error.message });
    }
}

export const getItems = async (req, res) => { 
    try {
        const filter = req.body
        console.log("Get items: " + JSON.stringify(filter));

        const items = await ItemModel.find(filter);
        
        res.status(200).json(items);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const addItem = async (req, res) => {
    try {
        const item = req.body
        console.log("New item: " + JSON.stringify(item));
        const newClient = await ItemModel.create({...item, createdAt: new Date().toISOString() })
        console.log("created item: " + JSON.stringify(newClient));

        //const updatedUser = await User.updateOne({ email: item.userId[0] }, { $push: {customers: item.number} })
        //console.log("user: " + JSON.stringify(updatedUser));


        await clientModel.save();
        res.status(201).json(updatedUser);
    } catch (error) {
        console.log(error.message);
        res.status(409).json(error.message)
    }
}

export const remItem = async (req, res) => {
    try {
        const { id } = req.query
        console.log("Rem item: " + JSON.stringify(id));
        const removedItem = await ItemModel.deleteOne({ _id: mongoose.Types.ObjectId(id) })

        console.log("Removed item: " + JSON.stringify(removedItem));

        //const updatedUser = await User.updateOne({ email: item.userId[0] }, { $push: {customers: item.number} })
        //console.log("user: " + JSON.stringify(updatedUser));

        res.status(201).json(removedItem);
    } catch (error) {
        console.log(error.message);
        res.status(409).json(error.message)
    }
}

export const updateItem = async (req, res) => {
    try {
        const item = req.body
        console.log("Update item: " + JSON.stringify(item));
        const updatedItem = await ItemModel.updateOne({ _id: mongoose.Types.ObjectId(item._id) }, item)
        console.log("updatedItem Client: " + JSON.stringify(updatedItem));

        //const updatedUser = await User.updateOne({ email: item.userId[0] }, { $push: {customers: item.number} })
        //console.log("user: " + JSON.stringify(updatedUser));


        res.status(201).json(updatedItem);
    } catch (error) {
        console.log(error.message);
        res.status(409).json(error.message)
    }
}

export const addRequest = async (req, res) => {
    try {
        const request = req.body
        console.log("New request: " + JSON.stringify(request));
        request.state = "open";
        const newRequest = new RequestModel(request);
        // Save the request to the database
        const savedRequest = await newRequest.save();

        // Find the item by its _id
        const foundItem = await ItemModel.findById(request.itemID);

        // Add the saved request's _id to the item's requests array
        foundItem.requests.push(savedRequest._id);

        // Save the modified item with the updated requests array
        const updatedItem = await foundItem.save();
        res.status(201).json(updatedItem);
    } catch (error) {
        console.log(error.message);
        res.status(409).json(error.message)
    }
}

export const updateRequest = async (req, res) => {
    try {
        const request = req.body
        console.log("Update Request: " + JSON.stringify(request));
        const updatedReq= await RequestModel.updateOne({ _id: mongoose.Types.ObjectId(request._id) }, request)
        console.log("updatedItem Client: " + JSON.stringify(updatedReq));

        res.status(201).json(updatedReq);
    } catch (error) {
        console.log(error.message);
        res.status(409).json(error.message)
    }
}

ItemModel.watch().on('change', data => console.log("OFFER CHANGED:" + JSON.stringify(data)));