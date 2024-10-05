

export type User = {
    id?: string;
    document_number: string;
    name: string;
    lastName: string;
    surName: string;
    birthDate: Date;
    gender: string;
    phone: string;
    register_date: Date;
    country: string;
    email: string;
    password: string;
    serial_number: string;
};

export type Liveness = {
    id?: string;
    id_user: string;
    initialDate: Date;
    finishDate: Date;
    result: boolean;
    ip_address: string;
    token_session: string;
    device_info: string;
};

export type LivenessResult = {
    id?: string;
    id_liveness: string;
    action_type: string;
    action_result: boolean;
};

export type GetUser = {
    data: string;
}

export type CreateUser = {
    body : User
}

export type CreateLiveness = {
    body : Liveness
}

export type CreateLivenessResult = {
    body : LivenessResult
}