const registerValidator = (req, res, next) => {
    const { username, password } = req.body || {};
    const errors = [];

    if (!username || typeof username !== 'string') {
        errors.push('Login jest wymagany');
    } else {
        const trimmed = username.trim();
        if (trimmed.length < 3 || trimmed.length > 25) {
            errors.push('Login musi mieć od 3 do 25 znaków');
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
            errors.push('Login może zawierać tylko litery, cyfry, myślniki (-) i podkreślenia (_)');
        }
    }

    if (!password || typeof password !== 'string') {
        errors.push('Hasło jest wymagane');
    } else {
        if (password.length < 6) {
            errors.push('Hasło musi mieć conajmniej 6 znaków');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    next();
};

export default registerValidator;
