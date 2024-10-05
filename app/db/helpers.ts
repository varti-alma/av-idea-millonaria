import { db } from "./config.server";
import { liveness, liveness_results, users } from "./schema";
import { v4 as uuid } from 'uuid';
import { Liveness, LivenessResult, User } from "../types/settings";
import {sql,eq} from 'drizzle-orm'



//GET
export const getAllUsers =  () => {
     db.select().from(users)
     return {
         status: 'OK',
         status_code: 200,
         data: JSON.stringify(users),
     };
};

export const getUserWithLiveness = (userId: string) => {
    const userWithLiveness =  db.select().from(users).leftJoin(liveness, eq(liveness.id_user , users.id)).where(sql`${users.id} = ${userId}`);

    return {
        status: 'OK',
        status_code: 200,
        data: JSON.stringify(userWithLiveness),
    }
}

export const  getUserById = async (id:string) => {
    const user = await db.select().from(users).where(sql`${users.id} = ${id}`);
    return {
        status: 'OK',
        status_code: 200,
        data: JSON.stringify(user),
    };
};

export const  getLivenessById = async (id:string) => {
    const liveness = await db.select().from(liveness_results).where(sql`${liveness_results.id} = ${id}`);
    return {
        status: 'OK',
        status_code: 200,
        data: JSON.stringify(liveness),
    };
};

//POST
export const  addNewUser = async (data:User) => {
    const newUser = {
        id: uuid(),
        document_number:data.document_number,
        name: data.name,
        lastName: data.lastName,
        surName: data.surName,
        birthDate: data.birthDate,
        gender: data.gender,
        phone: data.phone,
        register_date: data.register_date,
        country: data.country,
        email: data.email,
        password: data.password,
        serial_number: data.serial_number,
    };
     await db.insert(users).values(newUser);

    return {
        status: 'OK',
        status_code: 201,
        message: 'Usuario creado correctamente',
        data: JSON.stringify(newUser),
    };
};

export const  addNewLiveness = async (data:Liveness) => {
    const newLiveness = {
        id: uuid(),
        id_user: data.id_user,
        start_date: data.start_date,
        end_date: data.end_date,
        result: data.result,
        ip_address: data.ip_address,
        token_session: data.token_session,
        device_info: data.device_info,
    };
    await db.insert(liveness).values(newLiveness);
    return {
        status: 'OK',
        status_code: 201,
        message: 'Liveness created correctly',
        data: JSON.stringify(newLiveness),
    };
};

export const  addNewLivenessResult = async (data:LivenessResult) => {
    const newLivenessResult = {
        id: uuid(),
        id_liveness: data.id_liveness,
        action_type: data.action_type,
        action_result: data.action_result,
    };
    await db.insert(liveness_results).values(newLivenessResult);
    return {
        status: 'OK',
        status_code: 201,
        message: 'Liveness result created correctly',
        data: JSON.stringify(newLivenessResult),
    };
};  


