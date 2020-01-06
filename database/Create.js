const bcrypt = require('bcrypt');

function CreationController (DatabaseConntection,ExpressApplication){
    console.log('STARTING CREATION CONTROLLER');
    this.connection = DatabaseConntection;
    this.app = ExpressApplication;

    this.app.use('/database/create',(req,res) => {
		//Create a table that contains different access levels for each user, i.e admins etc.
        this.connection.query('CREATE TABLE IF NOT EXISTS users(_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,username VARCHAR(55) NOT NULL,password VARCHAR(550) NOT NULL,email VARCHAR(55) NOT NULL,logged_in BOOL NOT NULL DEFAULT false,firstname VARCHAR(99),lastname VARCHAR(99),joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,profile VARCHAR(999),notif_token VARCHAR(255))',(err,result,fields) => {
			if(!err) {
				this.connection.query('CREATE TABLE IF NOT EXISTS shared(_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,sharer INT NOT NULL,title VARCHAR(100) NOT NULL,artist VARCHAR(100) NOT NULL,art VARCHAR(100) NOT NULL,time_shared TIMESTAMP DEFAULT CURRENT_TIMESTAMP,duration INT DEFAULT 0,spotify_id VARCHAR(999))',(err,result) => {
					if(!err) {
            this.connection.query(`CREATE TABLE IF NOT EXISTS followers(_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,follower INT NOT NULL,following INT NOT NULL)`,(err,result) => {
              if(!err) {
                this.connection.query(`CREATE TABLE IF NOT EXISTS settings(_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,user INT NOT NULL,defaultUserSearch BOOL NOT NULL DEFAULT false,theme VARCHAR(255) NOT NULL DEFAULT 'grape')`)
                res.send({
                  TYPE: 'SUCCESS',
                  MESSAGE: 'SUCCESSFULLY CREATED DATABASE'
                });
              }
            })
					} else {
						console.log(err);
						res.send({
							TYPE: 'ERROR',
							TABLE: 'SHARED',
							MESSAGE: 'ERROR CREATING DATABASE'
						});
					}
				});
			} else {
				console.log(err);
				res.send({
					TYPE: 'ERROR',
					TABLE: 'USERS',
					MESSAGE: 'ERROR CREATING DATABASE'
				});
			}
        });
	});

	//DELETES ALL THE TABLES FROM THE DATABASE
	this.app.use('/database/purge',(req,res) => {
		this.connection.query('DROP TABLE users',(err,result) => {
			if(!err) {
				console.log('USERS TABLE DELETED');
				this.connection.query('DROP TABLE shared',(err,result) => {
					if(!err) {
						console.log('SHARED TABLE DELETED');
            this.connection.query('DROP TABLE followers',(err,result) => {
              if(!err) {
                console.log('FOLLWER TABLE DELETED');
                console.log('DATABASE PURGE COMPLETED');
              }
            });
						res.send({
							TYPE: 'SUCCESS',
							MESSAGE: 'DATABASE DELETED SUCCESS'
						});
					} else {
						console.log(err);
						res.send({
							TYPE: 'ERROR',
							TABLE: 'SHARES',
							MESSAGE: 'ERROR DELETING DATABASE'
						});
					}
				});
			} else {
				console.log(err);
				res.send({
					TYPE: 'ERROR',
					TABLE: 'USERS',
					MESSAGE: 'ERROR DELETING DATABASE'
				});
			}
		})
	});

    //Deletes all the data in the database and seeds to data for development purposes.
    this.app.use('/database/seed',async (req,res) => {
		await bcrypt.hash('drmario', 10,(err,hash) => {
			if(!err) {
				this.connection.query('INSERT INTO users(username,password,email,firstname,lastname,notif_token) VALUES("maxx730","' + hash + '","max.kinghorn@gmail.com","Max","Kinghorn",""),("tolm640","' + hash + '","tolm.lamar@gmail.com","Tom","Lamar",""),("ethan54","' + hash + '","ethan.clokels@gmail.com","Ethan","Clokey",""),("nippolas","' + hash + '","nip.clokels@gmail.com","Ethan","Clokey",""),("thenose43","' + hash + '","nose.clokels@gmail.com","Ethan","Clokey",""),("tanhole78","' + hash + '","tan.clokels@gmail.com","Ethan","Clokey",""),("lamar22","' + hash + '","lam.clokels@gmail.com","Ethan","Clokey",""),("whoreglory","' + hash + '","whore.clokels@gmail.com","Ethan","Clokey",""),("assraptor10","' + hash + '","ass.clokels@gmail.com","Ethan","Clokey",""),("kyskarol9","' + hash + '","kys.clokels@gmail.com","Ethan","Clokey",""),("trundle89","' + hash + '","trun.clokels@gmail.com","Ethan","Clokey",""),("hamplanet40","' + hash + '","ham.clokels@gmail.com","Ethan","Clokey","");',(err,result) => {
					if(!err) {
						this.connection.query('INSERT INTO shared(sharer,title,artist,art,spotify_id) VALUES(2,"TEST 1","ARTIST 1","ART 1","SPOTIFY_ID_1"),(2,"TEST 2","ARTIST 2","ART 2","SPOTIFY_ID_2"),(1,"TEST 3","ARTIST 3","ART 3","SPOTIFY_ID_3"),(1,"TEST 4","ARTIST 4","ART 4","SPOTIFY_ID_4"),(3,"TEST 5","ARTIST 5","ART 5","SPOTIFY_ID_5"),(1,"TEST 6","ARTIST 6","ART 6","SPOTIFY_ID_6");',(err,result) => {
							if(!err) {
                this.connection.query('INSERT INTO followers(follower,following) VALUES(1,2),(1,3),(2,1);',(err,result) => {
                  if(!err) {
                    res.send({
                      TYPE: 'SUCCESS',
                      MESSAGE: 'DATABASE SUCCESSFULLY SEEDED'
                    });
                  } else  {
                    console.log(err);
                    res.send({
                      TYPE: 'ERROR',
                      TABLE: 'SHARED',
                      MESSAGE: 'ERROR SEEDING FOLLOWERS TABLE'
                    });
                  }
                });
							} else {
								console.log(err);
								res.send({
									TYPE: 'ERROR',
									TABLE: 'SHARED',
									MESSAGE: 'ERROR SEEDING SHARED TABLE'
								});
							}
						});
					} else {
						console.log(err);
						res.send({
							TYPE: 'ERROR',
							TABLE: 'USERS',
							MESSAGE: 'ERROR SEEDING USERS TABLE'
						});
					}
				});
			} else {
				res.send({
					TYPE: 'ERROR',
					MESSAGE: 'ERROR CREATING PASSWORD HASHES'
				});
			}
		});
    });
}

module.exports = CreationController;
