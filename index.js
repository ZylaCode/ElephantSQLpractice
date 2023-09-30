import express from 'express';
import userRouter from './routers/userRoutes.js';
import orderRouter from './routers/orderRoutes.js';
import 'dotenv/config';
import orderByUserRouter from './routers/orderByUserRouter.js';

const app = express();

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/orderByUser', orderByUserRouter);

// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });

// app.get("/time", async (req, res) => {
//  try{
//     const {rows} = await pool.query('SELECT NOW()');
//     res.json(rows[0])
//  }catch(err){
//     res.status(500).json(err)
//  }
// });


const port = process.env.PORT || 8000;

app.listen(port, () => {
 console.log(`Server listening on port ${port}`)
});

