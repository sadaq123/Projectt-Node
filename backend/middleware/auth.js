const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (roles = []) => {
  return (req, res, next) => {
    // 1. Ka soo qaad Token-ka Headers-ka
    let authHeader = req.header('Authorization') || req.header('x-auth-token') || '';
    let token = authHeader;

    // 2. Nadiifinta Token-ka (Extremely Robust)
    // Waxaan ka tirtiraynaa erayga "Bearer" haddii uu laba-laabmo ama uu ku jiro meel khaldan
    token = token.replace(/Bearer/gi, '').trim(); 
    
    // Sidoo kale ka tirtir calaamadaha " " ama ' ' haddii uu isticmaalaha raaciyay koobi-ga
    token = token.replace(/['"]+/g, '').trim();

    // 3. Hadii aan token la helin ka dib nadiifinta
    if (!token) {
      return res.status(401).json({ 
        message: 'No token, authorization denied',
        tip: 'Fadlan hubi inaad Thunder Client qaybta Auth -> Bearer Token aad gelisay Token-ka.' 
      });
    }

    try {
      // 4. Xaqiiji in Token-ku uu sax yahay (Verify)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
      req.user = decoded;

      // 5. Hubi in isticmaalaha uu leeyahay awoodda (Role) loo baahan yahay
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Access denied: insufficient permissions',
          currentRole: req.user.role,
          requiredRoles: roles
        });
      }

      next();
    } catch (err) {
      res.status(401).json({ 
        message: 'Token is not valid',
        error: err.message,
        receivedToken: token.substring(0, 10) + '...' // Si loo ogaado waxa la helay
      });
    }
  };
};

module.exports = auth;
