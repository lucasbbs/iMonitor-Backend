import { Request, Response } from 'express';
import db from '../database/connection';

export default class SubjectsController {
  async index(request: Request, response: Response) {
    const subjects = await db('subjects');
    response.json({ subjects });
  }

  async create(request: Request, response: Response) {
    const { subject } = request.body;
    await db('subjects').insert({ subject });
    response.send();
  }
}
