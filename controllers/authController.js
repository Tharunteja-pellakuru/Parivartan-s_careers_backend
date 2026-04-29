const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {v4:uuidv4} = require("uuid");
const db = require("../config/db");

const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        
        // Validation - Check required fields
        if (!email || !password || !fullname) {
            return res.status(400).json({ 
                error: "Full name, email, and password are required" 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: "Invalid email format" 
            });
        }
        
        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ 
                error: "Password must be at least 8 characters long" 
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const uuid = uuidv4();
        
        // Insert into database with proper async/await
        const query = `INSERT INTO careers_tbl_admins(uuid, full_name, email, password) VALUES (?,?,?,?)`;
        const [result] = await db.query(query, [uuid, fullname, email, hashedPassword]);
        
        return res.status(201).json({ 
            message: "User signed up successfully!",
            userId: uuid 
        });
    } catch (error) {
        console.error("signup error:", error.message);
        
        // Check for specific database errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                error: "Email already registered" 
            });
        }
        
        return res.status(500).json({ 
            error: "Error occurred while signing up" 
        });
    }
};

const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        // Validation - Check required fields
        if (!email || !password) {
            return res.status(400).json({ 
                error: "Email and password are required" 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: "Invalid email format" 
            });
        }

        // Fetch user from database
        const query = `SELECT * FROM careers_tbl_admins WHERE email = ?`;
        const [rows] = await db.query(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ 
                error: "Invalid email or password" 
            });
        }

        const user = rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                error: "Invalid email or password" 
            });
        }

        const token = jwt.sign(
            { 
                userId: user.uuid,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || "your_default_secret_key",
            { expiresIn: '10h' }
        );

        // Set token in httpOnly cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 10 * 60 * 60 * 72000 // 10 hours in milliseconds
        });

        // Successful login - token is set in cookie
        return res.status(200).json({ 
            message: "Login successful!",
            userId: user.uuid,
            fullName: user.full_name,
            email: user.email
        });

    }
    catch(error){
        console.error("Login error:", error.message);
        return res.status(500).json({ 
            error: "Error occurred while logging in" 
        });
    }
}

const logout = async (req, res) => {
    try {
        // Clear the authToken cookie
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({ 
            message: "Logged out successfully!" 
        });
    } catch (error) {
        console.error("Logout error:", error.message);
        return res.status(500).json({ 
            error: "Error occurred while logging out" 
        });
    }
}

module.exports = {signup, login, logout};