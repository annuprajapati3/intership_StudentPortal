const express = require('express');
const QR = require('qrcode');
const route = express.Router();
const Transaction = require('../model/Fees')
route.get('/qr' , async (req , res)=>{
    const text = 'AKGEC';
    const amount = req.query.amount;
    console.log(text);
    console.log(amount);
    if(!text || !amount){
        return res.status(400);
    }
    const data = `amount : ${amount} name:${text}`
    console.log(data);
    const image = await QR.toDataURL(data);
    res.send(image)
})
route.post('/transcation' , async(req,res)=>{
    const {amount, transactionId , rollNumber} = req.body;
    if(!amount || !transactionId || !rollNumber){
        res.status(400).json('please provide complete deatils');
    }
    const newTransaction = new Transaction({ transactionId, amount , rollNumber });
    await newTransaction.save();
    res.status(200).json('success');

})
module.exports = route;