const ensureRole = (role) => (req, res, next) => {
    if (req.session.role === role) {
        return next();
    }
    return res.status(403).send('Acceso denegado');
};

module.exports = { ensureRole };