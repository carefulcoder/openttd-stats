/**
 * A basic statistics model.
 * @constructor
 */
exports.Stat = function() {

    this.companyName = "";
    this.companyMoney = 0;
    this.timestep = null;

    /**
     * Save our stats to the DB.
     */
    this.save = function() {
        var timestep = this.timestep ? this.timestep : exports.Stat.timestep;
        exports.Stat.connection.query('REPLACE INTO statistics VALUES(?, ?, ?)',
                                      [timestep, this.companyName, this.companyMoney]);
    };

    this.toJSON = function() {
        return {companyName: this.companyName, companyMoney: this.companyMoney, timestep: this.timestep};
    }
};

//"static" timestep field
exports.Stat.timestep = 0;

/**
 * Retrieve all statistics.
 * @param {function} callback
 */
exports.Stat.all = function(callback) {
    exports.Stat.connection.query('SELECT * FROM statistics', function(err, rows) {
        if (typeof rows != "undefined") {
            var ret = [];
            for(var i = 0; i < rows.length; i++) {
                var stat = new exports.Stat();
                stat.timestep = rows[i].timestep;
                stat.companyName = rows[i].company_name;
                stat.companyMoney = rows[i].company_money;
                ret.push(stat);
            }
            callback(ret);
        } else {
            callback([]);
        }
    });
};