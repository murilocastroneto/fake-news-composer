/**
 * Publish and/or vote news on the network
 * @param {org.acme.biznet.Publish_Vote} publish_vote - the publishment/vote to be processed
 * @transaction
*/ 

 function publishVote(publish_vote){
     if (publish_vote.event_type == 'PUBLISH' && publish_vote.news.published){
         
     }
     publish_vote.news.validators.push(publish_vote.member);
     publish_vote.news.published

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