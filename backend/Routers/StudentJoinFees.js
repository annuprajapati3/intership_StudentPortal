const express = require('express');
const Router = express.Router();
const Fees = require('../model/Fees');
const student = require('../model/Student');
Router.get('/feeDetails' ,async (req,res)=>{
    const data = await Fees.aggregate([
        {
            $lookup : {
                from :  'students',
                localField :  'rollNumber',
                foreignField :  'rollNumber',
                as :  'studentsDetails',
            }
        }
    ])
    res.send(data);
})
module.exports = Router;