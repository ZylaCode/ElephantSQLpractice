import express from 'express';
const userRouter = express.Router();
import {body, validationResult} from 'express-validator';
import pool from './pool.js';

const userValidation = [
    body('first_name').isString().notEmpty(),
    body('last_name').isString().notEmpty(),
    body('age').isInt({ min: 18 }),
];

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
    if (!rows.length){
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows);
 }catch(err){
    res.status(500).json(err)
 }
});

// POST / -> To create a new user 
// Send a status code of 400 (bad request) if no firstname or lastname is present in the body of the request
// Implement express-validator (or any other validation middleware) to validate/sanitize the input sent by the client

userRouter.post("/", userValidation, (req, res) => {
   const {first_name, last_name, age} = req.body;
   if (!first_name.length){
      return res.status(400).json({message: "First name not valid."});
   } else if (!last_name.length){
      return res.status(400).json({message: "Last name is not valid."});
   }
   pool.query('INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;', [first_name, last_name, age])
   .then(data => res.status(201).json(data))
   .catch(e => res.sendStatus(404)); 
});


// PUT /:id  :  To edit one user (with the id) 
userRouter.put("/:id", async (req, res) => {
   const id = req.params.id;
   const {first_name, last_name, age} = req.body;

if (!first_name.length){
   return res.status(400).json({ message: "First name not valid." });
}
if (!last_name.length){
      return res.status(400).json({ message: "Last name not valid." });
}
if (age < 18) {
   return res.status(400).json({message: "Age not valid."})
}
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
    //Check the existence of the target user in the database. If the user does not exist, send a status code of 404 (not found) back
    try {
      const {rows} = await pool.query('DELETE FROM users WHERE id=$1;', [id]);
      if (!rows){
      return res.status(404).json({ message: "User not found" });
    }
   res.json(rows[0])
    } catch(err){
        res.status(500).json(err)
    }
});

export default userRouter;