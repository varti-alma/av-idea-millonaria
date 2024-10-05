import { json } from "@remix-run/node";
import { getAllUsers , getUserById , addNewUser, getLivenessById, addNewLiveness, addNewLivenessResult } from "~/db/helpers";
import { CreateLiveness, CreateLivenessResult, CreateUser } from "~/types/settings";

//User
export const loaderAllUser = async () => {
    const userAll = getAllUsers();
    return json({userAll});
}

export const loaderUserWithParams = async ({ params }: { params: { id: string } }) => {
    const user = getUserById(params.id);
    return json({user});
}

export const createUserLoader = async ({ request }: { request: CreateUser }) => {
    const user = await addNewUser(request.body);
    return json({user});
}

//Liveness
export const getLivnessWithParamsLoader = async ({ params }: { params: { id: string } }) => {
    const liveness = getLivenessById(params.id);
    return json({liveness});
};

export const createLivenessLoader = async ({ request }: { request: CreateLiveness }) => {
    const liveness = await addNewLiveness(request.body);
    return json({liveness});
};

export const createLivenessResultLoader = async ({ request }: { request: CreateLivenessResult }) => {
    const livenessResult = await addNewLivenessResult(request.body);
    return json({livenessResult});
};