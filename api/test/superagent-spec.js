var superagent = require('superagent')
var expect = require('expect.js')
var should = require('should')
var _ = require('underscore')
var util = require('../util/myutil.js');

var httpLoc = 'http://localhost:3000/api/'

describe('superagent:', function(){
  var name = 'tim7';
  var ucnt = 0;
  var listId = 'Jutebi';
  var otherListId = 'Vegada';
  var listShops = 'groceries';
  it('GET / should be running and return: please select...', function(done){
    superagent.get(httpLoc)
      .end(function(e, res){
        //console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body).to.be.a('string')
        done()
      })    
  })
  describe('users', function(){
    
    it('DELs users/:name from users->success=1', function(done){
      superagent.del(httpLoc+'users/'+name)
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    }) 
    it('GETs {} if users/:tim7 doesnt exist', function(done){
      superagent.get(httpLoc+'users/'+name)
        .end(function(e,res){
          //console.log(res.body)
          expect(res.body).to.eql({})
          done()
        })
    })    
    it('GETs all users and counts em', function(done){
      superagent.get(httpLoc+'users')
        .end(function(e, res){
          // console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.length).to.be.above(0)
          expect(res.body).to.be.an('array')
          //possible util 
          var listOfUsers= res.body.map(function (item){return item.name});
          //console.log(listOfUsers);
          ucnt = listOfUsers.length;
          //console.log(ucnt);
          done()
        })
    })

    it('POSTs a new /user/:tim7 -> full array of objects ', function(done){
      superagent.post(httpLoc+'users')
        .send({name:name, email:"tim@sitebuilt.net", lists:[],role:'user', timestamp:1399208688, apikey:'Qemavohegoburuxosuqujoga' })
        .end(function(e,res){
          console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.length).to.eql(1)
          expect(res.body[0]._id.length).to.eql(24)
          expect(res.body[0].name).to.be(name)
          done()
        })    
    })
    it('GETs all users expecting the count to go up', function(done){
      superagent.get(httpLoc+'users')
        .end(function(e, res){
          // console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body.length).to.be.above(0)
          expect(res.body).to.be.an('array')
          //possible util 
          var listOfUsers= res.body.map(function (item){return item.name});
          //console.log(listOfUsers);
          expect(listOfUsers.length).to.be(ucnt+1);
          //console.log(listOfUsers.length);
          done()
        })
    })
    +    
    it('GETs a users/:tim7', function(done){
      superagent.get(httpLoc+'users/'+name)
        .end(function(e,res){
          //console.log(res.body)
          expect(res.body.name).to.eql(name)
          done()
        })
    })

    it('rejects POST of duplicate user/:tim7 ->11000', function(done){
      superagent.post(httpLoc+'users')
        .send({name:name, email:"tim@sitebuilt.net", lists:[]})
        .end(function(e,res){
          //console.log(res.body.code)
          expect(res.body.code).to.eql(11000)
          done()
        })    
    })

    it('PUTs an existing :list on /users/:name/:listId->list', function(done){
      superagent.put(httpLoc+'users/'+name+'/'+listId)
        .send()
        .end(function(e, res){
          console.log(res.body)
          expect(e).to.eql(null)
          expect(typeof res.body).to.eql('object')
          expect(res.body.lid).to.eql(listId) 
          expect(res.body.shops).to.be(listShops)       
          done()
        })
    })
    it('rejects a PUT of new :list on /users->list already included', function(done){
      superagent.put(httpLoc+'users/'+name+'/'+listId)
        .send()
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.be('list already included')       
          done()
        })
    })    
    it('reject a PUT of :list for user -> null list with that id', function(done){
      superagent.put(httpLoc+'users/'+name+'/'+otherListId)
        .send()
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.be('null list with that lid')       
          done()
        })
    })         
  })

/*----------------------------------------------------------------------------------*/
  describe('lists', function(){
    var newListId;
    var shops = 'testShop2';

    it('POSTs (creates) a new list',function(done){
      superagent.post(httpLoc+'lists/'+shops)
        .send()
        .end(function(e,res){
          //console.log(res.body)
          newListId = res.body[0].lid
          //console.log(lid)
          expect(res.body[0].shops).to.eql(shops)
          done()
        })
    })
    it('GETs timestamp for /lists/:lid', function(done){
      superagent.get(httpLoc+'lists/'+newListId)
        .end(function(e,res){
          expect(e).to.be(null)
          expect(res.body.timestamp).to.be.greaterThan(Date.now()-400)
          done()
        })
    })

    it('DELs a list by :lid', function(done){
      superagent.del(httpLoc+'lists/'+newListId)
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })      
    })
    it('PUTs updates /list timestamp', function(done){
      superagent.put(httpLoc+'lists/'+listId)
        .send({timestamp:Date.now()})
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    })
  })
/*----------------------------------------------------------------------------------*/
  describe('authentication', function(){
    var agent = superagent.agent();

    before(loginUser(agent));    
    it('POSTs authenticate for fake user',function(done){
      expect(1).to.eql(1);
      done();
    })
    it('GETs userinfo from api/account', function(done){
      agent
        .get('http://localhost:3000/api/account/')
        .end(function(e,res){
          res.should.have.status(200)
          done()
        })
    })
  })  

})

function loginUser(agent) {
  return function(done) {
    agent
      .post('http://localhost:3000/api/authenticate')
      .send({apikey:'1234567'})
      .end(onResponse);

    function onResponse(err, res) {
      console.log(res.body)
      res.should.have.status(200);
      //res.text.should.include('Dashboard');
      return done();
    }
  };
}
