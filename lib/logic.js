/**
 * Publish and/or vote news on the network
 * @param {org.acme.biznet.Publish_Vote} publish_vote - the publishment/vote to be processed
 * @transaction
*/ 

 function publishVote(publish_vote){
     var validators = publish_vote.news.validators;
     var voter = publish_vote.member;
     var sources = publish_vote.sources;
     if (publish_vote.event_type == 'PUBLISH' && publish_vote.news.published){
         throw new Error('News has not been published yet!');
     }
     if(voter.rating < 5 && voter.rating > 2){
         if(sources.length < 10){
             throw new Error('Based on your network rating %rating%, you have not provided enough sources to validate your vote');
         } 
     }
     if(voter.rating >= 5 && voter.rating < 7){
         if(sources.length < 5){
             throw new Error('Based on your network rating %rating%, you have not provided enough sources to validate your vote')
         }
     }

     validators.push(publish_vote.member);
     publish_vote.news.published = true; //swtich this to previous "if"

     //probably insert commands to update the registry with new vote


     //after participant vote is done, check if validation is done (via consensus)
     if(isNewsValidated(publish_vote.news)){ 
         publish_vote.news.validated = true;

         assetRegistry.update


     }
 }

 async function isNewsValidated(news){
    var bizNetConnection = new BusinessNetworkConnection();

    return bizNetConnection.connect('admin@network') //review this approach with playground examples
        .then(function(networkDefinition) {
            return bizNetConnection.getPartcipantRegistry('org.acme.biznet.Member'); //check where these regsitry names are stored
        })
        .then(function(participantRegistry){
            return participantRegistry.getAll();
        })
        .then(function(membersList){
            var bizantineNrOfMembers = membersList.length * 0.6; //check how double numbers will be handled
            var newsValidators = news.validators;
            var nrOfNewsValidations = newsValidators.length;
            if(nrOfValidations >= bizantineNrOfMembers){
                //check how each member voted to figure out if news has been validated
                var transactionList = getVotes();
                
                //transacoes que os caras do newsValidators praquela news
                //
            }
        })

 }

 async function getVotes(){
    //check other examples to verify if it'll be necessary to intatiate business network definition
    return getTransactionRegistry('org.acme.biznet.Publish_Vote')
        .then(function(transactionRegistry){
            return transactionRegistry.getAll();
        })
 }

 /**
 * Function to allow the participant to create news to be published and validated
 * @param {org.acme.biznet.Register_News} register_news - the news to registered
 * @transaction
*/
function registerNews(register_news) {
    
}



/**
 * Track the trade of a commodity from one trader to another
 * @param {org.acme.biznet.Trade} trade - the trade to be processed
 * @transaction

function tradeCommodity(trade) {
    trade.commodity.owner = trade.newOwner;
    return getAssetRegistry('org.acme.biznet.Commodity')
        .then(function (assetRegistry) {
            return assetRegistry.update(trade.commodity);
        });
}
*/