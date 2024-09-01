import { Router } from 'express';
import { CONSTS } from '../helper/consts.js';

const router = Router();

//Not Found Page
router.all('/', async (req, res) => {
  try {
    return res
      .status(CONSTS.STATUS.NOT_FOUND)
      .send({ success: true, message: 'Not Found!' });
  } catch (error) {
    return res
      .status(CONSTS.STATUS.BAD_REQUEST)
      .send({ success: false, message: error.message });
  }
});

export default router;
