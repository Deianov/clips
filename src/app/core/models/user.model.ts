export default interface IUser {
  name: string;
  email: string;
  age: number;
  password?: string;
  phoneNumber: string;
}

/*
Interfaces vs Classes
- Both can type check data
- Classes are a feature of JS
- Interfaces are a feature of TS
- Interfaces do not get transpiled, while a class does
- Methods can be added to classes

export default class IUser {
  name?: string;
  email?: string;
  age?: number;
  password?: string;
  phoneNumber?: string;
}
*/
