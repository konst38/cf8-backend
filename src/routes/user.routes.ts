import { Router } from "express"
import * as userCtrl from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { validateObjectId } from "../middlewares/validateObjectId.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { hasAdminRole } from "../middlewares/user.middleware";

const router = Router();

/**
 * @openapi
 * /users:
 *  get:
 *    summary: List of all users
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Response list of users 
 *      404:
 *        description: Users not found
 *      401:
 *        description: Not authenticated 
 */
router.get("/",   authenticate,  
   userCtrl.list);


/**
 * @openapi
 * /users/{userId}:
 *  get:
 *    summary: Get a specific user
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The ID of the user
 *        schema:
 *          type: string 
 *    responses:
 *      200:
 *        description: Response user with specific id 
 *      404:
 *        description: User not found 
 *      401:
 *        description: Not authenticated 
 */
router.get('/:id', authenticate , 
 validateObjectId('id'), userCtrl.getOne);

/**
 * @openapi
 * /users:
 *  post:
 *    summary: Creates a user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema: 
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              firstname:
 *                type: string
 *              lastname:
 *                type: string
 *              email:
 *                type: string
 *              address:
 *                type: object
 *                properties:
 *                  area:
 *                    type: string
 *                  street:
 *                    type: string
 *                  number:
 *                    type: string
 *              phone:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    type:
 *                      type: string               
 *                    number:
 *                      type: string
 *              roles:
 *                 type: array
 *                 items:
 *                   type: string                 
 *    responses: 
 *      201:
 *        description: User created  
 *      400:
 *        description: User not created
 */
router.post("/", validate(createUserSchema), userCtrl.create);

/**
 * @openapi
 * /users/{userId}:
 *  put:
 *    summary: Modifies a user
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The ID of the user
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema: 
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              firstname:
 *                type: string
 *              lastname:
 *                type: string
 *              email:
 *                type: string
 *              address:
 *                type: object
 *                properties:
 *                  area:
 *                    type: string
 *                  street:
 *                    type: string
 *                  number:
 *                    type: string
 *              phone:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    type:
 *                      type: string               
 *                    number:
 *                      type: string
 *              roles:
 *                 type: array
 *                 items:
 *                   type: string                               
 *    responses: 
 *      200:
 *        description: User modified 
 *      404:
 *        description: User not found
 *      401:
 *        description: Not authenticated 
 */
router.put('/:id', authenticate, 
 validate(updateUserSchema), validateObjectId('id'), userCtrl.update);

 /**
 * @openapi
 * /users/{userId}:
 *  delete:
 *    summary: Deletes a user
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The ID of the user
 *        schema:
 *          type: string
 *    responses: 
 *      204:
 *        description: User deleted 
 *      404:
 *        description: User not found
 *      403:
 *        description: Insufficient permissions 
 *      401:
 *        description: Not authenticated
 */
 router.delete('/:id',  authenticate, hasAdminRole,
 validateObjectId('id'), userCtrl.remove);

export default router;
