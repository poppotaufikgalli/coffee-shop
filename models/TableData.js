const _ = require('lodash')
var passport = require('passport');
var db = require('../config/database');

const All = (table, condition) => {
  var sql = `SELECT * FROM ${table}`
  var _value = [];

  if(condition){
    if(_.findKey(condition, 'status') === undefined){
      condition['status'] = 1
    }

    var _where = _.join(_.map(condition, function(v, k){
      return k + "= ?"
    }),' and ');
    
    _value = _.values(condition)

    sql = _.join(_.compact([sql, _where]), ' where ');
      
  }
  
  console.log("sql", sql, _value)

  return new Promise((resolve, reject) => {
    db.query(sql, _value, (err, rows, fields) => {
      if(err)
        reject(err);
      else
        resolve(rows);
    });
  });

};

const Find = (table, condition) => {
  var sql = `SELECT * FROM ${table}`
  var _value = [];

  if(condition){
    if(_.findKey(condition, 'status') === undefined){
      condition['status'] = 1
    }

    var _where = _.join(_.map(condition, function(v, k){
      return k + "= ?"
    }),' and ');
    
    _value = _.values(condition)

    sql = _.join(_.compact([sql, _where]), ' where ');
      
  }
  
  console.log("sql", sql, _value)

  return new Promise((resolve, reject) => {
    db.query(sql, _value, (err, rows, fields) => {
      if(err)
        reject(err);
      else
        resolve(rows[0]);
    });
  });

};

const Query = (queryString, condition) => {
  var sql = queryString;
  var _value = [];
  if(condition){
    var _where = _.join(_.map(condition, function(v, k){
      return k + "= ?"
    }),' and ');
    
    _value = _.values(condition)

    sql = _.join(_.compact([sql, _where]), ' where ');
      
  }

  return new Promise((resolve, reject) => {
    db.query(sql, (err, rows, fields) => {
      if(err)
        reject(err);
      else
        resolve(rows);
    });
  });
}

const Create = (table, fields) => {
  var sql = `INSERT INTO ${table}`
  var _value = [];

  if(fields){
    var _keys = _.join([ 
      '('+_.join(_.keys(fields), ', '),  
      _.join(_.map(fields, function(v){
        return "?"
      }), ', ') + ')'
    ], ') values (' );

    _value = _.values(fields)

    sql = sql +" "+ _keys;

    console.log(sql, _value)
  }

  return new Promise((resolve, reject) => {
    db.query(sql, _value, (err) => {
      if(err)
        reject(err);
      else
        resolve();
    });
  });
};

const Update = (table, fields, keys) => {
  var sql = `UPDATE ${table}`
  var _value = [];

  if(fields){
    var _command = _.join(_.map(fields, function(v, k){
      return k + "= ?"
    }),', ');
    
    _value = _.values(fields)

    sql = _.join(_.compact([sql, _command]), ' SET ');
      
  }

  if(keys){
    var _where = _.join(_.map(keys, function(v, k){
      return k + "= ?"
    }),' AND ');

    _value = _.concat(_value, _.values(keys))
    //_value = _.compact(_.join(_value, _.values(keys))) 

    sql = _.join(_.compact([sql, _where]), ' WHERE ');
      
  }
  
  console.log("sql", sql, _value)

  return new Promise((resolve, reject) => {
    db.query(sql, _value, (err, rows, fields) => {
      if(err)
        reject(err);
      else
        resolve(rows);
    });
  });

};

const Delete = (table, keys, uid) => {
  var sql = `UPDATE ${table}`
  var _value = [];

  var _command = `status = 0, deleted_at = now(), deleted_uid = ${uid}`
    
  sql = _.join(_.compact([sql, _command]), ' SET ');

  if(keys){
    var _where = _.join(_.map(keys, function(v, k){
      return k + "= ?"
    }),' AND ');

    _value = _.concat(_value, _.values(keys))
    //_value = _.compact(_.join(_value, _.values(keys))) 

    sql = _.join(_.compact([sql, _where]), ' WHERE ');
      
  }
  
  console.log("sql", sql, _value)

  return new Promise((resolve, reject) => {
    db.query(sql, _value, (err, rows, fields) => {
      if(err)
        reject(err);
      else
        resolve(rows);
    });
  });
};

const ForceDelete = (table, keys) => {
  var sql = `DELETE FROM ${table}`
  var _value = [];

  if(keys){
    var _where = _.join(_.map(keys, function(v, k){
      return k + "= ?"
    }),' AND ');

    _value = _.values(keys)

    sql = _.join(_.compact([sql, _where]), ' WHERE ');
      
  }
  
  console.log("sql", sql, _value)

  return new Promise((resolve, reject) => {
    db.query(sql, _value, (err, rows, fields) => {
      if(err)
        reject(err);
      else
        resolve(rows);
    });
  });

};


module.exports = {
  Find,
  All,
  Query,
  Create,
  Update,
  Delete,
  //ForceDelete,
};