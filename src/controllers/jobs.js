const express = require('express');
const jobsController = express.Router();
const { Op } = require("sequelize");

const updateBalance = async (amount, model, instance, op) => {
  if ( op === 'collect' ) {
    instance.balance += amount;
  } else {
    instance.balance -= amount;
  }
  return await model.update(instance, { where: {id: instance.id},raw: true})
}


/*
  GET: /jobs/unpaid -
  Get all unpaid jobs for a user (either a client or contractor),
  for active contracts only.
 */
jobsController.get('/unpaid', [  ], async (req, res) =>{
  const {Job, Contract} = req.app.get('models')
  const jobs = await Job.findAll({
    include: [{
      model: Contract,
      where: {status: {[Op.not]: 'terminated' }},
      attributes: ['id']
    }]})
  res.json({data: jobs});
});

/*
  POST: /jobs/:job_id/pay -
  Pay for a job, a client can only pay if his balance >= the amount to pay.
  The amount should be moved from the client's balance to the contractor balance.
 */
jobsController.post('/:job_id/pay', [ ], async (req, res) =>{
  const {Job, Contract, Profile} = req.app.get('models')
  const job = await Job.findOne({
    where: { id: req.params.job_id },
    raw: true
  });
  const contract = await Contract.findOne({
    where: {id: job.ContractId},
    raw: true
  });
  const client = await Profile.findOne({
    where: {id: contract.ClientId},
    raw: true
  });
  const contractor = await Profile.findOne({
    where: {id: contract.ContractorId},
    raw: true
  });
  if ( client.balance < job.price ) {
    return res.json({
      message: 'The balance is insufficient'
    })
  };
  await updateBalance(job.price, Profile, client, 'pay')
  await updateBalance(job.price, Profile, contractor, 'collect')
  res.json({data: {
      job: job,
      contract: contract,
      client: client,
      contractor: contractor
    }});
});

module.exports = {
  jobsController
};

