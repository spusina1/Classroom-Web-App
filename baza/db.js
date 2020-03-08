const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19","root","root",{host:"127.0.0.1",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.Osoblje = sequelize.import(__dirname+'/osoblje.js');
db.Rezervacija = sequelize.import(__dirname+'/rezervacija.js');
db.Sala = sequelize.import(__dirname+'/sala.js');
db.Termin = sequelize.import(__dirname+'/termin.js');

// Veze
db.Osoblje.hasMany(db.Rezervacija,{foreignKey:'osoba', as:'rezervacijeOsobe'});
db.Rezervacija.belongsTo(db.Osoblje, {foreignKey:'osoba', as:'osobaRezervacije'});
db.Termin.hasOne(db.Rezervacija, {foreignKey: {name: 'termin',unique: true,}, as:'rezrvacijaTermina'});
db.Rezervacija.belongsTo(db.Termin, {foreignKey: {name: 'termin',unique: true,}, as:'terminRezervacije'});
db.Sala.hasMany(db.Rezervacija, {foreignKey:'sala', as:'rezervacijeSale'})
db.Rezervacija.belongsTo(db.Sala,  {foreignKey:'sala', as:'salaRezervacije'});
db.Osoblje.hasOne(db.Sala,{as:'salaOsobe', foreignKey:'zaduzenaOsoba'});
db.Sala.belongsTo(db.Osoblje, {as:'osobaSale', foreignKey:'zaduzenaOsoba'}); 

module.exports=db;