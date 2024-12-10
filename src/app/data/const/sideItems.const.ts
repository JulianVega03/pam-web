import { Role } from '../enums/rol.enum';
import { ISidebar } from '../interfaces/ISidebar.interface';

export const sidebarItems: ISidebar[]  = [
    {
        title: 'Documentos',
        icon: 'pi pi-file',
        roles: [Role.ADMIN, Role.ENCARGADO],
        link: ['/inscription/backlog/home']
    },
    {
        title: 'Entrevista',
        icon: 'pi pi-users',
        roles: [Role.ADMIN, Role.ENCARGADO],
        link: ['/inscription/backlog/admin/entrevista']
    },
    {
        title: 'Prueba',
        icon: 'pi pi-pencil',
        roles: [Role.ADMIN, Role.ENCARGADO],
        link: ['/inscription/backlog/admin/prueba']
    },
    {
        title: 'Cohorte',
        icon: 'pi pi-calendar',
        roles: [Role.ADMIN],
        link: ['/inscription/backlog/admin/cohortes']
    },
    {
        title: 'Personal',
        icon: 'pi pi-user-plus',
        roles: [Role.ADMIN],
        link: ['/inscription/backlog/admin/personal']
    },
    {
        title: 'Listados',
        icon: 'pi pi-list',
        roles: [Role.ADMIN],
        children: [
            {
                title: 'Calificaciones',
                icon: 'pi pi-file-edit',
                roles: [Role.ADMIN],
                link: ['/inscription/backlog/admin/seleccionar-admitidos']
            },
            {
                title: 'General',
                icon: 'pi pi-check',
                roles: [Role.ADMIN],
                link: ['/inscription/backlog/admin/listado-general']
            }
        ]
   },
   {
        title: 'Reportes',
        icon: 'pi pi-file',
        roles: [Role.ADMIN],
        children: [
            {
                title: 'Aspirantes',
                icon: 'pi pi-download',
                roles: [Role.ADMIN],
                link: ['/inscription/backlog/admin/seleccionar-admitidos']
            }
        ]
    }


]


