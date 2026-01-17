import { TestServer } from "./testSetup";
import userRoutes from '../routes/user.routes';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
// import { describe } from "node:test";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';
const server = new TestServer();
server.app.use('/users', userRoutes);


describe('User API Tests ', () => {

  let token:string;
  let user: any;

  beforeAll(async () => {
    await server.start();
    const hash = await bcrypt.hash('admin1234', 10);
    user = await User.create({
      username:"admin",
      password: hash,
      firstname: "testUser",
      lastname: "testUser",
      email: "testUser@aueb.gr",
      roles: "ADMIN"
    });
    const payload = {
      username: user.username,
      email: user.email,
      roles: user.roles
    };
    token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});
  });

  afterAll(async() => { await server.stop();});

  test('GET /users -> returns list of users', async()=> {
    const res = await server.request.get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /users/:id -> returns a specific user', async()=> {
    const res = await server.request.get(`/users/${user._id}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(user._id.toString());
  });

  test('GET /users/:id -> tries to return a user with wrong valid id', async()=> {
    
    const fakeId = '507f1f77bcf86cd799439011'; // valid ObjectId, not in DB
    
    const res = await server.request.get(`/users/${fakeId}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  test('POST /users -> creates new user', async()=>{
    const res = await server.request.post('/users')
      // .set('Authorization', `Bearer ${token}`)
      .send({username: "newuser", password:"123456"});
    
    expect(res.status).toBe(201);
    expect(res.body.username).toBe('newuser');
  });

  test('POST /users -> creates new user with wrong password', async()=>{
    const res = await server.request.post('/users')
      //.set('Authorization', `Bearer ${token}`)
      .send({username: "newuser", password:"12"});
    
    expect(res.status).toBe(400);
  });

  test('POST /users -> creates new user with wrong username', async()=>{
    const res = await server.request.post('/users')
      //.set('Authorization', `Bearer ${token}`)
      .send({username: "ne", password:"1200000"});
    
    expect(res.status).toBe(400);
  });

  test('PUT /users/:id -> modifies a specific user', async()=>{
    const res = await server.request.put(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({firstname:"testUser1"});
    
    expect(res.status).toBe(200);
    expect(res.body.firstname).toBe('testUser1');
  });

  test('PUT /users/:id -> tries to modify a user with wrong valid id', async()=>{
    
    const fakeId = '507f1f77bcf86cd799439011'; // valid ObjectId, not in DB
    
    const res = await server.request.put(`/users/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({firstname:"testUser1"});
    
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  test('DELETE /users/:id -> deletes a specific user', async()=>{

    const hash = await bcrypt.hash('123456', 10);

  const user1 = await User.create({
    username: 'user1',
    password: hash,
    firstname: 'Peter',
    lastname: 'Johnson',
    email: 'user1@aueb.gr',
  });

    
    const res = await server.request.delete(`/users/${user1._id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204);
  });

  test('DELETE /users/:id -> tries to delete a user with wrong valid id', async()=>{

    const hash = await bcrypt.hash('123456', 10);

  const user1 = await User.create({
    username: 'user1',
    password: hash,
    firstname: 'Peter',
    lastname: 'Johnson',
    email: 'user1@aueb.gr',
  });

  const fakeId = '507f1f77bcf86cd799439011'; // valid ObjectId, not in DB

    
    const res = await server.request.delete(`/users/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
  });


  test('DELETE /users/:id -> tries to delete a user with invalid id', async()=>{

    const hash = await bcrypt.hash('123456', 10);

  const user2 = await User.create({
    username: 'user2',
    password: hash,
    firstname: 'Ben',
    lastname: 'Mint',
    email: 'user2@aueb.gr',
  });

    const res = await server.request.delete(`/users/11111111111111`)
      .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(400);
      
  });

test('DELETE /users/:id -> tries to delete a user without having ADMIN role', async()=>{

    const hash1 = await bcrypt.hash('123456', 10);

  const userToBeDeleted = await User.create({
    username: 'usertobedeleted',
    password: hash1,
    firstname: 'Ben',
    lastname: 'Mint',
    email: 'usertobedeleted@aueb.gr',
  });

const hash2 = await bcrypt.hash('123456', 10);

  const user3 = await User.create({
    username: 'user3',
    password: hash2,
    firstname: 'Fred',
    lastname: 'Naset',
    email: 'user3@aueb.gr',
  });

  const payload1 = {
      username: user3.username,
      email: user3.email,
      roles: user3.roles
    };
    
    let token1: string;
    
    token1 = jwt.sign(payload1, JWT_SECRET, {expiresIn: '1h'});

    const res = await server.request.delete(`/users/${userToBeDeleted._id}`)
      .set('Authorization', `Bearer ${token1}`)

      expect(res.status).toBe(403);
      
  });


})

