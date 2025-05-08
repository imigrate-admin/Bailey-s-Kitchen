import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

const router = Router();
const userController = new UserController();

router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.post('/', validate(CreateUserDto), (req, res) => userController.createUser(req, res));
router.put('/:id', validate(UpdateUserDto), (req, res) => userController.updateUser(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default router;

