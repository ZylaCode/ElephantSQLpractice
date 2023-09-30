import express from 'express';
import pg from 'pg';
import 'dotenv/config';


const app = express();
const {Pool} = pg;

app.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.get("/time", async (req, res) => {
 try{
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0])
 }catch(err){
    res.status(500).json(err)
 }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
 console.log(`Server listening on port ${port}`)
});

