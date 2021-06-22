const express = require('express');
const adminController = express.Router();
const { Op, fn, col } = require('sequelize');

/*
  GET: /admin/best-profession?start=<date>&end=<date> -
  Returns the profession that earned the most money (sum of jobs paid) for any contactor that
  worked in the query time range.
 */
adminController.get('/best-profession', async (req, res) => {
  const { start: startDate, end: endDate } = req.query;
  let where = {
    paid: { [Op.is]: true },
  };
  if (startDate && endDate) {
    where = {
      ...where,
      [Op.or]: [{
        paymentDate: {
          [Op.between]: [startDate, endDate]
        }
      }]
    };
  }
  const { Job, Contract, Profile } = req.app.get('models');
  const professions = await Job.findAll({
    where: where,
    attributes: [
      [fn('SUM', col('price')), 'earned'],
      'paid',
      'paymentDate'
    ],
    include: [{
      required: true,
      model: Contract,
      where: {
        // status: {[Op.not]: 'terminated'}
      },
      attributes: [
        'status',
        [fn('COUNT', col('Contract.Contractor.profession')), 'total'],
      ],
      include: [{
        required: true,
        model: Profile,
        as: 'Contractor',
        attributes: [
          'profession'
        ],
      }]
    }],
    group: ['Contract.Contractor.profession']
  });
  return res.json({ data: professions });
});
module.exports = {
  adminController
};

