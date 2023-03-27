const UserModel = require('../models').user
// const { where } = require('sequelize');
const model = require('../models')
const {Op} = require('sequelize')
async function getListUser (req,res) {
  const {keyword,page,pageSize,offset} = req.query
    try {
        const user = await UserModel.findAndCountAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            include : [
                {
                    model : model.outlet,
                    require : true,
                    as : "outlet",
                    attributes : ["nama","alamat","tlp"]
                }
            ],
            where : {
              [Op.or] : [
                {
                  nama : {
                    [Op.substring] : keyword
                  }
                }
              ]
            },
            limit : pageSize,
            offset : offset
        })
        res.json({
            status: "Success",
            msg: "user berhasil ditemukan",
            pagination : {
              currentPage : page,
              pageSize : pageSize,
              totalData : user.count
            },
            data: user,
          });
    } catch (error) {
        console.log(error)
        res.status(403).json({
            status: "fail",
            msg: "Ada kesalahan",
            err: error,
          });
    }
}
async function deleteUser (req,res) {
    try {
        const {id} = req.params
        const user = await UserModel.findByPk(id)

        if (user === null){
            res.status(403).json({
                status: "fail",
                msg: "user tidak ditemukan",
              });
        }

        await UserModel.destroy({
            where : {
                id : id
            }
        })
        res.json({
            status: "Success",
            msg: "user berhasil dihapus",
          });
    } catch (error) {
        res.status(403).json({
            status: "fail",
            msg: "Ada kesalahan",
            err: error,
          });
    }
}

async function detailUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where : {
          id : id
        }
      });
      res.json({
        status: "Success",
        msg: "detail user berhasil ditemukan",
        data: user,
      });
  
    } catch (error) {
      console.log(error);
      res.json({
        status: "Fail",
        msg: "ada kesalahan",
      });
    }
  }
  async function updateUser(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const { nama, username, id_outlet,role  } = payload;
      const outlet = await UserModel.findByPk(id);
  
      if (outlet === null) {
        res.json({
          status: "Fail",
          msg: "user tidak ditemukan",
        });
      }
  
      await UserModel.update(
        {
          nama,
          username,
          id_outlet,
          role
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.json({
        status: "Success",
        msg: "user berhasil diupdate",
      });
    } catch (error) {
      res.json({
        status: "Fail",
        msg: "ada kesalahan",
      });
    }
  }
module.exports = {getListUser,deleteUser,detailUser,updateUser}