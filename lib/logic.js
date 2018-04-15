/**
 * Publish and/or vote news on the network
 * @param {org.acme.biznet.Publish_Vote} publish_vote - the publishment/vote to be processed
 * @transaction
*/ 

 async function publishVote(publish_vote){
     var validators = publish_vote.news.validators;
     var voter = publish_vote.member;
     var sources = publish_vote.sources;
     //Think about these 
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

     ////HERE: code to update asset and transaction registry with new values
     const assetRegistry = await getAssetRegistry('org.acme.biznet.News');
     await assetRegistry.update(publish_vote.news)

     //it's necessary to add the vote to transaction registry before checking if consensus was reached
     //after participant vote is done, check if validation is done (via consensus)
     //other thing: maybe it's not a good idea for the peer to vote and try to check consensus right after: maybe we can write
     //a function (transaction) that's special to validate if consensus was reached. The question is: when would we call these function and how?
     //other idea: add control to the voting: if there is no voters with at least 5 of rating on the consensus, wait more votes to check...
     if(isNewsValidated(publish_vote.news) === true){ 
         publish_vote.news.validated = true;
         publish_vote.news.validationResult = true;
         await assetRegistry.update(publish_vote.news);
         //update registry again with news values

     } else if(isNewsValidated(publish_vote.news) === false){
         publish_vote.news.validated = true;
         publish_vote.news.validationResult = false;
         await assetRegistry.update(publish_vote.news);
     }

     //emit the event about the transaction

     
 }


/**
 * Function that checks if some news was already validated
 * @param {org.acme.biznet.News} news - the news to be checked
 * @transaction
*/
 async function isNewsValidated(news){
     
    return getPartcipantRegistry('org.acme.biznet.Member') //check where these regsitry names are stored
        .then(function(participantRegistry){
            return participantRegistry.getAll();
        })
        .then(function(membersList){
            var byzantineNrOfMembers;
            var newsValidators = news.validators;
            var nrOfNewsValidations = newsValidators.length;
            var transactionList = await getVotes(news); //maybe this can be returned on the function as well
            for(const voteTransaction in transactionList){
                //check how to do this only once (the calculations of byzantine fraction)
                if(voteTransaction.event_type == 'PUBLISH'){
                    var byzantineFraction = getByzantineNumber(voteTransaction.voter);
                    byzantineNrOfMembers = membersList.length * byzantineFraction;
                }
            }
            if(nrOfNewsValidations >= byzantineNrOfMembers){
                //check how each member voted to figure out if news has been validated
                //check if we'll need to order the transaction list to validate firstly votes from members that have higher rating 
                //Maybe YES:    (WE WROTE ON THE ARTICLE THAT ONLY PRE-SELECTED NODES WOULD VALIDATE THE NEWS)!!!    
                //maybe it's a good idea to store the vote of the publisher by the time we update the member's rating
                //RULE: update ALL members ratings, even if the member did not participate the consensus process
                var countTrue = 0;
                var countFalse = 0;
                var result = null;
                for(const voteTransaction in transactionList){
                    if(voteTransaction.vote === true){
                        countTrue++;
                    } else {
                        countFalse++;
                    }
                    if(countTrue >= byzantineNrOfMembers){
                        result = true;
                        await updateMembersRating(transactionList);

                    }
                    else if(countFalse == byzantineNrOfMembers){
                        result = false;
                        await updateMembersRating(transactionList);
                    }
                }
                //Rule: if true and false votes are higher than the byzantine minimum, choose the one that has more votes; in case of a tie,
                //choose consesus based on the PUBLISHER vote (RETHINK THAT AS WE DEFINED ONLY PRE-SELECTED NODES VALIDATE)
                return result;        
            }
        });
 }

 /**
  * Function to update members rating after voting
  */
async function updateMembersRating(transactionList){
    //TO DO
}



 /**
  * Function to get the votes that were already submitted
  */
 async function getVotes(news){
    //check other examples to verify if it'll be necessary to intatiate business network definition
    //test this and return to previous approach (getting all transactions from all news)
    var newsTransaction = [];
    //probably retrieve that from biz net connection
    var bizNetConnection = new BusinessNetworkConnection();

    //maybe many of those functions can be done just one time (like presetup)
    return bizNetConnection.connect('admin@network') //review this approach with playground examples (maybe it's not necessary to connect to biz network)
        .then(function(networkDefinition) {
            return bizNetConnection.getTransactionRegistry('org.acme.biznet.Publish_Vote')
        })
        .then(function(transactionRegistry){
            return transactionRegistry.getAll();
        })
        .then(function(transactionList){
            for(const transaction in transactionList){
                if(transaction.news.news_id == news.news_id){
                    newsTransaction.push(transaction);
                }
            }
            //sort the transactionList according to member rating
            //UPDATE 12/04 - maybe not necessary
            newsTransaction.sort(function (txOne, txTwo) {
                return txTwo.voter.rating - txOne.voter.rating;
            });
        });
}   
 

 /**
 * Function to allow the participant to create news to be published and validated on the network
 * @param {org.acme.biznet.Register_News} register_news - the news to be registered
 * @transaction
*/
async function registerNews(register_news) {
    //later: add lines to log information

    const factory = getFactory();

    var news = factory.newResource('org.acme.biznet', 'News', 'NEWS_1');

    /*
    o Boolean published
    o Boolean validated
    o Boolean validationResult
    --> Member[] validators   
    */
    
    news.title = register_news.title;
    news.text = register_news.text;
    news.published = false;
    news.validated = false;
    news.validationResult = null;
    news.validators = [];

    const newsRegistry = await getAssetRegistry('org.acme.biznet.News');
    await newsRegistry.add(news);   
}

function getByzantineNumber(voter){
    if(voter.rating < 7 && voter.rating >= 0){
        return 0.6;
    }
    else if(voter.rating < 9 && voter.rating >= 7){
        return 0.3;
    } 
    else {
        return 0;
    }
}
