function CreationController (DatabaseConntection,ExpressApplication){
    this.connection = DatabaseConntection;
    this.app = ExpressApplication;

    this.app.use('/database/create',(req,res) => {
        this.connection.query('CREATE TABLE IF NOT EXISTS users(_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,username VARCHAR(55) NOT NULL,password VARCHAR(55) NOT NULL,email VARCHAR(55) NOT NULL)',(err,result,fields) => {
            if(!err) {
                this.connection.query('SHOW DATABASES',(err,result) => {
                    if (!err) {
                        this.connection.query('CREATE TABLE IF NOT EXISTS shared(_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,title VARCHAR(100) NOT NULL,artist VARCHAR(100) NOT NULL,art VARCHAR(100) NOT NULL,time_shared DATETIME NOT NULL,spotify_id VARCHAR(999),youtube_id VARCHAR(999),play_id VARCHAR(999))',(err,result) => {
                            if(!err) {
                                console.log(result);
                            } else {
                                console.log(err)
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

    this.app.use('/database/seed',(req,res) => {
        this.connection.query('DELETE FROM users',(err,result) => {
            if(!err) {
                console.log('data deleted');
                this.connection.query('INSERT INTO users(username,password,email) VALUES("maxx730","drmario","max.kinghorn@gmail.com")',(err,result) => {
                    if(!err) {
                        console.log('users added');
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