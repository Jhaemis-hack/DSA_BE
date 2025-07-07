require("dotenv").config();
import DB from './config/db';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import errorHandler from './utils/errorHandler';
import AuthRouter from './modules/Auth/auth.routes';
import MenteeRouter from './modules/Mentee/mentee.routes';
import MentorRouter from './modules/Mentor/mentor.routes';
import seedUserIntoDataBase from './modules/seedData/user';
import seedMenteeProfileIntoDataBase from './modules/seedData/menteeProfile';
import seedMentorProfileIntoDataBase from './modules/seedData/mentorProfile';
import availabilitymentorInfoIntoDataBase from './modules/seedData/mentorAvailability';
import AdminRouter from './modules/Admin/admin.routes';

const port = Number(process.env.PORT) || 4040;
const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Server is up and running. Use /api/v1/*** to consume this API.');
});

// seedUserIntoDataBase()
// seedMenteeProfileIntoDataBase()
// seedMentorProfileIntoDataBase()
// availabilitymentorInfoIntoDataBase()

app.get('/api/v1', (req: Request, res: Response) => {
  res.send('Welcome to the DSA Project API');
});

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/users', MenteeRouter);
app.use('/api/v1/mentors', MentorRouter);
app.use('/api/v1/admin', AdminRouter);

// handles all application error
app.all("/{*splat}", (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status_code: StatusCodes.NOT_FOUND,
    message: `Server can not ${req.method} ${req.originalUrl}`,
    data: null,
  });
});

// handles  specific application errors
app.use(errorHandler);

const startServer = async () => {
  console.log("Connecting to database ✈️");

  await DB();

  app.listen(port, "0.0.0.0", () => {
    console.log({
      message: "🚀 Application startup in progress...",
      status: "Running",
      port,
      url: `http://localhost:${port}/api/v1`,
      timestamp: new Date().toISOString(),
    });
  });
};

// initialize database connection
startServer();

