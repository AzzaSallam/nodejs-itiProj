import express from 'express' ;
import { getAllUsers , addUser , deleteUser, editUser, login, register, forgotPassword, resetPassword} from '../controllers/userController.js';
import { validateMiddleWare } from '../middlewares/validationMiddleware.js';
import { userSchema } from './../validation/userValidation.js';
import { authMiddleware, restrictTo } from '../middlewares/authMiddleware.js';


const router = express.Router();

// /users
router.route('/')
  .get(getAllUsers)     
  .post(validateMiddleWare(userSchema),addUser);  

  router.post('/login' , login) ;
  router.post("/register", register);
  router.post("/forgotPassword" , forgotPassword);
  router.post("/resetPassword", resetPassword);

// /users/:id
router.route('/:id')
  .patch(authMiddleware , restrictTo('user' , 'seller' , 'admin'),editUser)         
  .delete(authMiddleware , restrictTo('user' , 'seller' , 'admin'),deleteUser); 


export default router ;