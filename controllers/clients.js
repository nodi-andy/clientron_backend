import {createApiClient} from "@companieshouse/api-sdk-node";
import mongoose from 'mongoose'

import ClientModel from '../models/ClientModel.js'
import User from '../models/userModel.js'

const CH_API = process.env.CH_API
const api = createApiClient("fa69d90c-f70a-4d21-bd91-8f98486fccde");

export const getClient = async (req, res) => { 
    const { id } = req.query;
    console.log("Get client: " + JSON.stringify(id));

    try {
        const client = await ClientModel.findById(mongoose.Types.ObjectId(id));
        
        res.status(200).json(client);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getClients = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await ClientModel.countDocuments({});
        const clients = await ClientModel.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: clients, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const createClient = async (req, res) => {
    try {
        const client = req.body
        console.log("New client: " + JSON.stringify(client));
        //const clientModel = new ClientModel();
        const newClient = await ClientModel.updateOne({ number: client.number }, {...client, createdAt: new Date().toISOString() }, {upsert: true, new: true})
        console.log("created Client: " + JSON.stringify(newClient));

        const updatedUser = await User.updateOne({ email: client.userId[0] }, { $push: {customers: client.number} })
        console.log("user: " + JSON.stringify(updatedUser));


        await clientModel.save();
        res.status(201).json(updatedUser);
    } catch (error) {
        console.log(error.message);
        res.status(409).json(error.message)
    }
}

export const searchClient = async (req, res) => {

    const client = req.body

    try {
        const profile = await api.alphabeticalSearch.getCompanies(client.name, "Req01", null, client.name);
    
        console.log("Search client: " + client.name)
        console.log(profile);
        console.log(profile.resource.items[0]);
        console.log(profile.resource.items[1]);
        console.log(profile.resource.items[2]);
        console.log(profile.resource.items[3]);
        //await newClient.save()
        res.status(201).json(profile.resource.items)
    } catch (error) {
        res.status(409).json(error.message)
    }
}

export const getClientProp = async (req, res) => {
    const { id } = req.query;
    console.log("Get client: " + JSON.stringify(id));

    try {
        const {resource} = await api.companyProfile.getCompanyProfile(id);
        console.log("getClientProp: " + JSON.stringify(resource.accounts.nextDue))
        res.status(201).json(resource.accounts.nextDue)
    } catch (error) {
        res.status(409).json(error.message)
    }
}

export const updateClient = async (req, res) => {
    const { id: _id } = req.params
    const client = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No client with that id')

    const updatedClient = await ClientModel.findByIdAndUpdate(_id, {...client, _id}, { new: true})

    res.json(updatedClient)
}


export const deleteClient = async (req, res) => {
    try {
        const client = req.body
        console.log("deleteClient:", client)
        const updatedUser = await User.updateOne({ email: client.userId[0] }, { $pull: {customers: client.number} })
        console.log("user: " + JSON.stringify(updatedUser));

        res.json({message: 'Client deleted successfully'})
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}


export const getClientsByUser = async (req, res) => {
    const { searchQuery } = req.query;
    console.log("getClientsByUser:", searchQuery)
    try {
        const profile = await User.findOne({ email: searchQuery });
        const customers = await ClientModel.find({ number: { $in: profile.customers } });
        console.log("getUserCustomers: " + searchQuery);
        console.log(profile.customers);
        console.log(customers);
        res.json({ data: customers });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

