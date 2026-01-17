import User, { IUser } from '../models/user.model'
import bcrypt from 'bcrypt';


const SALT_ROUNDS = 10;

export const findAllUsers = async() => {
  return User.find().lean()
}

export const findUserById = async(id: string) => {
  return User.findById(id).lean();
}

export const createUser = async(payload: Partial<IUser>) =>{
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }
 
  

  const user = new User({...payload})
  return user.save();
}

export const updateUser = async(id:string, payload: Partial<IUser>) => {
  if (payload.password) {
    const hash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    payload.password = hash;
  }
  return User.findByIdAndUpdate(id, payload, {new:true})
}

export const deleteUser = async(id: string) => {
  return User.findByIdAndDelete(id);
}