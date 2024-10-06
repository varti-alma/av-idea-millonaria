import { db } from "./config.server";
import { liveness, liveness_results, users } from "./schema";
import { v4 as uuid } from 'uuid';
import { Liveness, LivenessResult, User } from "../types/settings";
import {sql,eq} from 'drizzle-orm'
import { Http2ServerRequest } from "http2";



//GET
export const getAllUsers =  () => {
    try {
        db.select().from(users)
        return {
            status: 'OK',
            status_code: 200,
            data: JSON.stringify(users),
        };
    } catch (error:any) {
        if (error.code) {
            return {
                status: 'Error',
                status_code: error.code === '23505' ? 409 : 500,
                message: `Error al obtener los usuarios: ${error.message}`,
                error: error.message,
            };
        }
        return {
            status: 'Error',
            status_code: 500,
            message: 'Ocurrió un error inesperado al obtener los usuarios.',
            error: error.message,
        };
    };
};

export const getUserWithLiveness = (userId: string) => {
    
    try {
        const userWithLiveness =  db.select().from(users).leftJoin(liveness, eq(liveness.id_user , users.id)).where(sql`${users.id} = ${userId}`);
        return {
            status: 'OK',
            status_code: 200,
            data: JSON.stringify(userWithLiveness),
        }
        
    } catch (error:any) {
        if (error.code) {
            return {
                status: 'Error',
                status_code: error.code === '23505' ? 409 : 500,
                message: `Error al obtener los user-liveness: ${error.message}`,
                error: error.message,
            };
        }
        return {
            status: 'Error',
            status_code: 500,
            message: 'Ocurrió un error inesperado al obtener los user-liveness.',
            error: error.message,
        };
    }

}

export const  getUserById = async (id:string) => {
    try {
        const user = await db.select().from(users).where(sql`${users.id} = ${id}`);
        return {
            status: 'OK',
            status_code: 200,
            data: JSON.stringify(user),
        };
    } catch (error:any) {
        if (error.code) {
            return {
                status: 'Error',
                status_code: error.code === '23505' ? 409 : 500,
                message: `Error al obtener al usuario: ${error.message}`,
                error: error.message,
            };
        }
        return {
            status: 'Error',
            status_code: 500,
            message: 'Ocurrió un error inesperado al obtener  al usuario.',
            error: error.message,
        };
    }
};

export const  getLivenessById = async (id:string) => {
    try {
        const liveness = await db.select().from(liveness_results).where(sql`${liveness_results.id} = ${id}`);
        return {
            status: 'OK',
            status_code: 200,
            data: JSON.stringify(liveness),
        };
        
    } catch (error:any) {
        if (error.code) {
            return {
                status: 'Error',
                status_code: error.code === '23505' ? 409 : 500,
                message: `Error al obtener el liveness: ${error.message}`,
                error: error.message,
            };
        }
        return {
            status: 'Error',
            status_code: 500,
            message: 'Ocurrió un error inesperado al obtener el liveness.',
            error: error.message,
        };
    }
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

    try {
        if (!newUser.document_number || !newUser.email || !newUser.password) {
            throw new Error('Faltan campos obligatorios: document_number, email, o password');
        }
        await db.insert(users).values(newUser);

        return {
            status: 'OK',
            status_code: 201,
            message: 'Usuario creado correctamente',
            data: JSON.stringify(newUser),
        };
        
    } catch (error:any) {
      if (error.message.includes('duplicate key value')) {
            return {
                status: 'Error',
                status_code: 409,
                message: 'Error: El email o el número de documento ya están registrados.',
                error: error.message,
            };
        }
        if (error.message === 'Faltan campos obligatorios: document_number, email, o password') {
            return {
                status: 'Error',
                status_code: 400,
                message: error.message,
            };
        }
        return {
            status: 'Error',
            status_code: 500,
            message: 'Ocurrió un error al crear el usuario.',
            error: error.message,
        };
        
    }
     

    
};

export const  addNewLiveness = async (data:Liveness) => {
    const newLiveness = {
        id: uuid(),
        id_user: data.id_user,
        initialDate: data.initialDate,
        finishDate: data.finishDate,
        result: data.result,
        ip_address: data.ip_address,
        token_session: data.token_session,
        device_info: data.device_info,
    };
    try {

        if(!newLiveness.token_session) {
            throw new Error('Faltan campos obligatorios: token_session');
        }
        await db.insert(liveness).values(newLiveness);
        return {
            status: 'OK',
            status_code: 201,
            message: 'Liveness created correctly',
            data: JSON.stringify(newLiveness),
        };
        
    } catch (error:any) {
        if (error.message.includes('duplicate key value')) {
            return {
                status: 'Error',
                status_code: 409,
                message: 'Error: El token_session  ya está registrado.',
                error: error.message,
            };
        }
        if (error.message === 'Faltan campos obligatorios: token_session') {
            return {
                status: 'Error',
                status_code: 400,
                message: error.message,
            };
        }
        return {
            status: 'Error',
            status_code: 500,
            message: 'Ocurrió un error al crear el liveness.',
            error: error.message,
        };
        
    }
};

export const  addNewLivenessResult = async (data:LivenessResult) => {
    const newLivenessResult = {
        id: uuid(),
        id_liveness: data.id_liveness,
        action_type: data.action_type,
        action_result: data.action_result,
    };
    try {
        if(!newLivenessResult.id_liveness) {
            throw new Error('Faltan campos obligatorios: id_liveness');
        }
        await db.insert(liveness_results).values(newLivenessResult);
        return {
            status: 'OK',
            status_code: 201,
            message: 'Liveness result created correctly',
            data: JSON.stringify(newLivenessResult),
        };
        
    } catch (error:any) {

        if (error.message.includes('duplicate key value')) {
            return {
                status: 'Error',
                status_code: 409,
                message: 'Error: El id_liveness ya están registrado.',
                error: error.message,
            };
        }
        if (error.message === 'Faltan campos obligatorios: id_liveness') {
            return {
                status: 'Error',
                status_code: 400,
                message: error.message,
            };
        }
        return {
            status: 'Error',
            status_code: 500,
            message: 'Ocurrió un error al crear el liveness result.',
            error: error.message,
        };
        
    }
};  



