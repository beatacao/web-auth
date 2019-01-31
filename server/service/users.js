module.exports = {
    getUsers: function(name){
        return {name: name, password: name + 'pwd'}
    }
}