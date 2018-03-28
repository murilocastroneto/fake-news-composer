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
     publish_vote.news.published = true;

     if(validated){ //change that and probably code this on playground!! FOCUS ON CODING THAT!!
         publish_votenews.validated = true;

         var list_validators = publish_vote.news.validators;


     }
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