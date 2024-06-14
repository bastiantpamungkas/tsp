declare namespace UserTypes {
    interface IPermission {
        permission : {
            id: string;
            name: string;
            description: string;
        }
    }
  
    interface IRole {
        role : {
            id: string;
            name: string;
            description: string;
            role_permission: IPermission[];
        }
    }
  
    interface IUser {
        id: string;
        name: string;
        email: string;
        image: string;
        user_role: IRole[];
    }
}
export default UserTypes
  