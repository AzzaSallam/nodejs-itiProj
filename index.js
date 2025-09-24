import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import  connectDB  from './config/db.js';
import AppError from './utils/AppError.js';
import productsRoutes from './routes/productsRoutes.js';
import usersRoutes from './routes/userRoutes.js';
import cartRoute from './routes/cartRoutes.js';
import ordersRoute from './routes/ordersRoutes.js';

dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 8000;

//Database connection
connectDB()


//Logs every request that hits server in console.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//MiddleWare
app.use(cors()) //in production put frontend domain in origin atrr , but by default '*'
app.use(express.json());

app.use("/uploads", express.static("uploads"));


//Routes
app.get('/', (req, res) => {
  res.send('Hello, In Our Store!');
});
app.use('/products' , productsRoutes);
app.use('/users' , usersRoutes) ;
app.use('/users/cart' , cartRoute) ;
app.use('/users/orders' , ordersRoute) ;




//not found routes
app.use((req,res,next)=>{
  next(new AppError(404,`can't find ${req.originalUrl} on this server`))
})

//error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}.`
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});


//Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});