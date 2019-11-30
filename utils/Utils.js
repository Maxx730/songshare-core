const bcrypt = require('bcrypt');

function Utils(database) {
    this.connection = database;
}

//Checks whether or not the user actually exists in the database and they have given the right username and password.
Utils.prototype.CheckCredentials = function(request) {
    return new Promise(async (resolve,reject) => {
        //Remove the Basic keyword from the authorization header.
        const b64auth = (request.headers.authorization || '').split(' ')[1] || '';
        //Decode the base64 based string and split it into the username and password.
        const credentials = new Buffer(b64auth, 'base64').toString().split(':');
        this.connection.query(`SELECT * FROM users WHERE username='${credentials[0]}'`,async (err,result) => {
            if(!err) {
                //Once we have the user, we want to compare the bcrypt hash to the users 
                //provided password.
                if(result.length > 0) {
                    //Compare the passwords.
                    bcrypt.compare(credentials[1],result[0].password,(err,isMatch) => {
                        if(!err) {
                            if(isMatch) {
                                //Now we know that the password is correct.
                                //Pass the user information along to the next method.
                                resolve(result[0]);
                            } else  {
                                reject({
                                    TYPE: 'ERROR',
                                    MESSAGE: 'INCORRECT USERNAME OR PASSWORD'
                                });
                            }
                        } else  {
                            reject({
                                TYPE: 'ERROR',
                                MESSAGE: 'ERROR COMPARING PASSWORD'
                            });
                        }
                    })
                } else {
                    reject({
                        TYPE: 'ERROR',
                        MESSAGE: 'USER DOES NOT EXIST IN DATABASE'
                    });
                }
            } else {
                reject({
                    TYPE: 'ERROR',
                    MESSAGE: 'ERROR ACCESSING DATABASE'
                });
            }
        }); 
    });
}

//We need to make sure that a given user is actually allowed to do what they are trying to do.
//User should always be passed as this method should always only be run after checking the credentials of the given user.
//Action should be a json object describing what the user is attempting to do.
Utils.prototype.CheckAuthorization = function(user,action) {
    console.log(user)
    return new Promise((resolve,reject) => {
        if(action.TYPE) {
            switch(action.TYPE) {
                case 'UPDATE_USER':
                    if(user._id === action.DATA._id) {
                        resolve({
                            TYPE: 'SUCCESS',
                            MESSAGE: 'AUTHORIZATION GRANTED'
                        });
                    } else {
                        reject({
                            TYPE: 'ERROR',
                            MESSAGE: 'USER IS NOT ALLOWED TO UPDATE ANOTHER USERS INFO'
                        });
                    }
                break;
                default:
    
                break;
            }
        } else {
            reject({
                TYPE: 'ERROR',
                MESSAGE: 'ACTION NOT PROVIDED'
            });
        }
    });
}

module.exports = Utils;