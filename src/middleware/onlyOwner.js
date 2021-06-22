const onlyOwner = async (req, res, next) => {
  const { id: queryId } = req.params;
  const { id: profileId } = req.profile;
  if ( queryId != profileId ) {
    return res.status(403).end()
  }
  next();
};

module.exports = {
  onlyOwner
}
