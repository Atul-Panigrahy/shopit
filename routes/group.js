const express = require("express");
const Groups = require('../models/group');
const jwt_decode = require('jwt-decode');
const groupRouter = express.Router();
groupRouter.use(express.json());


groupRouter.route('/')
    .get((req,res,next)=>{
        const decoded = jwt_decode(req.cookies['access-token-myntra']);
        const userId = decoded.id;
        Groups.find({adminId: userId})
            .then((groups)=>{
                res.status(200).header('Content-Types','Application/json').json(groups);
            })
            .catch((err)=>{
                res.status(400).send(err);
            })

    })
    .post((req,res,next)=>{
        const decoded = jwt_decode(req.cookies['access-token-myntra']);
        const userId = decoded.id;
        if(!userId){
            res.status(400).json("Login to the website");
        }
        const {name , code } = req.body;

        const group = new Groups();
        group.name = name;
        group.adminId = userId;
        group.setCode(code);
        group.save((err,result)=>{
            if (err) { 
                return res.status(400).send({ 
                    message : "Failed to create group"
                }); 
            } 
            else { 
                return res.status(201).send({ 
                    message : "Group Created successfully"
                }); 
            } 
        })
    })
    

groupRouter.route('/:groupId')
    .get((req,res,next)=>{
        Groups.findById(req.params.groupId)
            .then((group)=>{
                res.status(200).header('Content-Types','Application/json').json(group);
            })
            .catch((err)=>{
                res.status(400).json(err);
            })
    })
    .post((req,res,next)=>{
        res.status(400).json("Post operation is not allowed");
    })
    .put((req,res,next)=>{
        res.status(400).json("PUT operation is not allowed");
    })
    .delete((req,res,next)=>{
        Groups.findByIdAndRemove(req.params.groupId)
            .then((result)=>{
                res.status(200).json("Deletion of group successful");
            })
            .catch((err)=>{
                res.status(400).json(err);
            })
    })


module.exports = groupRouter;