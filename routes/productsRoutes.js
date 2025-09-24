
import express from 'express' ;

import {getAll , addNew , edit ,deleteProduct, searchProducts} from '../controllers/productController.js';
import { authMiddleware, restrictTo } from '../middlewares/authMiddleware.js';
import { productSchema } from './../validation/productValidation.js';
import { validateMiddleWare } from './../middlewares/validationMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import { optionalAuthMiddleware } from '../middlewares/optionalMiddleware.js';


 
const router = express.Router();



router.get("/", optionalAuthMiddleware, getAll);


router.use(authMiddleware);

router.post("/", restrictTo('seller'), validateMiddleWare(productSchema), upload.single("photo"), addNew);

router.get("/search", restrictTo('admin','user','seller'), searchProducts);

router.route('/:id')
  .patch(restrictTo('seller'), edit)
  .delete( restrictTo('seller'), deleteProduct);




export default router ;