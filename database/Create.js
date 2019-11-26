const bcrypt = require('bcrypt');

function CreationController (DatabaseConntection,ExpressApplication){
    this.connection = DatabaseConntection;
    this.app = ExpressApplication;

    this.app.use('/database/create',(req,res) => {
        this.connection.query('CREATE TABLE IF NOT EXISTS users(_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,username VARCHAR(55) NOT NULL,password VARCHAR(550) NOT NULL,email VARCHAR(55) NOT NULL,logged_in BOOL NOT NULL DEFAULT false,firstname VARCHAR(99),lastname VARCHAR(99),joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,profile VARCHAR(999),accepted_eula BOOL NOT NULL DEFAULT 0,eula_date TIMESTAMP)',(err,result,fields) => {
			if(!err) {
				this.connection.query('CREATE TABLE IF NOT EXISTS shared(_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,sharer INT NOT NULL,title VARCHAR(100) NOT NULL,artist VARCHAR(100) NOT NULL,art VARCHAR(100) NOT NULL,time_shared TIMESTAMP DEFAULT CURRENT_TIMESTAMP,duration INT DEFAULT 0,spotify_id VARCHAR(999),youtube_id VARCHAR(999),play_id VARCHAR(999))',(err,result) => {
					if(!err) {
						this.connection.query('CREATE TABLE IF NOT EXISTS friends(_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,sender INT NOT NULL,receiver INT NOT NULL,accepted BOOL NOT NULL DEFAULT FALSE)',(err,result) => {
							if(!err) {
								this.connection.query('CREATE TABLE IF NOT EXISTS likes(_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,track_id INT NOT NULL,user_id INT NOT NULL)',(err,result) => {
									if(!err) {
										console.log('TABLES CREATED SUCCESSFULLY');
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
                this.connection.query('INSERT INTO users(username,password,email,firstname,lastname) VALUES("maxx730","' + hashed + '","max.kinghorn@gmail.com","Max","Kinghorn"),("tolm640","' + hashed + '","tolm.lamar@gmail.com","Tom","Lamar"),("ethan54","' + hashed + '","ethan.clokels@gmail.com","Ethan","Clokey");',(err,result) => {
                    if(!err) {
						console.log('USER DATA SEEDED');
						this.connection.query('DELETE FROM friends',(err,result) => {
							if(!err) {
								this.connection.query('INSERT INTO friends(sender,receiver,accepted) VALUES (1,2,false),(1,3,true),(2,3,true);',(err,result) => {
									if(!err) {
										console.log('FRIEND DATA SEEDED');
										this.connection.query('DELETE FROM shared',(err,result) => {
											if(!err) {
												this.connection.query('INSERT INTO shared(sharer,title,artist,art,spotify_id) VALUES(2,"TEST 1","ARTIST 1","ART 1","SPOTIFY_ID_1"),(2,"TEST 2","ARTIST 2","ART 2","SPOTIFY_ID_2"),(1,"TEST 3","ARTIST 3","ART 3","SPOTIFY_ID_3"),(1,"TEST 4","ARTIST 4","ART 4","SPOTIFY_ID_4"),(3,"TEST 5","ARTIST 5","ART 5","SPOTIFY_ID_5"),(1,"TEST 6","ARTIST 6","ART 6","SPOTIFY_ID_6")',(err,result) => {
													if(!err) {
														console.log('SHARED DATA SEEDED');
														console.log('DATABASE SEEDED');

														this.connection.query('INSERT INTO likes(track_id,user_id) VALUES(1,1),(2,1),(3,1),(1,6),(2,6)',(err,result) => {
															if(!err) {
																console.log('LIKES SEEDED');
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