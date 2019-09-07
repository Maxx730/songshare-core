function CreationController (DatabaseConntection,ExpressApplication){
    this.connection = DatabaseConntection;
    this.app = ExpressApplication;

    this.app.use('/database/create',(req,res) => {
        this.connection.query('CREATE TABLE IF NOT EXISTS users(_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,username VARCHAR(55) NOT NULL,password VARCHAR(55) NOT NULL,email VARCHAR(55) NOT NULL)',(err,result,fields) => {
            if(!err) {
                this.connection.query('INSERT INTO users(username,password,email) VALUES("maxx730","drmario","max.kinghorn@gmail.com");',(err,result) => {
                    if (!err) {
                        console.log(result)
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err)
            }
        });
    });
}

module.exports = CreationController;