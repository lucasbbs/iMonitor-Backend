"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
const convertHourToMinutes_1 = require("../utils/convertHourToMinutes");
class ClassesController {
    async index(request, response) {
        const filters = request.query;
        if (!filters.week_day || !filters.subject || !filters.time) {
            return response.status(400).json({
                error: 'Missing filters to search classes',
            });
        }
        const week_day = filters.week_day;
        const subject = filters.subject;
        const time = filters.time;
        const timeInMinutes = (0, convertHourToMinutes_1.convertHourToMinutes)(time);
        let classes = await (0, connection_1.default)('classes')
            .whereExists(function () {
            this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                .whereRaw('`class_schedule`.week_day = ??', [Number(week_day)])
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
            'users.email',
            'users.password',
            'users.name',
            'users.avatar',
            'users.whatsapp',
            'users.bio',
            'subjects.subject',
            'classes.id as class_id',
        ]);
        let class_schedule = await (0, connection_1.default)('class_schedule')
            .where('subjects.id', '=', subject)
            .join('subjects', 'classes.subject_id', '=', 'subjects.id')
            .join('classes', 'classes.id', '=', 'class_schedule.class_id')
            .select('class_schedule.*');
        const groupBy = (xs, key) => {
            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        class_schedule = class_schedule.map((classes) => (Object.assign(Object.assign({}, classes), { from: (0, convertHourToMinutes_1.convertMinuteToHours)(classes.from), to: (0, convertHourToMinutes_1.convertMinuteToHours)(classes.to) })));
        class_schedule = groupBy(class_schedule, 'class_id');
        classes = classes.map((cls) => (Object.assign(Object.assign({}, cls), { class_schedule: class_schedule[cls.class_id] })));
        return response.json(classes);
    }
    async create(request, response) {
        const { user_id, classes, schedule } = request.body;
        const trx = await connection_1.default.transaction();
        console.log(user_id, ' user_id');
        console.log(classes, ' classes');
        console.log(schedule, ' schedule');
        try {
            const mappedClasses = classes.map((classe) => ({
                cost: classe.cost,
                user_id,
                subject_id: classe.subject,
            }));
            const id = await trx('classes').insert(mappedClasses);
            const classSchedule = schedule.map((scheduleItem) => ({
                week_day: scheduleItem.week_day,
                from: (0, convertHourToMinutes_1.convertHourToMinutes)(scheduleItem.from),
                to: (0, convertHourToMinutes_1.convertHourToMinutes)(scheduleItem.to),
                class_id: id,
            }));
            await trx('class_schedule').insert(classSchedule);
            await trx.commit();
            return response.status(201).send();
        }
        catch (err) {
            console.log(err);
            await trx.rollback();
            return response.status(400).json({
                error: 'Unexpected error while creating new class',
            });
        }
    }
}
exports.default = ClassesController;
