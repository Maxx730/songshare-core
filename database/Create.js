const bcrypt = require('bcrypt');

function CreationController (DatabaseConntection,ExpressApplication){
    this.connection = DatabaseConntection;
    this.app = ExpressApplication;

    this.app.use('/database/create',(req,res) => {
        this.connection.query('CREATE TABLE IF NOT EXISTS users(_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,username VARCHAR(55) NOT NULL,password VARCHAR(55) NOT NULL,email VARCHAR(55) NOT NULL,logged_in BOOL NOT NULL DEFAULT false,joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)',(err,result,fields) => {
			if(!err) {
				this.connection.query('CREATE TABLE IF NOT EXISTS shared(_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,sharer INT NOT NULL,title VARCHAR(100) NOT NULL,artist VARCHAR(100) NOT NULL,art VARCHAR(100) NOT NULL,time_shared TIMESTAMP DEFAULT CURRENT_TIMESTAMP,duration INT DEFAULT 0,spotify_id VARCHAR(999),youtube_id VARCHAR(999),play_id VARCHAR(999))',(err,result) => {
					if(!err) {
						this.connection.query('CREATE TABLE IF NOT EXISTS friends(_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,sender INT NOT NULL,receiver INT NOT NULL,accepted BOOL NOT NULL DEFAULT FALSE)',(err,result) => {
							if(!err) {
								console.log('DATABASE SUCCESSFULLY CREATED!');
							} else {
								console.log(err);
							}
						});
					} else {
						console.log(err);
					}
				});
			} else {
				console.log(err);
			}
        });
	});
	
	//DELETES ALL THE TABLES FROM THE DATABASE
	this.app.use('/database/purge',(req,res) => {
		this.connection.query('DROP TABLE users',(err,result) => {
			if(!err) {
				console.log('USERS TABLE DELETED');
				this.connection.query('DROP TABLE friends',(err,result) => {
					if(!err) {
						console.log('FRIENDS TABLE DELETED');
						this.connection.query('DROP TABLE shared',(err,result) => {
							if(!err) {
								console.log('SHARED TABLE DELETED');
								console.log('DATABASE PURGE COMPLETED');
							} else {
								console.log(err);
							}
						});
					} else {
						console.log(err);
					}
				});
			} else {
				console.log(err);
			}
		})
	});

    //Deletes all the data in the database and seeds to data for development purposes.
    this.app.use('/database/seed',(req,res) => {
        this.connection.query('DELETE FROM users', async (err,result) => {
            if(!err) {
				const hashed = await bcrypt.hash('drmario', 10);
                this.connection.query('INSERT INTO users(username,password,email) VALUES("maxx730","' + hash + '","max.kinghorn@gmail.com"),("tolm640","drmario","tolm.lamar@gmail.com"),("ethan54","drmario","ethan.clokels@gmail.com");',(err,result) => {
                    if(!err) {
						console.log('USER DATA SEEDED');
						this.connection.query('DELETE FROM friends',(err,result) => {
							if(!err) {
								this.connection.query('INSERT INTO friends(sender,receiver,accepted) VALUES (0,1,false),(0,2,true),(1,2,false);',(err,result) => {
									if(!err) {
										console.log('FRIEND DATA SEEDED');
										this.connection.query('DELETE FROM shared',(err,result) => {
											if(!err) {
												this.connection.query('INSERT INTO shared(sharer,title,artist,art,spotify_id) VALUES(0,"TEST 1","ARTIST 1","ART 1","SPOTIFY_ID_1"),(0,"TEST 2","ARTIST 2","ART 2","SPOTIFY_ID_2"),(1,"TEST 3","ARTIST 3","ART 3","SPOTIFY_ID_3")',(err,result) => {
													if(!err) {
														console.log('SHARED DATA SEEDED');
														console.log('DATABASE SEEDED');
													} else {
														console.log(err);
													}
												});
											} else {
												console.log(err);
											}
										});
									} else {
										console.log(err);
									}
								});
							} else {
								console.log(err);
							}
						});
                    } else {
                        console.log(err);
                    }
                })
            } else {
                console.log(err);
            }
        })
    });
}

module.exports = CreationController;