import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const signIn = async (req,res)=>{
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email})
        if(!existingUser) res.status(404).json({message : "User not found"})

        const checkPassword = await bcrypt.compare(password, existingUser.password);
        if(!checkPassword) res.status(400).json({message : "Invalid credentials"})

        const token = jwt.sign({email : existingUser.email, id: existingUser._id},"samsquare" ,{expiresIn : "1h"})
        res.status(200).json({result : existingUser, token});
    } catch (error) {
        res.status(500).json({message : "something went wrong"})
    }
}

export const signUp = async (req, res) => {
  
  const { email, password, firstName, lastName } = req.body;
  // const user = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
    // const token = jwt.sign( { email: result.email, id: result._id }, "samsquare" , { expiresIn: "1h" } );

    // res.status(201).json({ result, token });
    res.status(201).json({message : "user created"});
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};
