var superagent = require('superagent')
var expect = require('expect.js')
var _ = require('underscore')
var util = require('../util/myutil.js');

var httpLoc = 'http://localhost:3000/api/'

describe('superagent:', function(){
  var name = 'tim7';
  var ucnt = 0;
  var listId = '0';
  var otherListId = '00';
  var listShops = 'testShop';
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
        .send({name:name, email:"tim@sitebuilt.net", lists:[]})
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

    it('PUTs a new :list on /users/:name/:listId->list', function(done){
      superagent.put(httpLoc+'users/'+name+'/'+listId)
        .send()
        .end(function(e, res){
          //console.log(res.body)
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
    it('reject a PUT of new :list for user -> name taken, choose another', function(done){
      superagent.put(httpLoc+'users/'+name+'/'+otherListId)
        .send()
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.be('name taken, choose another')       
          done()
        })
    })         
  })
/*----------------------------------------------------------------------------------*/
  describe('products', function(){
    var productCnt = 4;
    var pid;
    var product = 'hot dog with craut';
    var wasDonePid;
    var wasDoneProduct;

    it('GETs all /products', function(done){
      superagent.get(httpLoc+'products/')
        .end(function(e,res){
          expect(e).to.eql(null)
          done()          
        })
    })
    it('GETs all /products for /:listId 0', function(done){
      superagent.get(httpLoc+'products/'+listId)
        .end(function(e,res){
          //console.log(res.body)          
          expect(res.body.length).to.eql(productCnt)          
          done()          
        })
        
    })
    it('GETs /products/:name/:shops', function(done){
      superagent.get(httpLoc+'products/'+name+'/'+listShops)
        .end(function(e,res){      
          //console.log(res.body)          
          expect(e).to.eql(null)
          expect(res.body).to.be.an('array')          
          done()
        })          
    })  
    it('fails to GETs /products/:name Or/:shopNoExists', function(done){
      superagent.get(httpLoc+'products/z'+name+'/z'+listShops)
        .end(function(e,res){      
          //console.log(res.body)          
          expect(e).to.eql(null)
          expect(res.body).to.eql('that list or user doesn\'t exist')          
          done()
        })          
    })
    it('POSTs new /product/:lid +timestamp', function(done){
      superagent.post(httpLoc+'products/'+listId)
        .send({lid:listId, product:product, done:false, tags:[]})
        .end(function(e,res){
          //console.log(res.body)
          pid = res.body[0]._id;
          //console.log(pid)         
          expect(e).to.eql(null)
          expect(res.body.length).to.eql(1)
          expect(res.body[0]._id.length).to.eql(24)
          expect(res.body[0].product).to.be(product)
          done()
        })       
    })
    it('checks that product count ^ and new product is there', function(done){
      superagent.get(httpLoc+'products/'+listId)
        .end(function(e,res){
          //console.log(res.body) 
          var theRec= _.where(res.body,{_id:pid})
          //console.log(theRec)
          expect(theRec[0].product).to.eql(product)
          expect(res.body.length).to.eql(productCnt+1)          
          done()          
        })
    })
    it('DELs products/:_id->success=1 +timestamp', function(done){
      superagent.del(httpLoc+'products/'+pid)
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    })
    it('GETs /products/done/:lid for list' ,function(done){
      superagent.get(httpLoc+'products/done/'+listId)
        .end(function(e, res){
          //console.log(res.body)
          wasDonePid=res.body[0]._id
          wasDoneProduct=res.body[0].product
          //console.log(wasDonePid)
          expect(e).to.eql(null)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.eql(productCnt)
          done()
        })
    })
    it('GETs no /products/needed/:lid for list' ,function(done){
      superagent.get(httpLoc+'products/needed/'+listId)
        .end(function(e, res){
          //console.log(res.body)
          //wasNeededPid=res.body[0]._id
          //console.log(wasDonePid)
          expect(e).to.eql(null)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.eql(0)
          done()
        })
    })
    it('PUTs update /product/:pid to needed +timestamp', function(done){
      superagent.put(httpLoc+'products/'+wasDonePid)
        .send({done:false})
        .end(function(e, res){
          console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    })
    it('GETs 1 /products/needed/:lid for list' ,function(done){
      superagent.get(httpLoc+'products/needed/'+listId)
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.be.an('array')
          expect(res.body[0]._id).to.eql(wasDonePid)
          done()
        })
    })
    it('PUTs update /product/:pid to done +timestamp', function(done){
      superagent.put(httpLoc+'products/'+wasDonePid)
        .send({done:true})
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
          done()
        })
    })            
    it('PUTs update /product/:pid product(name) +timestamp', function(done){
      var productMod =wasDoneProduct+'Z';
      //console.log({product:productMod})
      superagent.put(httpLoc+'products/'+wasDonePid)
        .send({product:productMod})
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null)
          expect(res.body).to.eql(1)
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
})
