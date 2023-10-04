import express from 'express';
const orderRouter = express.Router();
import pool from './pool.js';


// GET  /  : To get all the orders 
orderRouter.get("/", async (req, res) => {
 try{
    const {rows} = await pool.query('SELECT * from orders');
    res.json(rows)
 }catch(err){
    res.status(500).json(err)
 }
});

// GET  /:id :  To get one order (with the id) 
orderRouter.get("/:id", async (req, res) => {
   const id = req.params.id;
 try{
    const {rows} = await pool.query('SELECT * from orders WHERE id=$1;', [id]);
    res.json(rows)
 }catch(err){
    res.status(500).json(err)
 }
});

// POST / -> To create a new order
orderRouter.post("/", (req, res) => {
   const {price, data, userId} = req.body;
   pool.query('INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *;', [price, data, userId])
   .then(data => res.status(201).json(data))
   .catch(e => res.sendStatus(404)); 
});

// PUT /:id  :  To edit one order (with the id) 
orderRouter.put("/:id", (req, res) => {
   const id = req.params.id;
   const {price, data, userId} = req.body;
   pool.query('UPDATE orders SET price=$1 data=$2 user_id=$3 WHERE id=$4 RETURNING *;', [price, data, userId, id])
    res.json(rows[0])
   .then(data => res.status(201).json(data))
   .catch(e => res.sendStatus(404));
});

// DELETE  /:id : To delete one order (with the id) 
orderRouter.delete("/:id", (req, res) => {
const id = req.params.id;
pool.query('DELETE FROM orders WHERE id=$1;', [id])
    res.json(rows[0])
.then(data => res.status(201).json(data))
.catch(e => res.sendStatus(404))
});

export default orderRouter;