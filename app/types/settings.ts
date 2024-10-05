

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
    start_date: Date;
    end_date: Date;
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