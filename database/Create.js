function CreationController (DatabaseConntection,ExpressApplication){
    this.connection = DatabaseConntection;
    this.app = ExpressApplication;

    this.app.use('/database/create',(req,res) => {
        this.connection.query('CREATE TABLE IF NOT EXISTS users(_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,username VARCHAR(55) NOT NULL,password VARCHAR(55) NOT NULL,email VARCHAR(55) NOT NULL,logged_in BOOL NOT NULL DEFAULT false,joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)',(err,result,fields) => {
			if(!err) {
				this.connection.query('CREATE TABLE IF NOT EXISTS shared(_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,sharer INT NOT NULL,title VARCHAR(100) NOT NULL,artist VARCHAR(100) NOT NULL,art VARCHAR(100) NOT NULL,time_shared TIMESTAMP DEFAULT CURRENT_TIMESTAMP,duration INT,spotify_id VARCHAR(999),youtube_id VARCHAR(999),play_id VARCHAR(999))',(err,result) => {
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
        this.connection.query('DELETE FROM users',(err,result) => {
            if(!err) {
                this.connection.query('INSERT INTO users(username,password,email) VALUES("maxx730","drmario","max.kinghorn@gmail.com");INSERT INTO users(username,password,email) VALUES("tolm640","drmario","tolm.lamar@gmail.com");INSERT INTO users(username,password,email) VALUES("ethan54","drmario","ethan.clokels@gmail.com");',(err,result) => {
                    if(!err) {
						console.log('USER DATA SEEDED');
                        this.connection.query('INSERT INTO friends(0,1,false);INSERT INTO friends(0,2,true);INSERT INTO friends(1,2,false);',(err,result) => {
							if(!err) {
								console.log('FRIEND DATA SEEDED');
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