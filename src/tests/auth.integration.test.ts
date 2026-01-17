import { TestServer } from "./testSetup";
import userRoutes from '../routes/user.routes';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
// import { describe } from "node:test";
import authRoutes from '../routes/auth.routes'

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';
const server = new TestServer();

server.app.use('/auth', authRoutes);

describe('Auth API Tests ', () => {

  let token:string;

  beforeAll(async () => {
    await server.start();
    const hash = await bcrypt.hash('admin1234', 10);
    const user = await User.create({
      username:"admin",
      password: hash,
      firstname: "testUser",
      lastname: "testUser",
      email: "testUser@aueb.gr",
    });
    const payload = {
      username: user.username,
      email: user.email,
      roles: user.roles
    };
    token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});
  });

  afterAll(async() => { await server.stop();});

  test('POST /auth/login -> logs in a user', async()=>{
    const res = await server.request.post('/auth/login')
      .send({username: "admin", password:"admin1234"});
    
    expect(res.status).toBe(200);
  });

  test('POST /auth/login -> tries to log in a user with wrong password', async()=>{
    const res = await server.request.post('/auth/login')
      .send({username: "admin", password:"admin12345"});
    
    expect(res.status).toBe(401);
  });

  test('POST /auth/login -> tries to log in a user with wrong username', async()=>{
    const res = await server.request.post('/auth/login')
      .send({username: "admin1", password:"admin1234"});
    
    expect(res.status).toBe(401);
  });


  test('POST /auth/login -> returns 400 if username is missing', async () => {
    const res = await server.request
    .post("/auth/login")
    .send({ password: "admin1234" });

    expect(res.status).toBe(400);
});

  test('POST /auth/login -> returns 400 if password is missing', async () => {
    const res = await server.request
    .post("/auth/login")
    .send({ username: "admin" });

    expect(res.status).toBe(400);
});

})
