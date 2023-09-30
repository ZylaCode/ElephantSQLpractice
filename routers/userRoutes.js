import express from 'express';
const userRouter = express.Router();
// import {query, validationResult} from 'express-validator';
import pg from 'pg';
const {Pool} = pg;

const pool = new Pool();

userRouter.get("/", async (req, res) => {
 try{
    const {rows} = await pool.query('SELECT * from users');
    res.json(rows)
 }catch(err){
    res.status(500).json(err)
 }
});

// GET  /:id :  To get one user (with the id) 
userRouter.get("/:id", async (req, res) => {
   const id = req.params.id;
 try{
    const {rows} = await pool.query('SELECT * from users WHERE id=$1;', [id]);
    res.json(rows)
 }catch(err){
    res.status(500).json(err)
 }
});

// POST / -> To create a new user 
userRouter.post("/", (req, res) => {
   const {first_name, last_name, age} = req.body;
   pool.query('INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;', [first_name, last_name, age])
   .then(data => res.status(201).json(data))
   .catch(e => res.sendStatus(404)); 
});
// PUT /:id  :  To edit one user (with the id) 
userRouter.put("/:id", async (req, res) => {
   const id = req.params.id;
   const {first_name, last_name, age} = req.body;
    try {
        const {rows} = await pool.query('UPDATE users SET first_name=$1 last_name=$2 age=$3 WHERE id=$4 RETURNING *;', [first_name, last_name, age, id]);
        res.json(rows[0])
    } catch(err){
        res.status(500).json(err)
    }
});
// DELETE  /:id : To delete one user (with the id)
userRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
      const {rows} = await pool.query('DELETE FROM users WHERE id=$1;', [id])
   res.json(rows[0])
    } catch(err){
        res.status(500).json(err)
    }
});

export default userRouter;