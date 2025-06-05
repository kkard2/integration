import { User, generateAuthToken } from "../models/Models.js";

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ where: { username: username } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Użytkownik o podanym loginie już istnieje'
            });
        }

        const user = new User({
            username,
            password,
        })
        await user.save()

        const token = generateAuthToken(user);
        user.password = undefined

        res.status(201).json({
            success: true,
            message: "Użytkownik zarejestrowany pomyślnie",
            data: {
                token,
            },
        })
    } catch (error) {

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message)
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: messages,
            })
        }

        console.error("Błąd rejestracji: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Walidacja danych wejściowych
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Login i hasło są wymagane",
            })
        }

        const user = await findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Nieprawidłowy login lub hasło"
            })
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Nieprawidłowy login lub hasło"
            })
        }

        const token = generateAuthToken(user);
        user.password = undefined;
        res.status(200).json({
            success: true,
            message: "Zalogowano",
            data: {
                token,
            },
        })
    } catch (error) {
        console.error("Login error: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}
