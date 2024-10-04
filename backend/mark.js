// Connecting with NodeJs
const MongoClient = require('mongodb').MongoClient;
const express = require("express");

const app = express();

async function createDatabase() {
  const client = await MongoClient.connect('mongodb://127.0.0.1:27017/test');
  console.log('Database created!');
}

async function deleteDocuments(client, db, collection, filter) {
  const result = await collection.deleteMany(filter);

  console.log(`Deleted ${result.deletedCount} documents`);
}

async function findDocument(collection){
  const documents = await collection.find().toArray();
  console.log('Query result:', documents);
}

async function createCollection1(document) {
  const client = await MongoClient.connect('mongodb://127.0.0.1:27017/test');
  const db = client.db('test');
  const collection = await db.createCollection('users');
  console.log('Collection created!');


  const result = await collection.insertOne(document);
  console.log(`Inserted document with ID: ${result.insertedId}`);

  await findDocument(collection);

  await deleteDocuments(client, db, collection, {age: 40});
  console.log("Deleted");
  await client.close();

}


async function main(document) {
  await createDatabase();
  await createCollection1(document);
}

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/add', (req, res) => {
  const document = {name: req.body.name1, age: req.body.age1};
  res.send(main(document));
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});


// Console based
const mongodb=require("mongodb").MongoClient

var readline = require('readline');
	var rl = readline.createInterface({
  		input: process.stdin,
  		output: process.stdout
	});

async function crudOperation(){
	const client= await mongodb.connect("mongodb://127.0.0.1:27017/StudentInfo")
	if(client){
		console.log("Database Created!!");
	}
	else{
		console.log("Database Creation Failed!!");
	}
	const db = client.db("StudentInfo");
	const collection = await db.createCollection("Student")
	if(collection){
		console.log("Collection Created!!");
		menu(collection);
		
	}
	else{
		console.log("Collection Creation Failed!!");
	}				
}
async function insertDocument(collection){
	console.log('Insertion')
	rl.question('Enter Name: ', function(name) {
  	  rl.question('Enter Roll No: ', function(rollno) {
		var rollnoVal = parseInt(rollno);
    		var nameVal = name;	 
		var bson = {rollno:rollnoVal,name:nameVal};
		const insert =  collection.insertOne(bson)
		if(insert){
			console.log('Inserted!!');
			rl.question('Do you want another operation to do? (yes/no)= ', function(ans) {
    				var ansVal = ans;	
				if(ansVal=='yes'){
					menu(collection);
				}
				else{
					rl.close();
				}
			});			
		}
		else{
			console.log('Insertion Failed!!');
		}
		
  	});
                });
}

async function display(collection){
	var result = await collection.find().toArray();
	if(result){
		console.log(result);
		rl.question('Do you want another operation to do? (yes/no)= ', function(ans) {
    			var ansVal = ans;	
			if(ansVal=='yes'){
				menu(collection);
			}
			else{
				rl.close();
			}
		});	
	}
	else{
		console.log('Sorry...No document found!!');
	}
}

async function update(collection){
	rl.question('Enter the new Name: ', function(name) {
  	  rl.question('Enter Roll No to be Update: ', function(rollno) {		
		var rollnoVal = parseInt(rollno);
    		var nameVal = name;	
		var result=collection.updateOne({rollno:rollnoVal},{$set:{name:nameVal}})
		if(result){
			console.log('Updated!!');				
		}
		else{
			console.log('Sorry..Updation Failed!!No Document found for this Rollno...Try It Again');
		}
			rl.question('Do you want another operation to do? (yes/no)= ', function(ans) {
    				var ansVal = ans;	
				if(ansVal=='yes'){
					menu(collection);
				}
				else{
					rl.close();
				}
			});
  	});
                });
}

async function deleteOp(collection){
  	  rl.question('Enter RollNo to be delete: ', function(rollno) {
		var filter = {rollno:parseInt(rollno)};		
		var resultDel=collection.deleteOne(filter)
		if(resultDel){
			console.log('Deleted!!');			
		}
		else{
			console.log('Sorry...Deletion Failed!!No document found for this Rollno...Try it again');
		}
		rl.question('Do you want another operation to do? (yes/no)= ', function(ans) {
    			var ansVal = ans;	
			if(ansVal=='yes'){
				menu(collection);
			}
			else{
				rl.close();
			}
		});		
  	});
}

async function menu(collection){
	console.log('1.Insert  2.Update 3.Display  4.Delete 5.Exit')
	rl.question('Enter your choice: ', function(choice) {
		var choiceVal = parseInt(choice);
		if(choiceVal == 1){insertDocument(collection);}
		else if(choiceVal == 2){update(collection); }
		else if(choiceVal == 3){display(collection); }
		else if(choiceVal == 4){ deleteOp(collection);}
		else if(choiceVal == 5){
			console.log('Exited...');
			rl.close();
		}
		else{
			console.log('Invalid Choice');
			menu(collection);
		}
	});	
}
crudOperation();