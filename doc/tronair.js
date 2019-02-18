// Written by @colradi for Community Node Super Representative Organization 
// contact on Telegram for scripting services t.me/CommunityNode
// GUI Interface coming soon!
//
//
// Script for airdroppin tokens (not TRX) based on SR votes (ratio can be configured)
//
// Private key for wallet defined in 'air_address' has to be stored as an environment var (at the level of OS) 
// $AIRDROP_PK
// 'air_address' Defines sender's wallet address, has to be stored as an environment var (at the level of OS) 
// $AIRDROP_ADDR
//
/************************** Command line  USAGE    *******************************/
/*  
Change 'air_address' to whatever is the address containing the tokens to be airdropped
Also change 'token_id' to your own token
Then execute the next command line instruction:

                           node tronair.js file.json

where file.json is a JSON file looking like this..
	
	{ "list":  [
			{"address" : "TXBnjY7CAq39Jj748XLfLd97tXGyknwD1x" , "votes" : 2004538},
			{"address" : "TQ5qpcvtruNdYwokc3JHGb6dzuYMbam485" , "votes" : 1788121},
			{"address" : "TUvV7VFJuj4wcd2ny3ZT3rZXivGpmhWoDV" , "votes" : 1473256},
			{"address" : "TAh4zm9ULixhuCauikkaBjNCgnDptX5bW5" , "votes" : 1  }  
			]
	}
*********************************************************************************/
/************************** CONFIGURATION AREA **********************************/
//var filename = 'votes_TDGy_2019_02_10at22_20_DONE.json'; 
//var candidate = "TDGy2M9qWBepSHDEutWWxWd1JZfmAed3BP"; //SR/candidate address from whom we want the votes details 
// candidtate set in other file
var air_address = process.env.AIRDROP_ADDR; //address containing the tokens to be airdropped
var token_id = '1000322'; //'1000322' = CommunityNodeToken  '1000562' HELP
/************************** END CONFIGURATION *******************************/
const { GrpcClient, SolidityGrpcClient } = require('tronix.js');
const fs = require('fs');

var filename = process.argv[2];
var voters = require("./" + filename ); //load the file
var failures = [];

// db2_fullnode
const client = new GrpcClient({
  hostname: 'grpc.trongrid.io',
  port: 50051,
});

async function sendToken(voter){
	const tx = await client.transferAsset( process.env.AIRDROP_PK, token_id, air_address, voter.address, voter.votes,'');
	
	if(!tx.result) { 
		failures.push(voter); 
		console.log("FAILURE: " + tx.transaction.toAddress + " - " + tx.transaction.amount + " tokens "); // result 	
	}else{
		console.log("SUCCESS: " + tx.transaction.toAddress + " - " + tx.transaction.amount + " tokens "); // result 	
	}	
}

//console.log(voters);
console.log("* * * Starting airdrop to " + voters.list.length + " wallets * * *");
voters.list.map( sendToken );

//Error handeling
if(failures.length > 0){  //store failures on a file
	
	failures = { "list": failures }; // write contents in the appropiate format (tronvotes.format.JSON)
	var new_filename = filename.slice(0, -5) + "_fail.json";
	var path = __dirname + "\\" + new_filename;

	console.log("Some transactions went wrong.");
	
    fs.appendFile( path, JSON.stringify(failures), function (err) {
		if (err) { 
			console.log("Error, could not save them on a new file");  
		}else{
			console.log("To retry to send them, pleas type this command: \n\n\t\t node tronair.js  " + new_filename);
		}
	});

}


















//transaction object example:

/*
{ result: true,
  code: 0,
  message: '',
  transaction:
   { assetName: '1000322',
     ownerAddress: 'TNtPJVFFGWYRYXUaa1XJhW6MCoNQzW1nkk',
     toAddress: 'TXBnjY7CAq39Jj748XLfLd97tXGyknwD1x',
     amount: 1,
     contractType: 2,
     hash: 'a77cadb2722d7489ae9f5007fc88c41fe4fe9cef0de48d01ad684b1144cafb29',
     time: 1549896394610,
     data: '' } }

*/







