function CreationController (DatabaseConntection,ExpressApplication){
    this.connection = DatabaseConntection;
    this.app = ExpressApplication;

    this.app.use('/database/create',(req,res) => {
        this.connection.query('CREATE DATABASE IF NOT EXISTS songshare',(err,result,fields) => {
            if(!err) {
                console.log('database created!')
            }
        });
    });
}

module.exports = CreationController;