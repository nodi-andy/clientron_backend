import express from 'express';
import mongoose from 'mongoose';

import ProfileModel from '../models/ProfileModel.js';
import ClientModel from '../models/ClientModel.js';
import User from '../models/userModel.js'

const router = express.Router();

export const getProfiles = async (req, res) => {
  try {
      const allProfiles = await ProfileModel.find().sort({ _id: -1 });
      res.status(200).json(allProfiles);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}

export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
      const profile = await ProfileModel.findById(id);
      res.status(200).json(profile);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}

export const createProfile = async (req, res) => {

  console.log("createProfile: " + JSON.stringify(req.body));
  try {
    const newProfile = new User({
      name: req.body.name,
      email: req.body.email,
      password: "google",
      customers: [],
      contactAddress: req.body.contactAddress,
      createdAt: new Date().toISOString() 
    })
    console.log("createProfile: " + JSON.stringify(newProfile));
    const existingUser = await User.findOne({ email: newProfile.email })

    if(existingUser) {
      console.log("existingUser: " + existingUser);
      res.status(201).json(existingUser );
    } else {
      await newProfile.save();
      console.log("newUser: " + newProfile);
      res.status(201).json(newProfile );
    }

  } catch (error) {
    console.log("ERROR: " + error.message);
    res.status(409).json({ message: error.message });
  }
}

export const getProfilesByUser = async (req, res) => {
  const { searchQuery } = req.query;

  try {
      const profile = await User.findById(mongoose.Types.ObjectId(searchQuery));
      console.log("getProfileByUserID: " + searchQuery);
      console.log(profile);
      res.json({ data: profile });
  } catch (error) {    
      res.status(404).json({ message: error.message });
  }
}

export const getUserCustomers = async (req, res) => {
  const { searchQuery } = req.query;

  try {
      const profile = await ProfileModel.findOne({ email: searchQuery });
      const customers = await ClientModel.find({ number: { $in: profile.customers } });
      console.log("getUserCustomers: ");
      console.log(searchQuery);
      console.log(profile.customers);
      console.log(customers);
      res.json({ data: customers });
  } catch (error) {    
      res.status(404).json({ message: error.message });
  }
}


export const getProfilesBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
      const name = new RegExp(searchQuery, "i");
      const email = new RegExp(searchQuery, "i");

      const profiles = await ProfileModel.find({ $or: [ { name }, { email } ] });

      res.json({ data: profiles });
  } catch (error) {    
      res.status(404).json({ message: error.message });
  }
}


export const updateProfile = async (req, res) => {
  try {
    const { id: _id } = req.params
    const profile = req.body
    console.log("updateProfile: " + JSON.stringify(profile));
    //const userModel = new User();
    const existingUser = await User.updateOne({ password: profile.password, email: profile.email, name: profile.name }, {$set: profile})
    console.log("existing user: " + JSON.stringify(existingUser));

    //await User.save();
    res.json(existingUser)
  } catch (error) {    
    console.log("ERROR: " + error.message);
    res.status(404).json({ message: error.message });
}
}


export const deleteProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No profile with id: ${id}`);

  await ProfileModel.findByIdAndRemove(id);

  res.json({ message: "Profile deleted successfully." });
}
