const mysqlCore = require('drizzle-orm/mysql-core');
console.log('Available types:', Object.keys(mysqlCore).filter(k => k.toLowerCase().includes('blob')));
