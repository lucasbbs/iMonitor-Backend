import { Request, Response } from 'express';

import db from '../database/connection';
import {
  convertHourToMinutes,
  convertMinuteToHours,
} from '../utils/convertHourToMinutes';

interface ScheduleItem {
  week_day: number;
  subject: string;
  from: string;
  to: string;
}

interface ClassItem {
  subject_id: string;
  cost: number;
  subject: string;
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;
    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: 'Missing filters to search classes',
      });
    }
    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;
    const timeInMinutes = convertHourToMinutes(time);

    let classes = await db('classes')
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes]);
      })
      .where('classes.subject_id', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .join('subjects', 'classes.subject_id', '=', 'subjects.id')
      .select([
        'classes.cost',
        'classes.subject_id',
        'classes.user_id',
        'users.*',
        'subjects.subject',
        'classes.id as class_id',
      ]);

    let class_schedule = await db('class_schedule')
      .where('subjects.id', '=', subject)
      .join('subjects', 'classes.subject_id', '=', 'subjects.id')
      .join('classes', 'classes.id', '=', 'class_schedule.class_id')
      .select('class_schedule.*');

    const groupBy = (xs: any, key: any) => {
      return xs.reduce(function (rv: any, x: any) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };

    class_schedule = class_schedule.map((classes) => ({
      ...classes,
      from: convertMinuteToHours(classes.from),
      to: convertMinuteToHours(classes.to),
    }));
    class_schedule = groupBy(class_schedule, 'class_id');

    classes = classes.map((cls) => ({
      ...cls,
      class_schedule: class_schedule[cls.class_id],
    }));

    return response.json(classes);
  }

  async create(request: Request, response: Response) {
    const { user_id, classes, schedule } = request.body;
    const trx = await db.transaction();
    console.log(user_id, ' user_id');
    console.log(classes, ' classes');
    console.log(schedule, ' schedule');

    try {
      const mappedClasses = classes.map((classe: ClassItem) => ({
        cost: classe.cost,
        user_id,
        subject_id: classe.subject,
      }));
      const id = await trx('classes').insert(mappedClasses);

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => ({
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to),
        class_id: id,
      }));

      await trx('class_schedule').insert(classSchedule);
      await trx.commit();
      return response.status(201).send();
    } catch (err) {
      console.log(err);
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while creating new class',
      });
    }
  }
}
