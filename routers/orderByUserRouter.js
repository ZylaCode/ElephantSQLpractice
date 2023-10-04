import express from 'express';
import pool from './pool.js';
const orderByUserRouter = express.Router();


//Create a user route that will return all the orders of a user

orderByUserRouter.get('/:id/orders', async (req, res) => {
       const id = req.params.id;
 try{
    const {rows} = await pool.query('SELECT * from orders WHERE user_id=$1;', [id]);
    res.json(rows[0])
 }catch(err){
    res.status(500).json(err)
 }
});


// •	Create another user route that will set a user as inactive if he has never ordered anything:
// o	PUT /:id/check-inactive : If a user has never ordered, he should be set as inactive
// if id in users does not equal user_id in orders
// orderByUserRouter.put("/:id/check-inactive", (req, res) => {
//    const id = req.params.id;
//    const {active} = req.body;
//    if (pool.query('RETURNING *;', [active, id])
//    .then(data => res.status(201).json(data))
//    .catch(e=> res.sendStatus(404));
// });

export default orderByUserRouter;