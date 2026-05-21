@ -17,9 +17,20 @@ const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: "http://localhost:5173",
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
