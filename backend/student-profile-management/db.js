var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/student-profile-management', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);