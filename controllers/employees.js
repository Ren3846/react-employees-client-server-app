const { prisma } = require("../prisma/prisma-client");

/**
 * @route  GET api/employees
 * @description Получення всіх сотрудників
 * @access Private
 */

const all = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();

    res.status(200).json(employees);
  } catch {
    res.status(500).json({ message: "Не вдалося отримати сотрудників" });
  }
};

/**
 * @route  POST api/employees/add
 * @description Додавання сотрудніка
 * @access Private
 */

const add = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({ message: "Усі поля обов'язкові!" });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    res.status(201).json(employee);
  } catch {
    res.status(500).json({ message: "Не вдалося додати сотрудника" });
  }
};

/**
 * @route  POST api/employees/remove/:id
 * @description Видалення сотрудніка
 * @access Private
 */

const remove = async (req, res) => {
  try {
    const { id } = req.body;

    await prisma.employee.delete({
      where: {
        id,
      },
    });

    res.status(204).json({ message: "OK" });
  } catch {
    res.status(500).json({ message: "Не вдалося видалити сотрудника" });
  }
};

/**
 * @route  PUT api/employees/edit/:id
 * @description Редагування сотрудника
 * @access Private
 */

const edit = async (req, res) => {
  try {
    const data = req.body;
    const id = data.id;

    await prisma.employee.update({
      where: {
        id,
      },
      data,
    });

    res.status(204).json({ message: "OK" });
  } catch {
    res.status(500).json({ message: "Не вдалося редагувати сотрудника" });
  }
};

/**
 * @route  PUT api/employees/:id
 * @description Знайти сотрудника
 * @access Private
 */

const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(employee);
  } catch {
    res.status(500).json({ message: "Не вдалося знайти сотрудника" });
  }
};

module.exports = {
  all,
  add,
  remove,
  edit,
  getEmployee,
};
