import { db } from "./config.server";
import { liveness, users } from "./schema";
import { v4 as uuid } from 'uuid';
import { User } from "../types/settings";
import {sql,eq} from 'drizzle-orm'



//Obtener usuarios
export const getAllUsers =  () => {
     db.select().from(users).all();
     return {
         status: 'OK',
         status_code: 200,
         data: JSON.stringify(users),
     };
};

export const getUserWithLiveness = (userId: string) => {
    const userWithLiveness =  db.select().from(users).leftJoin(liveness, eq(liveness.id_user , users.id)).where(sql`${users.id} = ${userId}`).all();

    return {
        status: 'OK',
        status_code: 200,
        data: JSON.stringify(userWithLiveness),
    }
}

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
    };
     await db.insert(users).values(newUser);

    return {
        status: 'OK',
        status_code: 201,
        message: 'Usuario creado correctamente',
        data: JSON.stringify(newUser),
    };
};

export const  getUserById = async (id:string) => {
    const user = await db.select().from(users).where(sql`${users.id} = ${id}`).all();
    return {
        status: 'OK',
        status_code: 200,
        data: JSON.stringify(user),
    };
};