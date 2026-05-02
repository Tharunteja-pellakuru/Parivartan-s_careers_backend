    const express = require("express");
    const cors = require("cors");
    const cookieParser = require("cookie-parser");
    const path = require("path");
    require("dotenv").config();


    const app = express(); 

    const { createAllTables } = require("./database/createTables");
    const authRoute = require("./routes/authRoute");
    const careersMasterRoute = require("./routes/careersMasterRoutes");
    const jobApplicationFieldsRoutes = require("./routes/jobApplicationFieldsRoutes");
    const jobsRoutes = require("./routes/jobsRoutes");
    const jobApplicationsRoutes = require("./routes/jobApplicationsRoutes");
    
    
    // Middleware   
    app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    }));
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "public")));
    app.use(
    "/api/job-applications",
    jobApplicationsRoutes
    );






    // Routes
    // Changed path to /api to keep it clean
    app.use("/api", authRoute); 
    app.use("/api/careers/master", careersMasterRoute);
    app.use("/api", jobsRoutes);
    app.use(
        "/api/job-application-fields",
        jobApplicationFieldsRoutes
    );

    app.get("/", (req, res) => {
        res.send("Backend Services are running!.");
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, async () => {
        await createAllTables();
        console.log(`Server is running on port ${PORT}`);
    });
