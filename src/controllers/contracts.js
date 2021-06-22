const express = require('express');
const { onlyOwner } = require('../middleware/onlyOwner');
const contractsController = express.Router();
const { Op } = require("sequelize");

/*
  GET: /contracts -
  Returns a list of contracts belonging to a user (client or contractor),
  the list should only contain non terminated contracts.
 */
contractsController.get('', async (req, res) => {
  const { Contract } = req.app.get('models');
  const contracts = await Contract.findAll({
    where: {
      status: {[Op.not]:'terminated'}
    }
  });
  return res.json({ data: contracts });
});


/*
  GET: /contracts/:id -
  This API is broken 😵! it should return the contract only if it belongs
  to the profile calling. better fix that!
*/
contractsController.get('/:id', [ onlyOwner ],async (req, res) =>{
  const {Contract} = req.app.get('models')
  const {id} = req.params
  const contract = await Contract.findOne({where: {id}})
  if(!contract) return res.status(404).end()
  res.json({data: contract});
});


module.exports = {
  contractsController
};

