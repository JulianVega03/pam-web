import { Role } from "../enums/rol.enum";

export interface ISidebar {
    title: string,
    icon?: string, 
    link?: string[],
    roles?: Role[]
    children?: ISidebar[]
    hidden?: boolean
}