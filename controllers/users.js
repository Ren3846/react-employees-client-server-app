const { prisma } = require("../prisma/prisma-client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

/** 
 * @route POST /api/user/login
 * @description Логін
 * @access Public
 * */ 

const login = async (req, res) => {
    
    try {

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "Заповнить обов'язкові поля будь-ласка!"})
    }

    const user = await prisma.user.findFirst({
        where: {
            email,
        }
    });

    const isPasswordCorrect = user && (await bcrypt.compare(password, user.password));
    const secret = process.env.JWT_SECRET;

    if (user && isPasswordCorrect && secret) {
        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            token: jwt.sign({id: user.id}, secret, {expiresIn: '30d'})
        })
    } else {
        return res.status(400).json({message: "Невірно введені логін або пароль!"})
    }

    }

    catch {
        return res.status(500).json({message: "Щось пішло не так!"})
    }
    
}

/** 
 * @route POST /api/user/register
 * @description Реєстрація
 * @access Public
 * */ 

const register = async (req, res) => {

    try {
        
        const { email, password, name} = req.body;
    
        if (!email || !password || !name) {
            return res.status(400).json({message: "Заповнить обов'язкові поля будь-ласка!"})
        }
    
        const registeredUser = await prisma.user.findFirst({
            where: {
                email
            }
        });
    
        if (registeredUser) {
            return res.status(400).json({message: "Користувач з такім email вже зареєстрований!"})
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })
    
        const secret = process.env.JWT_SECRET;
    
        if (user && secret) {
            res.status(201).json({
                id: user.id,
                email: user.email,
                name,
                token: jwt.sign({id: user.id}, secret, {expiresIn: '30d'})
    
            })
        } else {
            return res.status(500).json({message: "Не вийшло створити користувача!"})
        }
    } catch {
        return res.status(500).json({message: "Щось пішло не так!"})
    }



}

/**
 * @route GET /api/user/current
 * @desc Поточний користувач
 * @access Private
 */

const current = async (req, res) => {
    return res.status(200).json(req.user)
}

module.exports = {
    login,
    register,
    current
}