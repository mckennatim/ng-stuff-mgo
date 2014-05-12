'use strict';
var httpLoc = 'http://10.0.1.24:3000/api/';

/* Services */
/*
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._;
}); 
*/
var stuffAppServices = angular.module('stuffAppServices', []);
stuffAppServices.factory('ItemsData', function($http) {
  var lsid = 'groceries';
  var inidata = [
    {lid:'26',product:'banana', done:false},
    {lid:'26',product:'coffee', done:false},
    {lid:'26',product:'brown sugar', done:false},
    {lid:'26',product:'bacon', done:false},
    {lid:'26',product:'apples', done:false},
    {lid:'26',product:'brown gravy', done:true},
    {lid:'26',product:'bags', done:true},
    {lid:'26',product:'applesauce', done:true},
    {lid:'26',product:'sugar', done:true},
    {lid:'26',product:'baby back ribs', done:true},
    {lid:'26',product:'apple butter', done:true}
  ];
    return {
    get: function () {
      /*
      var url=httpLoc + 'products/4';
      var promise=$http.get(url).then(function(data) {
        console.log(data.data);
        return data;
      });
      return promise;
      */   
      var ret = JSON.parse(localStorage.getItem(lsid)) || inidata;
      return ret;
      
    },
    put: function(list){
      console.log('in put'+lsid);
      console.log(JSON.stringify(list));
      localStorage.setItem(lsid, JSON.stringify(list));
    },
    kitty: 'mabibi'
  };
});
stuffAppServices.factory('UsersData', function($http) {
  return {
    post: function () {
      var usr = {name:'tim9', email:"tim@sitebuilt.net", lists:[]};
      var url=httpLoc + 'users';
      var promise=$http.post(url, usr).then(function(data) {
        console.log(data.data);
        return data;
      });
      return promise;
      /*     
      var ret = JSON.parse(localStorage.getItem(lsid)) || inidata;
      return ret;
      */
    }
  }
});
stuffAppServices.factory('UserLS', function() {
  return {
    users: {},
    blankUsers: {lastLive:0, userList:[]},
    getAll: function (key) {    
      var ret = {};
      if(!localStorage.getItem(key)){
        ret = this.blankUsers;
        //console.log(JSON.stringify(ret))
        localStorage.setItem(key, JSON.stringify(ret));
      } else {
        //console.log(localStorage.getItem(key));
        //console.log(JSON.parse(localStorage.getItem(key)).userList);
        ret=JSON.parse(localStorage.getItem(key));
      }
      return ret;
    },
    getUser: function (user,key) {   
      var ret = this.getAll(key)
      return ret[user];
    },    
    postUser: function(user,key) {
      var al = this.getAll(key);
      //console.log(user.name)
      al.userList.push(user.name)
      al.userList = _.uniq(al.userList)
      al[user.name]=user 
      localStorage.setItem(key, JSON.stringify(al));
      return al
    },
    numUsers: function(key){
      var bl = this.getAll(key);
      console.log(bl)
      return bl.userList.length;
    }
  }
});
