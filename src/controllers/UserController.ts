import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import db from '../database/connection';

export default class UserController {
  async auth(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await db('users').where({ email });

    if (!user) {
      return response.status(401).json('Invalid email or password');
    }
    if (bcryptjs.compareSync(password, user[0].password)) {
      const token = sign({}, '2e247e2eb505c42b362e80ed4d05b078', {
        subject: String(user[0].id),
        expiresIn: '1d',
      });

      return response.json({
        token,
        user: {
          id: user[0].id,
          name: user[0].name,
          avatar: user[0].avatar,
          whatsapp: user[0].whatsapp,
          bio: user[0].bio,
          email: user[0].email,
          isMonitor: user[0].isMonitor,
        },
      });
    }
    return response.status(401).json('Invalid email or password');
  }

  async create(request: Request, response: Response) {
    const { name, avatar, whatsapp, bio, email, password } = request.body;

    if (!name || !whatsapp || !bio || !email || !password) {
      return response
        .status(400)
        .json({ message: 'All required fields must be informed' });
    }
    const user = await db('users').where({ email });

    if (user.length) {
      return response.status(400).json({ message: 'User already exists' });
    }
    if (password && password.trim().length < 6) {
      return response
        .status(400)
        .json({ message: 'Your password must be at least 6 characters long' });
    }

    await db('users').insert({
      name,
      avatar,
      whatsapp,
      bio,
      email,
      password: bcryptjs.hashSync(password, 10),
    });

    return response.status(201).send();
  }

  async update(request: Request, response: Response) {
    const { user_id } = request.params;
    const { name, avatar, whatsapp, bio, email, password } = request.body;

    if (!name || !whatsapp || !bio) {
      return response
        .status(400)
        .json({ message: 'All required fields must be informed' });
    }

    if (password && password.trim().length < 6) {
      return response
        .status(400)
        .json({ message: 'Your password must be at least 6 characters long' });
    }
    if (password) {
      await db('users')
        .where({ id: user_id })
        .update({
          name,
          avatar,
          whatsapp,
          bio,
          password: bcryptjs.hashSync(password, 10),
        });
    } else {
      await db('users').where({ id: user_id }).update({
        name,
        avatar,
        whatsapp,
        bio,
      });
    }
    return response.status(200).send();
  }
}
