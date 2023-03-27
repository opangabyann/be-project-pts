const { check } = require("express-validator");

const createOutletValidator = [
  check("nama")
    .isLength({
      min: 1,
    })
    .withMessage("nama wajib diisi"),

    check("alamat")
    .isLength({
      min: 1,
    })
    .withMessage("alamat wajib diisi"),

    check('tlp')
    .isLength({
        min : 1
    }).withMessage("nomor telepon wajib diisi")
];

module.exports = {createOutletValidator}